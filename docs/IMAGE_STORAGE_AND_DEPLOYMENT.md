# Image storage, recovery and deployment

## Workstation configuration

Capture runs from a local laptop disk. Its `path.txt` names the laptop's local TRECS data folder; `capture.txt` names its local camera hot folder. Starting capture rejects UNC paths. Do not use a mapped network drive for capture either.

Lab computers use this line in `path.txt`, beside their TRECS executable:

```text
\\192.168.1.190\Trecs\2026_2027 TRECS_new
```

The local `path-server.txt` example has been updated. This development workstation's `path.txt` remains local. No real server data has been changed or deployed by the tests.

Browser caches and capture-session journals are workstation-local under LocalAppData, separated by data-root identity. Existing capture journals are copied forward when found. Shared job databases, program settings and photographs continue to use the configured data root.

## Automatic lab updates

Packaged lab copies of `TRECS-Portable.exe` check the UNC data root at startup, before opening or changing a shared database. Capture laptops do not auto-update, and development/local-data copies do not auto-update. Each lab computer continues to run a local executable; the server copy is only the release source.

To publish a release from `trecs-js`:

```powershell
npm run build:portable
npm run publish:lab-update
```

The publish command reads the server location from `path-server.txt`. It copies a uniquely named executable such as `TRECS-Portable-a1b2c3d4e5f6.exe`, verifies its size and SHA-256 on the server, and replaces `TRECS-update.json` last. Do not publish by overwriting an active executable in place or by copying the manifest first. Older versioned server executables may be archived manually after every workstation has moved to a later build.

At the next launch, a lab computer compares its local executable with the server manifest. If they differ, TRECS copies the complete executable into that workstation's LocalAppData update cache and verifies it before offering **Install and Restart**. A separate local PowerShell helper waits for TRECS to close, retains the current executable as `TRECS-Portable.previous.exe`, installs the verified copy, and restarts TRECS. If the new program does not finish starting, the helper restores and launches the previous executable. A build identifier appears in the TRECS window title and system information for support calls.

The first release containing this updater must still be placed beside `path.txt` on every lab computer manually; versions older than that do not know how to update themselves. Publish that same build on the server before starting the manually upgraded lab copies. Future releases use the two commands above and update at each workstation's next startup.

Give ordinary lab users read-only access to the published executables and `TRECS-update.json`, with write access limited to the release administrator. The SHA-256 check detects partial or corrupted copies; server permissions are what prevent an unauthorized replacement. `TRECS_DISABLE_AUTO_UPDATE=1` is an emergency administrator-only opt-out, not a normal deployment setting.

## Capture changes

- Saving a capture updates its job database directly. It does not open unrelated job databases, reconstruct all job tables, or rewrite ProgramData. Connections are reused until file identity changes; at most two write connections remain resident.
- A small shared ID-reservation file preserves globally unique record IDs. All current-build database writers use one serialized cross-process filesystem lock. Do not delete `database/record-id-reservations.json` during operation.
- The normal capture screen loads preview bytes for at most the previous best and most recent image. Capture notifications merge the new preview into existing metadata. Preview caches are bounded and include file identity; full resolution is reserved for explicit inspection/zoom.
- Decoding and resizing run in a separate hidden image-processing renderer. Failed previews can retry. Missing preferred derivatives fall back to available versions. Medium crops are regenerated when their source signature changes.
- A stable JPG without its required RAW raises a dialog after approximately 10 seconds. Retry lets the photographer correct the camera or investigate. Skip retains the JPG and its original assignment under `CaptureHotFolder/SkippedCaptures` and advances to the next pair. A late RAW is retained with the skipped record. JPG-only mode does not raise RAW warnings.
- Pending camera-file ownership survives stopping capture or restarting TRECS; recovered files retain their original job/student assignment.

## Save and recovery behavior

Camera pairs are copied and SHA-256 verified before committing the job database. Source files are removed only after successful database replacement. Recovery journals preserve interrupted operations. Ambiguous save failures retain originals and staged copies. Rollback never deletes the last verified copy merely because the camera source disappeared.

Database writes flush a same-directory temporary file, then replace the database without deleting the live copy first. Up to 12 earlier copies are retained in `Database/.backups/job.db` or `database/.backups/ProgramData.db`, sampled on the first save and at most every five minutes. Explicit restoration first preserves the current database. These backups protect records, not the image collection: maintain a separate versioned server backup.

Use **Photo Integrity & Recovery** in the sidebar to check missing JPG/RAW/crops, stale derivatives, broken selections/links and duplicate references/registrations; list and restore backups; and review or undo photo-assignment actions. Undo restores links, selections and rejection flags, not file content or filenames. Conflicting newer changes must be undone first. Up to 500 undo snapshots are retained.

Stop capture and production before restoring. Other workstations must close the affected job. Restore validates SQLite integrity and job identity. If a missing job database has backups, TRECS will not silently replace it with an empty database. Missing ProgramData with existing backups stops startup with recovery guidance instead of replacing the school/job directory with an empty one. Scan photos after restoring old metadata.

TRECS never automatically deletes a stale-looking shared write lock: concurrent recovery attempts could remove a new writer's lock. If a workstation loses power while saving, an administrator must verify all writers have stopped before removing only `database/ProgramData.db.write-lock`. A slow save alone is not evidence that the lock is abandoned.

## End of day and production

End-of-day export verifies its package before cleaning up capture originals. Imports require the listed files, copy JPG and RAW into permanent job storage, detect duplicates by package identity/content rather than folder name, preserve existing selected images for edit-only changes, match stable student references, and review conflicting office/onsite edits before applying them. Legacy TRECS import workbook support is retained.

See [Production queue and school deliveries](PRODUCTION_RECOVERY_AND_DELIVERABLES.md) for pause/resume/retry behavior, per-order outcomes, SIS deliveries, sticker sheets and staff package configuration.

## Validation and limits

Isolated tests cover failed atomic saves, retained originals, ID allocation/migration, backup restoration, preview races/cache retries, RAW warning/skip/restart ownership, EOD transfer/dedup/conflicts, assignment undo, production outcomes, delivery formats, updater manifest validation, corrupt update rejection, verified local staging and rollback-helper syntax.

Local synthetic benchmark: two jobs with 2,500 additional students each; twelve 6000×4000 JPEGs (~20 MB each), paired with 25 MiB RAW placeholders. About 5.75 seconds total (~479 ms/pair); repeated preview reads averaged 13 ms. Main-process scheduling delay peaked at 16 ms in that run. ProgramData and the unrelated job remained byte-for-byte and timestamp unchanged during capture, with at most two decoded preview payloads per read. These are local throughput measurements, not real camera latency, RAW decoding or SMB benchmarks.

sql.js still exports the affected job database as a whole. General non-image workflows can still materialize several jobs. A server-owned API/database service remains the next architectural option if concurrent lab usage or very large job files exceed this design. Do not put a new SQLite WAL database on SMB as a shortcut.

Before production rollout:

1. Back up the shared database and image tree. Upgrade every lab workstation together; do not mix old writers with the new ID-allocation protocol.
2. Verify a copied representative job on two lab PCs over the actual share, including simultaneous saves, unavailable-share errors and recovery.
3. Test the missing-RAW dialog with the actual camera, then a complete end-of-day roundtrip from a laptop copy.
4. Proof stickers/staff sheets and validate a SIS delivery with the school. Automated tests do not perform physical printing or live-server acceptance.
