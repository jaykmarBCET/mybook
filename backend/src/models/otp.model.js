import { DataTypes } from "sequelize";
import sequelize from "../connections/pg.connection.js";


export const  OTP = sequelize.define("OTP",{
    userId:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:'id'
        },
        allowNull:false,
        unique:true,
        
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    expireTime:{
        type:DataTypes.DATE,
        default:DataTypes.NOW + 10*60*1000,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:true,
        }

    },
},{timestamps:true,freezeTableName:true})