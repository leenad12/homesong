// smart_mapping.js
import { embeddingsService } from './embeddings_service.js';

/**
 * Enhanced mapping using embeddings and color psychology
 */
export async function mapVisionToMusicSmart(visionData) {
  const { color, labels } = visionData;

  // Initialize embeddings service
  await embeddingsService.initialize();

  // 1. Create contextual descriptions for better embedding matching
  const contextualDescriptions = createContextualDescriptions(labels, color);

  // 2. Get genre recommendations using embeddings (get more specific genres)
  const genreResults = await embeddingsService.findSimilarGenresFromLabels(contextualDescriptions, 6);
  let genreSeeds = genreResults.map(result => result.genre);

  // Only add minimal fallbacks if we have very few specific genres
  if (genreSeeds.length < 3) {
    const minimalFallbacks = ['indie', 'alternative'];
    const fallbackGenres = minimalFallbacks.filter(genre => !genreSeeds.includes(genre));
    genreSeeds = [...genreSeeds, ...fallbackGenres.slice(0, 1)]; // Add only 1 fallback genre
  }

  // 2. Analyze color psychology
  const colorProfile = analyzeColorPsychology(color);

  // 3. Analyze label mood
  const moodProfile = analyzeLabelMood(labels);

  // 4. Combine all signals
  const finalProfile = combineProfiles({
    genres: genreSeeds,
    color: colorProfile,
    mood: moodProfile
  });

  console.log('🧠 Smart mapping results:', {
    detectedGenres: genreResults.map(r => `${r.genre} (${(r.similarity * 100).toFixed(1)}%)`),
    colorProfile,
    moodProfile,
    finalProfile
  });

  return finalProfile;
}

/**
 * Create highly specific contextual descriptions from image labels and colors
 */
function createContextualDescriptions(labels, color) {
  const { red, green, blue } = color;

  // Convert RGB to descriptive terms
  const colorDescription = getColorDescription(red, green, blue);

  // Create highly specific contextual phrases
  const contextualPhrases = [];

  // Add original labels
  contextualPhrases.push(...labels);

  // Add color-based musical descriptions
  contextualPhrases.push(colorDescription);

  // Create very specific musical contexts for each label
  for (const label of labels) {
    const lowerLabel = label.toLowerCase();

    // Beach/Water scenes
    if (lowerLabel.includes('beach') || lowerLabel.includes('sandbar') || lowerLabel.includes('seashore')) {
      contextualPhrases.push('surf rock', 'beach pop', 'california sound', 'coastal rock', 'summer vibes', 'ocean waves');
    }
    if (lowerLabel.includes('ocean') || lowerLabel.includes('sea') || lowerLabel.includes('coast')) {
      contextualPhrases.push('ocean ambient', 'sea shanties', 'maritime folk', 'coastal indie', 'wave music');
    }

    // Nature/Outdoor scenes
    if (lowerLabel.includes('forest') || lowerLabel.includes('mountain') || lowerLabel.includes('valley')) {
      contextualPhrases.push('folk music', 'indie folk', 'acoustic', 'nature sounds', 'mountain music', 'outdoor ambient');
    }
    if (lowerLabel.includes('lakeside') || lowerLabel.includes('lakeshore')) {
      contextualPhrases.push('lake music', 'peaceful acoustic', 'water ambient', 'serene folk');
    }

    // Urban/City scenes
    if (lowerLabel.includes('city') || lowerLabel.includes('urban') || lowerLabel.includes('street')) {
      contextualPhrases.push('urban pop', 'city hip hop', 'metropolitan electronic', 'street music', 'urban indie');
    }
    if (lowerLabel.includes('building') || lowerLabel.includes('skyline')) {
      contextualPhrases.push('city ambient', 'urban electronic', 'metropolitan pop', 'architectural music');
    }

    // Performance/Entertainment scenes
    if (lowerLabel.includes('stage') || lowerLabel.includes('microphone') || lowerLabel.includes('concert')) {
      contextualPhrases.push('live music', 'concert rock', 'performance pop', 'stage energy', 'live performance');
    }
    if (lowerLabel.includes('party') || lowerLabel.includes('celebration') || lowerLabel.includes('festival')) {
      contextualPhrases.push('party music', 'celebration pop', 'festival electronic', 'dance music', 'party house');
    }
    if (lowerLabel.includes('bubble') || lowerLabel.includes('whistle')) {
      contextualPhrases.push('playful pop', 'bubblegum pop', 'fun music', 'cheerful electronic');
    }

    // Transportation scenes
    if (lowerLabel.includes('car') || lowerLabel.includes('road') || lowerLabel.includes('highway')) {
      contextualPhrases.push('road trip music', 'driving rock', 'highway pop', 'travel music', 'road songs');
    }
    if (lowerLabel.includes('unicycle') || lowerLabel.includes('bicycle')) {
      contextualPhrases.push('quirky indie', 'playful music', 'circus music', 'funky pop');
    }

    // Animal scenes
    if (lowerLabel.includes('sheep') || lowerLabel.includes('coyote') || lowerLabel.includes('wildlife')) {
      contextualPhrases.push('nature ambient', 'wildlife sounds', 'pastoral music', 'country folk', 'rural acoustic');
    }

    // Architectural scenes
    if (lowerLabel.includes('castle') || lowerLabel.includes('boathouse')) {
      contextualPhrases.push('medieval music', 'castle ambient', 'historical folk', 'architectural music', 'vintage sounds');
    }

    // Time-based scenes
    if (lowerLabel.includes('sunset') || lowerLabel.includes('sunrise') || lowerLabel.includes('dawn')) {
      contextualPhrases.push('golden hour music', 'sunset pop', 'dawn ambient', 'warm acoustic', 'peaceful music');
    }
    if (lowerLabel.includes('night') || lowerLabel.includes('dark') || lowerLabel.includes('moon')) {
      contextualPhrases.push('nocturnal music', 'night ambient', 'dark pop', 'moonlight music', 'evening vibes');
    }

    // Generic fallback only if no specific match
    if (!contextualPhrases.some(phrase => phrase.includes(label.toLowerCase()))) {
      contextualPhrases.push(`${label} music`, `${label} vibes`, `${label} atmosphere`);
    }
  }

  return contextualPhrases;
}

/**
 * Convert RGB values to descriptive color terms
 */
function getColorDescription(red, green, blue) {
  const brightness = (red + green + blue) / 3;
  const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);

  let colorDesc = '';

  // Brightness description
  if (brightness > 200) colorDesc += 'bright ';
  else if (brightness < 100) colorDesc += 'dark ';
  else colorDesc += 'medium ';

  // Saturation description
  if (saturation > 150) colorDesc += 'vibrant ';
  else if (saturation < 50) colorDesc += 'muted ';
  else colorDesc += 'balanced ';

  // Dominant color
  if (red > green && red > blue) {
    if (green > blue) colorDesc += 'warm orange';
    else colorDesc += 'red';
  } else if (green > red && green > blue) {
    colorDesc += 'green';
  } else if (blue > red && blue > green) {
    colorDesc += 'cool blue';
  } else {
    colorDesc += 'neutral';
  }

  return colorDesc;
}

/**
 * Analyze color psychology to determine music characteristics
 */
function analyzeColorPsychology(color) {
  const { red, green, blue } = color;

  // Convert RGB to HSV for better color analysis
  const hsv = rgbToHsv(red, green, blue);
  const { hue, saturation, value } = hsv;

  let energy = 0.5;
  let valence = 0.5;
  let acousticness = 0.5;

  // Brightness affects energy
  energy = value / 100; // 0-1 scale

  // Hue affects valence (warm colors = positive)
  if (hue >= 0 && hue < 60) { // Red to Yellow
    valence = 0.8;
  } else if (hue >= 60 && hue < 120) { // Yellow to Green
    valence = 0.9;
  } else if (hue >= 120 && hue < 180) { // Green to Cyan
    valence = 0.7;
  } else if (hue >= 180 && hue < 240) { // Cyan to Blue
    valence = 0.4;
  } else if (hue >= 240 && hue < 300) { // Blue to Magenta
    valence = 0.3;
  } else { // Magenta to Red
    valence = 0.6;
  }

  // Saturation affects acousticness (muted colors = more acoustic)
  acousticness = 1 - (saturation / 100);

  return { energy, valence, acousticness };
}

/**
 * Analyze mood from labels using highly specific keyword scoring
 */
function analyzeLabelMood(labels) {
  const moodCategories = {
    energetic: {
      keywords: ['party', 'dance', 'celebration', 'festival', 'nightlife', 'club', 'concert', 'performance', 'stage', 'microphone', 'bubble', 'whistle'],
      weight: 1.0
    },
    calm: {
      keywords: ['beach', 'ocean', 'sea', 'sunset', 'sunrise', 'forest', 'mountain', 'nature', 'peaceful', 'serene', 'lakeside', 'lakeshore', 'valley'],
      weight: 0.8
    },
    urban: {
      keywords: ['city', 'street', 'building', 'urban', 'metropolitan', 'downtown', 'skyline', 'car', 'road', 'highway'],
      weight: 0.9
    },
    vintage: {
      keywords: ['vintage', 'retro', 'old', 'classic', 'antique', 'nostalgic', 'traditional', 'castle', 'boathouse'],
      weight: 0.7
    },
    artistic: {
      keywords: ['art', 'painting', 'gallery', 'museum', 'creative', 'abstract', 'artistic', 'unicycle', 'quirky'],
      weight: 0.6
    },
    dark: {
      keywords: ['dark', 'night', 'shadow', 'black', 'gothic', 'mysterious', 'ominous'],
      weight: 0.5
    },
    playful: {
      keywords: ['bubble', 'whistle', 'unicycle', 'fun', 'playful', 'quirky', 'circus'],
      weight: 0.9
    },
    nature: {
      keywords: ['sheep', 'coyote', 'wildlife', 'forest', 'mountain', 'valley', 'nature', 'outdoor', 'wilderness'],
      weight: 0.8
    },
    performance: {
      keywords: ['stage', 'microphone', 'concert', 'performance', 'live', 'show', 'entertainment'],
      weight: 1.0
    }
  };

  const moodScores = {};

  // Calculate scores for each mood category
  for (const [mood, config] of Object.entries(moodCategories)) {
    let score = 0;
    let matches = 0;

    for (const label of labels) {
      for (const keyword of config.keywords) {
        if (label.toLowerCase().includes(keyword)) {
          score += config.weight;
          matches++;
        }
      }
    }

    moodScores[mood] = {
      score: score,
      matches: matches,
      normalizedScore: matches > 0 ? score / matches : 0
    };
  }

  // Find dominant mood
  const dominantMood = Object.entries(moodScores)
    .sort((a, b) => b[1].normalizedScore - a[1].normalizedScore)[0];

  return {
    dominantMood: dominantMood[0],
    moodScores,
    confidence: dominantMood[1].normalizedScore
  };
}

/**
 * Combine all profiles into final music characteristics
 */
function combineProfiles({ genres, color, mood }) {
  let energy = color.energy;
  let valence = color.valence;
  let acousticness = color.acousticness;

  // Adjust based on dominant mood with more specific adjustments
  const moodAdjustments = {
    energetic: { energy: 0.4, valence: 0.3, acousticness: -0.4 },
    calm: { energy: -0.3, valence: 0.2, acousticness: 0.3 },
    urban: { energy: 0.3, valence: 0.1, acousticness: -0.3 },
    vintage: { energy: -0.2, valence: 0.2, acousticness: 0.4 },
    artistic: { energy: 0.1, valence: 0.1, acousticness: 0.2 },
    dark: { energy: -0.2, valence: -0.4, acousticness: 0.2 },
    playful: { energy: 0.5, valence: 0.4, acousticness: -0.2 },
    nature: { energy: -0.1, valence: 0.3, acousticness: 0.5 },
    performance: { energy: 0.6, valence: 0.4, acousticness: -0.3 }
  };

  if (mood.dominantMood && moodAdjustments[mood.dominantMood]) {
    const adjustment = moodAdjustments[mood.dominantMood];
    energy = Math.max(0, Math.min(1, energy + adjustment.energy));
    valence = Math.max(0, Math.min(1, valence + adjustment.valence));
    acousticness = Math.max(0, Math.min(1, acousticness + adjustment.acousticness));
  }

  return {
    energy: Math.round(energy * 100) / 100,
    valence: Math.round(valence * 100) / 100,
    acousticness: Math.round(acousticness * 100) / 100,
    genreSeeds: genres.slice(0, 4) // Take top 4 genres
  };
}

/**
 * Convert RGB to HSV color space
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let hue = 0;
  if (diff !== 0) {
    if (max === r) {
      hue = ((g - b) / diff) % 6;
    } else if (max === g) {
      hue = (b - r) / diff + 2;
    } else {
      hue = (r - g) / diff + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const saturation = max === 0 ? 0 : (diff / max) * 100;
  const value = max * 100;

  return { hue, saturation, value };
}
