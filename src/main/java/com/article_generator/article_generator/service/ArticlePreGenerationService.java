package com.article_generator.article_generator.service;

import com.article_generator.article_generator.dto.ArticleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ArticlePreGenerationService {

    @Autowired
    private TrendingArticlesService trendingArticlesService;

    private static final String[] ALL_CATEGORIES = {
        "all", "tech", "finance", "lifestyle", "business", "health", 
        "sports", "entertainment", "education", "science"
    };

    @Async
    public CompletableFuture<Void> preGenerateArticlesForAllCategories() {
        try {
            System.out.println("Starting pre-generation of articles for all categories...");
            
            for (String category : ALL_CATEGORIES) {
                try {
                    System.out.println("Pre-generating articles for category: " + category);
                    List<ArticleResponse> articles = trendingArticlesService.getTrendingArticles(category);
                    System.out.println("Pre-generated " + articles.size() + " articles for category: " + category);
                } catch (Exception e) {
                    System.err.println("Error pre-generating articles for category " + category + ": " + e.getMessage());
                }
            }
            
            System.out.println("Completed pre-generation of articles for all categories");
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            System.err.println("Error in pre-generation process: " + e.getMessage());
            return CompletableFuture.completedFuture(null);
        }
    }

    @Async
    public CompletableFuture<Void> preGenerateArticlesForCategory(String category) {
        try {
            System.out.println("Pre-generating articles for category: " + category);
            List<ArticleResponse> articles = trendingArticlesService.getTrendingArticles(category);
            System.out.println("Pre-generated " + articles.size() + " articles for category: " + category);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            System.err.println("Error pre-generating articles for category " + category + ": " + e.getMessage());
            return CompletableFuture.completedFuture(null);
        }
    }
}

