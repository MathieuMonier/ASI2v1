package com.cpe.springboot.gen_card_service.repository;

import com.cpe.springboot.gen_card_service.model.CardRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRequestRepository extends JpaRepository<CardRequestEntity, String> {
}
