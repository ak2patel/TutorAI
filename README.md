# VedaAI - AI Assessment Creator

VedaAI is a full-stack web application designed for teachers to generate structured question papers and assessments using Artificial Intelligence.

## 🚀 Features

- **Dynamic Assignment Creation**: Custom form to configure institution, subject, class, due date, and variable question types.
- **AI Paper Generation**: Utilizes Groq (Llama 3.3 70B) to generate pedagogically sound question papers in valid JSON format based on specific constraints (marks, difficulty distribution).
- **Context Uploads**: Attach text files or notes as reference material for the AI to base questions upon.
- **Real-Time Progress**: WebSocket (Socket.IO) integration to broadcast generation status instantly from the backend to the frontend.
- **Robust Queue System**: BullMQ and Redis handle async background jobs to ensure scalability and retry mechanisms on AI failure.
- **Print-Ready Output**: The final generated paper displays as an A4 document and uses specific CSS media queries for clean printing or PDF saving.

## 🏗️ Architecture & Tech Stack

This project is structured as a **Monorepo** with a separated Next.js client and Express server.

### Frontend (`/client`)
- **Framework**: Next.js 15 (App Router)
- **State Management & API**: Redux Toolkit & RTK Query
- **Styling**: Vanilla CSS Modules mapped to Figma design tokens (Bricolage Grotesque font, glassmorphism, responsive UI).
- **WebSockets**: Socket.IO-Client for real-time state tracking.

### Backend (`/server`)
- **Framework**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **Caching & Queue**: Upstash Redis + BullMQ
- **AI Integration**: Groq SDK (`llama-3.3-70b-versatile`)
- **WebSockets**: Socket.IO Server

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v20+)
- MongoDB Atlas cluster URL (or local MongoDB)
- Upstash Redis URL (or local Redis server)
- Groq API Key

### 1. Clone the repository
```bash
git clone https://github.com/ak2patel/TutorAI.git
cd TutorAI
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment variables
cp .env.example .env
# Fill in your MONGODB_URI, REDIS_URL, and GROQ_API_KEY in the .env file

# Start development server
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install

# Create environment variables
cp .env.local.example .env.local
# (Optional) Verify NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL point to http://localhost:5000

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🤝 Figma Design Adherence

The UI has been built referencing the provided Figma design files. Global tokens (colors, pill radii, realistic shadows, gradients, and typography) are managed in `globals.css` and strictly utilized across component CSS Modules.

*Note: As per requirements, internal Figma reference files are safely excluded from the repository.*
