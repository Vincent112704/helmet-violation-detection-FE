# API Specification - FastAPI Backend Integration

## Overview
This document specifies the API endpoints required by the TrafficShield frontend. The backend should be built with FastAPI and provide these endpoints for full application functionality.

## Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://api.yourdomain.com`

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <token>
```

Token should be returned by `/auth/login` endpoint.

---

## Endpoints

### 1. Authentication Endpoints

#### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "demo@traffic.gov.ph",
  "password": "demo123"
}

Response (200):
{
  "id": "user-123",
  "email": "demo@traffic.gov.ph",
  "name": "Officer Garcia",
  "role": "officer",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Error (401):
{
  "error": "Invalid credentials"
}
```

#### Signup
```
POST /auth/signup
Content-Type: application/json

Request:
{
  "email": "newuser@traffic.gov.ph",
  "password": "secure123",
  "name": "Officer Santos"
}

Response (201):
{
  "id": "user-456",
  "email": "newuser@traffic.gov.ph",
  "name": "Officer Santos",
  "role": "officer",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Error (400):
{
  "error": "Email already registered"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response (200):
{
  "message": "Successfully logged out"
}
```

#### Verify Token
```
GET /auth/verify
Authorization: Bearer <token>

Response (200):
{
  "valid": true,
  "user_id": "user-123"
}

Response (401):
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

---

### 2. Violations Endpoints

#### List Violations
```
GET /violations
Authorization: Bearer <token>

Query Parameters:
- status: "verified" | "pending_review" | "ticket_issued" | "appealed"
- search: string (plate number, location, officer name)
- sort_by: "timestamp" | "status" | "plate_number"
- sort_order: "asc" | "desc"
- limit: number (default: 10)
- offset: number (default: 0)

Response (200):
{
  "violations": [
    {
      "id": "VIO-2024-001",
      "plateNumber": "ABC-1234",
      "timestamp": "2024-01-15T14:23:45Z",
      "location": "EDSA cor. Makati Ave",
      "status": "verified",
      "videoUrl": "/videos/violation-001.mp4",
      "boundingBoxVerified": true,
      "officerName": "Officer Garcia"
    }
  ],
  "total": 148,
  "limit": 10,
  "offset": 0
}
```

#### Get Single Violation
```
GET /violations/{id}
Authorization: Bearer <token>

Response (200):
{
  "id": "VIO-2024-001",
  "plateNumber": "ABC-1234",
  "timestamp": "2024-01-15T14:23:45Z",
  "location": "EDSA cor. Makati Ave",
  "status": "verified",
  "videoUrl": "/videos/violation-001.mp4",
  "boundingBoxData": {
    "riders": [
      {
        "x": 100,
        "y": 50,
        "width": 80,
        "height": 120,
        "helmet": false,
        "confidence": 0.95
      }
    ],
    "vehicle": {
      "x": 50,
      "y": 100,
      "width": 200,
      "height": 150
    }
  },
  "boundingBoxVerified": true,
  "officerName": "Officer Garcia",
  "detectedViolators": 1
}
```

#### Update Violation Status
```
PATCH /violations/{id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "status": "ticket_issued",
  "notes": "Officer verified violation and issued ticket"
}

Response (200):
{
  "id": "VIO-2024-001",
  "status": "ticket_issued",
  "updatedAt": "2024-01-15T15:30:00Z",
  "updatedBy": "officer-123"
}
```

#### Create Ticket from Violation
```
POST /violations/{id}/create-ticket
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "fineAmount": 500,
  "notes": "No helmet violation detected"
}

Response (201):
{
  "ticketId": "TICKET-2024-001",
  "violationId": "VIO-2024-001",
  "plateNumber": "ABC-1234",
  "fineAmount": 500,
  "status": "issued",
  "createdAt": "2024-01-15T15:30:00Z"
}
```

---

### 3. Video Upload Endpoints

#### Upload Video for Analysis
```
POST /videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request:
- video: File (multipart upload, max 500MB)
- location: string (required, e.g., "EDSA, Makati" or "BGC, Taguig")
- description: string (optional)

Response (202):
{
  "uploadId": "upload-789",
  "status": "processing",
  "fileName": "violation_video_123.mp4",
  "fileSize": 45000000,
  "location": "EDSA, Makati",
  "processingUrl": "/videos/processing/upload-789"
}
```

#### Get Upload Status
```
GET /videos/processing/{uploadId}
Authorization: Bearer <token>

Response (200):
{
  "uploadId": "upload-789",
  "status": "processing" | "completed" | "failed",
  "progress": 75,
  "location": "EDSA, Makati",
  "violations": [
    {
      "id": "VIO-2024-002",
      "timestamp": "00:15:30",
      "riderCount": 2,
      "helmetlessCount": 1,
      "confidence": 0.92,
      "location": "EDSA, Makati"
    }
  ],
  "error": null
}
```

#### Cancel Upload Processing
```
DELETE /videos/processing/{uploadId}
Authorization: Bearer <token>

Response (200):
{
  "message": "Upload processing cancelled"
}
```

#### Get Processed Video with Bounding Boxes
```
GET /videos/{videoId}/preview
Authorization: Bearer <token>

Query Parameters:
- format: "webm" | "mp4" (default: mp4)
- include_bboxes: boolean (default: true)

Response (200):
Binary video file with:
- Bounding boxes around riders
- Red boxes for no helmet violations
- Green boxes for helmeted riders
- Timestamp overlays
```

---

### 4. Analytics Endpoints

#### Get Dashboard Statistics
```
GET /analytics/dashboard
Authorization: Bearer <token>

Query Parameters:
- start_date: ISO 8601 date
- end_date: ISO 8601 date
- location_filter: string (optional)

Response (200):
{
  "totalViolations": 148,
  "todayViolations": 10,
  "ticketsIssued": 89,
  "pendingReview": 35,
  "appealedCases": 5,
  "resolutionRate": 0.78,
  "averageResolutionTime": 2.5
}
```

#### Get Violations Trend
```
GET /analytics/violations-trend
Authorization: Bearer <token>

Query Parameters:
- days: number (default: 7)

Response (200):
{
  "data": [
    {
      "date": "2024-01-10",
      "violations": 8,
      "resolved": 5
    },
    {
      "date": "2024-01-11",
      "violations": 12,
      "resolved": 8
    }
  ]
}
```

#### Get Violations by Location
```
GET /analytics/violations-by-location
Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "location": "EDSA",
      "violations": 28
    },
    {
      "location": "Commonwealth Ave",
      "violations": 22
    }
  ]
}
```

#### Get Violation Status Distribution
```
GET /analytics/violation-status
Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "status": "Verified",
      "count": 64
    },
    {
      "status": "Pending Review",
      "count": 35
    },
    {
      "status": "Ticket Issued",
      "count": 42
    },
    {
      "status": "Appealed",
      "count": 7
    }
  ]
}
```

---

### 5. User Profile Endpoints

#### Get Current User Profile
```
GET /user/profile
Authorization: Bearer <token>

Response (200):
{
  "id": "user-123",
  "email": "demo@traffic.gov.ph",
  "name": "Officer Garcia",
  "role": "officer",
  "assignedArea": "EDSA Corridor",
  "joinDate": "2023-06-15",
  "totalViolationsProcessed": 234,
  "ticketsIssued": 189
}
```

#### Update User Profile
```
PATCH /user/profile
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "Officer Garcia Updated",
  "assignedArea": "BGC Area"
}

Response (200):
{
  "id": "user-123",
  "name": "Officer Garcia Updated",
  "assignedArea": "BGC Area"
}
```

#### Change Password
```
POST /user/change-password
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "currentPassword": "demo123",
  "newPassword": "newsecure456"
}

Response (200):
{
  "message": "Password updated successfully"
}

Error (401):
{
  "error": "Current password is incorrect"
}
```

---

### 6. Search Endpoints

#### Full Text Search
```
GET /search
Authorization: Bearer <token>

Query Parameters:
- q: string (search query)
- type: "violations" | "videos" | "tickets" | "all"

Response (200):
{
  "violations": [
    {
      "id": "VIO-2024-001",
      "plateNumber": "ABC-1234",
      "highlightedFields": ["plateNumber"]
    }
  ],
  "videos": [],
  "tickets": []
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T14:23:45Z"
}
```

### Common Error Codes
- `INVALID_CREDENTIALS` - 401 Unauthorized
- `TOKEN_EXPIRED` - 401 Unauthorized
- `PERMISSION_DENIED` - 403 Forbidden
- `NOT_FOUND` - 404 Not Found
- `VALIDATION_ERROR` - 400 Bad Request
- `INTERNAL_ERROR` - 500 Server Error
- `FILE_TOO_LARGE` - 413 Payload Too Large
- `UNSUPPORTED_FILE_TYPE` - 415 Unsupported Media Type

---

## Rate Limiting

All endpoints should implement rate limiting:
- Anonymous: 10 requests/minute
- Authenticated: 100 requests/minute
- Admin: 1000 requests/minute

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705334625
```

---

## CORS Headers

Required for frontend integration:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

---

## Data Types

### Violation Object
```typescript
{
  id: string;
  plateNumber: string;
  timestamp: ISO8601DateTime;
  location: string;
  status: "verified" | "pending_review" | "ticket_issued" | "appealed";
  videoUrl: string;
  boundingBoxVerified: boolean;
  officerName: string;
  detectedViolators?: number;
}
```

### User Object
```typescript
{
  id: string;
  email: string;
  name: string;
  role: "officer" | "supervisor" | "admin";
  joinDate?: ISO8601DateTime;
}
```

### Ticket Object
```typescript
{
  id: string;
  violationId: string;
  plateNumber: string;
  fineAmount: number;
  status: "issued" | "paid" | "appealed";
  createdAt: ISO8601DateTime;
}
```

---

## Authentication Flow

1. User logs in with credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer <token>`
5. Backend validates token on each request
6. If token expired, frontend gets 401 and redirects to login

---

## Example Implementation (FastAPI)

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from datetime import datetime, timedelta

app = FastAPI()
security = HTTPBearer()

@app.post("/auth/login")
async def login(credentials: LoginRequest):
    # Validate email and password
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT token
    token = create_access_token(
        data={"user_id": str(user["_id"])},
        expires_delta=timedelta(hours=24)
    )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "token": token
    }

@app.get("/violations")
async def get_violations(
    credentials: HTTPAuthCredentials = Depends(security),
    status: str = None,
    search: str = None
):
    # Validate token
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    
    # Build query
    query = {}
    if status:
        query["status"] = status
    if search:
        query["$text"] = {"$search": search}
    
    # Fetch violations
    violations = await db.violations.find(query).to_list(10)
    return {"violations": violations, "total": len(violations)}
```

---

## Testing

### Postman Collection
Import this environment:
```json
{
  "name": "TrafficShield API",
  "variables": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@traffic.gov.ph","password":"demo123"}'

# Get violations
curl -X GET "http://localhost:8000/violations?status=pending_review" \
  -H "Authorization: Bearer <token>"
```

---

**Last Updated:** January 2024
**API Version:** 1.0
**Status:** Ready for Implementation
