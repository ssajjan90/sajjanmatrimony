# Sajjan Matrimony - Architecture Overview

## System Diagram

```
+----------------------------------------------------------+
|                     CLIENT LAYER                         |
|   +-------------------+    +----------------------+     |
|   |  React Native     |    |  React Admin Panel   |     |
|   |  (Expo) Mobile    |    |  (Vite Web App)      |     |
|   +--------+----------+    +-----------+----------+     |
+------------+----------------------------+---------------+
             |  HTTPS / REST JSON         |
             v                           v
+----------------------------------------------------------+
|                   API GATEWAY LAYER                      |
|          Spring Boot 3.x  (port 8080)                    |
|  +----------+  +----------+  +----------+               |
|  |  Auth    |  | Profile  |  |  Admin   |  ...          |
|  |Controller|  |Controller|  |Controller|               |
|  +----+-----+  +----+-----+  +----+-----+               |
|       |             |             |                      |
|  +----v-------------v-------------v------+              |
|  |            Service Layer              |              |
|  +--------------------+------------------+              |
|  +--------------------v------------------+              |
|  |          Repository Layer             |              |
|  +--------------------+------------------+              |
+---------------------------+------------------------------+
                            |  Spring Data MongoDB
                            v
+----------------------------------------------------------+
|                      DATA LAYER                          |
|                MongoDB (port 27017)                      |
|  Collections:                                            |
|    users  profiles  interests  shortlists                |
|    admin_approvals  reports  subscriptions               |
+----------------------------------------------------------+
```

## Hybrid Data Model

```
Profile Document (MongoDB)
+------------------------------------------+
|  Indexed / Searchable Fields             |
|  gender        : String  @Indexed        |
|  age           : Integer @Indexed        |
|  city          : String  @Indexed        |
|  education     : String  @Indexed        |
|  occupation    : String  @Indexed        |
|  maritalStatus : String  @Indexed        |
|  caste         : String  @Indexed        |
|  height        : String                  |
|  ----------------------------------------|
|  additionalDetails: Map<String, Object>  |
|    gotra, diet, hobbies, familyType,    |
|    fatherOccupation, horoscope, etc.    |
+------------------------------------------+
```

## Security

- JWT HS256 access tokens (24h TTL)
- JWT refresh tokens (7d TTL)
- Role-based access: ROLE_USER, ROLE_ADMIN
- Passwords: BCrypt (strength 12)

## MongoDB Indexes

| Collection      | Key Indexes                                                                        |
|-----------------|------------------------------------------------------------------------------------|
| users           | email (unique), mobile (unique)                                                    |
| profiles        | userId, gender, age, city, education, occupation, maritalStatus, caste, isApproved |
| interests       | senderId + receiverId (compound unique)                                            |
| shortlists      | userId + profileId (compound unique)                                               |
| admin_approvals | profileId, status                                                                  |
