package com.cpe.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.EnableJms;

@EnableJms
@SpringBootApplication
public class GenImgServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GenImgServiceApplication.class, args);
	}

}
