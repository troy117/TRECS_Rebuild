UPDATE package_code_items
SET product_id = (
  SELECT pa.product_id
  FROM product_aliases pa
  WHERE TRIM(REPLACE(pa.alias, CHAR(160), ' ')) = TRIM(REPLACE(package_code_items.raw_value, CHAR(160), ' '))
)
WHERE product_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM product_aliases pa
    WHERE TRIM(REPLACE(pa.alias, CHAR(160), ' ')) = TRIM(REPLACE(package_code_items.raw_value, CHAR(160), ' '))
  );
