package com.sajjanmatrimony;

import com.sajjanmatrimony.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableMongoAuditing
public class SajjanMatrimonyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SajjanMatrimonyApplication.class, args);
    }
}
