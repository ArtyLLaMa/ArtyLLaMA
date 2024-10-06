const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Message = require('./messageModel');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Session.hasMany(Message, { foreignKey: 'sessionId', onDelete: 'CASCADE' });
Message.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = Session;
