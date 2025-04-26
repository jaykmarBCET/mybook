import { DataTypes } from 'sequelize';
import sequelize from '../connections/pg.connection.js';

const Posts = sequelize.define("Posts", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 50],
    },
  },
  postedBy: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT), 
    allowNull: true,
  },
  videos: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  freezeTableName: true, 
});

sequelize.sync()
  .then(() => {
    console.log("Posts table created successfully ✅");
  })
  .catch((error) => {
    console.error("❌ Failed to create Posts table:", error);
  });

export { Posts };
