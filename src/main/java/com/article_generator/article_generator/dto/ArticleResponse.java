package com.article_generator.article_generator.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ArticleResponse {
    private String id;
    private String title;
    private String subtitle;
    private String content;
    private String author;
    private String publishedAt;
    private String mediumUrl;
    private boolean aiDetected;
    private double aiScore;
    private boolean isFavorite;
    private String category;
}
