package com.article_generator.article_generator.service;

import com.article_generator.article_generator.dto.AuthResponse;
import com.article_generator.article_generator.dto.OtpVerificationRequest;
import com.article_generator.article_generator.dto.OtpVerificationResponse;
import com.article_generator.article_generator.dto.LoginRequest;
import com.article_generator.article_generator.dto.RegisterRequest;
import com.article_generator.article_generator.entity.User;
import com.article_generator.article_generator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;


    public AuthResponse register(RegisterRequest request) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return AuthResponse.builder()
                        .success(false)
                        .message("User with this email already exists")
                        .build();
            }

            // Create new user
            String otpCode = generateOtpCode();
            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .avatarUrl(generateAvatarUrl(request.getName()))
                    .emailVerified(false)
                    .otpCode(otpCode)
                    .otpExpires(LocalDateTime.now().plusMinutes(10))
                    .build();
            
            user.onCreate();
            User savedUser = userRepository.save(user);

            // Send OTP email
            try {
                emailService.sendOtpEmail(savedUser.getEmail(), savedUser.getName(), otpCode);
            } catch (Exception e) {
                // Log error but don't fail registration
                System.err.println("Failed to send OTP email: " + e.getMessage());
            }

            return AuthResponse.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .name(savedUser.getName())
                    .avatarUrl(savedUser.getAvatarUrl())
                    .createdAt(savedUser.getCreatedAt().toString())
                    .token(generateToken())
                    .message("User registered successfully. Please check your email for the OTP code.")
                    .success(true)
                    .build();
        } catch (Exception e) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Registration failed: " + e.getMessage())
                    .build();
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Invalid email or password")
                        .build();
            }

            if (!user.isEmailVerified()) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Please verify your email before logging in. Check your inbox for the OTP code.")
                        .build();
            }

            // Articles will be generated on-demand when user selects a category

            return AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .createdAt(user.getCreatedAt().toString())
                    .token(generateToken())
                    .message("Login successful")
                    .success(true)
                    .build();
        } catch (Exception e) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Login failed: " + e.getMessage())
                    .build();
        }
    }

    private String generateAvatarUrl(String name) {
        return "https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=667eea&color=fff";
    }

    public OtpVerificationResponse verifyOtp(OtpVerificationRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                return OtpVerificationResponse.builder()
                        .success(false)
                        .message("User not found")
                        .build();
            }

            User user = userOpt.get();
            
            // Check if OTP is correct
            if (!request.getOtpCode().equals(user.getOtpCode())) {
                return OtpVerificationResponse.builder()
                        .success(false)
                        .message("Invalid OTP code")
                        .build();
            }
            
            // Check if OTP is expired
            if (user.getOtpExpires().isBefore(LocalDateTime.now())) {
                return OtpVerificationResponse.builder()
                        .success(false)
                        .message("OTP code has expired. Please request a new one.")
                        .build();
            }

            // Check if already verified
            if (user.isEmailVerified()) {
                return OtpVerificationResponse.builder()
                        .success(false)
                        .message("Email is already verified")
                        .build();
            }

            // Verify the email
            user.setEmailVerified(true);
            user.setOtpCode(null);
            user.setOtpExpires(null);
            user.onUpdate();
            userRepository.save(user);

            // Send welcome email
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            } catch (Exception e) {
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }

            // Articles will be generated on-demand when user selects a category

            return OtpVerificationResponse.builder()
                    .success(true)
                    .message("Email verified successfully! You can now log in.")
                    .email(user.getEmail())
                    .name(user.getName())
                    .build();

        } catch (Exception e) {
            return OtpVerificationResponse.builder()
                    .success(false)
                    .message("OTP verification failed: " + e.getMessage())
                    .build();
        }
    }

    public AuthResponse resendOtp(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return AuthResponse.builder()
                        .success(false)
                        .message("User not found")
                        .build();
            }

            User user = userOpt.get();
            
            if (user.isEmailVerified()) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Email is already verified")
                        .build();
            }

            // Generate new OTP code
            String otpCode = generateOtpCode();
            user.setOtpCode(otpCode);
            user.setOtpExpires(LocalDateTime.now().plusMinutes(10));
            user.onUpdate();
            userRepository.save(user);

            // Send OTP email
            try {
                emailService.sendOtpEmail(user.getEmail(), user.getName(), otpCode);
            } catch (Exception e) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Failed to send OTP email: " + e.getMessage())
                        .build();
            }

            return AuthResponse.builder()
                    .success(true)
                    .message("OTP code sent successfully")
                    .build();

        } catch (Exception e) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Failed to resend OTP: " + e.getMessage())
                    .build();
        }
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private String generateOtpCode() {
        // Generate a 6-digit OTP code
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}
