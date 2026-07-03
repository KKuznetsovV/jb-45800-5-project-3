import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGO_URI = process.env.VACATIONS_MONGO_URI || 'mongodb://localhost:27017/vacations'

const vacations = [
    {
        destination: 'Rome',
        description: 'You can create a dream vacation of famous artistic wonders and historic hidden gems punctuated by top-notch dining in fabulous restaurants with a Rome vacation package. Fill your days with tours of the Roman Forum, the Pantheon, the Colosseum, all the show-off Rome sights, then meander down cobbled streets to find a pretty basement restaurant.',
        startDate: new Date('2027-08-10'),
        endDate: new Date('2027-08-22'),
        price: 1931,
        imageName: 'rome.jpg'
    },
    {
        destination: 'Rhodes',
        description: "It's time to take a break and enjoy a cocktail by the sea on a Rhodes vacation. Incredible seaside views are there for the taking on a trip to Rhodes — Pefkos Beach (28 miles / 45 km away) is a well-known example. We recommend staying close by. If you want other options, a lot of travelers also book Rhodes vacation packages in the vicinity.",
        startDate: new Date('2027-09-01'),
        endDate: new Date('2027-09-15'),
        price: 462,
        imageName: 'rhodes.jpg'
    },
    {
        destination: 'Lahaina',
        description: "It's time to take a break and relax by the ocean on a Lahaina vacation. Incredible seaside views are in plentiful supply on a trip to Lahaina — Kaanapali Beach (3 miles / 5 km away) is the perfect example. We recommend staying close by. If you want more options, loads of travelers also book Lahaina packages around Black Rock.",
        startDate: new Date('2027-09-20'),
        endDate: new Date('2027-10-05'),
        price: 1049,
        imageName: 'lahaina.jpg'
    },
    {
        destination: 'Corfu',
        description: "There's nothing more relaxing than a Corfu vacation. Whether you're treating yourself to a solo adventure or heading here as a couple, you'll find all sorts of ways to unwind. With its postcard-perfect scenery, white sandy beaches and balmy Mediterranean weather, it's not hard to see why so many people flock here.",
        startDate: new Date('2027-10-10'),
        endDate: new Date('2027-10-24'),
        price: 879,
        imageName: 'corfu.jpg'
    },
    {
        destination: 'Hilo',
        description: "There's nothing like a Hilo vacation to put a spring in your step. The soothing sound of the ocean, the sight of lush rainforests and the smell of tropical flowers — it's pure bliss. Hilo is a charming city on the Big Island of Hawaii, known for its friendly locals, eclectic shops and stunning natural scenery.",
        startDate: new Date('2027-11-05'),
        endDate: new Date('2027-11-19'),
        price: 734,
        imageName: 'hilo.jpg'
    },
    {
        destination: 'Montego Bay',
        description: "Montego Bay vacation packages — you can fly into Sangster International Airport and be on the beach in minutes. The second-largest city in Jamaica, Montego Bay is famous for its white sandy beaches, crystal-clear waters and vibrant nightlife. Doctor's Cave Beach is the most popular spot for swimming and sunbathing.",
        startDate: new Date('2027-11-28'),
        endDate: new Date('2027-12-12'),
        price: 1120,
        imageName: 'montego-bay.jpg'
    },
    {
        destination: 'Puerto Rico Island',
        description: "Puerto Rico is a vibrant Caribbean island with a rich culture, stunning beaches and colorful colonial architecture. Old San Juan's cobblestone streets are lined with pastel buildings, lively bars and excellent restaurants. El Yunque, the only tropical rainforest in the US National Forest system, is a must-visit natural wonder.",
        startDate: new Date('2027-12-20'),
        endDate: new Date('2028-01-03'),
        price: 980,
        imageName: 'puerto-rico.jpg'
    },
    {
        destination: 'Las Vegas',
        description: "Las Vegas is a world-renowned entertainment capital offering non-stop excitement. From the glittering lights of the Strip to world-class shows, gourmet restaurants and thrilling casinos, there is something for every taste. Explore the Bellagio fountains, catch a spectacular show or take a day trip to the nearby Grand Canyon.",
        startDate: new Date('2028-01-15'),
        endDate: new Date('2028-01-23'),
        price: 650,
        imageName: 'las-vegas.jpg'
    },
    {
        destination: 'Honolulu',
        description: "Honolulu is the vibrant capital of Hawaii, offering the perfect blend of urban sophistication and natural beauty. Waikiki Beach is one of the most famous stretches of sand in the world. The city is also home to Diamond Head State Monument, Iolani Palace and the Pearl Harbor National Memorial.",
        startDate: new Date('2028-02-10'),
        endDate: new Date('2028-02-24'),
        price: 1450,
        imageName: 'honolulu.jpg'
    },
    {
        destination: 'Kailua-Kona',
        description: "Kailua-Kona on the Big Island of Hawaii is a paradise for outdoor enthusiasts and beach lovers alike. Known for its world-class snorkeling, manta ray dives and coffee farms, this laid-back town offers a slower pace than the rest of Hawaii. The Ironman World Championship triathlon is held here every year.",
        startDate: new Date('2028-03-05'),
        endDate: new Date('2028-03-19'),
        price: 1280,
        imageName: 'kailua-kona.jpg'
    },
    {
        destination: 'Port Antonio',
        description: "Port Antonio is one of Jamaica's best-kept secrets — a lush, mountainous town on the northeastern coast that offers a tranquil escape from the busier resort areas. Frenchman's Cove is widely considered one of the most beautiful beaches in the world. The Blue Lagoon nearby is a stunning natural pool fed by fresh spring water.",
        startDate: new Date('2028-04-02'),
        endDate: new Date('2028-04-16'),
        price: 860,
        imageName: 'port-antonio.jpg'
    },
    {
        destination: 'Santorini',
        description: "Santorini is one of the most breathtaking destinations in the world. Famous for its iconic whitewashed buildings, blue-domed churches and dramatic volcanic caldera views, this Greek island is the ultimate romantic getaway. Watch the legendary Oia sunset, explore ancient ruins at Akrotiri and enjoy fresh seafood by the sea.",
        startDate: new Date('2028-05-10'),
        endDate: new Date('2028-05-24'),
        price: 2150,
        imageName: 'santorini.jpg'
    }
]

async function seed() {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB, starting seed...')

    const db = mongoose.connection.db!

    const count = await db.collection('vacations').countDocuments()
    if (count > 0) {
        console.log('Database already seeded, skipping...')
        await mongoose.disconnect()
        return
    }

    await db.collection('vacations').insertMany(vacations)
    console.log(`Inserted ${vacations.length} vacations`)

    const adminPassword = await bcrypt.hash('Admin1234', 10)
    const userPassword  = await bcrypt.hash('User1234', 10)

    await db.collection('users').insertMany([
        {
            firstName: 'Admin',
            lastName: 'System',
            email: 'admin@vacations.com',
            password: adminPassword,
            role: 'admin'
        },
        {
            firstName: 'Test',
            lastName: 'User',
            email: 'user@vacations.com',
            password: userPassword,
            role: 'user'
        }
    ])

    console.log('Created admin (admin@vacations.com / Admin1234) and test user (user@vacations.com / User1234)')
    console.log('Seed completed successfully')

    await mongoose.disconnect()
}

seed().catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
})
