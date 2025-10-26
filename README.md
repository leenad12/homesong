# HomeSong

**Transport yourself back to where you feel home**

HomeSong analyzes photos of your space and generates personalized Spotify playlists that match the mood, colors, and atmosphere. Upload a photo → AI analyzes the visual elements → Get a curated playlist with 100k+ stream songs that make any space feel like home.

## Inspiration

As freshmen, we often find ourselves missing home and looking at photos to cheer us up. We wanted to transfer this feeling to music - where you can remind yourself of a place you visited through the music and ambience of it. **"Transport yourself back to where you feel home"** became our mission.

## What it does

HomeSong analyzes photos of your space and generates personalized Spotify playlists that match the mood, colors, and atmosphere. Upload a photo → AI analyzes the visual elements → Get a curated playlist with 100k+ stream songs that make any space feel like home.

## How we built it

**Backend**: Node.js + Express with Hugging Face AI for image analysis, custom embeddings for genre matching, and Spotify API integration
**Frontend**: React + TypeScript with Radix UI and smooth animations
**AI Magic**: Color psychology, mood analysis, and semantic embeddings to map visual elements to musical characteristics

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

## Challenges we ran into

- **Spotify API restrictions** forced us to pivot from recommendations to search-based approach
- **Balancing personalization with popularity** - ensuring unique recommendations while maintaining song quality
- **Clean content filtering** - getting enough clean songs without compromising playlist variety

## Accomplishments that we're proud of

- **Highly personalized recommendations** that actually match image content (stage scenes → performance music, beach scenes → surf rock)
- **Advanced AI integration** using embeddings for semantic genre matching
- **Quality music curation** with 100k+ stream songs and smart filtering
- **Beautiful, responsive UI** with real-time feedback and smooth animations

## What we learned

- **AI embeddings are powerful** for matching visual concepts to musical genres
- **Spotify API requires creative workarounds** when endpoints are restricted
- **User experience matters** - real-time feedback and smooth transitions are crucial
- **Color psychology works** - visual elements can be systematically mapped to musical characteristics

## What's next for HomeSong

**Short-term**: Mobile app, voice integration, playlist sharing
**Long-term**: AR/VR space analysis, global music platforms, smart home integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- Spotify Developer Account
- Hugging Face Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/homesong.git
cd homesong
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd "../Downloads/Frontend Website for Homesong"
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory with:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

5. Run the application:
```bash
# From the backend directory
./start-app.sh
```

This will start both the backend server (port 3000) and frontend development server (port 5173).

## Usage

1. Open your browser to `http://localhost:5173`
2. Upload a photo of your space
3. Choose playlist options (size, content filter)
4. Wait for AI analysis and playlist generation
5. Enjoy your personalized playlist!

## API Endpoints

- `POST /api/analyze` - Analyze image and generate playlist
- `GET /` - Serve the web interface

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hugging Face for AI models
- Spotify for music API
- Radix UI for components
- Framer Motion for animations

---

*HomeSong bridges the gap between visual memories and musical comfort, helping you find the perfect soundtrack for any space.*
