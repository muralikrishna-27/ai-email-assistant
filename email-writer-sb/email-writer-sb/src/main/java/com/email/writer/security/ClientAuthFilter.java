package com.email.writer.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
@Order(1)
public class ClientAuthFilter extends OncePerRequestFilter {

    private static final Set<String> ALLOWED_CLIENT_KEYS = Set.of(
            "email-extension-dev"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!request.getRequestURI().startsWith("/api/email")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientKey = request.getHeader("X-CLIENT-KEY");

        if (clientKey == null || !ALLOWED_CLIENT_KEYS.contains(clientKey)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("""
                {
                  "error": "Unauthorized",
                  "message": "Invalid or missing client key"
                }
                """);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
