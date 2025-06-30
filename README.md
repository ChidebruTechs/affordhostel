Here’s the **cleaned-up and merged version** of your conflicting `README.md` or documentation content. I’ve merged all relevant sections from both sides, removed the Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and harmonized similar content.

---

### ✅ Merged Version (Conflict Resolved)

````md
# 🏠 AffordHostel - Off-Campus Hostel Booking Platform

**AffordHostel** is a web application designed to simplify off-campus hostel booking in Kenya. It connects students, landlords, and agents on a unified platform, offering a seamless experience for browsing, booking, and managing hostel accommodations.

![AffordHostel Preview](https://via.placeholder.com/800x400?text=AffordHostel+Screenshot)  
*Replace with actual screenshots*

---

## 🚀 Features

### 🎓 Student Accounts
- Register/login with student verification
- Browse hostels/rooms with filters (price, location, amenities)
- Book accommodations and pay via integrated gateways (M-Pesa, Stripe)
- Review and rate hostels
- Track booking history

### 🏠 Landlord Dashboard
- Create, update, and manage hostel listings
- Upload photos, descriptions, and pricing
- View booking requests and confirmations
- Access occupancy analytics

### 🔑 Admin Panel
- Manage users (students, landlords, agents)
- Moderate content (listings, reviews)
- Generate financial/usage reports
- Configure system settings

### 🤝 Agent Authorization
- Assist students and landlords with bookings (commission-based)
- Tiered access levels (Bronze, Silver, Gold)
- Track commissions and transactions

### 🔎 Hostel Discovery
- Search and filter hostels by location, price, and amenities

### 💬 Booking & Notifications
- Book hostels and receive confirmations in real-time

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Django
- **Database**: PostgreSQL

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- PostgreSQL
- pip / pipenv / virtualenv

---

### Backend Setup (Django)

```bash
# Clone the repo
git clone https://github.com/yourusername/affordhostel.git
cd affordhostel/backend

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and configure:
# SECRET_KEY=your_secret
# DATABASE_URL=postgres://user:pass@localhost:5432/affordhostel
# JWT_SECRET=jwt_key
# DEBUG=True

# Apply migrations
python manage.py migrate

# Start the server
python manage.py runserver
````

---

### Frontend Setup (React)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file with:
# REACT_APP_API_URL=http://localhost:8000
# REACT_APP_MAPBOX_TOKEN=your_token

# Start React dev server
npm start
```

---

## 📂 Project Structure

```
affordhostel/
├── backend/               # Django backend
│   ├── manage.py
│   └── affordhostel/      # Django project files
├── frontend/              # React frontend
│   ├── src/
│   └── public/
└── README.md
```

---

## 🛡️ Security & Authorization

* Authentication via Django (JWT or OAuth ready)
* Role-based access:

  * Admin: Full access
  * Landlord: Listing management
  * Student: Browsing & booking
  * Agent: Listing verification

---

## 🌍 Deployment

Containerized using Docker, ready for deployment on:

* Heroku
* Render
* DigitalOcean

---

## 📌 Roadmap

* Agent verification flow
* Payment integration (M-Pesa/Stripe)
* Email & SMS notifications
* Mobile responsive UI
* Review & rating system

---

## 🤝 Contributing

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push and create a PR
git push origin feature/your-feature
```

Please follow PEP8 (Python) and Airbnb Style Guide (React).

---

## 📄 License

Licensed under the MIT License.

---

## 📫 Contact

For questions or collaborations:

* Email: [affordhostel@gmail.com](mailto:affordhostel@gmail.com)
* GitHub: [ChidebruTechs](https://github.com/ChidebruTechs)
* Project Lead: Deusdarius Chimoyi



Now you can save this to your file and run:


git add README.md
git commit -m "Resolved merge conflict in README.md"
git push

