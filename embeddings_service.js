// embeddings_service.js
import { pipeline } from '@xenova/transformers';

class EmbeddingsService {
  constructor() {
    this.model = null;
    this.genreEmbeddings = null;
    this.genreLabels = null;
  }

  async initialize() {
    if (this.model) return; // Already initialized

    console.log('🔄 Loading music-optimized embeddings model...');
    // Using a more powerful model for better music understanding
    this.model = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');

    // Pre-compute embeddings for all music genres
    await this.precomputeGenreEmbeddings();
    console.log('✅ Music embeddings service initialized');
  }

  async precomputeGenreEmbeddings() {
    // Enhanced genre list with descriptive context for better embeddings
    const genres = [
      // Beach/Coastal vibes
      "beach music", "coastal vibes", "ocean sounds", "seaside music", "tropical house", "island music",
      "surf rock", "beach pop", "coastal folk", "ocean ambient", "seaside acoustic",

      // Nature/Outdoor
      "nature sounds", "forest music", "mountain ambient", "outdoor acoustic", "wilderness folk",
      "campfire songs", "hiking music", "nature meditation", "outdoor chill",

      // Urban/City
      "city pop", "urban electronic", "metropolitan house", "street music", "city nightlife",
      "urban hip-hop", "city jazz", "metropolitan ambient", "street art music",

      // Relaxing/Chill
      "chill music", "relaxing ambient", "calm acoustic", "peaceful music", "meditation sounds",
      "zen music", "spa music", "chillout", "downtempo", "lounge music",

      // Energetic/Dance
      "dance music", "energetic pop", "party music", "club music", "festival music",
      "dance electronic", "party house", "energetic rock", "celebration music",

      // Emotional/Mood
      "sad music", "melancholic", "happy music", "uplifting", "romantic music",
      "nostalgic", "dreamy music", "emotional", "moody", "atmospheric",

      // Time-based
      "morning music", "sunrise songs", "sunset music", "night music", "midnight vibes",
      "dawn music", "dusk songs", "late night", "early morning",

      // Weather/Seasonal
      "rainy day music", "sunny music", "storm music", "winter music", "summer vibes",
      "spring music", "autumn songs", "snow music", "wind sounds",

      // Traditional genres with context
      "acoustic guitar", "electric guitar", "piano music", "violin music", "orchestral",
      "jazz piano", "blues guitar", "rock guitar", "electronic synthesizer",
      "classical orchestra", "folk guitar", "country guitar", "funk bass",
      "reggae rhythm", "latin percussion", "gospel choir", "soul vocals",

      // Specific moods and atmospheres
      "mysterious music", "dark ambient", "bright pop", "warm music", "cool jazz",
      "hot dance", "cold ambient", "soft music", "loud rock", "quiet acoustic",
      "fast electronic", "slow ballad", "medium tempo", "upbeat", "downbeat",

      // Cultural/Regional
      "latin music", "african rhythms", "european classical", "american folk",
      "asian music", "caribbean", "mediterranean", "scandinavian", "celtic",

      // Activity-based
      "workout music", "study music", "driving music", "cooking music", "reading music",
      "sleep music", "focus music", "concentration", "background music",

      // Original genre names for compatibility
      "acoustic", "pop", "rock", "jazz", "classical", "dance", "hip-hop", "metal",
      "blues", "reggae", "country", "funk", "soul", "edm", "indie", "alternative",
      "electronic", "folk", "gospel", "latin", "new-age", "r-n-b", "rap", "reggaeton",
      "salsa", "samba", "tango", "techno", "trance", "trip-hop", "world-music",
      "ambient", "chill", "lofi", "house", "disco", "punk", "grunge", "emo",
      "hardcore", "progressive", "psychedelic", "garage", "surf", "shoegaze",
      "post-rock", "math-rock", "indie-pop", "indie-rock", "dream-pop", "synth-pop",
      "new-wave", "post-punk", "goth", "industrial", "experimental", "dubstep",
      "drum-and-bass", "jungle", "breakbeat", "bossa-nova", "flamenco", "celtic",
      "bluegrass", "rhythm-and-blues", "motown", "deep-house", "tech-house",
      "progressive-house", "electro-house", "tropical-house", "melodic-house"
    ];

    console.log('🔄 Computing genre embeddings...');
    this.genreLabels = genres;
    this.genreEmbeddings = await this.model(genres);
    console.log(`✅ Computed embeddings for ${genres.length} genres`);
  }

  async getEmbedding(text) {
    if (!this.model) {
      await this.initialize();
    }
    return await this.model(text);
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Find most similar genres to given text
  async findSimilarGenres(text, topK = 5) {
    if (!this.genreEmbeddings) {
      await this.initialize();
    }

    const textEmbedding = await this.getEmbedding(text);
    const similarities = [];

    for (let i = 0; i < this.genreLabels.length; i++) {
      const similarity = this.cosineSimilarity(textEmbedding.data, this.genreEmbeddings[i].data);
      similarities.push({
        genre: this.genreLabels[i],
        similarity: similarity
      });
    }

    // Sort by similarity and return top K
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  // Enhanced method that combines multiple text inputs
  async findSimilarGenresFromLabels(labels, topK = 5) {
    if (!this.genreEmbeddings) {
      await this.initialize();
    }

    // Combine all labels into a single text for better context
    const combinedText = labels.join(' ');

    // Also try individual labels to catch specific concepts
    const individualResults = [];
    for (const label of labels.slice(0, 3)) { // Limit to top 3 labels
      const results = await this.findSimilarGenres(label, 3);
      individualResults.push(...results);
    }

    // Get combined results
    const combinedResults = await this.findSimilarGenres(combinedText, topK * 2);

    // Merge and deduplicate results
    const allResults = [...individualResults, ...combinedResults];
    const genreMap = new Map();

    allResults.forEach(result => {
      if (!genreMap.has(result.genre) || genreMap.get(result.genre).similarity < result.similarity) {
        genreMap.set(result.genre, result);
      }
    });

    // Return top K results
    return Array.from(genreMap.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

// Export singleton instance
export const embeddingsService = new EmbeddingsService();
