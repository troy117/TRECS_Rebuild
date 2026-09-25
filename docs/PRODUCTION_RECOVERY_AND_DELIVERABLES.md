# Production queue and school deliveries

Batch Render accepts one or more jobs. Queue metadata and results live in ProgramData; order completion is saved only in the affected job. An order becomes rendered only after its requested picture products succeed. Missing photos, missing ImagePrep results, unsupported products, composites awaiting another pass, and external-production handoffs remain visible as exceptions. Envelopes or labels alone do not mark picture products rendered.

Pause and Cancel finish the current order and preserve completed files. Resume / recover reacquires job reservations and restarts unfinished jobs. Retry unfinished jobs also retries jobs with order exceptions. Completed jobs are preserved. Recovery uses the original batch date and output folder; incomplete jobs may regenerate their files. This is a job checkpoint, not a guarantee of exactly-once rendering for each individual file. No button sends output to a printer.

## School deliveries

- SIS Export writes actual JPEGs and native map files together in a unique delivery folder. Student CD and Destiny use 140×175 pixels; PowerSchool uses 200×300; SASI uses 96×134. Images fit on a white background without distortion. Leading zeros in IDs are preserved. Duplicate/invalid IDs, missing files and decode failures are excluded from the map and listed in exceptions. SASI includes unnumbered subjects' photographs under `PCTFILEC/Exceptions` when available.
- Sticker Prints writes letter-size 300 dpi JPEG sheets and a PDF using the legacy 6×6 positions. It also retains the work list and records missing photographs in its manifest.
- Staff Picture Packages uses the existing legacy `STAFF` package plan, code `101`, and the normal picture-unit layouts. Configure that plan in Package Editor if it is absent. Unsupported layouts are reported before rendering; missing photographs appear in the result manifest.

## Isolated checks

Run `node scripts/check-production-recovery.js` from `trecs-js` to check completion rules, paused queues, recovery and retry, SIS file mappings/exceptions/dimension requests, and legacy sticker coordinates. It creates and removes its own temporary files and uses in-memory databases.

`npm run check:job-storage` uses an isolated test root and real decodable JPEGs. It exercises 60 captures and 150 reads, checks that at most two previews are decoded per capture read, and asserts ProgramData and the unrelated job are not rewritten by capture.

For an optional larger local throughput check, set `TRECS_CAPTURE_STRESS=1` before running `npm run check:job-storage`. It seeds 2,500 synthetic subjects in each of two jobs and uses 6000×4000 JPEGs with 25 MiB RAW placeholders. The default is 12 captures; `TRECS_CAPTURE_STRESS_IMAGES` changes that count. The report includes fixture sizes, capture/read timings, and main-process scheduling delay. These synthetic local measurements are not network-share benchmarks or camera RAW decoding tests.
