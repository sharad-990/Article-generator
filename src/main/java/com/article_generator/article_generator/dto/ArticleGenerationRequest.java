package com.article_generator.article_generator.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleGenerationRequest {
    @NotEmpty(message = "Input text is required")
    @Size(min = 1, max = 1000, message = "Input text must be between 1 and 1000 characters")
    private String input;
}
