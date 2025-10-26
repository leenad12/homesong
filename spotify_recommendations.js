import axios from "axios";
import { getSpotifyAccessToken } from "./spotify_auth.js";

/**
 * Search for existing playlists that match the detected image tags
 */
async function searchPlaylistsByTags(token, labels) {
  try {
    const allTracks = [];

    // Search for playlists using detected labels
    for (const label of labels.slice(0, 3)) {
      const searchQuery = `playlist:${label}`;
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=playlist&limit=5&market=US`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Get tracks from each playlist
      for (const playlist of response.data.playlists.items) {
        try {
          const tracksResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const tracks = tracksResponse.data.items
            .filter(item => item.track && item.track.preview_url)
            .map(item => item.track);

          allTracks.push(...tracks);
        } catch (err) {
          console.log(`Could not access playlist ${playlist.name}:`, err.message);
        }
      }
    }

    return allTracks;
  } catch (err) {
    console.log("Playlist search failed:", err.message);
    return [];
  }
}

/**
 * Get mood keywords based on genre for more personalized searches
 */
function getMoodKeywords(genre) {
  const moodMap = {
    'surf rock': 'summer beach',
    'beach pop': 'summer coastal',
    'beach music': 'summer ocean',
    'california sound': 'summer west coast',
    'coastal rock': 'ocean waves',
    'ocean ambient': 'peaceful water',
    'sea shanties': 'maritime folk',
    'maritime folk': 'ocean sailing',
    'coastal indie': 'beach acoustic',
    'wave music': 'ocean surf',
    'folk music': 'acoustic nature',
    'indie folk': 'acoustic indie',
    'nature sounds': 'outdoor ambient',
    'mountain music': 'outdoor folk',
    'outdoor ambient': 'nature peaceful',
    'lake music': 'peaceful water',
    'peaceful acoustic': 'calm serene',
    'water ambient': 'peaceful ocean',
    'serene folk': 'calm acoustic',
    'urban pop': 'city metropolitan',
    'city hip hop': 'urban street',
    'metropolitan electronic': 'city nightlife',
    'street music': 'urban underground',
    'urban indie': 'city alternative',
    'city ambient': 'urban atmospheric',
    'urban electronic': 'city electronic',
    'metropolitan pop': 'city mainstream',
    'architectural music': 'urban ambient',
    'live music': 'concert performance',
    'concert rock': 'live energy',
    'performance pop': 'stage show',
    'stage energy': 'live performance',
    'live performance': 'concert stage',
    'party music': 'celebration dance',
    'celebration pop': 'party fun',
    'festival electronic': 'party dance',
    'dance music': 'party electronic',
    'party house': 'dance electronic',
    'playful pop': 'fun cheerful',
    'bubblegum pop': 'fun playful',
    'fun music': 'playful cheerful',
    'cheerful electronic': 'happy dance',
    'road trip music': 'driving travel',
    'driving rock': 'highway road',
    'highway pop': 'road trip',
    'travel music': 'journey adventure',
    'road songs': 'driving highway',
    'quirky indie': 'playful alternative',
    'playful music': 'fun quirky',
    'circus music': 'playful fun',
    'funky pop': 'quirky dance',
    'nature ambient': 'outdoor peaceful',
    'wildlife sounds': 'nature outdoor',
    'pastoral music': 'rural peaceful',
    'country folk': 'rural acoustic',
    'rural acoustic': 'country folk',
    'medieval music': 'historical traditional',
    'castle ambient': 'medieval atmospheric',
    'historical folk': 'traditional medieval',
    'architectural music': 'historical ambient',
    'vintage sounds': 'retro traditional',
    'golden hour music': 'sunset warm',
    'sunset pop': 'evening warm',
    'dawn ambient': 'morning peaceful',
    'warm acoustic': 'sunset golden',
    'peaceful music': 'calm serene',
    'nocturnal music': 'night dark',
    'night ambient': 'nocturnal atmospheric',
    'dark pop': 'night mysterious',
    'moonlight music': 'night romantic',
    'evening vibes': 'sunset night'
  };

  return moodMap[genre] || '';
}

// Only allow valid Spotify genre seeds
const validGenres = [
  "acoustic", "pop", "rock", "jazz", "classical",
  "dance", "hip-hop", "metal", "blues", "reggae", "country", "funk", "soul", "edm", "indie",
  "alternative", "electronic", "folk", "gospel", "latin", "new-age", "r-n-b", "rap",
  "reggaeton", "salsa", "samba", "tango", "techno", "trance", "trip-hop", "world-music",
  "ambient", "chill", "lofi", "house", "disco", "punk", "grunge", "emo", "screamo",
  "hardcore", "death-metal", "black-metal", "progressive", "psychedelic", "garage",
  "surf", "shoegaze", "post-rock", "math-rock", "indie-pop", "indie-rock", "dream-pop",
  "synth-pop", "new-wave", "post-punk", "goth", "industrial", "noise", "experimental",
  "avant-garde", "minimal", "maximal", "glitch", "dubstep", "drum-and-bass", "jungle",
  "breakbeat", "big-beat", "trip-hop", "downtempo", "chillout", "lounge", "smooth-jazz",
  "bossa-nova", "samba", "tango", "flamenco", "celtic", "irish", "scottish", "bluegrass",
  "honky-tonk", "western", "outlaw-country", "alt-country", "country-rock", "southern-rock",
  "swamp-rock", "delta-blues", "chicago-blues", "texas-blues", "rhythm-and-blues",
  "motown", "philly-soul", "memphis-soul", "northern-soul", "deep-house", "tech-house",
  "progressive-house", "electro-house", "future-house", "bass-house", "tropical-house",
  "melodic-house", "afro-house", "g-house", "jackin-house", "vocal-house", "french-house",
  "italo-disco", "euro-disco", "space-disco", "cosmic-disco", "nu-disco", "disco-house",
  "boogie", "funk-disco", "philly-disco", "new-york-disco", "miami-disco", "chicago-disco"
];

/**
 * Generate a playlist recommendation based on mood data.
 * Since Spotify has restricted the recommendations endpoint, we'll use search instead.
 * @param {object} moodData - e.g. { energy: 0.5, valence: 0.8, acousticness: 0.4, genreSeeds: ['chill', 'acoustic'], playlistSize: 10, explicitFilter: 'clean', searchPlaylists: true }
 */
export async function getPlaylistRecommendations(moodData) {
  const token = await getSpotifyAccessToken();

  const { energy, valence, acousticness, genreSeeds, playlistSize = 10, explicitFilter = 'clean', visionData } = moodData;

  // Filter invalid genres
  const seeds = genreSeeds.filter(g => validGenres.includes(g.toLowerCase()));
  if (!seeds.length) seeds.push("pop"); // fallback

  try {
    let allTracks = [];

    // Note: Removed playlist search functionality as it was causing issues

    // Search for tracks by genre with highly personalized strategies
    for (const genre of seeds.slice(0, 4)) { // Search specific genres
      // Strategy 1: Recent tracks in genre (2020-2024) - prioritize newer music
      const recentQuery = `genre:${genre} year:2020-2024`;
      const recentUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(recentQuery)}&type=track&limit=${Math.ceil(playlistSize/3)}&market=US`;

      try {
        const recentResponse = await axios.get(recentUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        allTracks = allTracks.concat(recentResponse.data.tracks.items);
      } catch (err) {
        console.log(`Recent search failed for ${genre}:`, err.message);
      }

      // Strategy 2: Specific genre + mood combinations
      const moodQuery = `genre:${genre} ${getMoodKeywords(genre)}`;
      const moodUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(moodQuery)}&type=track&limit=${Math.ceil(playlistSize/4)}&market=US`;

      try {
        const moodResponse = await axios.get(moodUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        allTracks = allTracks.concat(moodResponse.data.tracks.items);
      } catch (err) {
        console.log(`Mood search failed for ${genre}:`, err.message);
      }

      // Strategy 3: Genre + specific year ranges for variety
      const yearRanges = ['2022-2024', '2020-2022', '2018-2020'];
      for (const yearRange of yearRanges) {
        if (allTracks.length >= playlistSize * 1.5) break;

        const yearQuery = `genre:${genre} year:${yearRange}`;
        const yearUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(yearQuery)}&type=track&limit=5&market=US`;

        try {
          const yearResponse = await axios.get(yearUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          allTracks = allTracks.concat(yearResponse.data.tracks.items);
        } catch (err) {
          console.log(`Year search failed for ${genre} ${yearRange}:`, err.message);
        }
      }
    }

    // Strategy 4: Fallback to general music if we don't have enough tracks
    if (allTracks.length < playlistSize) {
      const fallbackQueries = [
        'year:2023-2024',
        'year:2022-2024',
        'year:2021-2024'
      ];

      for (const query of fallbackQueries) {
        if (allTracks.length >= playlistSize * 1.5) break; // Stop if we have enough

        const fallbackUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20&market=US`;

        try {
          const fallbackResponse = await axios.get(fallbackUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          allTracks = allTracks.concat(fallbackResponse.data.tracks.items);
        } catch (err) {
          console.log(`Fallback search failed for ${query}:`, err.message);
        }
      }
    }

    // Remove duplicates
    const uniqueTracks = allTracks.filter((track, index, self) =>
      index === self.findIndex(t => t.id === track.id)
    );

    // Filter by popularity (Spotify popularity score 0-100, we want 40+ for ~100k+ streams)
    const popularTracks = uniqueTracks.filter(track => {
      const popularity = track.popularity || 0;
      return popularity >= 40; // 40+ popularity score = ~100k+ streams
    });

    console.log(`Found ${uniqueTracks.length} unique tracks, ${popularTracks.length} with 100k+ streams`);

    // Filter by explicit content with fallback strategy
    let filteredTracks = popularTracks;
    if (explicitFilter === 'clean') {
      filteredTracks = popularTracks.filter(track => !track.explicit);

      // If not enough clean tracks, reduce popularity threshold for clean tracks
      if (filteredTracks.length < playlistSize) {
        console.log(`⚠️ Only found ${filteredTracks.length} clean tracks with 100k+ streams, reducing threshold...`);

        const lessPopularCleanTracks = uniqueTracks.filter(track => {
          const popularity = track.popularity || 0;
          return popularity >= 25 && !track.explicit && !filteredTracks.some(ft => ft.id === track.id);
        });

        filteredTracks = [...filteredTracks, ...lessPopularCleanTracks];

        // If still not enough clean tracks, use even lower threshold
        if (filteredTracks.length < playlistSize) {
          const evenLessPopularCleanTracks = uniqueTracks.filter(track => {
            const popularity = track.popularity || 0;
            return popularity >= 15 && !track.explicit && !filteredTracks.some(ft => ft.id === track.id);
          });

          filteredTracks = [...filteredTracks, ...evenLessPopularCleanTracks];
        }
      }
    }
    // If explicitFilter is 'any', no filtering needed

    // Debug info (can be removed in production)
    console.log(`Found ${uniqueTracks.length} unique tracks, ${filteredTracks.length} after explicit filter`);

    // Include tracks even without previews, but prefer those with previews
    const tracksWithPreviews = filteredTracks.filter(track => track.preview_url);
    const tracksWithoutPreviews = filteredTracks.filter(track => !track.preview_url);

    // Combine: first tracks with previews, then tracks without previews
    let finalTracks = [...tracksWithPreviews, ...tracksWithoutPreviews];

    // If we still don't have enough tracks, add more from the original pool
    if (finalTracks.length < playlistSize) {
      console.log(`⚠️ Only found ${finalTracks.length} tracks, adding more from original pool...`);

      // Try with lower popularity threshold (25+ instead of 40+)
      const lessPopularTracks = uniqueTracks.filter(track => {
        const popularity = track.popularity || 0;
        return popularity >= 25 && !finalTracks.some(ft => ft.id === track.id);
      });

      finalTracks = [...finalTracks, ...lessPopularTracks];

      // If still not enough, add any remaining tracks
      if (finalTracks.length < playlistSize) {
        const remainingTracks = uniqueTracks.filter(track =>
          !finalTracks.some(ft => ft.id === track.id)
        );
        finalTracks = [...finalTracks, ...remainingTracks];
      }
    }

    // Ensure we have at least the requested number of tracks
    if (finalTracks.length < playlistSize) {
      console.log(`⚠️ Still only have ${finalTracks.length} tracks, using all available tracks`);
    }

    finalTracks = finalTracks.slice(0, playlistSize);

    const resultTracks = finalTracks.map((t) => ({
      name: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      preview_url: t.preview_url,
      external_url: t.external_urls.spotify,
      explicit: t.explicit || false,
      album_art: t.album?.images?.[0]?.url || null,
      album_name: t.album?.name || 'Unknown Album',
    }));

    return resultTracks;
  } catch (err) {
    console.error("❌ Spotify search error:", err.response?.data || err.message);
    throw new Error("Spotify search failed");
  }
}
