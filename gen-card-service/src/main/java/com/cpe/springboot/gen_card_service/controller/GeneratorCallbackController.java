package com.cpe.springboot.gen_card_service.controller;

import com.cpe.springboot.gen_card_service.model.CardRequestEntity;
import com.cpe.springboot.gen_card_service.model.RequestStatus;
import com.cpe.springboot.gen_card_service.repository.CardRequestRepository;
import com.cpe.springboot.gen_card_service.service.CardBuilderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gen-card")
public class GeneratorCallbackController {

    private final CardRequestRepository repository;
    private final CardBuilderService builderService;

    public GeneratorCallbackController(CardRequestRepository repository, CardBuilderService builderService) {
        this.repository = repository;
        this.builderService = builderService;
    }

    @PostMapping("/image-generated")
    public void imageGenerated(@RequestBody ImageResponse response) {
        System.out.println("🖼️ Image générée reçue : " + response.imageUrl);
        var entity = repository.findById(String.valueOf(response.id)).orElseThrow();
        entity.setGeneratedImageUrl(response.imageUrl);
        if (entity.getStatus() == RequestStatus.TEXT_RECEIVED)
            entity.setStatus(RequestStatus.READY_TO_BUILD);
        else
            entity.setStatus(RequestStatus.IMAGE_RECEIVED);

        repository.save(entity);
        builderService.tryAssembleIfReady(entity);
    }

    @PostMapping("/text-generated")
    public void textGenerated(@RequestBody TextResponse response) {
        System.out.println("📜 Texte généré reçu : " + response.description);
        var entity = repository.findById(String.valueOf(response.id)).orElseThrow();
        entity.setGeneratedText(response.description);
        if (entity.getStatus() == RequestStatus.IMAGE_RECEIVED)
            entity.setStatus(RequestStatus.READY_TO_BUILD);
        else
            entity.setStatus(RequestStatus.TEXT_RECEIVED);

        repository.save(entity);
        builderService.tryAssembleIfReady(entity);
    }

    record ImageResponse(Long id, String imageUrl) {}
    record TextResponse(Long id, String description) {}
}
