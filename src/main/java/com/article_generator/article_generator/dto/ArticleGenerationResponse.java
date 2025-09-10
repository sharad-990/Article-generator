package com.article_generator.article_generator.dto;

import lombok.Data;
import lombok.Builder;

import java.util.List;

@Data
@Builder
public class ArticleGenerationResponse {
    private List<ArticleResponse> articles;
    private String message;
    private boolean success;
}
