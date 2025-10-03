package com.article_generator.article_generator.repository;

import com.article_generator.article_generator.entity.Article;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends MongoRepository<Article, String> {
    List<Article> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Article> findByUserIdAndIsFavoriteTrueOrderByCreatedAtDesc(String userId);
    List<Article> findByUserIdAndCategoryOrderByCreatedAtDesc(String userId, String category);
    void deleteByUserId(String userId);
}
