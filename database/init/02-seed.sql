-- One-time seed data, mirroring database/src/seed.ts (previously run by a
-- separate Node "seeder" container). Runs automatically via MySQL's
-- docker-entrypoint-initdb.d mechanism, only when the data directory is
-- empty (i.e. first container start against a fresh volume) — so this is
-- naturally idempotent across restarts.
--
-- imageName values below point at objects already uploaded to the remote
-- S3-compatible bucket (Cloudflare R2). Images for real (non-seed)
-- vacations get there via the admin upload flow -- see
-- backend/src/utils/image-handler.ts. Since the bucket is remote and not a
-- Docker volume, these seed images survive `docker compose down -v` and
-- load identically on any machine pointed at the same bucket.

INSERT INTO vacations (destination, description, startDate, endDate, price, imageName, createdAt, updatedAt) VALUES
('Rome', 'You can create a dream vacation of famous artistic wonders and historic hidden gems punctuated by top-notch dining in fabulous restaurants with a Rome vacation package. Fill your days with tours of the Roman Forum, the Pantheon, the Colosseum, all the show-off Rome sights, then meander down cobbled streets to find a pretty basement restaurant.', '2026-08-10', '2026-08-22', 1931, 'rome.jpg', NOW(), NOW()),
('Rhodes', 'It''s time to take a break and enjoy a cocktail by the sea on a Rhodes vacation. Incredible seaside views are there for the taking on a trip to Rhodes — Pefkos Beach (28 miles / 45 km away) is a well-known example. We recommend staying close by. If you want other options, a lot of travelers also book Rhodes vacation packages in the vicinity.', '2026-09-01', '2026-09-15', 462, 'rhodes.jpg', NOW(), NOW()),
('Lahaina', 'It''s time to take a break and relax by the ocean on a Lahaina vacation. Incredible seaside views are in plentiful supply on a trip to Lahaina — Kaanapali Beach (3 miles / 5 km away) is the perfect example. We recommend staying close by. If you want more options, loads of travelers also book Lahaina packages around Black Rock.', '2026-09-20', '2026-10-05', 1049, 'lahaina.jpg', NOW(), NOW()),
('Corfu', 'There''s nothing more relaxing than a Corfu vacation. Whether you''re treating yourself to a solo adventure or heading here as a couple, you''ll find all sorts of ways to unwind. With its postcard-perfect scenery, white sandy beaches and balmy Mediterranean weather, it''s not hard to see why so many people flock here.', '2026-10-10', '2026-10-24', 879, 'corfu.jpg', NOW(), NOW()),
('Hilo', 'There''s nothing like a Hilo vacation to put a spring in your step. The soothing sound of the ocean, the sight of lush rainforests and the smell of tropical flowers — it''s pure bliss. Hilo is a charming city on the Big Island of Hawaii, known for its friendly locals, eclectic shops and stunning natural scenery.', '2026-11-05', '2026-11-19', 734, 'hilo.webp', NOW(), NOW()),
('Montego Bay', 'Montego Bay vacation packages — you can fly into Sangster International Airport and be on the beach in minutes. The second-largest city in Jamaica, Montego Bay is famous for its white sandy beaches, crystal-clear waters and vibrant nightlife. Doctor''s Cave Beach is the most popular spot for swimming and sunbathing.', '2026-11-28', '2026-12-12', 1120, 'montego-bay.jpg', NOW(), NOW()),
('Puerto Rico Island', 'Puerto Rico is a vibrant Caribbean island with a rich culture, stunning beaches and colorful colonial architecture. Old San Juan''s cobblestone streets are lined with pastel buildings, lively bars and excellent restaurants. El Yunque, the only tropical rainforest in the US National Forest system, is a must-visit natural wonder.', '2026-12-20', '2027-01-03', 980, 'puerto-rico-island.jpg', NOW(), NOW()),
('Las Vegas', 'Las Vegas is a world-renowned entertainment capital offering non-stop excitement. From the glittering lights of the Strip to world-class shows, gourmet restaurants and thrilling casinos, there is something for every taste. Explore the Bellagio fountains, catch a spectacular show or take a day trip to the nearby Grand Canyon.', '2026-07-18', '2026-07-29', 650, 'las-vegas.jpg', NOW(), NOW()),
('Honolulu', 'Honolulu is the vibrant capital of Hawaii, offering the perfect blend of urban sophistication and natural beauty. Waikiki Beach is one of the most famous stretches of sand in the world. The city is also home to Diamond Head State Monument, Iolani Palace and the Pearl Harbor National Memorial.', '2026-07-12', '2026-07-31', 1450, 'honolulu.jpg', NOW(), NOW()),
('Kailua-Kona', 'Kailua-Kona on the Big Island of Hawaii is a paradise for outdoor enthusiasts and beach lovers alike. Known for its world-class snorkeling, manta ray dives and coffee farms, this laid-back town offers a slower pace than the rest of Hawaii. The Ironman World Championship triathlon is held here every year.', '2026-07-20', '2026-08-03', 1280, 'kailua-kona.jpg', NOW(), NOW()),
('Port Antonio', 'Port Antonio is one of Jamaica''s best-kept secrets — a lush, mountainous town on the northeastern coast that offers a tranquil escape from the busier resort areas. Frenchman''s Cove is widely considered one of the most beautiful beaches in the world. The Blue Lagoon nearby is a stunning natural pool fed by fresh spring water.', '2026-08-25', '2026-09-08', 860, 'port-antonio.jpg', NOW(), NOW()),
('Santorini', 'Santorini is one of the most breathtaking destinations in the world. Famous for its iconic whitewashed buildings, blue-domed churches and dramatic volcanic caldera views, this Greek island is the ultimate romantic getaway. Watch the legendary Oia sunset, explore ancient ruins at Akrotiri and enjoy fresh seafood by the sea.', '2026-09-12', '2026-09-26', 2150, 'santorini.jpg', NOW(), NOW()),
('Tel Aviv', 'Tel Aviv is Israel''s vibrant cultural and economic hub, known for its stunning Mediterranean beaches, thriving nightlife and world-class culinary scene. Wander through the historic streets of Jaffa, relax on the golden sands of Gordon Beach or explore the trendy boutiques and cafes of Rothschild Boulevard. This dynamic city blends a laid-back beach vibe with a buzzing urban energy.', '2026-10-01', '2026-10-15', 1100, 'tel-aviv.jpg', NOW(), NOW());

-- Passwords are bcrypt hashes (cost 10) of 'Admin1234' and 'User1234', precomputed
-- since MySQL init scripts can't run Node/bcrypt at build time.
INSERT INTO users (firstName, lastName, email, password, role, createdAt, updatedAt) VALUES
('Admin', 'System', 'admin@vacations.com', '$2a$10$fzgFfOwuqGRjixyy2kcnL.vHJ5ONeOSGZ/8CEcHVS1/9NI/u6Mal2', 'admin', NOW(), NOW()),
('Test', 'User', 'user@vacations.com', '$2a$10$rCioqVztU.IJjU./vCQcmuKE/yUkselnTCfWCXAMiX0OdwOAmGT3K', 'user', NOW(), NOW()),
('Alice', 'Johnson', 'alice@vacations.com', '$2a$10$rCioqVztU.IJjU./vCQcmuKE/yUkselnTCfWCXAMiX0OdwOAmGT3K', 'user', NOW(), NOW()),
('Bob', 'Smith', 'bob@vacations.com', '$2a$10$rCioqVztU.IJjU./vCQcmuKE/yUkselnTCfWCXAMiX0OdwOAmGT3K', 'user', NOW(), NOW()),
('Carla', 'Diaz', 'carla@vacations.com', '$2a$10$rCioqVztU.IJjU./vCQcmuKE/yUkselnTCfWCXAMiX0OdwOAmGT3K', 'user', NOW(), NOW()),
('David', 'Lee', 'david@vacations.com', '$2a$10$rCioqVztU.IJjU./vCQcmuKE/yUkselnTCfWCXAMiX0OdwOAmGT3K', 'user', NOW(), NOW());

-- Random likes from admin and the seeded users across the seeded vacations
-- (userId 1=Admin, 2=Test User, 3=Alice, 4=Bob, 5=Carla, 6=David;
-- vacationId 1..13 in insertion order above).
INSERT INTO likes (userId, vacationId, createdAt, updatedAt) VALUES
(1, 1, NOW(), NOW()),
(1, 5, NOW(), NOW()),
(1, 9, NOW(), NOW()),
(1, 13, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(2, 6, NOW(), NOW()),
(2, 10, NOW(), NOW()),
(3, 1, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(3, 7, NOW(), NOW()),
(3, 11, NOW(), NOW()),
(3, 13, NOW(), NOW()),
(4, 2, NOW(), NOW()),
(4, 4, NOW(), NOW()),
(4, 8, NOW(), NOW()),
(4, 12, NOW(), NOW()),
(5, 3, NOW(), NOW()),
(5, 5, NOW(), NOW()),
(5, 9, NOW(), NOW()),
(5, 13, NOW(), NOW()),
(6, 1, NOW(), NOW()),
(6, 6, NOW(), NOW()),
(6, 10, NOW(), NOW()),
(6, 12, NOW(), NOW());
