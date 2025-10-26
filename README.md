# HomeSong

Being college students, we frequently find ourselves being homesick. One of the most effective ways to cope with this feeling is to scroll through your camera roll, each one transporting you back to that exact spot and giving you the same exact feelings. We wanted to enhance this experience by transferring it to music, essentially transporting you back to a place you cherish through sound. Our hack, HomeSong analyzes the nostalgic photos from your camera and generates personalized spotify song recommendations to transfer to your playlists. HomeSong selects based on a specific criteria based on the mood, colors, and environment depicted in the photos. Our process essentially works like this, the user uploads a photo, AI analyzes the key features, and finally you receive song recommendations out of 100k+ streamable songs, making any place feel like back home.

So how did we manage to build HomeSong? On the backend we used Node.js and Express, utilizing Hugging Face AI for the overall image analysis. Our AI process analyzed the images using mood analysis, color psychology, and semantic embeddings to map scanned visual elements to musical characteristics. To match AI curated description to music genres we used custom embeddings, and to find the perfect song we used Spotify API integration. To make our website user friendly we used React and TypeScript with Radix UI which provided a much more customizable interface. Additionally we added a few animations to our website to enhance the experience of finding the perfect song.

## Challenges we ran into

creating an accurate method to match labeled features in an image to the characteristics and genre of a song
balancing personalization with popularity - ensuring unique recommendations while maintaining song quality
clean content filtering - getting enough clean songs without compromising playlist variety

## Accomplishments that we're proud of

highly personalized recommendations that actually match image content
ex. stage scenes include performance music
AI integration: using embeddings for semantic genre matching
quality music curation: filtered songs by popularity and other factors
easy to use and appealing UI: smooth animations

## What we learned

AI embeddings can be powerful to find similarities and differences between datasets
user experience matters: real-time feedback and smooth transitions are crucial
what makes music appealing! (color psychology: visual elements can be systematically mapped to musical characteristics)
a useful project should be able to use by the most diverse set of people

After completing this basic version of HomeSong we have identified some key areas of improvement to further enhance the process of song finding. In the short term we want to analyze videos, enable playlist/song distribution, and additionally a mobile-app/widget version of Homesong. In the long term we want to enable users to be able to use other music streaming services, and additionally create family spaces to create music to memory sharing. In conclusion, our mission with HomeSong is to bridge the gap between memories and reality, by helping you combine visual memories with songs.

## Built with

**Backend**
- Node.js
- Express.js
- Hugging Face Transformers API
- Spotify Web API
- ColorThief
- Multer

**Frontend**
- React
- TypeScript
- Vite
- Radix UI
- Framer Motion
- Tailwind CSS

**AI & Machine Learning**
- Hugging Face Inference API
- Custom embeddings service
- Semantic similarity matching
- Color psychology algorithms

**APIs & Services**
- Spotify Web API
- Hugging Face API
- Custom music genre embeddings

**Development**
- npm
- Vite dev server
- Shell scripting

**Key Features**
- Real-time image analysis
- Smart music recommendation engine
- Responsive web interface
- Audio preview integration
- Playlist customization options
