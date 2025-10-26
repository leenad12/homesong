// server.js
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeImage } from "./vision_analysis.js";
import { mapVisionToMusicSmart } from "./smart_mapping.js";
import { getPlaylistRecommendations } from "./spotify_recommendations.js";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" }); // Folder to store temporary uploads

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Basic route - serve the HTML interface
app.get("/", (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Main route: Upload an image → Analyze → Generate playlist
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = path.resolve(req.file.path);

        // Get user options
        const playlistSize = parseInt(req.body.playlistSize) || 10;
        const explicitFilter = req.body.explicitFilter || 'clean';

    // Step 1: Analyze image with Hugging Face + ColorThief
    const visionData = await analyzeImage(imagePath);
    console.log("🖼️ Vision data:", visionData);

    // Step 2: Map vision features → music profile using smart embeddings
    const musicProfile = await mapVisionToMusicSmart(visionData);
    console.log("🎚️ Music profile:", musicProfile);

        // Step 3: Get playlist recommendations from Spotify
        const playlist = await getPlaylistRecommendations({
          ...musicProfile,
          playlistSize,
          explicitFilter,
          visionData
        });
    console.log("🎧 Playlist tracks:", playlist.length);

    // Step 4: Delete uploaded file after analysis
    fs.unlinkSync(imagePath);

    // Step 5: Send full result back to frontend
    res.json({
      visionData,
      musicProfile,
      playlist,
    });
  } catch (err) {
    console.error("❌ Error analyzing image:", err);
    res.status(500).json({ error: "Failed to analyze image", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
