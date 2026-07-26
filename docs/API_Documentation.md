# Rivyuu-Connect API Documentation

> Base URL: `http://localhost:8080/api`  
> Authentication: Bearer JWT token in `Authorization` header

---

## Authentication

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Arjun Mehta",
  "email": "arjun@example.com",
  "password": "securepassword123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Arjun Mehta",
    "email": "arjun@example.com",
    "trustScore": 50.0,
    "level": "Bronze",
    "badges": ["early-adopter"]
  }
}
```

---

### POST `/auth/login`
Login with email/password.

**Request Body:**
```json
{
  "email": "arjun@example.com",
  "password": "securepassword123"
}
```

**Response 200:** Same as register response.

---

### GET `/auth/me`
Get currently authenticated user. Requires `Authorization: Bearer <token>`.

---

## Reviews

### GET `/reviews`
Get paginated reviews with optional filters.

**Query Params:**
| Param | Type | Default | Description |
|---|---|---|---|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| businessId | string | - | Filter by business |
| userId | string | - | Filter by user |
| sort | string | recent | `recent`, `helpful`, `rating-high`, `rating-low` |

**Response 200:**
```json
{
  "content": [
    {
      "id": "review-uuid",
      "userId": "user-uuid",
      "businessId": "biz-uuid",
      "rating": 4,
      "title": "Great experience!",
      "content": "Detailed review text...",
      "aiSentiment": "positive",
      "aiScore": 85,
      "aiLabel": "Highly Positive & Authentic",
      "helpful": 24,
      "verified": true,
      "tags": ["delivery", "quality"],
      "createdAt": "2025-07-20T14:32:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 10
}
```

---

### POST `/reviews`
Create a new review. **Requires authentication.**

**Request Body:**
```json
{
  "businessId": "business-uuid",
  "rating": 5,
  "title": "Amazing service!",
  "content": "Detailed description of the experience...",
  "tags": ["delivery", "quality", "app"]
}
```

**Validation:** content min 20 chars, max 1000 chars; rating 1-5; title max 100 chars.

---

### POST `/reviews/{id}/vote`
Vote on a review. **Requires authentication.**

**Query Params:** `?type=helpful` or `?type=notHelpful`

---

### POST `/reviews/{id}/respond`
Business response to a review. **Requires BUSINESS role.**

**Query Params:** `?text=Thank you for your feedback!`

---

## Users

### GET `/users/leaderboard`
Get top users by various metrics.

**Query Params:** `?metric=trustScore&page=0&size=10`

---

### GET `/users/{id}`
Get user profile by ID.

### GET `/users/username/{username}`
Get user profile by username.

### POST `/users/{id}/follow`
Follow a user. **Requires authentication.**

---

## Businesses

### GET `/businesses`
List all businesses.

### GET `/businesses/{id}`
Get business details.

### GET `/businesses/{id}/analytics`
Get business analytics dashboard data. **Requires BUSINESS role.**

---

## Error Responses

```json
{
  "error": "Unauthorized",
  "message": "JWT token is expired or invalid",
  "status": 401,
  "timestamp": "2025-07-26T08:00:00Z"
}
```

| Status | Meaning |
|---|---|
| 400 | Bad Request — validation failed |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found |
| 409 | Conflict — email already registered |
| 500 | Internal Server Error |
