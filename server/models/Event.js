const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    name: { type: DataTypes.STRING, allowNull: false },
    organizer: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    availableSeats: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    }
});

module.exports = Event;
