package com.cpe.springboot.prompt.controller;

import com.cpe.springboot.prompt.model.PromptModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/prompt")
public class PromptRestController {

    @Autowired
    private PromptService promptService;

    @PostMapping
    public PromptModel createPrompt(@RequestBody PromptModel prompt) {
        return promptService.saveAndQueuePrompt(prompt);
    }
}