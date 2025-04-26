import {  DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'




const Status = sequelize.define("Status",{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true
    },
    image:{
        type:DataTypes.STRING,
    },
    video:{
        type:DataTypes.STRING,
    },
    description:{
        type:DataTypes.TEXT,
    },
    userId:{
        type:DataTypes.BIGINT,
        references:{
            model:"Users",
            key:"id",
        },
        allowNull:false,
    },
    isPublic:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    }

},{timestamps:true})

const StatusPrivacy = sequelize.define("StatusPrivacy",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    userId:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"Users",
            key:"id"
        }
    },
    statusId:{
        type:DataTypes.BIGINT,
        references:{
            model:"Status",
            key:"id"
        },
        allowNull:false
    },
    blockedFriends:{
        type:DataTypes.ARRAY({
            type:DataTypes.BIGINT,
            allowNull:false,
            references:{
                model:"Users",
                key:"id"
            }
        })
    }
},{timestamps:true})

export {Status,StatusPrivacy}