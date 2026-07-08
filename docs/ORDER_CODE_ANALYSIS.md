# Order Code Analysis

This document records what the current data suggests about package/order codes and how the rebuild should parse them.

## Current Finding

Legacy order fields store one or more package/add-on codes in a single text value.

Examples from UHS `FALL_2024`:

- `7`
- `22`
- `91`
- `99.8`
- `3.75.45`
- `4.64.74.45.99.90`

The best current interpretation is:

- Split the order string on `.`.
- Treat each non-empty segment as one package/add-on code.
- Resolve each segment against the job's assigned package plan.
- Preserve the original raw order string for debugging and audit history.

The migration prototype now follows this rule.

## Prototype Result

Imported source:

- `ProgramData.accdb`
- `JOBS/UHS/FALL_2024/Database/Students.accdb`

Updated migration result:

- `orders`: 149
- `order_items`: 248

The increase from 149 order items to 248 order items happened because compound codes now split into separate line items.

## UHS Fall Package Plan

UHS `FALL_2024` uses package plan:

- `ELEM_STANDARD`

The imported package plan has:

- 58 package/add-on codes
- 109 package item rows

## Parsed UHS Fall Order Codes

Most-used parsed code segments:

| Code | Uses | Package Code Name | Package Items |
| --- | ---: | --- | --- |
| `7` | 33 | `PkgG` | `PkgG`, `8x10`, `2-5x7`, `4-3x5`, `8 Wallets`, `ClassPhoto` |
| `22` | 28 | `2-5x7` | `2-5x7` |
| `21` | 25 | `8x10` | `8x10` |
| `8` | 23 | `PkgH` | `PkgH`, `2-5x7`, `4-3x5`, `8 Wallets`, `ClassPhoto` |
| `13` | 22 | `PkgM` | `BuildYourOwn` |
| `91` | 14 | `Digital Download` | `DigitalDownload` |
| `45` | 12 | `border_NameAll` | `border_NameAll` |
| `24` | 10 | `8 Wallets` | `8 Wallets` |
| `4` | 9 | `PkgD` | `PkgD`, `8x10`, `2-3x5 & 5x7`, `8 Wallets`, `StarPhoto` |
| `23` | 9 | `4-3x5` | `4-3x5` |
| `99` | 8 | `Retouching` | `Retouching` |
| `49` | 6 | `border_Vignette` | `border_Vignette` |
| `6` | 5 | `PkgF` | `PkgF`, `2-8x10`, `2-5x7`, `4-3x5`, `8 Wallets`, `ClassPhoto` |
| `90` | 5 | unmatched | unmatched |

## Unmatched Codes

Code `90` appears in UHS fall orders but does not exist in any imported package plan.

Examples:

- `13.22.23.90`
- `22.90`
- `4.64.74.45.99.90`
- `7.90`

Possible meanings:

- retired add-on
- special instruction
- web-order-only code
- typo or old package-plan mismatch
- item defined somewhere outside `PackagePlans`

Migration rule for now:

- Keep unmatched codes as `order_items.package_code`.
- Leave `product_id` null.
- Flag them later in the app as needing package/product mapping review.

## Package Plan Interpretation

Each package code expands into one or more package item rows.

Example:

Package code `7` in `ELEM_STANDARD`:

- `PkgG`
- `8x10`
- `2-5x7`
- `4-3x5`
- `8 Wallets`
- `ClassPhoto`

Package code `45`:

- `border_NameAll`

This suggests the new rendering pipeline should eventually expand:

`order -> order_items(package/add-on codes) -> package_code_items(product/render items) -> render_tasks`

## Recommended Parsing Rules

### Rule 1: Preserve Raw Code

Always keep the original field value, such as `4.64.74.45.99.90`, in `order_items.raw_code`.

### Rule 2: Split On Dot

Split by `.` and ignore blank segments.

Examples:

- `7` becomes `7`
- `3.75.45` becomes `3`, `75`, `45`
- `4.` becomes `4`
- `99.8` becomes `99`, `8`

### Rule 3: Resolve Against Job Package Plan

Resolve each code segment using the package plan assigned to the job.

For UHS `FALL_2024`, resolve against `ELEM_STANDARD`.

### Rule 4: Keep Unmatched Codes

If a code is not found in the package plan, keep it as an order item with no product/package expansion.

### Rule 5: Expand Later During Rendering

Do not duplicate every rendered product into `order_items` during migration.

Instead:

- `order_items` should represent ordered package/add-on codes.
- `package_code_items` should represent what each package/add-on produces.
- rendering should expand from package codes into actual render tasks.

## Product Mapping Work Still Needed

Package item raw values need to be mapped into structured product definitions.

Examples:

- `8x10`
- `2-5x7`
- `4-3x5`
- `8 Wallets`
- `ClassPhoto`
- `StarPhoto`
- `DigitalDownload`
- `Retouching`
- `border_NameAll`
- `FunpackBackToSchool`
- `MagnetsDinosaur`
- `KeychainMarble`

Some raw values are straightforward print/product names. Others are render modifiers, borders, digital outputs, or workflow instructions.

## Next Step

Build a product mapping draft:

1. Extract all unique `package_code_items.raw_value` values.
2. Group them into product categories:
   - prints
   - packages
   - class/group photos
   - digital/download
   - borders/render modifiers
   - specialty items
   - workflow/admin items
   - unknown
3. Create seed product rows for the obvious values.
4. Leave ambiguous values in an `unknown` review list.
