# Tracking System - Photo & Number Tracker

A full-stack tracking website with authentication, photo upload, phone number tracking, and database integration.

## Features

- 🔐 User Authentication (Login/Signup)
- 📸 Photo Upload & Storage
- 📱 Phone Number Tracking
- 🔍 Search Functionality
- 🗄️ Supabase Database Integration
- 🌐 National Database Connection Ready
- 📊 Dashboard with Records Management

## Setup Instructions

### 1. Database Setup (Supabase)

Create the following tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tracking Records Table
```sql
CREATE TABLE tracking_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Storage Bucket
Create a storage bucket named `tracking-photos` in Supabase Storage and make it public.

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_random_secret_key
PORT=3000
```

### 3. Installation

```bash
npm install
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access the Application

Open your browser and navigate to:
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Dashboard: http://localhost:3000/dashboard

## Deployment

### Deploy to Railway

1. Push code to GitHub
2. Connect Railway to your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Tracking
- `POST /api/tracking/create` - Create tracking record
- `GET /api/tracking/records` - Get all records
- `GET /api/tracking/search/:phone` - Search by phone
- `PUT /api/tracking/update/:id` - Update record

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer
- **Frontend**: HTML, CSS, JavaScript

## License

MIT License