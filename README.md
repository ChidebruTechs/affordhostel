🏠 AffordHostel
AffordHostel is a web application designed to simplify off-campus hostel booking in Kenya. It connects students, landlords, and agents on a unified platform, offering a seamless experience for browsing, booking, and managing hostel accommodations.

🚀 Features
🔐 Admin Panel: Manage users, listings, and platform settings.

🏘️ Landlord Dashboard: Create, update, and manage hostel listings.

🎓 Student Account: Browse hostels, view details, make bookings.

🧑‍💼 Agent Authorization: Agents can verify and manage listings.

🔎 Hostel Discovery: Search and filter hostels by location, price, amenities, and more.

💬 Booking & Notifications: Book hostels and receive confirmations.

🛠️ Tech Stack
Frontend: React

Backend: Django

Database: PostgreSQL

🧑‍💻 Getting Started
Prerequisites
Node.js & npm

Python 3.9+

PostgreSQL

pip / pipenv / virtualenv

Backend Setup (Django)
bash
Copy
Edit
# Clone the repo
git clone https://github.com/your-username/affordhostel.git
cd affordhostel/backend

# Set up virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure PostgreSQL database in settings.py
# Then apply migrations
python manage.py migrate

# Start the development server
python manage.py runserver
Frontend Setup (React)
bash
Copy
Edit
cd ../frontend

# Install dependencies
npm install

# Start React dev server
npm start
📂 Project Structure
csharp
Copy
Edit
affordhostel/
│
├── backend/               # Django backend
│   ├── manage.py
│   └── affordhostel/      # Django project files
│
├── frontend/              # React frontend
│   ├── src/
│   └── public/
│
└── README.md
🛡️ Security & Authorization
Authentication handled via Django (with potential for JWT or OAuth).

Role-based access:

Admin: Full access

Landlord: Listing management

Student: Browsing & booking

Agent: Listing verification

🌍 Deployment
To be containerized using Docker and deployed via platforms like Heroku, Render, or DigitalOcean.

📌 Roadmap
 Agent verification flow

 Payment integration

 Email & SMS notifications

 Mobile responsive UI

 Review & rating system

🤝 Contributing
Contributions are welcome! Please open issues and submit pull requests for improvements or feature additions.

bash
Copy
Edit
# Fork the repository
# Create your feature branch
git checkout -b feature/YourFeature

# Commit your changes
git commit -m "Add your feature"

# Push and create a PR
git push origin feature/YourFeature
📄 License
This project is licensed under the MIT License.

📫 Contact
For questions or collaborations, contact us at: affordhostel@gmail.com

