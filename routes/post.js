import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Post from "../models/Post.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/create', upload.array("file", 5), async (req, res) => {
  try {
    const { userId, content } = req.body;
    const fileUrls = req.files.map(file => `uploads/${file.filename}`);
	
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
      post.fileUrls.forEach(fileUrl => {
	const filePath = path.join("public", fileUrl);
	fs.unlink(filePath, (err) => {
	  if (err && err.code !== 'ENOENT') {
	    console.error(`Failed to delete file: ${filePath}`, err);
	  }
	});
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting posts", error: error.message });
  } 
});

export default router;
