package com.email.writer.controller;

import com.email.writer.dto.EmailRequest;
import com.email.writer.service.EmailGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailGeneratorController {

    private final EmailGeneratorService service;

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody EmailRequest req) {
        return ResponseEntity.ok(service.generateEmailReply(req));
    }

    @PostMapping("/detect-tone")
    public ResponseEntity<String> detectTone(@RequestBody EmailRequest req) {
        return ResponseEntity.ok(service.detectTone(req.getEmailContent()));
    }
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

}
