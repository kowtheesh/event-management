const sequelize = require('./config/database');
const Event = require('./models/Event');

const events = [
    {
        name: 'Tech Conference 2026',
        organizer: 'Bellcorp Tech',
        location: 'San Francisco, CA',
        date: new Date('2026-05-15T09:00:00'),
        description: 'A deep dive into the latest in AI and Web3 technologies.',
        capacity: 500,
        availableSeats: 500,
        category: 'Technology',
        tags: ['AI', 'Web3', 'Blockchain']
    },
    {
        name: 'Music Festival Echo',
        organizer: 'Echo Events',
        location: 'Austin, TX',
        date: new Date('2026-06-20T14:00:00'),
        description: 'A weekend of live music, food trucks, and art installations.',
        capacity: 1000,
        availableSeats: 1000,
        category: 'Music',
        tags: ['Live Music', 'Festival', 'Art']
    },
    {
        name: 'Startup Pitch Night',
        organizer: 'Innovation Hub',
        location: 'New York, NY',
        date: new Date('2026-04-10T18:00:00'),
        description: 'Founders pitch their next big ideas to a panel of investors.',
        capacity: 100,
        availableSeats: 100,
        category: 'Business',
        tags: ['Startup', 'Pitch', 'Networking']
    },
    {
        name: 'Health & Wellness Expo',
        organizer: 'Green Life',
        location: 'Chicago, IL',
        date: new Date('2026-07-05T10:00:00'),
        description: 'Workshops, yoga sessions, and healthy cooking demonstrations.',
        capacity: 300,
        availableSeats: 300,
        category: 'Health',
        tags: ['Yoga', 'Wellness', 'Health']
    },
    {
        name: 'Web Dev Workshop',
        organizer: 'Code Masters',
        location: 'Seattle, WA',
        date: new Date('2026-03-22T13:00:00'),
        description: 'Hands-on workshop building a full-stack React application.',
        capacity: 50,
        availableSeats: 50,
        category: 'Workshop',
        tags: ['React', 'NodeJS', 'Fullstack']
    },
    {
        name: 'Retro Game Night',
        organizer: 'Classic Arcade',
        location: 'Portland, OR',
        date: new Date('2026-02-28T19:00:00'),
        description: 'Play your favorite classic games on original hardware.',
        capacity: 40,
        availableSeats: 40,
        category: 'Entertainment',
        tags: ['Gaming', 'Retro', 'Arcade']
    }
];

const seedDB = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced & cleared');

        await Event.bulkCreate(events);
        console.log('Sample events seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
