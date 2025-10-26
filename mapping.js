// mapping.js
export function mapVisionToMusic(visionData) {
  const { color, labels } = visionData;

  // Basic color logic
  const warm = color.red > color.blue && color.red > color.green;
  const bright = color.red + color.green + color.blue > 500;
  const dark = color.red + color.green + color.blue < 300;
  const saturated = Math.max(color.red, color.green, color.blue) - Math.min(color.red, color.green, color.blue) > 100;

  let energy = bright ? 0.7 : 0.4;
  let valence = warm ? 0.8 : 0.5;
  let acousticness = 0.5;
  let genreSeeds = ["pop", "indie"];

  // Enhanced genre mapping based on detected objects and colors
  if (labels.some(label => label.includes("beach") || label.includes("ocean") || label.includes("sea"))) {
    genreSeeds = ["chill", "ambient", "lofi", "tropical-house", "downtempo"];
    energy = 0.4;
    acousticness = 0.8;
  } else if (labels.some(label => label.includes("sunset") || label.includes("sunrise"))) {
    genreSeeds = ["dream-pop", "indie-pop", "chill", "ambient"];
    energy = 0.5;
    valence = 0.8;
    acousticness = 0.7;
  } else if (labels.some(label => label.includes("nightlife") || label.includes("city") || label.includes("urban"))) {
    genreSeeds = ["house", "techno", "electronic", "deep-house", "tech-house"];
    energy = 0.9;
    valence = 0.7;
    acousticness = 0.2;
  } else if (labels.some(label => label.includes("forest") || label.includes("mountain") || label.includes("nature"))) {
    genreSeeds = ["folk", "ambient", "acoustic", "indie-folk", "singer-songwriter"];
    energy = 0.3;
    acousticness = 0.9;
  } else if (labels.some(label => label.includes("car") || label.includes("road") || label.includes("highway"))) {
    genreSeeds = ["rock", "alternative", "indie-rock", "garage", "surf"];
    energy = 0.8;
    valence = 0.6;
  } else if (labels.some(label => label.includes("food") || label.includes("restaurant") || label.includes("kitchen"))) {
    genreSeeds = ["jazz", "bossa-nova", "lounge", "smooth-jazz", "latin"];
    energy = 0.5;
    valence = 0.7;
    acousticness = 0.6;
  } else if (labels.some(label => label.includes("party") || label.includes("celebration") || label.includes("festival"))) {
    genreSeeds = ["dance", "house", "disco", "funk", "pop"];
    energy = 0.9;
    valence = 0.9;
    acousticness = 0.2;
  } else if (labels.some(label => label.includes("rain") || label.includes("storm") || label.includes("cloud"))) {
    genreSeeds = ["ambient", "chill", "lofi", "downtempo", "trip-hop"];
    energy = 0.3;
    valence = 0.4;
    acousticness = 0.7;
  } else if (labels.some(label => label.includes("vintage") || label.includes("retro") || label.includes("old"))) {
    genreSeeds = ["blues", "soul", "motown", "rhythm-and-blues", "jazz"];
    energy = 0.6;
    valence = 0.7;
    acousticness = 0.8;
  } else if (labels.some(label => label.includes("art") || label.includes("painting") || label.includes("gallery"))) {
    genreSeeds = ["experimental", "ambient", "post-rock", "art-rock", "progressive"];
    energy = 0.5;
    valence = 0.6;
    acousticness = 0.6;
  }

  // Color-based adjustments
  if (dark) {
    genreSeeds = [...genreSeeds, "dark-ambient", "industrial", "goth"];
    energy = Math.max(0.2, energy - 0.2);
    valence = Math.max(0.2, valence - 0.2);
  }

  if (saturated && warm) {
    genreSeeds = [...genreSeeds, "latin", "reggaeton", "salsa"];
    energy = Math.min(1.0, energy + 0.2);
    valence = Math.min(1.0, valence + 0.1);
  }

  // Ensure we have at least 2 genres and limit to 4
  if (genreSeeds.length < 2) {
    genreSeeds = ["pop", "indie", ...genreSeeds];
  }
  genreSeeds = genreSeeds.slice(0, 4);

  return { energy, valence, acousticness, genreSeeds };
}
