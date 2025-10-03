package com.article_generator.article_generator.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleGenerationRequest {
    @NotEmpty(message = "Input text is required")
    @Size(min = 1, max = 1000, message = "Input text must be between 1 and 1000 characters")
    private String input;
    
    private String length = "medium"; // short, medium, long
    private String tone = "engaging"; // professional, casual, urgent, engaging, inspirational
    private String template = "general"; // general, howto, listicle, story, comparison
    private String category = "all"; // category for context
}
