package com.article_generator.article_generator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String email;
    private String name;
    private String avatarUrl;
    private String createdAt;
    private String token;
    private String message;
    private boolean success;
}
