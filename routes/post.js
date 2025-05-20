import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Post from "../models/Post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "postbook_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

router.post('/create', upload.array("file", 5), async (req, res) => {
  try {
    const { userId, content } = req.body;
    const fileUrls = req.files.map(file => file.path);
	
    const newPost = new Post({ user: new mongoose.Types.ObjectId(userId), content, fileUrls });
    await newPost.save();

    res.status(200).json({ message: "Post created", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const posts = await Post.find({ user: userId}).sort({ createdAt: -1 }).populate('user', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;

    const updateData = { content };

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Post updated", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (Array.isArray(post.fileUrls)) {
      for (const url of post.fileUrls) {
	const parts = url.split("/");
	const fileName = parts[parts.length - 1];

	const publicId = `postbook_uploads/${fileName.split(".")[0]}`;

	await cloudinary.uploader.destroy(publicId);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting posts", error: error.message });
  } 
});

export default router;
