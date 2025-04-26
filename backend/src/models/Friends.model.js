import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const Friends = sequelize.define("Friends",{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    friendBy:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id"
        },
        allowNull:false,
    },
    userId:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id"
        },
        allowNull:false,
    },

},{timestamps:true,freezeTableName:true})

export {Friends}