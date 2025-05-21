# AffordHostel - Off-Campus Hostel Booking Platform

**AffordHostel** is a web application designed to streamline off-campus hostel and room bookings for students in Kenya. Built with React (frontend) and Django (backend), it empowers landlords to list properties, students to browse/book accommodations, and agents to facilitate transactions.

![AffordHostel Preview](https://via.placeholder.com/800x400?text=AffordHostel+Screenshot) *Replace with actual screenshots*

## Features

### 👨🎓 Student Accounts
- Register/login with student verification
- Browse hostels/rooms with filters (price, location, amenities)
- Book accommodations and pay via integrated gateways (M-Pesa, Stripe)
- Review and rate hostels
- Track booking history

### 🏠 Landlord Dashboard
- Create and manage hostel listings
- Upload photos/descriptions/pricing
- View booking requests and confirmations
- Access occupancy analytics

### 🔑 Admin Panel
- Manage users (students, landlords, agents)
- Moderate content (listings, reviews)
- Generate financial/usage reports
- Configure system settings

### 🤝 Agent Authorization
- Assist students/landlords with bookings (commission-based)
- Tiered access levels (Bronze, Silver, Gold)
- Track commissions and transactions

## Installation

### Prerequisites
- Python 3.8+ (Backend)
- Node.js 16+ & npm (Frontend)
- PostgreSQL (Recommended database)

### Backend (Django)
1. Clone repo:
   ```bash
   git clone https://github.com/yourusername/AffordHostel.git
   cd AffordHostel/backend
Create virtual environment:

bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
Install dependencies:

bash
pip install -r requirements.txt
Configure environment variables (create .env):

ini
SECRET_KEY=your_django_secret
DATABASE_URL=postgres://user:pass@localhost:5432/affordhostel
DEBUG=True
JWT_SECRET=your_jwt_secret
Run migrations:

bash
python manage.py migrate
Start server:

bash
python manage.py runserver
Frontend (React)
Navigate to frontend:

bash
cd ../frontend
Install dependencies:

bash
npm install
Configure environment (create .env):

ini
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAPBOX_TOKEN=your_token
Start development server:

bash
npm start
Configuration
Update these in your .env files:

Backend

PAYMENT_MODE (sandbox/production)

MPESA_CONSUMER_KEY & MPESA_CONSUMER_SECRET

STRIPE_API_KEY

Frontend

REACT_APP_GOOGLE_ANALYTICS_ID

REACT_APP_STRIPE_PUBLIC_KEY

Usage
Access admin panel: http://localhost:8000/admin (Create superuser with python manage.py createsuperuser)

Student/Landlord signup: Available via frontend registration

Test payments: Use Stripe test card 4242 4242 4242 4242

API Endpoints
Endpoint	Method	Description
/api/auth/login	POST	User authentication
/api/hostels/	GET	List all hostels
/api/bookings/	POST	Create new booking
/api/payments/mpesa/	POST	Initiate M-Pesa payment
Full API documentation available at /swagger/ after running server.

Contributing
Fork the repository

Create a feature branch (git checkout -b feature/your-feature)

Commit changes (git commit -m 'Add some feature')

Push to branch (git push origin feature/your-feature)

Open a Pull Request

Please adhere to PEP8 (Python) and Airbnb React Style Guide.

License
Distributed under the MIT License. See LICENSE for details.

Acknowledgements
Django REST Framework

React Community

M-Pesa API Documentation

Contact
Project Lead: Deusdarius Chimoyi
GitHub: ChidebruTechs
