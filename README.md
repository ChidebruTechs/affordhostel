# AffordHostel Platform

A comprehensive student accommodation booking platform for Kenya, built with React frontend and Django backend.

## 🏗️ Architecture

This project is split into two separate applications:

- **Frontend**: React + TypeScript + Vite application
- **Backend**: Django REST API with PostgreSQL database

## 🚀 Deployment

### Frontend Deployment (Heroku)

1. **Create Heroku app for frontend:**
   ```bash
   cd frontend
   heroku create your-frontend-app-name
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set VITE_API_BASE_URL=https://your-backend-app.herokuapp.com/api
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

### Backend Deployment (Heroku)

1. **Create Heroku app for backend:**
   ```bash
   cd backend
   heroku create your-backend-app-name
   ```

2. **Add PostgreSQL and Redis addons:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   heroku addons:create heroku-redis:mini
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
   heroku config:set DEBUG=False
   heroku config:set FRONTEND_URL=https://your-frontend-app.herokuapp.com
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## 🛠️ Local Development

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📱 Features

- **Multi-role Authentication**: Student, Landlord, Agent, Admin
- **Hostel Management**: CRUD operations with images and amenities
- **Booking System**: Complete booking workflow with payments
- **Payment Integration**: M-Pesa and PayPal support
- **Review System**: User reviews and ratings
- **Notification System**: Real-time notifications
- **Admin Dashboard**: Content management for company info and team
- **Analytics**: Comprehensive platform analytics
- **Responsive Design**: Mobile-first approach

## 🔐 Special Access

### Admin & Agent Access
For security purposes, Admin and Agent roles are not visible in the public sign-in/signup forms. To access these roles:

1. **For Login**: Visit `/login?access=privileged` or add `?access=privileged` to the login URL
2. **For Signup**: Visit `/signup?access=privileged` or add `?access=privileged` to the signup URL

This ensures that only authorized personnel with the special URL can access administrative and agent functionalities.

### Demo Credentials
You can use any email/password combination with the following roles:
- **Student**: Regular user access for browsing and booking hostels
- **Landlord**: Property management and booking oversight
- **Agent**: Property verification and landlord management (requires privileged access)
- **Admin**: Full platform administration (requires privileged access)

## 🔧 Technology Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

### Backend
- Django 4.2 + Django REST Framework
- PostgreSQL database
- JWT authentication
- Celery for background tasks
- Redis for caching
- M-Pesa API integration

## 🌐 API Documentation

The backend provides a comprehensive REST API with the following endpoints:

- **Authentication**: `/api/auth/`
- **Hostels**: `/api/hostels/`
- **Bookings**: `/api/bookings/`
- **Reviews**: `/api/reviews/`
- **Notifications**: `/api/notifications/`
- **Payments**: `/api/payments/`
- **Core**: `/api/core/`

## 🔐 Security Features

- JWT token authentication
- Role-based permissions
- CORS configuration
- Input validation and sanitization
- Secure file uploads
- Password hashing
- Two-factor authentication support

## 📊 Monitoring

- Comprehensive logging
- Error tracking
- Performance monitoring
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.