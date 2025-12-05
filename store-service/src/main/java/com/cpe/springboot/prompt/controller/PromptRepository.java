package com.cpe.springboot.prompt.controller;

import com.cpe.springboot.prompt.model.PromptModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromptRepository extends JpaRepository<PromptModel, Integer> {}