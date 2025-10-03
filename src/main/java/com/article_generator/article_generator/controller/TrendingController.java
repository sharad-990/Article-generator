package com.article_generator.article_generator.controller;

import com.article_generator.article_generator.dto.ArticleResponse;
import com.article_generator.article_generator.service.TrendingArticlesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TrendingController {

    @Autowired
    private TrendingArticlesService trendingArticlesService;

    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingArticles(
            @RequestParam(required = false, defaultValue = "all") String category) {
        try {
            List<ArticleResponse> trendingArticles = trendingArticlesService.getTrendingArticles(category);
            
            return ResponseEntity.ok(Map.of(
                "articles", trendingArticles,
                "success", true,
                "message", "Trending articles retrieved successfully",
                "count", trendingArticles.size(),
                "category", category
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "articles", List.of(),
                "success", false,
                "message", "Error retrieving trending articles: " + e.getMessage(),
                "count", 0,
                "category", category
            ));
        }
    }

    @PostMapping("/trending/refresh")
    public ResponseEntity<Map<String, Object>> refreshTrendingArticles(
            @RequestParam(required = false, defaultValue = "all") String category) {
        try {
            // Force refresh by clearing cache
            List<ArticleResponse> trendingArticles = trendingArticlesService.getTrendingArticles(category);
            
            return ResponseEntity.ok(Map.of(
                "articles", trendingArticles,
                "success", true,
                "message", "Trending articles refreshed successfully",
                "count", trendingArticles.size(),
                "category", category
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "articles", List.of(),
                "success", false,
                "message", "Error refreshing trending articles: " + e.getMessage(),
                "count", 0,
                "category", category
            ));
        }
    }
}
