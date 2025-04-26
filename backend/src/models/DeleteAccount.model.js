import { DataTypes } from "sequelize";
import sequelize from "../connections/pg.connection.js";

const DeletedUser = sequelize.define("DeletedUser", {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    references: {
      model: "User", 
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  dob: {
    type: DataTypes.DATE,
  },
  isVerifyToken: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  accessIp: {
    type: DataTypes.STRING,
    defaultValue: "0.0.0.0",
  },
  coverImage: {
    type: DataTypes.STRING,
    defaultValue: "default.png",
    validate: {
      isUrl: true,
    },
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: "default.png",
    validate: {
      isUrl: true,
    },
  },
  mobileNumber: {
    type: DataTypes.BIGINT,
    defaultValue: 1234567890,
  },
  avatarId: {
    type: DataTypes.STRING,
  },
  coverImageId: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: "Add your summary",
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isTokenExpireTime: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(Date.now() + 10 * 60 * 1000),
  },
}, {
  freezeTableName: true, 
  timestamps: false, 
});

export { DeletedUser };
