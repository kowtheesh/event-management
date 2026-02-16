const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
    const { search, category, location } = req.query;
    let where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category && category !== 'All') where.category = category;
    if (location) where.location = { [Op.like]: `%${location}%` };

    try {
        const events = await Event.findAll({ where, order: [['date', 'ASC']] });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'Event is fully booked' });

        // Using explicit camelCase foreign keys
        const existingReg = await Registration.findOne({ where: { userId: req.user.id, eventId: event.id } });
        if (existingReg) return res.status(400).json({ message: 'Already registered' });

        const registration = await Registration.create({ userId: req.user.id, eventId: event.id });
        event.availableSeats -= 1;
        await event.save();
        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id/cancel', protect, async (req, res) => {
    try {
        const registration = await Registration.findOne({ where: { userId: req.user.id, eventId: req.params.id } });
        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        await registration.destroy();
        const event = await Event.findByPk(req.params.id);
        if (event) {
            event.availableSeats += 1;
            await event.save();
        }
        res.json({ message: 'Registration cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/me', protect, async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { userId: req.user.id },
            include: [Event]
        });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
