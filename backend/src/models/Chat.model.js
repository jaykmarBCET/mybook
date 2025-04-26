import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const Chat = sequelize.define("Chats",{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    file:{
        type:DataTypes.STRING,
    },
    fileId:DataTypes.STRING,
    description:{
        type:DataTypes.STRING,
    },
    chatSender:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"User",
            key:"id"
        }
    },
    chatReceiver:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"User",
            key:'id'
        }
    },


},{timestamps:true,freezeTableName:true})

export {Chat}