package com.article_generator.article_generator.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String name, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your OTP Code - Article Generator");
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering with Article Generator!\n\n" +
                "Your OTP (One-Time Password) code is:\n\n" +
                "🔐 %s\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "Please enter this code on the verification page to complete your registration.\n\n" +
                "If you didn't create an account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Article Generator Team",
                name, otpCode
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            System.out.println("✅ OTP Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            // Fallback: Print OTP to console for testing
            System.out.println("❌ Failed to send email: " + e.getMessage());
            System.out.println("📧 OTP CODE FOR " + toEmail + ": " + otpCode);
            System.out.println("⏰ This code expires in 10 minutes");
        }
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Article Generator!");
        
        String emailBody = String.format(
            "Hello %s,\n\n" +
            "Welcome to Article Generator! Your email has been successfully verified.\n\n" +
            "You can now start creating amazing articles with our AI-powered generator.\n\n" +
            "Happy writing!\n\n" +
            "Best regards,\n" +
            "Article Generator Team",
            name
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }
}
