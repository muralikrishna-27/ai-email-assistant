package com.email.writer.service;

import com.email.writer.dto.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public EmailGeneratorService(
            WebClient.Builder builder,
            @Value("${groq.api.key}") String apiKey
    ) {
        this.webClient = builder
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }



    public String generateEmailReply(EmailRequest req) {
        String prompt = buildReplyPrompt(req);
        String response = callGroq(prompt, 0.6);
        return extractText(response);
    }



    public String detectTone(String email) {
        try {
            String response = callGroq(buildTonePrompt(email), 0.0);

            JsonNode root = mapper.readTree(response);
            String content = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            JsonNode toneJson = mapper.readTree(content);
            return toneJson.path("tone").asText("professional");

        } catch (Exception e) {
            return "professional";
        }
    }


    private String callGroq(String prompt, double temperature) {

        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", temperature
        );

        return webClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(12))
                .block();
    }



    private String buildReplyPrompt(EmailRequest req) {
        String tone = (req.getTone() == null || req.getTone().isBlank())
                ? "professional"
                : req.getTone();

        return """
                Write a natural human email reply.

                Rules:
                    - No subject
                    - No markdown
                    - No headers
                    - Clear and concise
                    - Do NOT mention years, dates, or time references unless they are explicitly present in the original email.
                    - If the original email does not mention a year, do not guess one.
                    - Keep replies context-aware and neutral in time.

                Tone: %s

                Email:
                    %s
        """.formatted(tone, req.getEmailContent());
    }

    private String buildTonePrompt(String email) {
        return """
            Return ONLY valid JSON.
            No explanation.

            Choose ONE:
            professional | friendly | casual

            JSON:
            {"tone":"professional"}

            Email:
                %s
        """.formatted(email);
    }

    private String extractText(String response) {
        try {
            JsonNode root = mapper.readTree(response);
            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            return "⚠️ Failed to generate reply.";
        }
    }
}
