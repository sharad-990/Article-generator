package com.article_generator.article_generator.service;

import com.article_generator.article_generator.dto.ArticleResponse;
import com.article_generator.article_generator.entity.Article;
import com.article_generator.article_generator.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    @Autowired(required = false)
    private ArticleRepository articleRepository;

    public void saveArticle(String userId, ArticleResponse articleResponse, String category) {
        // MongoDB not available - just log the action
        if (articleRepository == null) {
            System.out.println("Article saved (MongoDB not available): " + articleResponse.getTitle());
            return;
        }

        Article article = Article.builder()
                .userId(userId)
                .title(articleResponse.getTitle())
                .subtitle(articleResponse.getSubtitle())
                .content(articleResponse.getContent())
                .category(category)
                .isFavorite(false)
                .build();
        
        article.onCreate();
        articleRepository.save(article);
    }

    public List<ArticleResponse> getUserArticles(String userId) {
        // MongoDB not available - return empty list
        if (articleRepository == null) {
            return List.of();
        }

        List<Article> articles = articleRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return articles.stream()
                .map(this::convertToArticleResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getUserFavorites(String userId) {
        // MongoDB not available - return empty list
        if (articleRepository == null) {
            return List.of();
        }

        List<Article> articles = articleRepository.findByUserIdAndIsFavoriteTrueOrderByCreatedAtDesc(userId);
        return articles.stream()
                .map(this::convertToArticleResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getUserArticlesByCategory(String userId, String category) {
        // MongoDB not available - return empty list
        if (articleRepository == null) {
            return List.of();
        }

        List<Article> articles = articleRepository.findByUserIdAndCategoryOrderByCreatedAtDesc(userId, category);
        return articles.stream()
                .map(this::convertToArticleResponse)
                .collect(Collectors.toList());
    }

    public void toggleFavorite(String articleId, String userId) {
        // MongoDB not available - just log the action
        if (articleRepository == null) {
            System.out.println("Toggle favorite (MongoDB not available): " + articleId);
            return;
        }

        Article article = articleRepository.findById(articleId).orElse(null);
        if (article != null && article.getUserId().equals(userId)) {
            article.setFavorite(!article.isFavorite());
            article.onUpdate();
            articleRepository.save(article);
        }
    }

    public void deleteUserArticles(String userId) {
        // MongoDB not available - just log the action
        if (articleRepository == null) {
            System.out.println("Delete user articles (MongoDB not available): " + userId);
            return;
        }

        articleRepository.deleteByUserId(userId);
    }

    private ArticleResponse convertToArticleResponse(Article article) {
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .subtitle(article.getSubtitle())
                .content(article.getContent())
                .author("AI Generator")
                .publishedAt(article.getCreatedAt().toString())
                .aiDetected(false)
                .aiScore(0.0)
                .isFavorite(article.isFavorite())
                .category(article.getCategory())
                .build();
    }
}
