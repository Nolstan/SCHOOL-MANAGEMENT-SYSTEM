# School Management System

A comprehensive School Management and Offline AI Learning System built with Node.js, Express, and MongoDB. It features automated WhatsApp notifications for parents and an integrated AI Tutor powered by Ollama.

## 🚀 Features

- **Student Management**: Register and manage students, classes, and subjects.
- **Attendance Tracking**: Easy-to-use interface for teachers to mark attendance.
- **WhatsApp Notifications**: Automatically status alerts (e.g., absence notifications) sent to parents via WhatsApp.
- **AI Tutor**: Offline educational support for students using the Llama 3.1 model.
- **Data Analysis**: AI-powered insights for teachers to analyze student performance and attendance trends.
- **Fee Management**: Track student fee balances and history.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Messaging**: WhatsApp-web.js
- **AI Engine**: Ollama (Llama 3.1)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally
- [Ollama](https://ollama.com/) installed and running (for AI features)

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd "SCHOOL MANAGEMENT SYSTEM"
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory and add the following:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/school_management
OLLAMA_URL=http://localhost:11434/api/generate
```

### Step 4: Start the Server
```bash
npm run dev
```

### Step 5: WhatsApp Initialization
When the server starts, a QR code will appear in the terminal. Scan it with your WhatsApp mobile app to enable the notification service.

## 📂 Project Structure

- `server.js`: Main entry point.
- `routes/`: API endpoint definitions.
- `controllers/`: Business logic.
- `models/`: Database schemas.
- `services/`: External integrations (WhatsApp & AI).
- `public/`: Frontend static assets.

## 📜 System Design
For a deeper dive into the architecture, check out the [System Design Documentation](.system_generated/brain/<conversation-id>/system_design.md).

## 🤝 Contributing
Feel free to fork the project and submit pull requests for any enhancements or bug fixes.
