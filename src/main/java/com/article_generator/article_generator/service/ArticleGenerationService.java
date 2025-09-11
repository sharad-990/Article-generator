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
    
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public List<ArticleResponse> generateArticles(String input) {
        System.out.println("Starting article generation for input: " + input);
        List<ArticleResponse> articles = new ArrayList<>();
        
        for (int i = 0; i < 3; i++) {
            System.out.println("Generating article " + (i + 1) + " of 3");
            ArticleResponse article = generateSingleArticle(input, i + 1);
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

    private ArticleResponse generateSingleArticle(String input, int articleNumber) {
        System.out.println("Generating article " + articleNumber + " for input: " + input);
        try {
        String prompt = String.format("""
            You are a 24-year-old content creator and blogger who writes in a super engaging, funny, and relatable way. 
            Write about: "%s" as if you're a real person sharing personal experiences and thoughts.
            
            WRITE LIKE A REAL PERSON - THESE ARE NON-NEGOTIABLE:
            1. Word count: EXACTLY 1000-1200 words
            2. Use "OMG", "literally", "honestly", "like", "so", "totally", "actually"
            3. Include personal stories and embarrassing moments
            4. Use emojis in your writing (but not too many)
            5. Write like you're texting a close friend
            6. Include random tangents and side thoughts
            7. Use "dude", "friend", "pal" occasionally (not gender-specific)
            8. Share your real opinions (even if controversial)
            9. Include specific details about your life, age, location, etc.
            10. Use incomplete sentences and run-on sentences
            11. Include your actual thoughts and feelings
            12. Make it suspenseful and engaging
            13. Add humor and make people laugh
            14. Include some drama and personal struggles
            15. Write in first person throughout
            16. Address everyone, not just one gender
            17. Create catchy titles WITHOUT starting with "LISTEN," "SERIOUSLY," "HERE'S THE TRUTH," etc.
            
            CONTENT STYLE - BE ENTERTAINING:
            - Start with a hook that makes people want to keep reading
            - Include personal anecdotes and stories
            - Add suspense and drama
            - Make it funny and relatable
            - Include some tea or drama
            - Share your real experiences (make them up but make them believable)
            - Use conversational language
            - Include your actual thoughts and opinions
            - Make it informative but fun
            - End with a personal takeaway or call-to-action
            
            TITLE EXAMPLES (NO "LISTEN," "SERIOUSLY," etc.):
            - "WHY I'M NOT BUYING THE IPHONE 17 (AND YOU SHOULDN'T EITHER)"
            - "THE AI TOOLS THAT ACTUALLY CHANGED MY LIFE IN 2024"
            - "CRYPTO MADE ME RICH - HERE'S WHAT I WISH I KNEW SOONER"
            - "REMOTE WORK IS KILLING MY SOCIAL LIFE (BUT I LOVE IT)"
            - "SUSTAINABLE FASHION IS A LIE - HERE'S THE TRUTH"
            
            FORMATTING:
            - Use ALL CAPS for headings (no markdown)
            - Use dashes (-) for bullet points
            - NO markdown symbols whatsoever
            - Write like you're actually typing this on your phone
            
            PERSONALITY TRAITS TO INCLUDE:
            - You're 24, live in a big city, love coffee, have a cat
            - You're into tech but also fashion and lifestyle
            - You're honest about your mistakes and failures
            - You're funny and sarcastic but also caring
            - You're not perfect and you admit it
            - You're relatable and down-to-earth
            - You're inclusive and speak to everyone
            
            Format the response as JSON:
            {
                "title": "Your catchy, engaging title here",
                "subtitle": "Your engaging, relatable subtitle here", 
                "content": "Your 1000-1200 word article written like a real person with NO markdown symbols"
            }
            """, input);

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
                    .author("AI Article Generator")
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
}
