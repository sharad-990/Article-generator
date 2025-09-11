package com.article_generator.article_generator.controller;

import com.article_generator.article_generator.dto.ArticleGenerationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ArticleGenerationResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = "Validation failed: ";
        if (ex.getBindingResult().hasFieldErrors()) {
            errorMessage += ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        } else {
            errorMessage += "Invalid input provided";
        }
        
        return ResponseEntity.badRequest().body(ArticleGenerationResponse.builder()
            .articles(List.of())
            .success(false)
            .message(errorMessage)
            .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ArticleGenerationResponse> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ArticleGenerationResponse.builder()
                .articles(List.of())
                .success(false)
                .message("Internal server error: " + ex.getMessage())
                .build());
    }
}
