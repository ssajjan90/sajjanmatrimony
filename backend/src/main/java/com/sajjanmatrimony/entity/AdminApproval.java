package com.sajjanmatrimony.entity;

import com.sajjanmatrimony.entity.enums.ApprovalStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "admin_approvals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminApproval {

    @Id
    private String id;

    @Indexed
    private String profileId;

    private String adminId;

    @Indexed
    @Builder.Default
    private ApprovalStatus status = ApprovalStatus.PENDING;

    private String remarks;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
