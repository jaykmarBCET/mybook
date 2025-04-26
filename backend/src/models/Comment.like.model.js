import { DataTypes } from 'sequelize'
import sequelize from '../connections/pg.connection.js'


const CommentsLike = sequelize.define("CommentsLike",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
        allowNull:true
    },
    commentId:{
        type:DataTypes.BIGINT,
        references:{
            model:"Comments",
            key:"id"
        },
        allowNull:false
    },
    likeBy:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id"
        },
        allowNull:false,
    },
},{timestamps:true,freezeTableName:true})
const CommentsDislike = sequelize.define("CommentsDislike",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
        allowNull:true
    },
    commentId:{
        type:DataTypes.BIGINT,
        references:{
            model:"Comments",
            key:"id"
        },
        allowNull:false
    },
    dislikeBy:{
        type:DataTypes.BIGINT,
        references:{
            model:"User",
            key:"id"
        },
        allowNull:false,
    },
},{timestamps:true,freezeTableName:true})

export {CommentsDislike,CommentsLike}