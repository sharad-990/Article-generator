package com.article_generator.article_generator.controller;

import com.article_generator.article_generator.dto.*;
import com.article_generator.article_generator.service.ArticleGenerationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ArticleController {

    @Autowired
    private ArticleGenerationService articleGenerationService;

    @PostMapping("/generateArticles")
    public ResponseEntity<ArticleGenerationResponse> generateArticles(
            @Valid @RequestBody ArticleGenerationRequest request) {
        try {
            List<ArticleResponse> articles = articleGenerationService.generateArticles(request.getInput());
            
            return ResponseEntity.ok(ArticleGenerationResponse.builder()
                .articles(articles)
                .success(true)
                .message("Articles generated successfully")
                .build());
                
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(ArticleGenerationResponse.builder()
                .articles(List.of())
                .success(false)
                .message("Error generating articles: " + e.getMessage())
                .build());
        }
    }


    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "message", "Article Generator API is running"));
    }
}
