<!-- 🌬️ AQI Real-Time Dashboard
A full-stack application monitoring real-time Air Quality Index data using a Flask backend and a React (Vite) frontend.

🛠️ Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18.0 or higher)

Python (3.9 or higher)

Git

🚀 Getting Started
1. Clone the Repository
Bash

git clone https://github.com/mobius952004/Aqi-dashboard.git
cd Aqi-dashboard
2. Backend Setup (Flask)
The backend handles data fetching and API processing.

Navigate to the backend folder:

Bash

cd backend
Create a Virtual Environment:

Bash

python -m venv venv
Activate the Environment:

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Install Dependencies:

Bash

pip install -r requirements.txt
Run the Flask Server:

Bash

python app.py
The backend usually runs on http://127.0.0.1:5000

3. Frontend Setup (React + Vite)
The frontend provides the interactive dashboard and map visualizations.

Navigate to the project root or frontend folder:

Bash

# From the root directory
cd dashboard 
Install Dependencies:

Bash

npm install
Start the Development Server:

Bash

npm run dev
The frontend will open at http://localhost:5173

🎨 Tech Stack
Frontend: React 19, Vite, Tailwind CSS v4

Backend: Python, Flask, Flask-CORS

Data: Real-time AQI API integration\\\

📝 Note on .env Files
Do not share your API keys. Create a .env file in the backend/ directory and add your credentials there:

Plaintext

AQI_API_KEY=your_key_here -->