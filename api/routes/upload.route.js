import express from "express";
import {
  uploadImage,
  uploadMiddleware,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadImage);

export default router;
