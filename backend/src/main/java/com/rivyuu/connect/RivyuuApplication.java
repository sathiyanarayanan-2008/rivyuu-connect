package com.rivyuu.connect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class RivyuuApplication {
    public static void main(String[] args) {
        SpringApplication.run(RivyuuApplication.class, args);
    }
}
