package com.atelier1.microtext.controller;

import com.atelier1.microtext.model.TextPrompt;
import com.atelier1.microtext.service.TextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/generatetext")
public class TextController {

    @Autowired
    private TextService textService;

    @PostMapping
    public String createPrompt(@RequestBody TextPrompt prompt) {
        textService.sendToQueue(prompt);
        return "OK";
    }
}
