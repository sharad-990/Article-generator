package com.article_generator.article_generator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ArticleGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArticleGeneratorApplication.class, args);
	}

}
