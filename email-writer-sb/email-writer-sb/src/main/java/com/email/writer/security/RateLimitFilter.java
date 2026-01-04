package com.email.writer.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(2)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Map<String, Bucket> CACHE = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String key) {
        return CACHE.computeIfAbsent(key, k ->
                Bucket.builder()
                        .addLimit(
                                Bandwidth.classic(
                                        10,
                                        Refill.intervally(10, Duration.ofMinutes(1))
                                )
                        )
                        .build()
        );
    }

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
        String bucketKey = clientKey != null ? clientKey : "anonymous";

        Bucket bucket = resolveBucket(bucketKey);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("""
                {
                  "error": "Too many requests",
                  "message": "Rate limit exceeded"
                }
                """);
        }
    }
}
