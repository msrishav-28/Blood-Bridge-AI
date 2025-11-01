# BloodBridge Implementation Guide

## Project Status: Frontend Complete, Backend & Optimization Pending

This document provides a comprehensive roadmap for completing the BloodBridge platform by implementing backend API integration and performance optimization.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Backend API Integration](#backend-api-integration)
3. [Performance Optimization](#performance-optimization)
4. [Security Implementation](#security-implementation)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Plan](#deployment-plan)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Current State Analysis

### ✅ Completed (Frontend)

- **UI/UX**: Complete with 12 sections, 5 modals, responsive design
- **Service Architecture**: 11 modular service files with clean separation
- **Features**: 32+ features implemented (mock data)
- **PWA**: Service worker, manifest, offline support
- **Documentation**: README.md, FEATURES.md, INTEGRATION.md
- **Version Control**: Repository pushed to GitHub

### ❌ Pending (Backend & Optimization)

- Backend API development and integration
- Database schema and implementation
- Authentication & authorization system
- Real-time communication (WebSocket/Socket.io)
- External API integrations
- Performance optimization & bundling
- Production deployment
- Monitoring and analytics

---

## Backend API Integration

### Phase 1: Backend Setup (Week 1-2)

#### 1.1 Technology Stack Selection

**Recommended Stack:**
```
Backend Framework: Node.js + Express.js OR Python + FastAPI
Database: PostgreSQL (primary) + Redis (caching)
ORM: Sequelize (Node.js) OR SQLAlchemy (Python)
Real-time: Socket.io OR WebSocket
Authentication: JWT + OAuth2
API Documentation: Swagger/OpenAPI
```

**Alternative Stacks:**
- Java Spring Boot + MySQL
- Django + PostgreSQL
- .NET Core + SQL Server

#### 1.2 Database Schema Design

**Core Tables:**

```sql
-- Users & Authentication
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'donor', 'patient', 'admin', 'blood_bank'
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors
CREATE TABLE donors (
    donor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    full_name VARCHAR(255) NOT NULL,
    blood_type VARCHAR(5) NOT NULL, -- 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    emergency_contact VARCHAR(20),
    medical_conditions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    full_name VARCHAR(255) NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    disease_type VARCHAR(100) DEFAULT 'Thalassemia',
    diagnosis_date DATE,
    hemoglobin_level DECIMAL(4, 2),
    ferritin_level DECIMAL(7, 2),
    next_transfusion_date DATE,
    transfusion_frequency INTEGER, -- days
    hospital_id UUID,
    doctor_name VARCHAR(255),
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Banks
CREATE TABLE blood_banks (
    blood_bank_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    operating_hours JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Inventory
CREATE TABLE blood_inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_bank_id UUID REFERENCES blood_banks(blood_bank_id),
    blood_type VARCHAR(5) NOT NULL,
    units_available INTEGER NOT NULL DEFAULT 0,
    units_reserved INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    minimum_threshold INTEGER DEFAULT 10,
    UNIQUE(blood_bank_id, blood_type)
);

-- Emergency Requests
CREATE TABLE emergency_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    blood_type VARCHAR(5) NOT NULL,
    units_needed INTEGER NOT NULL,
    urgency_level VARCHAR(20) DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM'
    hospital_name VARCHAR(255),
    hospital_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP,
    notes TEXT
);

-- Donations
CREATE TABLE donations (
    donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES donors(donor_id),
    blood_bank_id UUID REFERENCES blood_banks(blood_bank_id),
    request_id UUID REFERENCES emergency_requests(request_id),
    donation_date DATE NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    units_donated INTEGER DEFAULT 1,
    hemoglobin_level DECIMAL(4, 2),
    blood_pressure VARCHAR(20),
    status VARCHAR(50) DEFAULT 'COMPLETED', -- 'SCHEDULED', 'COMPLETED', 'REJECTED'
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    appointment_type VARCHAR(50) NOT NULL, -- 'TRANSFUSION', 'CONSULTATION', 'SCREENING'
    scheduled_date TIMESTAMP NOT NULL,
    hospital_name VARCHAR(255),
    doctor_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification - Achievements
CREATE TABLE user_achievements (
    achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    tier VARCHAR(50), -- 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'LEGENDARY'
    points_awarded INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_type, tier)
);

-- Gamification - Points & Rewards
CREATE TABLE user_points (
    user_id UUID PRIMARY KEY REFERENCES users(user_id),
    total_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rewards (
    reward_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_type VARCHAR(50) NOT NULL, -- 'BADGE', 'VOUCHER', 'CERTIFICATE', 'MERCHANDISE'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    category VARCHAR(100),
    partner_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    stock_available INTEGER,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_rewards (
    user_reward_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    reward_id UUID REFERENCES rewards(reward_id),
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'DELIVERED', 'EXPIRED'
    redemption_code VARCHAR(100)
);

-- Learning Portal
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50), -- 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'
    duration_hours DECIMAL(4, 2),
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER
);

CREATE TABLE user_course_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),
    module_id UUID REFERENCES course_modules(module_id),
    status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, module_id)
);

-- Health Records
CREATE TABLE health_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    record_date DATE NOT NULL,
    hemoglobin DECIMAL(4, 2),
    ferritin DECIMAL(7, 2),
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    weight DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'EMERGENCY', 'APPOINTMENT', 'REMINDER', 'ACHIEVEMENT', 'GENERAL'
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Predictions (for caching)
CREATE TABLE ai_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_type VARCHAR(100) NOT NULL, -- 'SHORTAGE', 'DEMAND', 'OUTBREAK'
    blood_type VARCHAR(5),
    region VARCHAR(100),
    prediction_date DATE NOT NULL,
    confidence_score DECIMAL(5, 2),
    predicted_value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(50), -- 'SUCCESS', 'FAILURE'
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes for Performance:**
```sql
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_location ON donors(latitude, longitude);
CREATE INDEX idx_donors_available ON donors(is_available);
CREATE INDEX idx_patients_blood_type ON patients(blood_type);
CREATE INDEX idx_emergency_status ON emergency_requests(status, created_at);
CREATE INDEX idx_blood_inventory_type ON blood_inventory(blood_bank_id, blood_type);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_donations_date ON donations(donation_date);
```

#### 1.3 API Endpoint Design

**Base URL:** `https://api.bloodbridge.in/v1`

**Authentication Endpoints:**
```
POST   /auth/register              - Register new user
POST   /auth/login                 - Login and get JWT token
POST   /auth/logout                - Logout (invalidate token)
POST   /auth/refresh-token         - Refresh JWT token
POST   /auth/forgot-password       - Request password reset
POST   /auth/reset-password        - Reset password with token
POST   /auth/verify-email          - Verify email address
POST   /auth/resend-verification   - Resend verification email
```

**Donor Endpoints:**
```
GET    /donors                     - List all donors (with filters)
GET    /donors/:id                 - Get donor details
POST   /donors                     - Register new donor
PUT    /donors/:id                 - Update donor profile
DELETE /donors/:id                 - Delete donor account
GET    /donors/:id/donations       - Get donation history
PUT    /donors/:id/availability    - Update availability status
GET    /donors/nearby              - Find nearby donors (lat, lng, radius)
GET    /donors/stats/:id           - Get donor statistics
```

**Patient Endpoints:**
```
GET    /patients                   - List all patients (admin only)
GET    /patients/:id               - Get patient details
POST   /patients                   - Register new patient
PUT    /patients/:id               - Update patient profile
DELETE /patients/:id               - Delete patient account
GET    /patients/:id/appointments  - Get appointment history
GET    /patients/:id/health-records - Get health records
POST   /patients/:id/health-records - Add health record
```

**Emergency Request Endpoints:**
```
GET    /emergency-requests         - List emergency requests
GET    /emergency-requests/:id     - Get request details
POST   /emergency-requests         - Create emergency request
PUT    /emergency-requests/:id     - Update request status
DELETE /emergency-requests/:id     - Cancel request
POST   /emergency-requests/:id/notify - Notify nearby donors
GET    /emergency-requests/:id/responses - Get donor responses
```

**Blood Bank Endpoints:**
```
GET    /blood-banks                - List all blood banks
GET    /blood-banks/:id            - Get blood bank details
POST   /blood-banks                - Add new blood bank (admin)
PUT    /blood-banks/:id            - Update blood bank
GET    /blood-banks/:id/inventory  - Get inventory status
PUT    /blood-banks/:id/inventory  - Update inventory
GET    /blood-banks/nearby         - Find nearby blood banks
GET    /blood-banks/search         - Search by blood type availability
```

**Appointment Endpoints:**
```
GET    /appointments               - List appointments
GET    /appointments/:id           - Get appointment details
POST   /appointments               - Schedule appointment
PUT    /appointments/:id           - Update/reschedule appointment
DELETE /appointments/:id           - Cancel appointment
GET    /appointments/upcoming      - Get upcoming appointments
POST   /appointments/:id/reminder  - Send appointment reminder
```

**Gamification Endpoints:**
```
GET    /gamification/achievements      - List all achievements
GET    /gamification/achievements/:userId - Get user achievements
POST   /gamification/achievements      - Award achievement
GET    /gamification/leaderboard       - Get leaderboard (global/regional)
GET    /gamification/points/:userId    - Get user points
POST   /gamification/points            - Award points
GET    /gamification/rewards           - List available rewards
POST   /gamification/rewards/redeem    - Redeem reward
GET    /gamification/user-rewards/:userId - Get user's redeemed rewards
```

**Learning Portal Endpoints:**
```
GET    /courses                    - List all courses
GET    /courses/:id                - Get course details
GET    /courses/:id/modules        - Get course modules
POST   /courses/:id/enroll         - Enroll in course
GET    /courses/my-courses         - Get user's enrolled courses
PUT    /courses/:courseId/progress - Update course progress
POST   /courses/:courseId/complete - Mark course as completed
```

**AI/Analytics Endpoints:**
```
GET    /ai/predictions/shortage    - Get blood shortage predictions
GET    /ai/predictions/demand      - Get demand forecasts
POST   /ai/screening               - Perform AI health screening
GET    /ai/matching                - Get AI-powered donor matches
GET    /analytics/dashboard        - Get dashboard analytics
GET    /analytics/reports          - Generate custom reports
POST   /analytics/export           - Export analytics data
```

**Health Monitoring Endpoints:**
```
GET    /health/vitals/:userId      - Get health vitals
POST   /health/vitals              - Record health vitals
GET    /health/trends/:userId      - Get health trends
POST   /health/medications         - Add medication
GET    /health/medications/:userId - Get medication list
PUT    /health/medications/:id     - Update medication
```

**Notification Endpoints:**
```
GET    /notifications              - Get user notifications
PUT    /notifications/:id/read     - Mark notification as read
PUT    /notifications/read-all     - Mark all as read
DELETE /notifications/:id          - Delete notification
POST   /notifications/subscribe    - Subscribe to push notifications
```

**WhatsApp Integration Endpoints:**
```
POST   /whatsapp/send-alert        - Send WhatsApp alert
POST   /whatsapp/send-reminder     - Send appointment reminder
POST   /whatsapp/send-thank-you    - Send thank you message
GET    /whatsapp/templates         - Get message templates
```

**Search & Discovery:**
```
GET    /search                     - Global search
GET    /search/donors              - Search donors
GET    /search/blood-banks         - Search blood banks
GET    /search/hospitals           - Search hospitals
```

### Phase 2: API Implementation (Week 3-5)

#### 2.1 Setup Express.js Backend

**Project Structure:**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── env.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── Patient.js
│   │   ├── BloodBank.js
│   │   └── ... (other models)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── donorController.js
│   │   ├── patientController.js
│   │   └── ... (other controllers)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── donor.routes.js
│   │   ├── patient.routes.js
│   │   └── ... (other routes)
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   ├── whatsappService.js
│   │   ├── notificationService.js
│   │   ├── aiService.js
│   │   └── analyticsService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── sockets/
│   │   └── socketHandler.js
│   └── server.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
└── README.md
```

**Sample Implementation (server.js):**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const http = require('http');

// Import routes
const authRoutes = require('./routes/auth.routes');
const donorRoutes = require('./routes/donor.routes');
const patientRoutes = require('./routes/patient.routes');
const emergencyRoutes = require('./routes/emergency.routes');
// ... other routes

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth.middleware');

// Import config
const config = require('./config/env');
const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/donors', authenticate, donorRoutes);
app.use('/api/v1/patients', authenticate, patientRoutes);
app.use('/api/v1/emergency-requests', authenticate, emergencyRoutes);
// ... other routes

// Socket.io connection
require('./sockets/socketHandler')(io);

// Error handling
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    
    const PORT = config.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

#### 2.2 Environment Variables (.env)

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bloodbridge
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Email (SendGrid/SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@bloodbridge.in
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=BloodBridge <noreply@bloodbridge.in>

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Business API
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# AI/ML Services
OPENAI_API_KEY=your_openai_key
ML_SERVICE_URL=http://localhost:8001

# AWS (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=bloodbridge-assets

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
FCM_SERVER_KEY=your_fcm_server_key

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Payment Gateway (for rewards)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Phase 3: Frontend-Backend Integration (Week 6-7)

#### 3.1 Create API Client Service

**File: `src/js/services/api-client.js`**

```javascript
class APIClient {
    constructor() {
        this.baseURL = 'https://api.bloodbridge.in/v1'; // Change to your API URL
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Token expired, try to refresh
                await this.refreshToken();
                return this.request(endpoint, options);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.removeToken();
            window.location.href = '/login';
            return;
        }

        try {
            const data = await this.request('/auth/refresh-token', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            });
            this.setToken(data.token);
        } catch (error) {
            this.removeToken();
            window.location.href = '/login';
        }
    }
}

export default new APIClient();
```

#### 3.2 Update Service Files to Use Real APIs

**Example: Update `src/js/services/donors.js`**

Replace mock data with real API calls:

```javascript
import apiClient from './api-client.js';

export class DonorService {
    async getAllDonors(filters = {}) {
        try {
            const data = await apiClient.get('/donors', filters);
            return data.donors;
        } catch (error) {
            console.error('Error fetching donors:', error);
            throw error;
        }
    }

    async getDonorById(donorId) {
        try {
            const data = await apiClient.get(`/donors/${donorId}`);
            return data.donor;
        } catch (error) {
            console.error('Error fetching donor:', error);
            throw error;
        }
    }

    async registerDonor(donorData) {
        try {
            const data = await apiClient.post('/donors', donorData);
            return data.donor;
        } catch (error) {
            console.error('Error registering donor:', error);
            throw error;
        }
    }

    async updateDonor(donorId, updates) {
        try {
            const data = await apiClient.put(`/donors/${donorId}`, updates);
            return data.donor;
        } catch (error) {
            console.error('Error updating donor:', error);
            throw error;
        }
    }

    async updateAvailability(donorId, isAvailable) {
        try {
            const data = await apiClient.put(`/donors/${donorId}/availability`, {
                isAvailable
            });
            return data.donor;
        } catch (error) {
            console.error('Error updating availability:', error);
            throw error;
        }
    }

    async findNearbyDonors(latitude, longitude, radius = 10, bloodType = null) {
        try {
            const params = { latitude, longitude, radius };
            if (bloodType) params.bloodType = bloodType;
            
            const data = await apiClient.get('/donors/nearby', params);
            return data.donors;
        } catch (error) {
            console.error('Error finding nearby donors:', error);
            throw error;
        }
    }

    async getDonationHistory(donorId) {
        try {
            const data = await apiClient.get(`/donors/${donorId}/donations`);
            return data.donations;
        } catch (error) {
            console.error('Error fetching donation history:', error);
            throw error;
        }
    }

    async getDonorStats(donorId) {
        try {
            const data = await apiClient.get(`/donors/stats/${donorId}`);
            return data.stats;
        } catch (error) {
            console.error('Error fetching donor stats:', error);
            throw error;
        }
    }
}
```

#### 3.3 Implement WebSocket for Real-time Features

**File: `src/js/services/websocket-client.js`**

```javascript
import io from 'socket.io-client';

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        this.socket = io('wss://api.bloodbridge.in', {
            auth: { token },
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('emergency-alert', (data) => {
            this.emit('emergency-alert', data);
        });

        this.socket.on('inventory-update', (data) => {
            this.emit('inventory-update', data);
        });

        this.socket.on('notification', (data) => {
            this.emit('notification', data);
        });
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    send(event, data) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, data);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new WebSocketClient();
```

### Phase 4: External API Integrations (Week 8)

#### 4.1 Google Maps Integration

Update API key in `index-modern.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

#### 4.2 WhatsApp Business API Integration

Backend implementation (Node.js):
```javascript
const axios = require('axios');

class WhatsAppService {
    constructor() {
        this.apiUrl = 'https://graph.facebook.com/v17.0';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.accessToken = process.env.WHATSAPP_API_KEY;
    }

    async sendTemplateMessage(to, templateName, components) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: { code: 'en' },
                        components: components
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('WhatsApp API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendEmergencyAlert(donorPhone, patientName, bloodType, hospital) {
        return this.sendTemplateMessage(donorPhone, 'emergency_alert', [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: patientName },
                    { type: 'text', text: bloodType },
                    { type: 'text', text: hospital }
                ]
            }
        ]);
    }
}

module.exports = new WhatsAppService();
```

#### 4.3 Email Service (SendGrid/NodeMailer)

```javascript
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail({ to, subject, html, text }) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                html
            });
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    async sendWelcomeEmail(userEmail, userName) {
        const html = `
            <h1>Welcome to BloodBridge, ${userName}!</h1>
            <p>Thank you for joining our community...</p>
        `;
        return this.sendEmail({
            to: userEmail,
            subject: 'Welcome to BloodBridge',
            html
        });
    }

    async sendEmergencyAlert(donorEmail, alertDetails) {
        const html = `
            <h1>Emergency Blood Request</h1>
            <p>Blood Type: ${alertDetails.bloodType}</p>
            <p>Location: ${alertDetails.hospital}</p>
            <p>Urgency: ${alertDetails.urgency}</p>
        `;
        return this.sendEmail({
            to: donorEmail,
            subject: '🚨 Emergency Blood Request',
            html
        });
    }
}

module.exports = new EmailService();
```

#### 4.4 SMS Service (Twilio)

```javascript
const twilio = require('twilio');

class SMSService {
    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    }

    async sendSMS(to, message) {
        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: to
            });
            return result;
        } catch (error) {
            console.error('SMS sending failed:', error);
            throw error;
        }
    }

    async sendEmergencyAlert(donorPhone, bloodType, hospital) {
        const message = `URGENT: Blood donation needed! Type: ${bloodType}. Location: ${hospital}. Please respond if available.`;
        return this.sendSMS(donorPhone, message);
    }

    async sendAppointmentReminder(patientPhone, appointmentDate, hospital) {
        const message = `Reminder: You have a transfusion appointment on ${appointmentDate} at ${hospital}.`;
        return this.sendSMS(patientPhone, message);
    }
}

module.exports = new SMSService();
```

---

## Performance Optimization

### Phase 5: Build & Optimization Setup (Week 9)

#### 5.1 Setup Build Tools

**Install Vite for Building:**

```bash
npm init -y
npm install --save-dev vite
npm install --save-dev vite-plugin-pwa
npm install --save-dev vite-plugin-compression
npm install --save-dev terser
```

**Create `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        rollupOptions: {
            input: {
                main: './index-modern.html'
            },
            output: {
                manualChunks: {
                    'vendor': ['chart.js', 'leaflet'],
                    'services': [
                        './src/js/services/donors.js',
                        './src/js/services/ai-prediction.js',
                        './src/js/services/health.js'
                    ]
                }
            }
        },
        chunkSizeWarningLimit: 500
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'BloodBridge',
                short_name: 'BloodBridge',
                theme_color: '#DC2626',
                icons: [
                    {
                        src: '/assets/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/assets/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.bloodbridge\.in\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        }),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz'
        }),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br'
        })
    ],
    server: {
        port: 8000,
        open: true
    }
});
```

**Update `package.json`:**

```json
{
  "name": "bloodbridge",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "analyze": "vite-bundle-visualizer"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0",
    "vite-plugin-compression": "^0.5.1",
    "terser": "^5.24.0"
  }
}
```

#### 5.2 Code Splitting & Lazy Loading

**Update `app-modern.js` for lazy loading:**

```javascript
class BloodBridgeApp {
    constructor() {
        this.services = {};
        this.loadedModules = new Set();
    }

    async loadServiceOnDemand(serviceName) {
        if (this.loadedModules.has(serviceName)) {
            return this.services[serviceName];
        }

        switch(serviceName) {
            case 'ai':
                const { AIPredictionService } = await import('./services/ai-prediction.js');
                this.services.ai = new AIPredictionService();
                break;
            case 'health':
                const { HealthService } = await import('./services/health.js');
                this.services.health = new HealthService();
                break;
            case 'gamification':
                const { GamificationService } = await import('./services/gamification.js');
                this.services.gamification = new GamificationService();
                break;
            // ... other services
        }

        this.loadedModules.add(serviceName);
        return this.services[serviceName];
    }

    async showSection(sectionName) {
        // Load service only when section is accessed
        switch(sectionName) {
            case 'ai-insights':
                await this.loadServiceOnDemand('ai');
                await this.loadAIInsights();
                break;
            case 'health-dashboard':
                await this.loadServiceOnDemand('health');
                await this.loadHealthDashboard();
                break;
            // ... other sections
        }
    }
}
```

#### 5.3 Image Optimization

**Create responsive images:**

```bash
# Install sharp for image optimization
npm install --save-dev sharp

# Create optimization script
node scripts/optimize-images.js
```

**`scripts/optimize-images.js`:**

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './assets/images';
const outputDir = './assets/optimized';

const sizes = [320, 640, 1024, 1920];

async function optimizeImages() {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        
        for (const size of sizes) {
            const outputPath = path.join(outputDir, `${path.parse(file).name}-${size}w.webp`);
            
            await sharp(inputPath)
                .resize(size)
                .webp({ quality: 80 })
                .toFile(outputPath);
        }
    }
}

optimizeImages();
```

#### 5.4 CSS Optimization

**Install PurgeCSS:**

```bash
npm install --save-dev @fullhuman/postcss-purgecss
npm install --save-dev cssnano
```

**Create `postcss.config.js`:**

```javascript
module.exports = {
    plugins: [
        require('@fullhuman/postcss-purgecss')({
            content: ['./**/*.html', './src/**/*.js'],
            safelist: ['active', 'show', 'hidden']
        }),
        require('cssnano')({
            preset: 'default',
        })
    ]
};
```

#### 5.5 Caching Strategy

**Update `sw.js` for aggressive caching:**

```javascript
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAMES = {
    static: `bloodbridge-static-${CACHE_VERSION}`,
    dynamic: `bloodbridge-dynamic-${CACHE_VERSION}`,
    api: `bloodbridge-api-${CACHE_VERSION}`
};

const STATIC_ASSETS = [
    '/index-modern.html',
    '/offline.html',
    '/src/css/modern-styles.css',
    '/src/js/app-modern.js',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAMES.static)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !Object.values(CACHE_NAMES).includes(name))
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first for API, cache first for static
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API requests - Network first, fallback to cache
    if (url.origin.includes('api.bloodbridge.in')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAMES.api).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets - Cache first, fallback to network
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then(response => {
                    return caches.open(CACHE_NAMES.dynamic).then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            })
            .catch(() => {
                if (request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});
```

---

## Security Implementation

### Phase 6: Security Hardening (Week 10)

#### 6.1 Input Validation & Sanitization

**Install validation libraries:**

```bash
npm install joi express-validator
npm install dompurify
```

**Backend validation (Express):**

```javascript
const { body, validationResult } = require('express-validator');

const donorValidationRules = [
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone('en-IN'),
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('dateOfBirth').isISO8601().toDate(),
    body('fullName').trim().isLength({ min: 2, max: 255 })
];

router.post('/donors', donorValidationRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process valid data
});
```

**Frontend sanitization:**

```javascript
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [] 
    });
}
```

#### 6.2 Authentication Implementation

**JWT Token Management:**

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    async register(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);
        
        return { user, token, refreshToken };
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);
        
        return { user, token, refreshToken };
    }

    generateToken(user) {
        return jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRE }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
```

#### 6.3 HTTPS & Security Headers

**Force HTTPS (server):**

```javascript
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

**Security headers:**

```javascript
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.bloodbridge.in", "wss://api.bloodbridge.in"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

---

## Testing Strategy

### Phase 7: Testing Implementation (Week 11)

#### 7.1 Backend Testing

**Install testing libraries:**

```bash
npm install --save-dev jest supertest
npm install --save-dev @babel/preset-env
```

**Sample test (`tests/integration/donor.test.js`):**

```javascript
const request = require('supertest');
const app = require('../../src/server');

describe('Donor API', () => {
    let authToken;

    beforeAll(async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });
        authToken = response.body.token;
    });

    test('GET /api/v1/donors should return list of donors', async () => {
        const response = await request(app)
            .get('/api/v1/donors')
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.donors).toBeInstanceOf(Array);
    });

    test('POST /api/v1/donors should create new donor', async () => {
        const newDonor = {
            fullName: 'Test Donor',
            email: 'donor@test.com',
            bloodType: 'O+',
            phone: '+919876543210'
        };

        const response = await request(app)
            .post('/api/v1/donors')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newDonor);
        
        expect(response.status).toBe(201);
        expect(response.body.donor).toHaveProperty('donorId');
    });
});
```

#### 7.2 Frontend Testing

**Install Playwright:**

```bash
npm install --save-dev @playwright/test
```

**Sample test (`tests/e2e/navigation.spec.js`):**

```javascript
const { test, expect } = require('@playwright/test');

test.describe('BloodBridge Navigation', () => {
    test('should navigate between sections', async ({ page }) => {
        await page.goto('http://localhost:8000');

        // Click on Donors section
        await page.click('[data-section="donors"]');
        await expect(page.locator('#donors-section')).toBeVisible();

        // Click on Patients section
        await page.click('[data-section="patients"]');
        await expect(page.locator('#patients-section')).toBeVisible();
    });

    test('should open emergency modal', async ({ page }) => {
        await page.goto('http://localhost:8000');
        
        await page.click('#emergency-btn');
        await expect(page.locator('#emergency-modal')).toBeVisible();
    });
});
```

---

## Deployment Plan

### Phase 8: Production Deployment (Week 12)

#### 8.1 Backend Deployment (Railway/Render/AWS)

**Using Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

**Environment variables on Railway:**
- Set all variables from `.env` in Railway dashboard

#### 8.2 Frontend Deployment (Vercel/Netlify)

**Using Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Build production
npm run build

# Deploy
vercel --prod
```

**`vercel.json` configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index-modern.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### 8.3 Database Migration

**Run migrations on production:**

```bash
# Using Sequelize CLI
npx sequelize-cli db:migrate --env production

# Or run SQL script directly
psql $DATABASE_URL -f database/schema.sql
```

#### 8.4 SSL Certificate

**Using Let's Encrypt (if self-hosted):**

```bash
sudo certbot --nginx -d bloodbridge.in -d www.bloodbridge.in
```

---

## Monitoring & Maintenance

### Phase 9: Post-Deployment (Ongoing)

#### 9.1 Error Tracking

**Install Sentry:**

```bash
npm install @sentry/node @sentry/browser
```

**Backend integration:**

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend integration:**

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0
});
```

#### 9.2 Analytics & Monitoring

**Setup Google Analytics:**

```html
<!-- Add to index-modern.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Application Performance Monitoring:**

```bash
npm install newrelic
```

#### 9.3 Backup Strategy

**Automated daily backups:**

```bash
# Cron job for PostgreSQL backup
0 2 * * * pg_dump $DATABASE_URL > /backups/bloodbridge_$(date +\%Y\%m\%d).sql
```

---

## Timeline Summary

| Week | Phase | Tasks |
|------|-------|-------|
| 1-2 | Backend Setup | Database schema, API design, Express setup |
| 3-5 | API Implementation | Controllers, routes, middleware |
| 6-7 | Frontend Integration | API client, service updates, WebSocket |
| 8 | External APIs | WhatsApp, Email, SMS, Maps integration |
| 9 | Optimization | Build setup, code splitting, caching |
| 10 | Security | Validation, authentication, HTTPS |
| 11 | Testing | Unit tests, integration tests, E2E tests |
| 12 | Deployment | Production deployment, SSL, monitoring |

---

## File Cleanup Recommendations

Based on analysis, these files can be **safely deleted**:

### Unnecessary Files to Remove:

1. **`chart_script.py`** - Python script for generating charts, not needed for production
2. **`script.py`** - Analysis script, used for research only
3. **`thalassemia-solution-proposal.md`** - Proposal document, keep for reference but not needed in production

### Files to Keep:

- All HTML, JS, CSS files (required for application)
- `manifest.json`, `sw.js` (required for PWA)
- Documentation files: `README.md`, `FEATURES.md`, `INTEGRATION.md`
- `.gitignore` (version control)
- `.github/` folder (CI/CD and instructions)

---

## Next Steps Checklist

- [ ] Review and approve database schema
- [ ] Set up development database (PostgreSQL)
- [ ] Choose backend framework and initialize project
- [ ] Implement authentication system
- [ ] Create API endpoints (start with core features)
- [ ] Update frontend services to use real APIs
- [ ] Set up external API accounts (WhatsApp, Twilio, SendGrid)
- [ ] Implement WebSocket for real-time features
- [ ] Configure build tools (Vite)
- [ ] Optimize assets (images, CSS, JS)
- [ ] Write tests (unit + integration)
- [ ] Set up staging environment
- [ ] Deploy to production
- [ ] Configure monitoring and error tracking
- [ ] Set up automated backups
- [ ] Performance testing and optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Launch! 🚀

---

## Support & Resources

**Documentation References:**
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Socket.io: https://socket.io/docs/
- Vite: https://vitejs.dev/
- Playwright: https://playwright.dev/

**Community:**
- GitHub Discussions: Create issues and discussions in the repository
- Documentation: Refer to `FEATURES.md` and `INTEGRATION.md`

---

**Last Updated:** November 1, 2025  
**Version:** 1.0.0  
**Author:** BloodBridge Development Team
