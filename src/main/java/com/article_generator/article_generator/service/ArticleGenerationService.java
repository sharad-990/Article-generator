package com.article_generator.article_generator.service;

import com.article_generator.article_generator.dto.ArticleResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArticleGenerationService {

    @Value("${spring.ai.google.ai.api-key}")
    private String apiKey;

    @Autowired
    private ArticleService articleService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public List<ArticleResponse> generateArticles(String input) {
        return generateArticles(input, "medium", "engaging", "general", "all");
    }

    public List<ArticleResponse> generateArticles(String input, String length, String tone, String template, String category) {
        System.out.println("Starting article generation for input: " + input);
        System.out.println("Parameters - Length: " + length + ", Tone: " + tone + ", Template: " + template + ", Category: " + category);
        List<ArticleResponse> articles = new ArrayList<>();
        
        for (int i = 0; i < 3; i++) {
            System.out.println("Generating article " + (i + 1) + " of 3");
            ArticleResponse article = generateSingleArticle(input, length, tone, template, category, i + 1);
            if (article != null) {
                articles.add(article);
                System.out.println("Successfully generated article " + (i + 1));
            } else {
                System.out.println("Failed to generate article " + (i + 1));
            }
        }
        
        System.out.println("Total articles generated: " + articles.size());
        return articles;
    }

    private ArticleResponse generateSingleArticle(String input, String length, String tone, String template, String category, int articleNumber) {
        System.out.println("Generating article " + articleNumber + " for input: " + input);
        try {
            String prompt = buildPrompt(input, length, tone, template, category);

            String response = callGoogleAI(prompt);
            System.out.println("Raw API response: " + response);
            
            // Parse JSON response
            ArticleResponse article = parseArticleFromResponse(response);
            System.out.println("Parsed article: " + (article != null ? "SUCCESS" : "FAILED"));
            
            if (article != null) {
                // Set AI detection as false since we're not using the service
                article.setAiDetected(false);
                article.setAiScore(0.0);
            }
            
            return article;
            
        } catch (Exception e) {
            System.err.println("Error in generateSingleArticle: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Value("${spring.ai.google.ai.model}")
    private String modelName;

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
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                Map.class
            );
            
            System.out.println("API Response Status: " + response.getStatusCode());
            System.out.println("API Response Body: " + response.getBody());
            System.out.println("Using model: " + modelName);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                    if (contentMap != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            } else {
                System.err.println("API call failed with status: " + response.getStatusCode());
                System.err.println("Response body: " + response.getBody());
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
                System.err.println("Response is null or empty");
                return null;
            }
            
            // Clean the response to extract JSON
            String jsonResponse = extractJsonFromResponse(response);
            if (jsonResponse == null) {
                System.err.println("Could not extract JSON from response: " + response);
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
                    .author("Sarah M.")
                    .publishedAt(java.time.LocalDateTime.now().toString())
                    .aiDetected(false)
                    .aiScore(0.0)
                    .build();
            } else {
                System.err.println("Missing required fields in JSON response");
                System.err.println("Title: " + title + ", Subtitle: " + subtitle + ", Content: " + (content != null ? "present" : "null"));
            }
        } catch (Exception e) {
            System.err.println("Error parsing article response: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String extractJsonFromResponse(String response) {
        try {
            if (response == null || response.trim().isEmpty()) {
                return null;
            }
            
            // Try to find JSON object in the response
            int startIndex = response.indexOf("{");
            int endIndex = response.lastIndexOf("}");
            
            if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                return response.substring(startIndex, endIndex + 1);
            } else {
                System.err.println("No JSON object found in response: " + response);
            }
        } catch (Exception e) {
            System.err.println("Error extracting JSON from response: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String buildPrompt(String input, String length, String tone, String template, String category) {
        // Word count based on length
        String wordCount = switch (length) {
            case "short" -> "300-500 words";
            case "long" -> "1500-2000 words";
            default -> "800-1200 words";
        };

        // Tone instructions - completely human-like
        String toneInstructions = switch (tone) {
            case "professional" -> "Write like a seasoned professional sharing genuine expertise. Use natural language with occasional contractions, personal insights, and real-world experience. Sound like a knowledgeable friend giving advice.";
            case "casual" -> "Write like you're talking to a close friend over coffee. Use natural speech patterns, personal stories, and everyday language. Include 'you know', 'honestly', 'I mean', and other natural expressions.";
            case "urgent" -> "Write like someone who just discovered something important and can't wait to share it. Use natural urgency without being artificial - like a friend calling you with exciting news.";
            case "inspirational" -> "Write like someone who genuinely cares and wants to help others succeed. Use heartfelt language, personal struggles, and authentic motivation. Sound like a mentor sharing wisdom.";
            default -> "Write like a passionate person who loves sharing knowledge. Use natural enthusiasm, personal experiences, and genuine excitement about the topic.";
        };

        // Template instructions - human writing patterns
        String templateInstructions = switch (template) {
            case "howto" -> "Write like you're teaching a friend. Use natural step-by-step explanations with personal tips and 'here's what I learned' moments.";
            case "listicle" -> "Write like you're sharing your personal favorites or discoveries. Use natural transitions between points and personal commentary.";
            case "story" -> "Write like you're telling a story to friends. Use natural storytelling flow with personal details and authentic emotions.";
            case "comparison" -> "Write like you're helping a friend decide between options. Use personal experience and honest opinions about each choice.";
            default -> "Write like you're sharing something interesting you discovered. Use natural flow with personal insights and genuine interest.";
        };

        return String.format("""
            You are a real person writing a genuine article about: "%s"
            
            WRITE LIKE A REAL HUMAN:
            - Use natural, conversational language
            - Include personal opinions and experiences
            - Use contractions (I'm, you're, don't, can't)
            - Include natural speech patterns and filler words
            - Write like you're talking to a friend
            - Use "I think", "in my experience", "honestly", "personally"
            - Include small mistakes or natural imperfections
            - Use varied sentence lengths and structures
            - Include personal anecdotes and real examples
            - Sound like a real person, not a robot
            
            WRITING STYLE: %s
            TEMPLATE: %s
            WORD COUNT: %s
            
            AVOID AI PATTERNS:
            - No overly perfect structure
            - No robotic language
            - No generic phrases
            - No artificial enthusiasm
            - No perfect grammar everywhere
            - No corporate speak
            
            MAKE IT SOUND HUMAN:
            - Use natural transitions
            - Include personal quirks and opinions
            - Use real-world examples
            - Include some uncertainty or "I'm not sure but..."
            - Use natural emphasis and emphasis
            - Include personal struggles or learning moments
            
            Format as JSON:
            {
                "title": "Natural, human-like title",
                "subtitle": "Genuine subtitle that sounds like you wrote it", 
                "content": "Your %s article written like a real person"
            }
            """, 
            input,
            toneInstructions,
            templateInstructions,
            wordCount,
            wordCount
        );
    }
}
