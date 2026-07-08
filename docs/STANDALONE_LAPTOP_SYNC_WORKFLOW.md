# Standalone Laptop Sync Workflow

This document defines how picture-day laptops should work when photographers are on site without reliable access to the shared production drive.

## Decision

On-site capture laptops run standalone. Each laptop has:

- its own installed copy of the TRECS app
- its own local SQLite capture database
- its own local Canon EOS hot folder
- its own local image storage folder for the shoot

The shared/server hot folder is not used for camera capture. It is only for envelope scanning from one office computer.

## Workflow Overview

### 1. Prepare Laptop Package

Before picture day, the office creates one laptop package per capture station.

Package contents:

- job metadata
- subject roster
- subject groups/lists
- subject codes if available
- package/order summary if needed for no-photo/order-priority queues
- a local SQLite database
- a session manifest JSON file
- empty image folders

Suggested folder:

```text
TRECS_Capture/<JOB_NAME>/
  capture.db
  session-manifest.json
  HotFolder/
  Images/
  Exports/
```

The package should include a unique `session_uuid`, workstation name, job id/reference, and export creation time.

### 2. Capture On Site

During photography:

- Canon EOS writes new images into the laptop-local `HotFolder`.
- TRECS watches that local folder.
- TRECS imports images into the laptop-local `Images` folder.
- TRECS records `image_assets`, `image_versions`, `subject_images`, and `image_import_events` in the laptop database.
- Operators link images to subjects and select primary images locally.
- Subject/order notes can be edited locally if needed.

The laptop must not require the network drive to continue photographing.

### 3. Export Capture Session

After the shoot, the operator creates an export package.

Export contents:

- session manifest
- laptop SQLite database or a compact changeset database
- imported image files
- optional thumbnail/contact sheet for quick review
- export log

Suggested folder:

```text
TRECS_Capture/<JOB_NAME>/Exports/<SESSION_UUID>/
  session-manifest.json
  capture-export.db
  Images/
  export-log.json
```

The export package should be copied back to the shared production drive, USB drive, or office intake folder.

### 4. Office Import

The office production app imports one laptop session at a time.

Import steps:

1. Validate manifest and job match.
2. Read export database/changeset.
3. Copy image files into the job's production image folders.
4. Insert or update image assets.
5. Insert or update image versions.
6. Insert or update subject image links.
7. Update subject primary image and photographed status.
8. Import notes if there are no conflicts.
9. Record an import batch and per-row results.
10. Show conflicts for operator review.

The import must be repeatable. If the same laptop package is imported twice, the second import should identify already-imported records and avoid duplicate image or link rows.

## Identity And Matching

Each laptop-generated record needs a durable local identity so it can be reconciled later.

Recommended IDs:

- `session_uuid`: unique per laptop capture session
- `local_uuid`: unique per local record created on the laptop
- `source_hash`: file hash for image duplicate detection
- `source_relative_path`: path inside the export package

Server import should map:

- `session_uuid + local_uuid` to a server record
- image file hash to an existing image asset when possible
- subject legacy ref number to the server subject for the same job

## Conflict Rules

### Safe Auto-Imports

Import automatically when:

- the subject exists in the server job
- the image file is new
- the image link does not already exist
- the subject has no primary image, or the export marks the same image as primary

### Review Required

Ask for review when:

- the subject does not exist in the server job
- two laptop sessions set different primary images for the same subject
- the server already has a newer note value
- the same filename exists with a different hash
- an image exists but points to a different subject

### Recommended Default

For primary image conflicts, keep the current server primary image and import the laptop image as an additional linked capture image with `needs_review`.

## Proposed Sync Tables

The central database should track import/export activity separately from the operational tables.

Tables:

- `sync_packages`
- `sync_record_mappings`
- `sync_conflicts`

These tables should not replace `image_assets`, `subject_images`, or `image_import_events`; they only track how local laptop data entered the central production database.

## First Implementation Slice

The first useful implementation should be:

1. [x] Create a read-only "Prepare Laptop Package" design screen.
2. [x] Export a local package for one selected job.
3. [x] Include job, subjects, groups, and empty hot/image folders.
4. Import the package back with no images, just to prove package identity and job matching.
5. Add image file import after the package identity workflow works.

Current prototype export path:

```text
exports/laptop-packages/<LOCATION>-<JOB>-<TIMESTAMP>/
  capture.db
  session-manifest.json
  HotFolder/
  Images/
  Exports/
```

The prototype package includes the selected job, roster, subject codes, subject groups, existing order summaries, a unique `session_uuid`, workstation name, creation time, and count metadata.

## Open Questions

- Should each laptop package include only one job or support multiple jobs?
- Should notes edited on laptops be allowed to overwrite server notes?
- Should the laptop export include original files only, or also cropped preview versions?
- Should the office import copy images immediately into final production folders or first into a staging folder?
- What should be the standard field laptop operators use to find students fastest: ref number, barcode, name, or list order?
