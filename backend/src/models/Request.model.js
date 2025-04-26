import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const Request = sequelize.define("Request",{
    id:{
        type:DataTypes.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },

    requestedBy:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id",

        },
        allowNull:false,
    },
    requestReceiver:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"User",
            key:"id"
        },
    },
    isAccept:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    }
},{timestamps:true,freezeTableName:true})

export {Request}