import { DataTypes } from "sequelize";
import sequelize from "../connections/pg.connection.js";


const PostLikes = sequelize.define("Likes",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    postId:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"Posts",
            key:"id"
        }
    },
    likedBy:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{

            model:"User",
            key:"id",
        },
    },
},{timestamps:true,freezeTableName:true})

const PostDislikes = sequelize.define("Dislikes",{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    postId:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"Posts",
            key:"id"
        }
    },
    dislikedBy:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{

            model:"User",
            key:"id",
        },
    },
},{timestamps:true})

export {PostDislikes,PostLikes}



