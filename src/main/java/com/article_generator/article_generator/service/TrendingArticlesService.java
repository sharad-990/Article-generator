package com.article_generator.article_generator.service;

import com.article_generator.article_generator.dto.ArticleResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class TrendingArticlesService {

    @Value("${spring.ai.google.ai.api-key}")
    private String apiKey;
    
    @Value("${spring.ai.google.ai.model}")
    private String modelName;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Cache for daily trending articles
    private List<ArticleResponse> cachedTrendingArticles = new ArrayList<>();
    private LocalDate lastGeneratedDate = null;

    public List<ArticleResponse> getTrendingArticles() {
        LocalDate today = LocalDate.now();
        
        // Return cached articles if they were generated today
        if (lastGeneratedDate != null && lastGeneratedDate.equals(today) && !cachedTrendingArticles.isEmpty()) {
            return cachedTrendingArticles;
        }
        
        // Generate new trending articles
        cachedTrendingArticles = generateTrendingArticles();
        lastGeneratedDate = today;
        
        return cachedTrendingArticles;
    }

    private List<ArticleResponse> generateTrendingArticles() {
        List<ArticleResponse> articles = new ArrayList<>();
        
        // Get current trending topics
        List<String> trendingTopics = getTrendingTopics();
        
        for (int i = 0; i < Math.min(10, trendingTopics.size()); i++) {
            try {
                ArticleResponse article = generateTrendingArticle(trendingTopics.get(i), i + 1);
                if (article != null) {
                    articles.add(article);
                }
            } catch (Exception e) {
                System.err.println("Error generating trending article " + (i + 1) + ": " + e.getMessage());
            }
        }
        
        return articles;
    }

    private List<String> getTrendingTopics() {
        // Current trending topics - you can update these daily or fetch from an API
        return Arrays.asList(
            "iPhone 17 launch and why you should save money instead",
            "AI tools that are actually changing everything",
            "Crypto market trends and what everyone needs to know",
            "Remote work lifestyle and productivity hacks",
            "Sustainable fashion and eco-friendly choices",
            "Mental health and self-care in 2024",
            "Side hustle ideas that actually make money",
            "Social media detox and digital wellness",
            "Investment tips for beginners",
            "Climate change and what we can actually do"
        );
    }

    private ArticleResponse generateTrendingArticle(String topic, int articleNumber) {
        try {
            String prompt = String.format("""
                You are a 24-year-old viral content creator who writes super engaging, catchy articles that go viral.
                Create a trending article about: "%s"
                
                VIRAL TITLE REQUIREMENTS:
                - Use ALL CAPS for emphasis
                - Make it urgent and attention-grabbing
                - Include "LIKE, RIGHT NOW" or similar urgency
                - Make it sound like you're talking to a close friend
                - Examples: "WHY I'M NOT BUYING THE IPHONE 17 (AND YOU SHOULDN'T EITHER)", "THE AI TOOLS THAT ACTUALLY CHANGED MY LIFE IN 2024", "CRYPTO MADE ME RICH - HERE'S WHAT I WISH I KNEW SOONER"
                
                CONTENT REQUIREMENTS:
                - Word count: EXACTLY 1000-1200 words (full-length trending articles)
                - Write like a real person sharing urgent advice
                - Include personal opinions and strong takes
                - Use "OMG", "literally", "honestly", "like", "so", "totally"
                - Include specific details and actionable advice
                - Make it controversial or contrarian (like "save money instead of buying iPhone")
                - Include emojis sparingly
                - Write in first person
                - Make it shareable and viral-worthy
                - Address everyone, not just one gender
                - Include personal stories and anecdotes
                - Add suspense and drama
                - Make it informative but entertaining
                
                FORMATTING:
                - Use ALL CAPS for headings (no markdown)
                - Use dashes (-) for bullet points
                - NO markdown symbols whatsoever
                
                PERSONALITY:
                - You're 24, live in NYC, have strong opinions
                - You're honest about money, lifestyle, and choices
                - You're not afraid to go against popular opinion
                - You want to help people make smart decisions
                - You're inclusive and speak to everyone
                
                Format the response as JSON:
                {
                    "title": "Your viral, catchy title here",
                    "subtitle": "Your engaging subtitle here", 
                    "content": "Your 300-500 word viral article with NO markdown symbols"
                }
                """, topic);

            String response = callGoogleAI(prompt);
            System.out.println("Trending article " + articleNumber + " response: " + response);
            
            ArticleResponse article = parseArticleFromResponse(response);
            if (article != null) {
                article.setAuthor("Trending Content Creator");
                article.setPublishedAt(java.time.LocalDateTime.now().toString());
                article.setAiDetected(false);
                article.setAiScore(0.0);
            }
            
            return article;
            
        } catch (Exception e) {
            System.err.println("Error generating trending article: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String callGoogleAI(String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", new Object[]{part});
            requestBody.put("contents", new Object[]{content});
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                    if (contentMap != null) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private ArticleResponse parseArticleFromResponse(String response) {
        try {
            if (response == null || response.trim().isEmpty()) {
                return null;
            }
            
            String jsonResponse = extractJsonFromResponse(response);
            if (jsonResponse == null) {
                return null;
            }
            
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            
            String title = jsonNode.get("title") != null ? jsonNode.get("title").asText() : null;
            String subtitle = jsonNode.get("subtitle") != null ? jsonNode.get("subtitle").asText() : null;
            String content = jsonNode.get("content") != null ? jsonNode.get("content").asText() : null;
            
            if (title != null && subtitle != null && content != null) {
                return ArticleResponse.builder()
                    .title(title)
                    .subtitle(subtitle)
                    .content(content)
                    .author("Sarah - Trending Content Creator")
                    .publishedAt(java.time.LocalDateTime.now().toString())
                    .aiDetected(false)
                    .aiScore(0.0)
                    .build();
            }
        } catch (Exception e) {
            System.err.println("Error parsing trending article response: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String extractJsonFromResponse(String response) {
        try {
            if (response == null || response.trim().isEmpty()) {
                return null;
            }
            
            int startIndex = response.indexOf("{");
            int endIndex = response.lastIndexOf("}");
            
            if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                return response.substring(startIndex, endIndex + 1);
            }
        } catch (Exception e) {
            System.err.println("Error extracting JSON from response: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
