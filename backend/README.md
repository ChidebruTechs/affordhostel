# AffordHostel Backend API

A comprehensive Django REST API for the AffordHostel platform - a student accommodation booking system for Kenya.

## Features

- **User Management**: Multi-role authentication (Student, Landlord, Agent, Admin)
- **Hostel Management**: CRUD operations for hostels with images and room types
- **Booking System**: Complete booking workflow with status management
- **Payment Integration**: M-Pesa STK Push integration
- **Review System**: User reviews and ratings for hostels
- **Notification System**: Real-time notifications for users
- **Wishlist**: Save favorite hostels

## Setup Instructions

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb affordhostel

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- Database credentials
- Email settings for password reset
- M-Pesa credentials for payments
- Redis URL for caching

### 4. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/upload-avatar/` - Upload profile picture

### Hostels
- `GET /api/hostels/` - List hostels (with filtering)
- `POST /api/hostels/` - Create hostel (landlords only)
- `GET /api/hostels/{id}/` - Get hostel details
- `PUT /api/hostels/{id}/` - Update hostel
- `DELETE /api/hostels/{id}/` - Delete hostel
- `POST /api/hostels/{id}/wishlist/add/` - Add to wishlist
- `DELETE /api/hostels/{id}/wishlist/remove/` - Remove from wishlist
- `GET /api/hostels/wishlist/` - Get user's wishlist

### Bookings
- `GET /api/bookings/` - List user's bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Get booking details
- `PUT /api/bookings/{id}/` - Update booking
- `POST /api/bookings/{id}/status/` - Update booking status

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review
- `GET /api/reviews/{id}/` - Get review details
- `PUT /api/reviews/{id}/` - Update review
- `DELETE /api/reviews/{id}/` - Delete review
- `POST /api/reviews/{id}/helpful/` - Mark review as helpful

### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/read/` - Mark as read
- `POST /api/notifications/mark-all-read/` - Mark all as read
- `GET /api/notifications/unread-count/` - Get unread count

### Payments
- `GET /api/payments/` - List user payments
- `POST /api/payments/mpesa/initiate/` - Initiate M-Pesa payment
- `POST /api/payments/mpesa/callback/` - M-Pesa callback (webhook)
- `GET /api/payments/status/{transaction_id}/` - Check payment status

## Models Overview

### User Model
Extended Django user with role-based fields for different user types.

### Hostel Model
- Basic information (name, description, price, location)
- Multiple images support
- Multiple room types
- Amenities as JSON field
- Verification status

### Booking Model
- Links student, hostel, and room type
- Date range and guest count
- Payment tracking
- Status workflow

### Payment Model
- Multiple payment methods (M-Pesa, Card, Bank)
- Transaction tracking
- M-Pesa integration with STK Push

## Security Features

- JWT authentication
- Role-based permissions
- CORS configuration
- Input validation and sanitization
- Secure file uploads

## Deployment Notes

1. Set `DEBUG=False` in production
2. Configure proper database (PostgreSQL recommended)
3. Set up Redis for caching and Celery
4. Configure email backend for notifications
5. Set up proper M-Pesa credentials
6. Use environment variables for all secrets
7. Set up proper static/media file serving

## Testing

```bash
# Run tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```