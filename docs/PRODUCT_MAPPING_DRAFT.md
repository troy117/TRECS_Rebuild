# Product Mapping Draft

This document starts translating legacy package item values into normalized product categories for the JavaScript rebuild.

Seed data:

- `database/product_seed.sql`
- `database/apply_product_aliases.sql`

Schema support:

- `products`
- `product_aliases`
- `package_code_items.product_id`

## Why Product Aliases Exist

The old `PackagePlans` table stores render/product values as raw text in `f1` through `f15`.

Those raw values mix several different concepts:

- real products, such as `8x10`
- bundles, such as `2-5x7`
- package labels, such as `PkgG`
- render modifiers, such as `border_NameAll`
- fulfillment instructions, such as `Mail Home`
- specialty themed items, such as `MagnetsDinosaur`
- workflow placeholders, such as `Call 559.456-1400 to order - Thank you`

The rebuild should preserve every raw value while mapping obvious values to normalized products. `product_aliases` lets the system say: this old raw value points to this product, while still keeping the original old text.

## Categories

### Prints And Print Bundles

Examples:

- `8x10`
- `2-8x10`
- `2-5x7`
- `4-5x7`
- `4-3x5`
- `8 Wallets`
- `16 Wallets`
- `16 Mini`
- `10x13`
- `10x13 Poster`

Category:

- `print`
- `print_bundle`

### Group And Class Products

Examples:

- `ClassPhoto`
- `StarPhoto`
- `Group5x7`
- `Group8x10`
- `Grad Group`

Category:

- `group_print`

### Digital Products

Examples:

- `DigitalDownload`
- `Digital Download`
- `CD`
- `Zip`
- `Senior Session Thumbdrive`

Category:

- `digital`
- `digital_media`

### ID Products

Examples:

- `StudentID`
- `BonusID`
- `NameWallet`

Category:

- `id_card`

### Specialty Items

Examples:

- `FunpackBackToSchool`
- `MagnetsDinosaur`
- `KeychainMarble`
- `Dad's Package`
- `Mom's Package`
- `Notecards`
- `Announcements12`
- `TradingCards`
- `MemoryMate`

Category:

- `specialty`
- `sports_product`

### Render Modifiers

Examples:

- `border_NameAll`
- `border_Vignette`
- `border_FunGrunge`
- `border_PhotoCorners`
- `border_TexturedFrame`
- `border_Grad`
- `NameAll`
- `Addname`

Category:

- `render_modifier`

### Services And Fulfillment

Examples:

- `Retouching`
- `Mail Home`
- `MailHome`
- `MAIL`

Category:

- `service`
- `fulfillment`

### Workflow / Admin

Examples:

- `Complimentary`
- `BuildYourOwn`
- `PkgA` through `PkgJ`
- `Call 559.456-1400 to order - Thank you`
- `Holding for order`
- `Choose Circle Pose`
- `Choose Formal Pose`

Category:

- `workflow`
- `package_builder`
- `package_marker`

## Needs Review

These values were seeded but should be reviewed with production knowledge:

- `Buddy`
- `ComboSpecial`
- `4 Wall & 5x7`
- `4 Wall & 2-3x5`
- `Class Photo and Sticker Prints`
- themed magnet/keychain/funpack quantity variants
- performance group values like `5x7_Advanced Band` and `8x10_Showcase`

## Still Unmapped

The seed file intentionally focuses on obvious/common values first. Remaining values should be mapped after deciding whether they are one-off products, performance group products, or just labels.

Known examples:

- `8x12 Elem Orchestra`
- `11x17 HS Band`
- `5x7_Advanced Band`
- `8x10_Jazz Band`
- other performance/group-specific values

The performance/group values appear to include hidden trailing spacing in the Access data, so these should be handled with value normalization before alias matching.

## Validation Query

After loading `database/product_seed.sql` and `database/apply_product_aliases.sql`, this query shows package item values that still do not have a product mapping:

```sql
SELECT pci.raw_value, COUNT(*) AS uses
FROM package_code_items pci
WHERE pci.product_id IS NULL
GROUP BY pci.raw_value
ORDER BY uses DESC, pci.raw_value;
```

## Prototype Mapping Result

After applying the current product seed and alias update:

- `products`: 67
- `product_aliases`: 154
- `package_code_items`: 727
- mapped package item rows: 727
- unmapped package item rows: 0

The final unmapped package item count is now zero. Performance/group print values are mapped as generic performance print products:

- `8x12 Elem Orchestra`
- `11x17 HS Band`
- `5x7_Advanced Band`
- `8x10_Jazz Band`

The alias application step normalizes hidden non-breaking spaces before matching.

## Next Step

Review whether performance/group print values should remain generic products or become individual named products in the final app.
