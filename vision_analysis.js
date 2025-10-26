// vision_analysis.js
import axios from "axios";
import fs from "fs";
import ColorThief from "colorthief";

export async function analyzeImage(imagePath) {
  try {
    // Read the image as binary
    const imageData = fs.readFileSync(imagePath);

    // Correct Hugging Face endpoint
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      imageData,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    // Extract labels
    const labels = hfResponse.data?.map((l) => l.label.toLowerCase()) || [];

    // Extract dominant color using ColorThief
    const [r, g, b] = await ColorThief.getColor(imagePath);

    return { labels, color: { red: r, green: g, blue: b } };
  } catch (err) {
    console.error("❌ Error in analyzeImage:", err.response?.data || err.message);
    throw new Error("Vision analysis failed");
  }
}
