# Image Asset Migration

This document records the first prototype import of fall and senior image files into the new image model.

## Prototype Scope

Imported image folders:

- `JOBS/UHS/FALL_2024/CroppedMed`
- `JOBS/UHS/FALL_2024/CroppedLarge`
- `JOBS/UHS/FALL_2024/CroppedSmall`
- `JOBS/UHS/SENIORS/CroppedMed`
- `JOBS/UHS/SENIORS/CroppedLarge`
- `JOBS/UHS/SENIORS/Chosen`

The UHS senior `Images` folder was scanned, but no original-source assets were imported from it in this prototype run.

## Image Model Behavior

- `image_assets` stores one logical image per job/filename.
- `image_versions` stores folder-specific versions such as `cropped_med`, `cropped_large`, `cropped_small`, and `chosen`.
- Matching filenames across folders become versions of the same image asset.
- `subject_images` links image assets to subjects by parsing the reference number from the filename.
- Fall filenames such as `40001.jpg` map to subject reference `40001`.
- Senior filenames such as `40379__MG_2734.jpg` map to subject reference `40379`.
- Senior order items now link directly to `image_assets` by the filename stored in the senior `Orders` memo.

## Prototype Counts

Overall:

- `image_assets`: 1,944
- `image_versions`: 3,482
- image versions with dimensions: 3,482
- `subject_images`: 1,932
- senior order items: 589
- senior order items linked to image assets: 589
- fall subjects with primary images: 402
- senior subjects with image links: 122

By job/source:

| Job | Source | Assets |
| --- | --- | ---: |
| `FALL_2024` | `legacy_cropped_med` | 406 |
| `SENIORS` | `legacy_chosen` | 8 |
| `SENIORS` | `legacy_cropped_med` | 1,530 |

By job/version:

| Job | Version Type | Versions |
| --- | --- | ---: |
| `FALL_2024` | `cropped_large` | 4 |
| `FALL_2024` | `cropped_med` | 406 |
| `FALL_2024` | `cropped_small` | 4 |
| `SENIORS` | `chosen` | 8 |
| `SENIORS` | `cropped_large` | 1,530 |
| `SENIORS` | `cropped_med` | 1,530 |

## Senior Order Link Example

Senior order memo values such as:

```text
{"40379__MG_2734.jpg":"12.34"}
```

now create order items linked to the matching `image_assets.filename`:

```text
subject 40379 / ADRIAN AVALOS
image 40379__MG_2734.jpg
package codes 12 and 34
```

## Notes

- The prototype currently chooses the first imported version path as `image_assets.current_path`.
- Fall primary images are set from cropped folders where filenames match subject references.
- Senior chosen images are marked with role `chosen`; proof/cropped images use role `proof`.
- `Thumbs.db` and non-image files are ignored.

## Next Step

Add import support for image metadata and improve original-vs-cropped image handling:

- Check whether original image folders exist in real production jobs outside this sample.
- Decide whether `image_assets.current_path` should prefer original, chosen, cropped large, or cropped med.
- Add width/height metadata for image versions.
- Add a capture/import status dashboard in the future app shell.
