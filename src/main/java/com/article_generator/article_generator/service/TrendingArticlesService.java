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
    
    // Cache for daily trending articles by category
    private Map<String, List<ArticleResponse>> cachedTrendingArticles = new HashMap<>();
    private Map<String, LocalDate> lastGeneratedDate = new HashMap<>();

    public List<ArticleResponse> getTrendingArticles(String category) {
        LocalDate today = LocalDate.now();
        
        // Return cached articles if they were generated today for this category
        if (lastGeneratedDate.containsKey(category) && 
            lastGeneratedDate.get(category).equals(today) && 
            cachedTrendingArticles.containsKey(category) && 
            !cachedTrendingArticles.get(category).isEmpty()) {
            return cachedTrendingArticles.get(category);
        }
        
        // Generate new trending articles for this category
        List<ArticleResponse> articles = generateTrendingArticles(category);
        cachedTrendingArticles.put(category, articles);
        lastGeneratedDate.put(category, today);
        
        return articles;
    }

    private List<ArticleResponse> generateTrendingArticles(String category) {
        List<ArticleResponse> articles = new ArrayList<>();
        
        // Get current trending topics for the category
        List<String> trendingTopics = getTrendingTopics(category);
        
        for (int i = 0; i < Math.min(8, trendingTopics.size()); i++) {
            try {
                ArticleResponse article = generateTrendingArticle(trendingTopics.get(i), category, i + 1);
                if (article != null) {
                    articles.add(article);
                }
            } catch (Exception e) {
                System.err.println("Error generating trending article " + (i + 1) + " for category " + category + ": " + e.getMessage());
            }
        }
        
        return articles;
    }

    private List<String> getTrendingTopics(String category) {
        Map<String, List<String>> categoryTopics = new HashMap<>();
        
        categoryTopics.put("tech", Arrays.asList(
            "Why I'm not buying the new iPhone and you probably shouldn't either",
            "The AI tools I actually use every day (and the ones I don't)",
            "Tech gadgets that are actually worth the money",
            "Why I switched to cheaper tech and I'm happier now",
            "The AI stuff that's actually useful vs the hype",
            "Tech companies doing good things (surprisingly few)",
            "Smartphones are getting boring and here's why",
            "Free software that's better than the expensive stuff"
        ));
        
        categoryTopics.put("finance", Arrays.asList(
            "What I learned about investing after losing money",
            "Why I'm still not buying crypto (and I'm okay with that)",
            "The money mistakes I made in my 20s that cost me",
            "How I actually started saving money (it's not what you think)",
            "Investment apps that are basically gambling",
            "Why I switched banks and it was the best decision",
            "The side hustle that actually worked for me",
            "Financial advice that actually helped me"
        ));
        
        categoryTopics.put("lifestyle", Arrays.asList(
            "The lifestyle changes that actually made me happier",
            "Why I tried minimalism and it didn't work for me",
            "The morning routine that actually stuck",
            "Why I deleted social media and I'm not going back",
            "The habits I copied from successful people",
            "Why work-life balance is harder than I thought",
            "The self-care stuff that actually helps",
            "Why I moved to a smaller city and it was perfect"
        ));
        
        categoryTopics.put("business", Arrays.asList(
            "The business trends that are actually working in 2024",
            "Why most startups fail and how to avoid it",
            "The marketing strategies that actually convert",
            "Why I left my corporate job to start my own business",
            "The business books that actually changed my perspective",
            "Why networking events are a waste of time",
            "The productivity hacks that actually work",
            "Why remote work is killing company culture"
        ));
        
        categoryTopics.put("health", Arrays.asList(
            "The health trends that are actually dangerous",
            "Why I stopped following fitness influencers",
            "The simple habits that improved my health dramatically",
            "Why expensive supplements are a scam",
            "The workout routine that actually works for busy people",
            "Why mental health matters more than physical health",
            "The diet changes that changed my life",
            "Why I quit the gym and got healthier"
        ));
        
        categoryTopics.put("education", Arrays.asList(
            "Why traditional education is failing students",
            "The skills that actually matter in 2024",
            "Why I dropped out of college and learned more",
            "The online courses that are actually worth your time",
            "Why most certifications are useless",
            "The learning methods that actually work",
            "Why I stopped following educational influencers",
            "The books that actually taught me something valuable"
        ));
        
        categoryTopics.put("entertainment", Arrays.asList(
            "The movies that are actually worth watching in 2024",
            "Why I stopped watching Netflix and my life improved",
            "The TV shows that changed my perspective",
            "Why most entertainment is designed to waste your time",
            "The podcasts that actually taught me something",
            "Why I quit social media and found better entertainment",
            "The books that are better than any movie",
            "Why I stopped following celebrity culture"
        ));
        
        categoryTopics.put("travel", Arrays.asList(
            "The travel destinations that are actually worth it",
            "Why expensive travel is overrated",
            "The budget travel tips that actually work",
            "Why I stopped traveling and started exploring locally",
            "The travel mistakes everyone makes",
            "Why most travel influencers are lying to you",
            "The places that changed my perspective on travel",
            "Why I quit the travel lifestyle and settled down"
        ));
        
        categoryTopics.put("food", Arrays.asList(
            "The food trends that are actually unhealthy",
            "Why I stopped following food influencers",
            "The simple recipes that changed my cooking",
            "Why expensive restaurants are overrated",
            "The food habits that improved my health",
            "Why I quit dieting and started eating normally",
            "The cooking tips that actually work",
            "Why I stopped buying expensive ingredients"
        ));
        
        categoryTopics.put("sports", Arrays.asList(
            "The sports that are actually worth your time",
            "Why I quit competitive sports and got healthier",
            "The fitness trends that are actually dangerous",
            "Why most sports influencers are lying",
            "The simple exercises that actually work",
            "Why I stopped following professional sports",
            "The sports that changed my perspective on fitness",
            "Why I quit the gym and found better alternatives"
        ));
        
        // Default topics for "all" category
        categoryTopics.put("all", Arrays.asList(
            "Why I'm not buying the new iPhone and you probably shouldn't either",
            "The AI tools I actually use every day",
            "Tech gadgets that are actually worth the money",
            "Why I switched to cheaper tech and I'm happier now",
            "The AI stuff that's actually useful vs the hype",
            "What I learned about investing after losing money",
            "Why I deleted social media and I'm not going back",
            "The lifestyle changes that actually made me happier",
            "The side hustle that actually worked for me",
            "Why work-life balance is harder than I thought",
            "The morning routine that actually stuck",
            "Financial advice that actually helped me",
            "Why I tried minimalism and it didn't work for me"
        ));
        
        return categoryTopics.getOrDefault(category, categoryTopics.get("all"));
    }

    private ArticleResponse generateTrendingArticle(String topic, String category, int articleNumber) {
        try {
            String categoryContext = getCategoryContext(category);
            
            String prompt = String.format("""
                You are a real person who just discovered something important about: "%s"
                
                CATEGORY CONTEXT: %s
                
                WRITE LIKE A REAL HUMAN WHO JUST LEARNED SOMETHING:
                - You're genuinely excited to share what you learned
                - You're writing to friends who might benefit from this
                - You have personal experience with this topic
                - You're not trying to be perfect or professional
                - You're being honest about your mistakes and learnings
                
                HUMAN WRITING STYLE:
                - Use natural language and contractions (I'm, you're, don't, can't)
                - Include personal stories and real experiences
                - Use "honestly", "I mean", "you know", "like", "so"
                - Include uncertainty sometimes ("I think", "maybe", "not sure")
                - Use varied sentence lengths - some short, some long
                - Include natural pauses and thoughts
                - Write like you're talking, not like you're writing a report
                
                CONTENT REQUIREMENTS:
                - Word count: 800-1200 words
                - Share your genuine thoughts and opinions
                - Include what you learned the hard way
                - Be honest about what worked and what didn't
                - Include specific details from your experience
                - Make it relatable to regular people
                - Focus on the %s category but keep it human
                
                AVOID AI PATTERNS:
                - No overly perfect structure
                - No generic advice
                - No corporate language
                - No artificial enthusiasm
                - No perfect grammar everywhere
                - No robotic transitions
                
                MAKE IT SOUND REAL:
                - Include personal quirks and opinions
                - Use real-world examples from your life
                - Include some uncertainty or "I'm still figuring this out"
                - Use natural emphasis and casual language
                - Include personal struggles or mistakes
                - Sound like a friend sharing advice
                
                FORMATTING:
                - Use natural headings (not ALL CAPS)
                - Use dashes (-) for lists
                - NO markdown symbols
                - Write like a real person would
                
                Format as JSON:
                {
                    "title": "Natural title that sounds like you wrote it",
                    "subtitle": "Genuine subtitle from your perspective", 
                    "content": "Your article written like a real person sharing real experience"
                }
                """, topic, categoryContext, category);

            String response = callGoogleAI(prompt);
            System.out.println("Trending article " + articleNumber + " response: " + response);
            
            ArticleResponse article = parseArticleFromResponse(response);
            if (article != null) {
                article.setAuthor("Alex K.");
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
                    .author("Alex K.")
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

    private String getCategoryContext(String category) {
        Map<String, String> contexts = new HashMap<>();
        contexts.put("tech", "Technology, gadgets, AI, software, hardware, digital trends");
        contexts.put("finance", "Money, investments, budgeting, financial advice, economy");
        contexts.put("lifestyle", "Daily life, habits, routines, personal development, wellness");
        contexts.put("business", "Entrepreneurship, career, marketing, productivity, leadership");
        contexts.put("health", "Fitness, nutrition, mental health, wellness, medical advice");
        contexts.put("education", "Learning, skills, courses, books, personal development");
        contexts.put("entertainment", "Movies, TV shows, music, books, pop culture");
        contexts.put("travel", "Destinations, travel tips, culture, adventure, exploration");
        contexts.put("food", "Cooking, recipes, restaurants, nutrition, culinary trends");
        contexts.put("sports", "Fitness, athletics, training, sports news, physical health");
        contexts.put("all", "General trending topics across all categories");
        
        return contexts.getOrDefault(category, "General trending topics");
    }
}
