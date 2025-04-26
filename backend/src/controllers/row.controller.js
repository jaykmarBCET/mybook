import { Posts } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Friends } from "../models/Friends.model.js";
import { Op } from "sequelize";

export const getUserInfoByUserNameAndId = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }
    const { name, id } = req.body;

    if (!name && !id) {
        return res.status(400).json({ message: "Name or ID required" });
    }
    
    const userInfo = await User.findOne({
        where: {
            [Op.or]: [
                name ? { name: { [Op.like]: `%${name}%` } } : null,
                id ? { id } : null
            ].filter(Boolean)
        },
        attributes: ["name", "id", "avatar"]
    });

    if (!userInfo) {
        return res.status(200).json({ message: "Not available" });
    }

    return res.status(200).json(userInfo);
});

export const getPostByUserInfo = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }
    const { id } = req.body;

    const posts = await Posts.findAll({
        where: {
            postedBy: id
        }
    });

    if (!posts.length) {
        return res.status(200).json({ message: "Not available" });
    }

    return res.status(200).json(posts);
});

export const getFriendByUserInfo = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }
    const { id } = req.body;

    const friend = await Friends.findAll({
        where: {
            userId: id
        }
    });

    if (!friend.length) {
        return res.status(200).json({ message: "Not have friend yet" });
    }

    return res.status(200).json(friend);
});

export const searchUserInfoByUserData = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { name, id } = req.body;

    const userInfo = await User.findAll({
        where: {
            [Op.or]: [
                name ? { name: { [Op.like]: `%${name}%` } } : null,
                id ? { id } : null
            ].filter(Boolean)
        },
        attributes: ["name", "id", "avatar"]
    });

    if (!userInfo.length) {
        return res.status(200).json({ message: "Not available" });
    }

    return res.status(200).json(userInfo);
});

export const searchPostByUserInfo = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { id, name } = req.body;

    User.hasMany(Posts,{
        foreignKey:"postedBy"
    })
    Posts.belongsTo(User,{
        foreignKey:"postedBy"
    })
    const post = await Posts.findAll({
        include: [
            {
                model: User,
                attributes: ["name", "id"],
                where: name ? { name: { [Op.like]: `%${name}%` } } : undefined
            }
        ],
        where: id ? { postedBy: id } : undefined,
        attributes: ["title", "description", "images", "videos", "createdAt", "updatedAt"]
    });

    if (!post.length) {
        return res.status(200).json({ message: "Not available yet" });
    }

    return res.status(200).json(post);
});

export const searchFriendByUserInfo = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { id, name } = req.body;
     User.hasMany(Friends, {
        foreignKey: 'userId',
      });
      Friends.belongsTo(User, {
        foreignKey: 'userId',
      });
            

    const friendInfo = await Friends.findAll({
        include: [
            {
                model: User,
                attributes: ["name", "id"],
                where: name ? { name: { [Op.like]: `%${name}%` } } : undefined
            }
        ],
        where: id ? { userId: id } : undefined
    });

    if (!friendInfo.length) {
        return res.status(200).json({ message: "Not available yet" });
    }

    return res.status(200).json(friendInfo);
});

export const searchPostByTitle = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { title } = req.body;

    const posts = await Posts.findAll({
        where: {
            title: {
                [Op.like]: `%${title}%`
            }
        }
    });

    if (!posts.length) {
        return res.status(200).json({ message: "Not available yet" });
    }

    return res.status(200).json(posts);
});

export const getProfileByUserId = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    let profile = {};
    const { id } = req.body;

    const UserInfo = await User.findOne({
        where: {
            id: id
        },
        attributes: ["name", "id", "avatar", "coverImage"]
    });

    if (!UserInfo) {
        return res.status(404).json({ message: 'Not found' });
    }

    const posts = await Posts.findAll({
        where: {
            postedBy: UserInfo.id
        }
    });

    const friends = await Friends.findAll({
        where: {
            userId: UserInfo.id
        }
    });

    profile.name = UserInfo.name;
    profile.id = UserInfo.id;
    profile.avatar = UserInfo.avatar;
    profile.coverImage = UserInfo.coverImage;
    profile.posts = posts;
    profile.friends = friends;

    return res.status(200).json(profile);
});

