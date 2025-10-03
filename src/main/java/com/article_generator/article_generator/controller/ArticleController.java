package com.article_generator.article_generator.controller;

import com.article_generator.article_generator.dto.ArticleResponse;
import com.article_generator.article_generator.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ArticleResponse>> getUserArticles(@PathVariable String userId) {
        List<ArticleResponse> articles = articleService.getUserArticles(userId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<List<ArticleResponse>> getUserFavorites(@PathVariable String userId) {
        List<ArticleResponse> articles = articleService.getUserFavorites(userId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<ArticleResponse>> getUserArticlesByCategory(
            @PathVariable String userId, 
            @PathVariable String category) {
        List<ArticleResponse> articles = articleService.getUserArticlesByCategory(userId, category);
        return ResponseEntity.ok(articles);
    }

    @PostMapping("/{articleId}/toggle-favorite")
    public ResponseEntity<String> toggleFavorite(@PathVariable String articleId, @RequestParam String userId) {
        articleService.toggleFavorite(articleId, userId);
        return ResponseEntity.ok("Favorite status updated");
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUserArticles(@PathVariable String userId) {
        articleService.deleteUserArticles(userId);
        return ResponseEntity.ok("User articles deleted");
    }
}