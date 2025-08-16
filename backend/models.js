import { DataTypes } from 'sequelize';
import { sequelize } from './config/db.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true }
});

export const Auction = sequelize.define('Auction', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  startingPrice: DataTypes.INTEGER,
  bidIncrement: DataTypes.INTEGER,
  goLiveAt: DataTypes.DATE,
  durationSec: DataTypes.INTEGER,
  status: { type: DataTypes.ENUM('scheduled','live','ended','closed'), defaultValue: 'scheduled' },
  sellerId: { type: DataTypes.UUID, allowNull: false }
});

export const Bid = sequelize.define('Bid', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  amount: DataTypes.INTEGER,
  auctionId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false }
});

export const CounterOffer = sequelize.define('CounterOffer', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  auctionId: { type: DataTypes.UUID, allowNull: false },
  sellerId: { type: DataTypes.UUID, allowNull: false },
  buyerId: { type: DataTypes.UUID, allowNull: false },
  amount: DataTypes.INTEGER,
  status: { type: DataTypes.ENUM('pending','accepted','rejected'), defaultValue:'pending' }
});

Auction.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
Bid.belongsTo(User, { as: 'bidder', foreignKey: 'userId' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId' });
CounterOffer.belongsTo(Auction, { foreignKey: 'auctionId' });