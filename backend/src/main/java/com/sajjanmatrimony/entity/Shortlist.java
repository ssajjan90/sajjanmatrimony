package com.sajjanmatrimony.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "shortlists")
@CompoundIndexes({
    @CompoundIndex(name = "user_profile_idx",
            def = "{'userId': 1, 'profileId': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shortlist {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String profileId;

    @CreatedDate
    private Instant createdAt;
}
