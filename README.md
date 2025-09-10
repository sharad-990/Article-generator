# Article Generator - Full Stack Application

A full-stack application that generates viral-quality articles using Google Gemini AI. Built with React frontend and Spring Boot backend.

## Features

- **AI-Powered Article Generation**: Uses Google Gemini AI to create 3 unique articles from any input
- **Copy to Clipboard**: Easy copy functionality for titles, subtitles, content, or full articles
- **Modern UI**: Clean, responsive interface with beautiful design
- **Real-time Preview**: Preview articles with markdown rendering
- **Cross-Platform Ready**: Copy articles to use on any platform (Medium, WordPress, etc.)

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5.5
- Spring AI (Google Gemini integration)
- Maven
- RESTful APIs

### Frontend
- React 18
- Modern CSS with responsive design
- React Markdown for content rendering
- Axios for API calls

## Prerequisites

- Java 21+
- Node.js 16+
- Maven 3.6+
- Google AI API Key (Gemini)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the project root directory
2. Update `src/main/resources/application.properties` with your Gemini API key:
   ```properties
   spring.ai.google.ai.api-key=your-google-ai-api-key-here
   ```

3. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   netstat -ano | findstr :<Port>
   taskkill /PID <PID> /F
   mvn spring-boot:run
   ```

The backend will be available at `http://localhost:8080`

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Generate Articles
- **POST** `/api/generateArticles`
- **Body**: `{ "input": "your topic or keyword" }`
- **Response**: Array of 3 generated articles with titles, subtitles, and content

### Health Check
- **GET** `/api/health`
- **Response**: Application status

## Getting Your Gemini API Key

### Google AI API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the key and add it to `src/main/resources/application.properties`

## Usage

1. Open the application in your browser
2. Enter a topic, keyword, or one-liner in the input field
3. Click "Generate 3 Articles" to create viral-quality content
4. Preview the generated articles
5. Use the copy buttons to copy:
   - **Title only** (📋 button next to title)
   - **Subtitle only** (📋 button next to subtitle)
   - **Content only** (📋 Copy Content button)
   - **Full article** (📄 Copy Full Article button)
6. Paste the copied content to your preferred platform (Medium, WordPress, etc.)

## Project Structure

```
article-generator/
├── src/main/java/com/article_generator/article_generator/
│   ├── controller/          # REST controllers
│   ├── service/            # Business logic services
│   ├── dto/                # Data transfer objects
│   └── ArticleGeneratorApplication.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Features in Detail

### Article Generation
- Uses advanced AI prompts to create engaging, viral-worthy content
- Follows best practices with proper headings and structure
- Generates 3 unique articles per request
- Includes catchy titles and engaging subtitles

### Copy Functionality
- Individual copy buttons for titles, subtitles, and content
- Full article copy with proper markdown formatting
- Visual feedback when content is copied
- Works with any platform (Medium, WordPress, etc.)

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check Java version (21+) and Maven installation
2. **API errors**: Verify Gemini API key is correctly set in application.properties
3. **CORS issues**: Ensure frontend is running on localhost:3000
4. **Copy not working**: Ensure you're using a modern browser with clipboard API support

### Development Tips

- Use `mvn spring-boot:run` for hot reloading during development
- Check browser console for frontend errors
- Monitor backend logs for API integration issues
- Test with simple inputs first before complex topics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
