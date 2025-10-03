package com.article_generator.article_generator.controller;

import com.article_generator.article_generator.dto.ArticleGenerationRequest;
import com.article_generator.article_generator.dto.ArticleGenerationResponse;
import com.article_generator.article_generator.dto.ArticleResponse;
import com.article_generator.article_generator.service.ArticleGenerationService;
import com.article_generator.article_generator.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ArticleGenerationController {

    @Autowired
    private ArticleGenerationService articleGenerationService;

    @Autowired
    private ArticleService articleService;

    @PostMapping("/generateArticles")
    public ResponseEntity<ArticleGenerationResponse> generateArticles(@Valid @RequestBody ArticleGenerationRequest request) {
        try {
            String input = request.getInput();
            if (input == null || input.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ArticleGenerationResponse.builder()
                        .success(false)
                        .message("Input cannot be empty")
                        .articles(List.of())
                        .build());
            }

            List<ArticleResponse> articles = articleGenerationService.generateArticles(
                input.trim(), 
                request.getLength(), 
                request.getTone(), 
                request.getTemplate(),
                request.getCategory()
            );
            
            // Save articles to MongoDB
            String userId = "anonymous"; // For now, use anonymous user
            for (ArticleResponse article : articles) {
                articleService.saveArticle(userId, article, "Generated");
            }
            
            return ResponseEntity.ok(ArticleGenerationResponse.builder()
                .success(true)
                .message("Articles generated successfully")
                .articles(articles)
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ArticleGenerationResponse.builder()
                    .success(false)
                    .message("Error generating articles: " + e.getMessage())
                    .articles(List.of())
                    .build());
        }
    }
}
