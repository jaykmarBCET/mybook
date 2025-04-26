import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const Blocked = sequelize.define("BLocke",{
    id:{
        type:DataTypes.BIGINT,
        allowNull:false,

        primaryKey:true,
        autoIncrement:true,
    },
    blockedBy:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"Users",
            key:"id"
        }
    },
    blocked:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"Users",
            key:"id"
        }
    },
    isBLocked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
},{timestamps:true})

export {Blocked}