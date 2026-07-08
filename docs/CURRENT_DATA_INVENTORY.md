# Current Data Inventory

This document records what is present in the current TRECS V7 folder as of the first Milestone 0 pass.

## Master Database

File: `ProgramData.accdb`

### `Schools` table

Rows found: 67

Columns:

- `ReferenceNumber` : text
- `SchoolName` : text
- `TrecsName` : text
- `Phone` : text
- `Address` : text
- `City` : text
- `State` : text
- `Zipcode` : text
- `Contact1Name` : text
- `Contact1Position` : text
- `Contact1Email` : text
- `Contact2Name` : text
- `Contact2Position` : text
- `Contact2Email` : text
- `Contact3Name` : text
- `Contact3Position` : text
- `Contact3Email` : text
- `Notes` : text

Migration target:

- `clients`
- `client_contacts`
- `client_notes`

### `Jobs` table

Rows found: 7

Columns:

- `ID` : text
- `ReferenceNumber` : text
- `Location` : text
- `JobName` : text
- `Type` : text
- `PackagePlan` : text
- `STU_ID` : text
- `FAC_ID` : text
- `Notes` : memo

Migration target:

- `jobs`
- `job_settings`
- `job_notes`

### `PackagePlans` table

Rows found: 440

Columns:

- `PackagePlan` : text
- `Code` : text
- `CodeName` : text
- `f1` through `f15` : text

Migration target:

- `package_plans`
- `package_codes`
- `package_code_items`
- eventually `products`

Notes:

- The current schema stores package contents as fixed `f1` through `f15` fields.
- The rebuild should normalize these into one row per product/item.
- Package plans should be versioned so an old job can keep the exact package rules it was created with.

### `IDtemplate` table

Rows found: 32

Purpose:

- Stores ID card layout settings such as image position, text position, fonts, barcode position, QR position, and colors.

Migration target:

- `templates`
- `template_elements`
- `id_card_templates`

Notes:

- Most columns are layout coordinates or text styling fields.
- This is a good candidate for a later template-editor milestone, but should be imported early as data.

## Fall / Sports Student Job Database

Example files:

- `JOBS/ISLAND/FALL_2024/Database/Students.accdb`
- `JOBS/UHS/FALL_2024/Database/Students.accdb`

### `Students` table

Rows found:

- ISLAND fall sample: 22
- UHS fall sample: 646

Columns:

- `RefNum` : text
- `First` : text
- `Last` : text
- `StuID` : text
- `Grade` : text
- `Homeroom` : text
- `Track` : text
- `Photo` : boolean
- `Field1` : text
- `Field2` : text
- `Notes` : memo
- `Order1` : text
- `Order1Pay` : boolean
- `Order2` : text
- `Order2Pay` : boolean

Migration target:

- `subjects`
- `subject_fields`
- `subject_status`
- `orders`
- `order_items`
- `payments`
- `notes`

Notes:

- `Order1` and `Order2` are the most important model limitation to replace.
- `Photo` should become a derived or workflow status based on attached image assets, not only a manual boolean.
- `Field1` and `Field2` should become configurable job fields.
- Sample UHS fall rows show paper/manual order codes in `Order1`.
- Sample UHS fall rows show online order references stored in `Notes` and online order/package codes stored in `Order2`.
- Order code examples include single codes and compound dot-separated codes such as `99.8` or `3.75.45`.
- Prototype migration converted UHS fall `Order1` and `Order2` values into 149 normalized orders and 248 order items after splitting dot-separated package/add-on codes.

### `Lists` table

Rows found:

- ISLAND fall sample: 0
- UHS fall sample: 24

Columns:

- `List` : text
- `ReferenceNumber` : text

Migration target:

- `subject_groups`
- `subject_group_members`

Notes:

- Existing lists should become named groups/tags.
- Lists should be usable across reports, capture queues, exports, and rendering batches.

## Senior Job Database

Example files:

- `JOBS/ISLAND/SENIORS_TEST/Database/Seniors.accdb`
- `JOBS/UHS/SENIORS/Database/Seniors.accdb`

### `Students` table

Rows found:

- ISLAND senior test sample: 6
- UHS seniors sample: 123

Columns:

- `RefNum` : text
- `First` : text
- `Last` : text
- `StuID` : text
- `Homeroom` : text
- `Notes` : memo
- `Orders` : memo
- `Code` : text

Migration target:

- `subjects`
- `subject_codes`
- `orders`
- `order_items`
- `notes`

Notes:

- `Orders` appears to hold a JSON-like or serialized order structure in a memo field.
- `Code` should become a subject access code or gallery code.
- Sample senior `Orders` values are JSON-style maps from image filename to order code.
- Senior notes can contain multiple online order references in one memo field.
- Prototype migration imports UHS senior records into unified `subjects`, senior gallery codes into `subject_codes`, and senior image-specific order maps into normalized `orders` and `order_items`.

### `Lists` table

Rows found:

- UHS seniors sample: 6
- ISLAND senior test sample: not present in the extracted output

Columns:

- `List` : text
- `ReferenceNumber` : text

Migration target:

- `subject_groups`
- `subject_group_members`

### `FallJob` table

Rows found: 1 per senior database

Columns:

- `FallJobPath` : text

Migration target:

- `job_links`

Notes:

- Senior and spring jobs currently point back to a selected fall job path.
- The rebuild should store job-to-job relationships by database IDs, while keeping original paths as migration metadata.

## Job Folder Layouts Found

### Fall jobs

Examples:

- `JOBS/ISLAND/FALL_2024`
- `JOBS/UHS/FALL_2024`

Common folders:

- `Borders`
- `Certificates`
- `CroppedLarge`
- `CroppedMed`
- `CroppedSmall`
- `Database`
- `Exports`
- `Notes`
- `Processed`
- `Templates`

Additional observed folder:

- `ID_Cards` in `ISLAND/FALL_2024`

### Senior jobs

Examples:

- `JOBS/ISLAND/SENIORS_TEST`
- `JOBS/UHS/SENIORS`

Common folders:

- `CroppedLarge`
- `CroppedMed`
- `Database`
- `Images`

Additional observed folder:

- `Chosen` in `UHS/SENIORS`

## Tooling Added During Inventory

Added local helper:

- `tools/AccessSchemaInspector.java`
- `tools/AccessTableSampler.java`
- `tools/TrecsMigrationPrototype.java`

Purpose:

- Reads one or more `.accdb` files with Jackcess.
- Prints tables, row counts, columns, and column types.
- Samples table rows for migration research.
- Generates SQLite import SQL for `ProgramData.accdb` and one fall job.

Product mapping artifacts:

- `database/product_seed.sql`
- `database/apply_product_aliases.sql`
- `docs/PRODUCT_MAPPING_DRAFT.md`

Current prototype product mapping result:

- `products`: 67
- `product_aliases`: 154
- `package_code_items`: 727
- mapped package item rows: 727
- unmapped package item rows: 0

Image migration artifact:

- `docs/IMAGE_ASSET_MIGRATION.md`

Current prototype image import result:

- `image_assets`: 1,944
- `image_versions`: 3,482
- `subject_images`: 1,932
- senior order items linked to image assets: 589 of 589

Compile:

```powershell
javac -cp "JARS\jackcess-4.0.0.jar;JARS\commons-lang3-3.11.jar;JARS\commons-logging-1.2.jar" tools\AccessSchemaInspector.java
```

Run:

```powershell
java -cp "tools;JARS\jackcess-4.0.0.jar;JARS\commons-lang3-3.11.jar;JARS\commons-logging-1.2.jar" AccessSchemaInspector ProgramData.accdb
```

Sample rows:

```powershell
java -cp "tools;JARS\jackcess-4.0.0.jar;JARS\commons-lang3-3.11.jar;JARS\commons-logging-1.2.jar" AccessTableSampler ProgramData.accdb PackagePlans 12
```
