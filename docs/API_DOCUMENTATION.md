# Dabba Nation API Documentation

**Version:** 1.0.0  
**Base URL:** `https://your-domain.com/api`  
**Last Updated:** December 28, 2025

---

## Table of Contents

1. [Authentication](#authentication)
2. [Order Management APIs](#order-management-apis)
3. [Payment APIs](#payment-apis)
4. [Admin APIs](#admin-apis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Webhooks](#webhooks)

---

## Authentication

### JWT Token Authentication

Admin routes require JWT token authentication via the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Token Expiration:** Configurable via `JWT_EXPIRES_IN` (default: 7 days)

---

## Order Management APIs

### 1. Create Order

Creates a new tiffin order in the system.

**Endpoint:** `POST /api/orders/create`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "planKey": "weekly",
  "plan": {
    "title": "Weekly Tiffin",
    "price": 455,
    "duration": "7 Days"
  },
  "customer": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main Street, Nehru Place",
    "pincode": "110019"
  }
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "orderId": "DN-1703765432123",
  "message": "Order created successfully"
}
```

**Validations:**

- Phone: 10 digits, starts with 6-9
- Pincode: 6 digits
- Spam prevention: Max 3 orders per 5 minutes per phone number

**Error Responses:**

- `400` - Invalid package, validation errors
- `429` - Rate limit exceeded or spam detected
- `500` - Server error

---

### 2. Get Order by ID

Retrieves order details by order ID.

**Endpoint:** `GET /api/orders/:orderId`

**Parameters:**

- `orderId` (path) - Order ID (e.g., DN-1703765432123)

**Response:** `200 OK`

```json
{
  "success": true,
  "order": {
    "orderId": "DN-1703765432123",
    "customer": {
      "name": "John Doe",
      "phone": "9876543210",
      "address": "123 Main Street, Nehru Place",
      "pincode": "110019"
    },
    "package": "weekly",
    "totalAmount": 455,
    "paymentStatus": "paid",
    "meals": {
      "breakfast": { "delivered": false },
      "lunch": { "delivered": true, "deliveredAt": "2025-12-28T12:30:00Z" },
      "dinner": { "delivered": false }
    },
    "createdAt": "2025-12-28T10:00:00Z"
  }
}
```

**Error Responses:**

- `404` - Order not found
- `500` - Server error

---

### 3. List Orders

Retrieves list of orders (public endpoint with limited data).

**Endpoint:** `GET /api/orders/list`

**Response:** `200 OK`

```json
{
  "success": true,
  "orders": [
    {
      "orderId": "DN-1703765432123",
      "package": "weekly",
      "createdAt": "2025-12-28T10:00:00Z"
    }
  ]
}
```

---

## Payment APIs

### 1. Create Razorpay Order

Creates a Razorpay payment order for an existing order.

**Endpoint:** `POST /api/payments/create-order`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "orderId": "DN-1703765432123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "razorpayOrderId": "order_NXj3kl2m3n4o5p",
  "amount": 45500,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

**Error Responses:**

- `400` - Order ID missing
- `404` - Order not found
- `409` - Order already paid
- `500` - Razorpay API error

---

### 2. Verify Payment

Verifies Razorpay payment signature after successful payment.

**Endpoint:** `POST /api/payments/verify`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "razorpay_payment_id": "pay_NXj3kl2m3n4o5p",
  "razorpay_order_id": "order_NXj3kl2m3n4o5p",
  "razorpay_signature": "9c8d7e6f5a4b3c2d1e0f...",
  "orderId": "DN-1703765432123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "verified": true
}
```

**Security:**

- HMAC SHA256 signature verification
- Payment status updated only on successful verification
- Prevents double payment

**Error Responses:**

- `400` - Missing or invalid payment details
- `401` - Invalid signature
- `404` - Order not found
- `409` - Order already paid
- `500` - Server error

---

### 3. Payment Webhook

Handles Razorpay webhook events for payment status updates.

**Endpoint:** `POST /api/payments/webhook`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-razorpay-signature": "webhook_signature_here"
}
```

**Events Handled:**

- `payment.captured` - Payment successful
- `payment.failed` - Payment failed

**Security:**

- Webhook signature verification
- HMAC SHA256 validation

**Response:** `200 OK`

```json
{
  "success": true
}
```

---

## Admin APIs

### 1. Admin Login

Authenticates admin user and returns JWT token.

**Endpoint:** `POST /api/admin/login`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "username": "admin",
  "password": "secure_password"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Security:**

- Rate limiting: 5 attempts per minute
- JWT token with configurable expiration
- Credentials validated against environment variables

**Error Responses:**

- `400` - Invalid credentials format
- `401` - Invalid username/password
- `429` - Too many login attempts
- `500` - Server configuration error

---

### 2. Get All Orders (Admin)

Retrieves all active paid orders with pagination.

**Endpoint:** `GET /api/admin/orders`

**Authentication:** Required (JWT)

**Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Query Parameters:**

- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response:** `200 OK`

```json
{
  "success": true,
  "orders": [
    {
      "orderId": "DN-1703765432123",
      "customer": {
        "name": "John Doe",
        "phone": "9876543210",
        "address": "123 Main Street",
        "pincode": "110019"
      },
      "package": "weekly",
      "paymentStatus": "paid",
      "totalAmount": 455,
      "meals": {
        "breakfast": { "delivered": false },
        "lunch": { "delivered": true, "deliveredAt": "2025-12-28T12:30:00Z" },
        "dinner": { "delivered": false }
      },
      "createdAt": "2025-12-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Performance Optimizations:**

- `.lean()` for faster queries
- `.select()` for reduced payload
- Automatic meal reset for multi-day packages
- Batch updates for efficiency

**Error Responses:**

- `401` - Unauthorized (invalid/expired token)
- `429` - Rate limit exceeded
- `500` - Server error

---

### 3. Mark Meal as Delivered

Updates meal delivery status for an order.

**Endpoint:** `PATCH /api/admin/orders/mark-meal`

**Authentication:** Required (JWT)

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "orderId": "DN-1703765432123",
  "meal": "lunch"
}
```

**Valid Meal Types:** `breakfast`, `lunch`, `dinner`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "lunch marked as delivered",
  "order": {
    "orderId": "DN-1703765432123",
    "meals": {
      "breakfast": { "delivered": false },
      "lunch": { "delivered": true, "deliveredAt": "2025-12-28T12:30:00Z" },
      "dinner": { "delivered": false }
    }
  }
}
```

**Business Logic:**

- Daily packages auto-close after dinner delivery
- Prevents duplicate meal marking
- Payment verification required
- Audit logging enabled

**Error Responses:**

- `400` - Invalid meal type or already delivered
- `401` - Unauthorized
- `403` - Payment not confirmed
- `404` - Order not found
- `500` - Server error

---

### 4. Update Order Status (Deprecated)

**Endpoint:** `PATCH /api/admin/orders/update-status`

**Status:** `410 Gone`

This endpoint has been removed. Use individual meal marking instead.

---

### 5. Process Lifecycle (Deprecated)

**Endpoint:** `POST /api/admin/automation/process-lifecycle`

**Status:** `410 Gone`

Lifecycle automation has been removed from the system.

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code  | Description                                              |
| ----- | -------------------------------------------------------- |
| `200` | Success                                                  |
| `201` | Created                                                  |
| `400` | Bad Request - Invalid input                              |
| `401` | Unauthorized - Invalid/missing authentication            |
| `403` | Forbidden - Payment required or insufficient permissions |
| `404` | Not Found - Resource doesn't exist                       |
| `409` | Conflict - Duplicate action (e.g., already paid)         |
| `410` | Gone - Endpoint deprecated                               |
| `429` | Too Many Requests - Rate limit exceeded                  |
| `500` | Internal Server Error                                    |

---

## Rate Limiting

### Global Rate Limits

| Endpoint             | Limit       | Window   |
| -------------------- | ----------- | -------- |
| Order Creation       | 10 requests | 1 minute |
| Payment Verification | 10 requests | 1 minute |
| Admin Login          | 5 attempts  | 1 minute |
| Admin Orders List    | 60 requests | 1 minute |
| Mark Meal            | 30 requests | 1 minute |

### Rate Limit Headers

Currently not exposed in headers. Rate limits are enforced server-side.

### Rate Limit Response

```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

**HTTP Status:** `429 Too Many Requests`

---

## Webhooks

### Razorpay Payment Webhook

**Endpoint:** `POST /api/payments/webhook`

**Event Types:**

#### 1. payment.captured

Triggered when payment is successfully captured.

**Payload:**

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_NXj3kl2m3n4o5p",
        "order_id": "order_NXj3kl2m3n4o5p",
        "amount": 45500,
        "status": "captured"
      }
    }
  }
}
```

**Action:** Updates order to `paid` status and activates it.

#### 2. payment.failed

Triggered when payment fails.

**Payload:**

```json
{
  "event": "payment.failed",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_NXj3kl2m3n4o5p",
        "order_id": "order_NXj3kl2m3n4o5p",
        "status": "failed",
        "error_code": "BAD_REQUEST_ERROR"
      }
    }
  }
}
```

**Action:** Updates order to `failed` status.

### Webhook Security

- HMAC SHA256 signature verification
- Secret stored in `RAZORPAY_WEBHOOK_SECRET`
- Signature passed in `x-razorpay-signature` header

---

## Data Models

### Order Schema

```typescript
{
  orderId: string;           // Unique order ID (DN-timestamp)
  customer: {
    name: string;
    phone: string;           // 10 digits, starts with 6-9
    address: string;
    pincode: string;         // 6 digits
  };
  package: "daily" | "weekly" | "monthly";
  totalAmount: number;       // In rupees
  paymentStatus: "pending" | "paid" | "failed";
  active: boolean;           // Order active status
  meals: {
    breakfast: {
      delivered: boolean;
      deliveredAt?: Date;
    };
    lunch: {
      delivered: boolean;
      deliveredAt?: Date;
    };
    dinner: {
      delivered: boolean;
      deliveredAt?: Date;
    };
  };
  razorpay: {
    orderId?: string;
    paymentId?: string;
  };
  createdAt: Date;
  paidAt?: Date;
  lastMealReset?: Date;      // For multi-day packages
}
```

---

## Environment Variables

### Required Configuration

```env
# Database
MONGODB_URI=mongodb://...

# Admin Credentials
ADMIN_USERNAME=admin_username
ADMIN_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# Public Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Best Practices

### 1. Performance

- All read queries use `.lean()` for better performance
- Field selection with `.select()` to reduce payload size
- Pagination enabled on list endpoints
- Batch operations for bulk updates

### 2. Security

- JWT authentication for admin routes
- Rate limiting on all endpoints
- Input validation and sanitization
- HMAC signature verification for webhooks
- Environment variable protection

### 3. Data Integrity

- Payment verification before order activation
- Double delivery prevention
- Spam order detection
- Atomic updates with optimistic concurrency

### 4. Monitoring

- Comprehensive error logging
- Audit logs for admin actions
- Payment status tracking
- Failed payment notifications

---

## Support

For API support or questions:

- **WhatsApp:** Set via `NEXT_PUBLIC_WHATSAPP_NUMBER`
- **Email:** support@dabbanation.com

---

## Changelog

### Version 1.0.0 (December 28, 2025)

- Initial API documentation
- JWT authentication implementation
- Payment gateway integration
- Admin dashboard APIs
- Performance optimizations (lean, select, pagination)
- Rate limiting implementation
- Webhook security enhancements

---

**© 2025 Dabba Nation. All rights reserved.**
