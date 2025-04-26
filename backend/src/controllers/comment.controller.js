import { Comments } from '../models/Comment.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';


export const createComment = asyncHandler(async (req, res) => {
    const user = req.user;
    const { postId, description } = req.body;

    if (!postId || !description) {
        return res.status(400).json({ message: "Post ID and description are required" });
    }

    const comment = await Comments.create({
        postId,
        description,
        commentedBy: user.id
    });

    return res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req, res) => {
    const {postId} = req.query || req.params;

    const comments = await Comments.findAll({
        where: { postId }
    });

    return res.status(200).json(comments);
});


export const updateComment = asyncHandler(async (req, res) => {
    const user = req.user;
    const commentId = req.params.commentId;
    const { description } = req.body;

    const comment = await Comments.findOne({
        where: { id: commentId, commentedBy: user.id }
    });

    if (!comment) {
        return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    comment.description = description || comment.description;
    

    await comment.save({validate:false});
    return res.status(200).json(comment);
});


export const deleteComment = asyncHandler(async (req, res) => {
    const user = req.user;
    const commentId = req.params.commentId;

    const deleted = await Comments.destroy({
        where: { id: commentId, commentedBy: user.id }
    });

    if (!deleted) {
        return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
});
