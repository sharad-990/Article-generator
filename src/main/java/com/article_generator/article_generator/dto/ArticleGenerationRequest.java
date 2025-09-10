package com.article_generator.article_generator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleGenerationRequest {
    @NotBlank(message = "Input text is required")
    @Size(min = 3, max = 500, message = "Input text must be between 3 and 500 characters")
    private String input;
}
