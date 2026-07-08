BEGIN TRANSACTION;

INSERT OR IGNORE INTO products (name, category, size, requires_image, metadata_json) VALUES
  ('8x10', 'print', '8x10', 1, '{"legacy_group":"print"}'),
  ('2-8x10', 'print_bundle', '8x10', 1, '{"quantity":2,"legacy_group":"print"}'),
  ('5x7', 'print', '5x7', 1, '{"legacy_group":"print"}'),
  ('2-5x7', 'print_bundle', '5x7', 1, '{"quantity":2,"legacy_group":"print"}'),
  ('3-5x7 & 12 Wallets', 'print_bundle', NULL, 1, '{"legacy_group":"print"}'),
  ('4-5x7', 'print_bundle', '5x7', 1, '{"quantity":4,"legacy_group":"print"}'),
  ('3x5', 'print', '3x5', 1, '{"legacy_group":"print"}'),
  ('2-3x5', 'print_bundle', '3x5', 1, '{"quantity":2,"legacy_group":"print"}'),
  ('4-3x5', 'print_bundle', '3x5', 1, '{"quantity":4,"legacy_group":"print"}'),
  ('2-3x5 & 5x7', 'print_bundle', NULL, 1, '{"legacy_group":"print"}'),
  ('Wallets', 'print_bundle', 'wallet', 1, '{"legacy_group":"print"}'),
  ('4 Wallets', 'print_bundle', 'wallet', 1, '{"quantity":4,"legacy_group":"print"}'),
  ('8 Wallets', 'print_bundle', 'wallet', 1, '{"quantity":8,"legacy_group":"print"}'),
  ('16 Wallets', 'print_bundle', 'wallet', 1, '{"quantity":16,"legacy_group":"print"}'),
  ('24 Wallets', 'print_bundle', 'wallet', 1, '{"quantity":24,"legacy_group":"print"}'),
  ('Mini Wallets', 'print_bundle', 'mini_wallet', 1, '{"legacy_group":"print"}'),
  ('16 Mini', 'print_bundle', 'mini_wallet', 1, '{"quantity":16,"legacy_group":"print"}'),
  ('8 Mini & 2-3x5', 'print_bundle', NULL, 1, '{"legacy_group":"print"}'),
  ('10x13', 'print', '10x13', 1, '{"legacy_group":"print"}'),
  ('10x13 Poster', 'print', '10x13', 1, '{"legacy_group":"print"}'),
  ('10x13 MiniPoster', 'print', '10x13', 1, '{"legacy_group":"print"}'),
  ('Group5x7', 'group_print', '5x7', 1, '{"legacy_group":"group"}'),
  ('Group8x10', 'group_print', '8x10', 1, '{"legacy_group":"group"}'),
  ('Performance 5x7', 'group_print', '5x7', 1, '{"legacy_group":"performance"}'),
  ('Performance 8x10', 'group_print', '8x10', 1, '{"legacy_group":"performance"}'),
  ('Performance 8x12', 'group_print', '8x12', 1, '{"legacy_group":"performance"}'),
  ('Performance 11x17', 'group_print', '11x17', 1, '{"legacy_group":"performance"}'),
  ('ClassPhoto', 'group_print', NULL, 1, '{"legacy_group":"group"}'),
  ('StarPhoto', 'group_print', NULL, 1, '{"legacy_group":"group"}'),
  ('Grad Group', 'group_print', NULL, 1, '{"legacy_group":"group"}'),
  ('MemoryMate', 'sports_product', NULL, 1, '{"legacy_group":"sports"}'),
  ('TradingCards', 'sports_product', NULL, 1, '{"legacy_group":"sports"}'),
  ('Dad''s Package', 'specialty_bundle', NULL, 1, '{"legacy_group":"specialty"}'),
  ('Mom''s Package', 'specialty_bundle', NULL, 1, '{"legacy_group":"specialty"}'),
  ('DigitalDownload', 'digital', NULL, 1, '{"legacy_group":"digital"}'),
  ('CD', 'digital_media', NULL, 1, '{"legacy_group":"digital"}'),
  ('Zip', 'digital_media', NULL, 1, '{"legacy_group":"digital"}'),
  ('StudentID', 'id_card', NULL, 1, '{"legacy_group":"id"}'),
  ('BonusID', 'id_card', NULL, 1, '{"legacy_group":"id"}'),
  ('NameWallet', 'id_card', 'wallet', 1, '{"legacy_group":"id"}'),
  ('Funpack', 'specialty', NULL, 1, '{"legacy_group":"funpack"}'),
  ('Magnets', 'specialty', NULL, 1, '{"legacy_group":"magnet"}'),
  ('Keychain', 'specialty', NULL, 1, '{"legacy_group":"keychain"}'),
  ('Notecards', 'specialty', NULL, 1, '{"legacy_group":"notecard"}'),
  ('Announcements', 'specialty', NULL, 1, '{"legacy_group":"announcement"}'),
  ('Senior Session Thumbdrive', 'digital_media', NULL, 1, '{"legacy_group":"senior"}'),
  ('SpringArtPrint', 'specialty', NULL, 1, '{"legacy_group":"spring"}'),
  ('SpringColorMe', 'specialty', NULL, 1, '{"legacy_group":"spring"}'),
  ('Border Name All', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Border Vignette', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Border Fun Grunge', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Border Photo Corners', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Border Textured Frame', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Border Grad', 'render_modifier', NULL, 0, '{"legacy_group":"border"}'),
  ('Name All', 'render_modifier', NULL, 0, '{"legacy_group":"modifier"}'),
  ('Add Name', 'render_modifier', NULL, 0, '{"legacy_group":"modifier"}'),
  ('Retouching', 'service', NULL, 0, '{"legacy_group":"service"}'),
  ('Mail Home', 'fulfillment', NULL, 0, '{"legacy_group":"fulfillment"}'),
  ('Complimentary', 'workflow', NULL, 0, '{"legacy_group":"workflow"}'),
  ('Placeholder', 'workflow', NULL, 0, '{"legacy_group":"workflow"}'),
  ('Holding for order', 'workflow', NULL, 0, '{"legacy_group":"workflow"}'),
  ('Build Your Own', 'package_builder', NULL, 0, '{"legacy_group":"package"}'),
  ('Package Marker', 'package_marker', NULL, 0, '{"legacy_group":"package"}'),
  ('Buddy', 'unknown', NULL, 1, '{"legacy_group":"review"}'),
  ('ComboSpecial', 'unknown', NULL, 1, '{"legacy_group":"review"}'),
  ('Choose Circle Pose', 'workflow', NULL, 0, '{"legacy_group":"pose_selection"}'),
  ('Choose Formal Pose', 'workflow', NULL, 0, '{"legacy_group":"pose_selection"}');

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10', 'Exact legacy package item' FROM products WHERE name = '8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '2-8x10', 'Exact legacy package item' FROM products WHERE name = '2-8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '2-5x7', 'Exact legacy package item' FROM products WHERE name = '2-5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '3-5x7 & 12 Wallets', 'Exact legacy package item' FROM products WHERE name = '3-5x7 & 12 Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '4-5x7', 'Exact legacy package item' FROM products WHERE name = '4-5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '2-3x5', 'Exact legacy package item' FROM products WHERE name = '2-3x5';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '4-3x5', 'Exact legacy package item' FROM products WHERE name = '4-3x5';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '2-3x5 & 5x7', 'Exact legacy package item' FROM products WHERE name = '2-3x5 & 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '4 Wall & 5x7', 'Legacy wall/wallet bundle needs quantity confirmation' FROM products WHERE name = 'Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '4 Wall & 2-3x5', 'Legacy wall/wallet bundle needs quantity confirmation' FROM products WHERE name = 'Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '4 Wallets', 'Exact legacy package item' FROM products WHERE name = '4 Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8 Wallets', 'Exact legacy package item' FROM products WHERE name = '8 Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '16 Wallets', 'Exact legacy package item' FROM products WHERE name = '16 Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '24 Wallets', 'Exact legacy package item' FROM products WHERE name = '24 Wallets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '16 Mini', 'Exact legacy package item' FROM products WHERE name = '16 Mini';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8 Mini & 2-3x5', 'Exact legacy package item' FROM products WHERE name = '8 Mini & 2-3x5';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '10x13', 'Exact legacy package item' FROM products WHERE name = '10x13';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '10x13 Poster', 'Exact legacy package item' FROM products WHERE name = '10x13 Poster';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '10x13 MiniPoster', 'Exact legacy package item' FROM products WHERE name = '10x13 MiniPoster';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Group5x7', 'Exact legacy package item' FROM products WHERE name = 'Group5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Group8x10', 'Exact legacy package item' FROM products WHERE name = 'Group8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 Elem Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 Intermediate Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 HS Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 Intermediate Band', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 HS Band', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 Intermediate Choir', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x12 HS Choir', 'Performance group print' FROM products WHERE name = 'Performance 8x12';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 Elem Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 Intermediate Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 HS Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 Intermediate Band', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 HS Band', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 Intermediate Choir', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '11x17 HS Choir', 'Performance group print' FROM products WHERE name = 'Performance 11x17';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Advanced Band', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Advanced Mariachi', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Advanced Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Art Society', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Balladeers', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Beginning Mariachi', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Concert Choir', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_JADE', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Jazz Band', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Leadership 2', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Off-the-Chain', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Percussion Ensemble', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '5x7_Showcase', 'Performance group print' FROM products WHERE name = 'Performance 5x7';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Advanced Band', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Advanced Mariachi', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Advanced Orchestra', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Art Society', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Balladeers', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Beginning Mariachi', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Concert Choir', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_JADE', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Jazz Band', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Leadership 2', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Off-the-Chain', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Percussion Ensemble', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, '8x10_Showcase', 'Performance group print' FROM products WHERE name = 'Performance 8x10';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'ClassPhoto', 'Exact legacy package item' FROM products WHERE name = 'ClassPhoto';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Class Photo and Sticker Prints', 'Class/sticker combined item needs render confirmation' FROM products WHERE name = 'ClassPhoto';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'StarPhoto', 'Exact legacy package item' FROM products WHERE name = 'StarPhoto';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Grad Group', 'Exact legacy package item' FROM products WHERE name = 'Grad Group';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MemoryMate', 'Exact legacy package item' FROM products WHERE name = 'MemoryMate';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'TradingCards', 'Exact legacy package item' FROM products WHERE name = 'TradingCards';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Dad''s Package', 'Exact legacy package item' FROM products WHERE name = 'Dad''s Package';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Mom''s Package', 'Exact legacy package item' FROM products WHERE name = 'Mom''s Package';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'DigitalDownload', 'Exact legacy package item' FROM products WHERE name = 'DigitalDownload';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Digital Download', 'Spaced legacy alias' FROM products WHERE name = 'DigitalDownload';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'CD', 'Exact legacy package item' FROM products WHERE name = 'CD';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Zip', 'Exact legacy package item' FROM products WHERE name = 'Zip';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'StudentID', 'Exact legacy package item' FROM products WHERE name = 'StudentID';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'BonusID', 'Exact legacy package item' FROM products WHERE name = 'BonusID';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'NameWallet', 'Exact legacy package item' FROM products WHERE name = 'NameWallet';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackTieDye', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackBeach', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackCalifornia', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackBackToSchool', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackDinosaur', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackMoments', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackMarble', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackRockStar', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackSpring', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackSports', 'Funpack theme' FROM products WHERE name = 'Funpack';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'FunpackSeasons', 'Funpack theme' FROM products WHERE name = 'Funpack';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsTieDye', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsBeach', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsCalifornia', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsBackToSchool', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsDinosaur', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsMoments', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsMarble', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsRockStar', 'Magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Magnets2', 'Magnet quantity/theme needs confirmation' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Magnets4Spring', 'Magnet quantity/theme needs confirmation' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsGrad', 'Grad magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsGrad2', 'Grad magnet quantity/theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsGrad4', 'Grad magnet quantity/theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsSenior', 'Senior magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsSpring2', 'Spring magnet quantity/theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MagnetsSports', 'Sports magnet theme' FROM products WHERE name = 'Magnets';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'SportsMagnets', 'Sports magnet theme' FROM products WHERE name = 'Magnets';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Keychain', 'Exact legacy package item' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainTieDye', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainBeach', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainCalifornia', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainBackToSchool', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainDinosaur', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainMoments', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainMarble', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainRockStar', 'Keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainSpring', 'Spring keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainSports', 'Sports keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainGrad', 'Grad keychain theme' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainsGrad', 'Grad keychain plural alias' FROM products WHERE name = 'Keychain';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'KeychainSenior', 'Senior keychain theme' FROM products WHERE name = 'Keychain';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Notecards', 'Exact legacy package item' FROM products WHERE name = 'Notecards';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Announcements12', 'Announcement quantity' FROM products WHERE name = 'Announcements';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Announcements16', 'Announcement quantity' FROM products WHERE name = 'Announcements';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Senior Session Thumbdrive', 'Exact legacy package item' FROM products WHERE name = 'Senior Session Thumbdrive';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'SpringArtPrint', 'Exact legacy package item' FROM products WHERE name = 'SpringArtPrint';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'SpringColorMe', 'Exact legacy package item' FROM products WHERE name = 'SpringColorMe';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_NameAll', 'Exact legacy package item' FROM products WHERE name = 'Border Name All';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_Vignette', 'Exact legacy package item' FROM products WHERE name = 'Border Vignette';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_FunGrunge', 'Exact legacy package item' FROM products WHERE name = 'Border Fun Grunge';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_PhotoCorners', 'Exact legacy package item' FROM products WHERE name = 'Border Photo Corners';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_TexturedFrame', 'Exact legacy package item' FROM products WHERE name = 'Border Textured Frame';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'border_Grad', 'Exact legacy package item' FROM products WHERE name = 'Border Grad';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'NameAll', 'Exact legacy package item' FROM products WHERE name = 'Name All';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Addname', 'Exact legacy package item' FROM products WHERE name = 'Add Name';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Retouching', 'Exact legacy package item' FROM products WHERE name = 'Retouching';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Mail Home', 'Exact legacy package item' FROM products WHERE name = 'Mail Home';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MailHome', 'No-space legacy alias' FROM products WHERE name = 'Mail Home';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'MAIL', 'Uppercase legacy alias' FROM products WHERE name = 'Mail Home';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Complimentary', 'Exact legacy package item' FROM products WHERE name = 'Complimentary';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Call 559.456-1400 to order - Thank you', 'Legacy placeholder text' FROM products WHERE name = 'Placeholder';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Holding for order', 'Exact legacy package item' FROM products WHERE name = 'Holding for order';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'BuildYourOwn', 'Exact legacy package item' FROM products WHERE name = 'Build Your Own';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgA', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgB', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgC', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgD', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgE', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgF', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgG', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgH', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgI', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'PkgJ', 'Package marker, not a physical product' FROM products WHERE name = 'Package Marker';

INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Buddy', 'Needs production review' FROM products WHERE name = 'Buddy';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'ComboSpecial', 'Needs production review' FROM products WHERE name = 'ComboSpecial';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Choose Circle Pose', 'Exact legacy package item' FROM products WHERE name = 'Choose Circle Pose';
INSERT OR IGNORE INTO product_aliases (product_id, alias, notes)
SELECT id, 'Choose Formal Pose', 'Exact legacy package item' FROM products WHERE name = 'Choose Formal Pose';

COMMIT;
