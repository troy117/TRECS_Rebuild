const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const appRoot = path.join(repoRoot, 'trecs-js');
const initSqlJs = require(path.join(appRoot, 'node_modules', 'sql.js'));

function readDataRoot() {
  const pathFile = path.join(repoRoot, 'path.txt');
  if (!fs.existsSync(pathFile)) return repoRoot;
  const configured = fs.readFileSync(pathFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^["']|["']$/g, ''))
    .find((line) => line && !line.startsWith('#'));
  return configured ? path.resolve(repoRoot, configured) : repoRoot;
}

function q(value) {
  return String(value || '').replace(/'/g, "''");
}

function json(value) {
  return JSON.stringify(value);
}

const products = [
  ['5x7', 'print', '5x7', 1, { legacy_group: 'print' }],
  ['6-3x5', 'print_bundle', '3x5', 1, { quantity: 6, legacy_group: 'print' }],
  ['12 Wallets', 'print_bundle', 'wallet', 1, { quantity: 12, legacy_group: 'print' }],
  ['8 Mini Wallets', 'print_bundle', 'mini_wallet', 1, { quantity: 8, legacy_group: 'print' }],
  ['BonusID', 'id_card', null, 1, { legacy_group: 'id' }],
  ['Placeholder', 'envelope_text', null, 0, { legacy_group: 'workflow' }]
];

const aliases = [
  ['5x7', '5x7', 'Exact legacy package item'],
  ['6-3x5', '6-3x5', 'Exact legacy package item'],
  ['12 Wallets', '12 Wallets', 'Exact legacy package item'],
  ['8 Mini Wallets', '8 Mini Wallets', 'Exact legacy package item'],
  ['BonusID', 'BonusID', 'Exact legacy package item'],
  ['Placeholder', 'Placeholder', 'Exact legacy package item']
];

const codeDefinitions = [
  { code: '1', name: 'Package A', price: 64, items: ['2-8x10', '4-5x7', '6-3x5', '16 Wallets', '8 Mini Wallets', 'StarPhoto', ['Funpack', 'Funpack - Back To School'], ['Magnets', 'Magnets - Back To School']] },
  { code: '2', name: 'Package B', price: 58, items: ['2-8x10', '3-5x7 & 12 Wallets', '4-3x5', 'StarPhoto', ['Funpack', 'Funpack - Back To School'], ['Magnets', 'Magnets - Back To School']] },
  { code: '3', name: 'Package C', price: 54, items: ['2-8x10', '2-5x7', '4-3x5', '8 Wallets', 'StarPhoto', ['Funpack', 'Funpack - Back To School'], ['Magnets', 'Magnets - Back To School']] },
  { code: '4', name: 'Package D', price: 48, items: ['8x10', '5x7', '2-3x5', '8 Wallets', 'StarPhoto', ['Funpack', 'Funpack - Back To School'], ['Magnets', 'Magnets - Back To School']] },
  { code: '5', name: 'Package E', price: 50, items: ['2-8x10', '4-5x7', '2-3x5', '16 Wallets', '8 Mini Wallets', 'ClassPhoto'] },
  { code: '6', name: 'Package F', price: 44, items: ['2-8x10', '2-5x7', '4-3x5', '8 Wallets', 'ClassPhoto'] },
  { code: '7', name: 'Package G', price: 40, items: ['8x10', '2-5x7', '4-3x5', '8 Wallets', 'ClassPhoto'] },
  { code: '8', name: 'Package H', price: 34, items: ['2-5x7', '4-3x5', '8 Wallets', 'ClassPhoto'] },
  { code: '9', name: 'Package I', price: 35, items: ['8x10', '5x7', '2-3x5', '8 Wallets', 'ClassPhoto'] },
  { code: '101', name: 'Package J', price: 25, items: ['5x7', '4 Wallets', 'ClassPhoto'] },
  { code: '12', name: 'Package K Zip', price: null, items: ['Zip', 'StarPhoto', 'Border Name & Year All', 'Border Vignette', 'Border Fun Grunge', 'Border Photo Corners', 'Border Textured Frame'] },
  { code: '13', name: 'Package M Build Your Own', price: 32, items: ['Build Your Own'] },
  { code: '21', name: '8x10', price: 22, items: ['8x10'] },
  { code: '22', name: '2-5x7', price: 22, items: ['2-5x7'] },
  { code: '23', name: '4-3x5', price: 22, items: ['4-3x5'] },
  { code: '24', name: '8 Wallets', price: 22, items: ['8 Wallets'] },
  { code: '25', name: '16 Mini Wallets', price: 22, items: ['16 Mini'] },
  { code: '26', name: 'Student ID - Receive 2', price: 10, items: [['StudentID', 'Student ID', 2]] },
  { code: '27', name: 'Traditional Class Photo', price: 22, items: ['ClassPhoto'] },
  { code: '28', name: 'Star Class Photo', price: 25, items: ['StarPhoto'] },
  { code: '31', name: '10x13 Big Print', price: 36, items: ['10x13'] },
  { code: '41', name: 'Bonus ID', price: null, items: ['BonusID'] },
  { code: '45', name: 'Border Name & Year All', price: 6, items: ['Border Name & Year All'] },
  { code: '49', name: 'Border Vignette', price: 6, items: ['Border Vignette'] },
  { code: '51', name: 'Border Fun Grunge', price: 6, items: ['Border Fun Grunge'] },
  { code: '52', name: 'Border Photo Corners', price: 6, items: ['Border Photo Corners'] },
  { code: '53', name: 'Border Textured Frame', price: 6, items: ['Border Textured Frame'] },
  { code: '61', name: 'Funpack - Tie-Dye', price: 16, items: [['Funpack', 'Funpack - Tie-Dye']] },
  { code: '62', name: 'Funpack - Summer Beach', price: 16, items: [['Funpack', 'Funpack - Summer Beach']] },
  { code: '63', name: 'Funpack - Cars', price: 16, items: [['Funpack', 'Funpack - Cars']] },
  { code: '64', name: 'Funpack - Back To School', price: 16, items: [['Funpack', 'Funpack - Back To School']] },
  { code: '65', name: 'Funpack - Timeless', price: 16, items: [['Funpack', 'Funpack - Timeless']] },
  { code: '66', name: 'Funpack - Moments', price: 16, items: [['Funpack', 'Funpack - Moments']] },
  { code: '67', name: 'Funpack - Marble', price: 16, items: [['Funpack', 'Funpack - Marble']] },
  { code: '68', name: 'Funpack - Unicorns', price: 16, items: [['Funpack', 'Funpack - Unicorns']] },
  { code: '71', name: 'Magnets - Tie-Dye', price: 24, items: [['Magnets', 'Magnets - Tie-Dye']] },
  { code: '72', name: 'Magnets - Summer Beach', price: 24, items: [['Magnets', 'Magnets - Summer Beach']] },
  { code: '73', name: 'Magnets - Cars', price: 24, items: [['Magnets', 'Magnets - Cars']] },
  { code: '74', name: 'Magnets - Back To School', price: 24, items: [['Magnets', 'Magnets - Back To School']] },
  { code: '75', name: 'Magnets - Timeless', price: 24, items: [['Magnets', 'Magnets - Timeless']] },
  { code: '76', name: 'Magnets - Moments', price: 24, items: [['Magnets', 'Magnets - Moments']] },
  { code: '77', name: 'Magnets - Marble', price: 24, items: [['Magnets', 'Magnets - Marble']] },
  { code: '78', name: 'Magnets - Unicorns', price: 24, items: [['Magnets', 'Magnets - Unicorns']] },
  { code: '81', name: 'Keychain - Tie-Dye', price: 12, items: [['Keychain', 'Keychain - Tie-Dye']] },
  { code: '82', name: 'Keychain - Summer Beach', price: 12, items: [['Keychain', 'Keychain - Summer Beach']] },
  { code: '83', name: 'Keychain - Cars', price: 12, items: [['Keychain', 'Keychain - Cars']] },
  { code: '84', name: 'Keychain - Back To School', price: 12, items: [['Keychain', 'Keychain - Back To School']] },
  { code: '85', name: 'Keychain - Timeless', price: 12, items: [['Keychain', 'Keychain - Timeless']] },
  { code: '86', name: 'Keychain - Moments', price: 12, items: [['Keychain', 'Keychain - Moments']] },
  { code: '87', name: 'Keychain - Marble', price: 12, items: [['Keychain', 'Keychain - Marble']] },
  { code: '88', name: 'Keychain - Unicorns', price: 12, items: [['Keychain', 'Keychain - Unicorns']] },
  { code: '91', name: 'Digital Download', price: 30, items: ['DigitalDownload'] },
  { code: '92', name: "Mom's Package", price: null, items: ["Mom's Package"] },
  { code: '93', name: "Dad's Package", price: null, items: ["Dad's Package"] },
  { code: '94', name: 'Mail Home', price: null, items: ['Mail Home'] },
  { code: '95', name: 'Placeholder', price: null, items: ['Placeholder'] },
  { code: '98', name: 'Complimentary', price: null, items: ['Complimentary'] },
  { code: '99', name: 'Retouching', price: 15, items: ['Retouching'] }
];

const middleSchoolOverrides = new Map([
  ['1', { code: '1', name: 'Package A', price: 64, items: ['2-8x10', '4-5x7', '6-3x5', '16 Wallets', '8 Mini Wallets', ['Magnets', 'Magnets - Back To School'], ['StudentID', 'Student ID', 2]] }],
  ['2', { code: '2', name: 'Package B', price: 58, items: ['2-8x10', '3-5x7 & 12 Wallets', '4-3x5', ['Magnets', 'Magnets - Back To School'], ['StudentID', 'Student ID', 2]] }],
  ['3', { code: '3', name: 'Package C', price: 54, items: ['2-8x10', '2-5x7', '4-3x5', '8 Wallets', ['Magnets', 'Magnets - Back To School'], ['StudentID', 'Student ID', 2]] }],
  ['4', { code: '4', name: 'Package D', price: 48, items: ['8x10', '5x7', '2-3x5', '8 Wallets', ['Magnets', 'Magnets - Back To School'], ['StudentID', 'Student ID', 2]] }],
  ['5', { code: '5', name: 'Package E', price: 50, items: ['2-8x10', '4-5x7', '2-3x5', '16 Wallets', '8 Mini Wallets'] }],
  ['6', { code: '6', name: 'Package F', price: 44, items: ['2-8x10', '2-5x7', '4-3x5', '8 Wallets'] }],
  ['7', { code: '7', name: 'Package G', price: 40, items: ['8x10', '2-5x7', '4-3x5', '8 Wallets'] }],
  ['8', { code: '8', name: 'Package H', price: 34, items: ['2-5x7', '4-3x5', '8 Wallets'] }],
  ['12', { code: '12', name: 'Package K Zip', price: null, items: ['Zip', 'Border Name & Year All', 'Border Vignette', 'Border Fun Grunge', 'Border Photo Corners', 'Border Textured Frame'] }]
]);

const middleSchoolCodeDefinitions = codeDefinitions
  .filter((definition) => !['9', '101', '27', '28'].includes(definition.code))
  .map((definition) => middleSchoolOverrides.get(definition.code) || definition);

const planDefinitions = new Map([
  ['Standard', codeDefinitions],
  ['Elementary', codeDefinitions],
  ['District', codeDefinitions],
  ['Middle School', middleSchoolCodeDefinitions]
]);

function itemParts(item) {
  if (Array.isArray(item)) {
    return { product: item[0], rawValue: item[1] || item[0], quantity: item[2] || 1 };
  }
  return { product: item, rawValue: item, quantity: 1 };
}

function rows(db, sql) {
  const result = db.exec(sql);
  if (!result.length) return [];
  return result[0].values.map((values) => Object.fromEntries(result[0].columns.map((column, index) => [column, values[index]])));
}

function scalar(db, sql) {
  return rows(db, sql)[0];
}

function ensureProduct(db, name, category, size, requiresImage, metadata) {
  db.run(`
    INSERT INTO products (name, category, size, requires_image, metadata_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(name) DO UPDATE SET
      category = excluded.category,
      size = excluded.size,
      requires_image = excluded.requires_image,
      updated_at = datetime('now');
  `, [name, category, size, requiresImage, json(metadata)]);
}

function productId(db, name) {
  const product = scalar(db, `SELECT id FROM products WHERE name = '${q(name)}' LIMIT 1;`);
  if (!product) throw new Error(`Missing product: ${name}`);
  return Number(product.id);
}

function seedDatabase(dbPath, SQL) {
  const db = new SQL.Database(fs.readFileSync(dbPath));
  db.run('PRAGMA foreign_keys = ON;');
  db.run('BEGIN TRANSACTION;');
  try {
    products.forEach((product) => ensureProduct(db, ...product));
    aliases.forEach(([productName, alias, notes]) => {
      db.run(`
        INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
        SELECT id, ?, ? FROM products WHERE name = ?;
      `, [alias, notes, productName]);
    });

    planDefinitions.forEach((definitions, planName) => {
      db.run(`
        INSERT INTO package_plans (name, version, active)
        VALUES (?, 1, 1)
        ON CONFLICT(name, version) DO UPDATE SET active = 1;
      `, [planName]);
      const plan = scalar(db, `SELECT id FROM package_plans WHERE name = '${q(planName)}' AND version = 1 LIMIT 1;`);
      const planId = Number(plan.id);
      const existing = rows(db, `SELECT id FROM package_codes WHERE package_plan_id = ${planId};`);
      existing.forEach((code) => db.run('DELETE FROM package_codes WHERE id = ?;', [Number(code.id)]));

      definitions.forEach((definition) => {
        db.run(`
          INSERT INTO package_codes (package_plan_id, code, name, active, legacy_code_name, metadata_json)
          VALUES (?, ?, ?, 1, ?, ?);
        `, [planId, definition.code, definition.name, definition.name, json({
          price: definition.price,
          source: planName === 'Middle School'
            ? 'Trecs Data Entry Codes Fall.xlsx + MS_2026 PRINT.jpg'
            : 'Trecs Data Entry Codes Fall.xlsx + ELEM_2026 print.jpg',
          plan_family: planName
        })]);
        const packageCodeId = Number(scalar(db, 'SELECT last_insert_rowid() AS id;').id);
        definition.items.forEach((item, index) => {
          const parts = itemParts(item);
          db.run(`
            INSERT INTO package_code_items (package_code_id, legacy_field, raw_value, product_id, quantity, sort_order)
            VALUES (?, ?, ?, ?, ?, ?);
          `, [packageCodeId, `Item${index + 1}`, parts.rawValue, productId(db, parts.product), parts.quantity, index + 1]);
        });
      });
    });

    db.run('COMMIT;');
    fs.writeFileSync(dbPath, Buffer.from(db.export()));
  } catch (error) {
    db.run('ROLLBACK;');
    throw error;
  } finally {
    db.close();
  }
}

(async () => {
  const dataRoot = process.argv[2] ? path.resolve(process.argv[2]) : readDataRoot();
  const databaseFolder = path.join(dataRoot, 'database');
  const dbPaths = ['migration_prototype.db', 'program.db']
    .map((name) => path.join(databaseFolder, name))
    .filter((dbPath) => fs.existsSync(dbPath));
  if (!dbPaths.length) throw new Error(`No TRECS databases were found in ${databaseFolder}`);
  const SQL = await initSqlJs({ locateFile: (file) => path.join(appRoot, 'node_modules', 'sql.js', 'dist', file) });
  dbPaths.forEach((dbPath) => seedDatabase(dbPath, SQL));
  console.log(`Seeded ${Array.from(planDefinitions.keys()).join(', ')} in ${dbPaths.length} database(s).`);
})();
