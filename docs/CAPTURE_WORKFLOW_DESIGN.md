# Capture Workflow Design

This document sketches the first capture workflow for the TRECS JavaScript rebuild.

## Goals

- Make picture-day capture faster and clearer than the Java Swing workflow.
- Keep compatibility with watched folders and existing `JOBS/<SCHOOL>/<JOB>` image folders.
- Make image matching explicit and reviewable.
- Support both fall/student capture and senior/event-style image workflows.

## Core Capture Concepts

### Capture Session

A capture session belongs to a job and a workstation.

Photography-day capture will usually run on standalone laptops at the shoot location. Each laptop has its own local hot folder where Canon EOS software drops images. Those laptop sessions should be able to import and match images locally, then later sync/export the finished session back to the shared production location.

The server hot folder has a different purpose: it is only for envelope scanning, and envelope scanning is expected to happen from one computer.

It should track:

- job
- workstation/user
- capture mode
- watched folder
- local/session database path when running standalone
- active subject/list/filter
- current subject
- latest imported image
- queue state
- sync/export state
- session start/end time

Potential future table:

- `capture_sessions`

### Image Import Queue

New files from a hot folder should enter an import queue.

For on-site laptops, image import events come from the local Canon EOS hot folder. For production envelope scanning, image import events come from the server-side envelope scan hot folder.

Statuses:

- `new`
- `importing`
- `matched`
- `needs_review`
- `ignored`
- `failed`

Potential future table:

- `image_import_events`

Import event types:

- `camera_hot_folder`
- `envelope_scan`
- `manual_import`

### Subject Queue

Operators need a fast way to move through subjects.

Queue modes:

- all subjects
- no-photo subjects
- selected list
- homeroom/class
- search result
- manually pinned subjects

## First Capture Screen Layout

The first capture UI should be dense and keyboard-friendly.

Suggested layout:

- Left: subject search and queue
- Center: current subject detail and current/primary image
- Right: latest imported image and match/review controls
- Bottom: recent capture log

Important fields:

- reference number
- first/last name
- grade
- homeroom
- track/team
- notes
- photographed status
- linked images

Primary commands:

- next subject
- previous subject
- search/ref jump
- accept latest image for current subject
- reject/ignore latest image
- relink image
- mark photographed
- flag for review

## Matching Rules

Initial matching can use:

- selected/current subject at time of capture
- barcode/ref number if present in hot-folder sidecar/log files
- filename/reference number when already renamed
- manual match from review queue

Every match should create:

- `image_assets`
- `image_versions`
- `subject_images`
- event/log record later

## Review States

Images and subject links should support review states:

- matched
- needs review
- duplicate candidate
- no subject found
- subject already photographed
- manually overridden

## Prototype Status

The current Electron prototype already supports:

- job list
- job detail
- subject list
- image list
- image dimensions
- image preview through the preload bridge
- subject-to-image links from migration
- senior order-item-to-image links
- read-only capture planning per selected job

The read-only capture planning view now shows:

- selected job
- no-photo subject count
- no-photo subject queue
- latest/linked images with preview
- image preview
- review candidates

The next implementation step is still not live capture. It should add subject/order detail panels or choose the first safe write workflow before hot-folder watching starts.

## Hot-Folder Decision

- On-site photography laptops run standalone capture sessions.
- Each photographer laptop has its own local Canon EOS hot folder.
- The app should treat those laptop capture databases/sessions as later sync/export sources, not as live shared-network writers during the shoot.
- The server hot folder is only for envelope scanning.
- Envelope scanning is done from one computer, so it does not need the same multi-station conflict model as on-site capture.
- Envelope scanning is also order entry: the employee scans the envelope and keys the order codes, so the workflow should create a `paper` order and parsed `order_items`.

## Standalone Laptop Sync

The detailed sync workflow lives in `docs/STANDALONE_LAPTOP_SYNC_WORKFLOW.md`.

High-level flow:

1. The office prepares a laptop capture package for a job.
2. The laptop captures locally with a local SQLite database and local image folders.
3. The laptop exports a session package after the shoot.
4. The office imports the session package into the shared production database.
5. Any conflicts are reviewed before replacing primary images or notes.

## Open Decisions

- Whether capture state should be stored only in the laptop SQLite file or also mirrored into a session log.
- Whether each laptop should import from one global local hot folder or one local hot folder per job.
- Whether the camera software can write sidecar metadata we can consume.
