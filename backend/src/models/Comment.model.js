import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const Comments = sequelize.define("Comments",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    description:{
        type:DataTypes.TEXT,
    },
    postId:{
        type:DataTypes.BIGINT,
        references:{
            model:"Posts",
            key:"id",
        },
        allowNull:false,
    },
    commentedBy:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id"
        },
        allowNull:false
    },

},{timestamps:true,freezeTableName:true})

export {Comments}