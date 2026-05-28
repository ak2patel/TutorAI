# VedaAI - AI Assessment Creator

VedaAI is a full-stack web application designed for teachers to generate structured question papers and assessments using Artificial Intelligence. Built with modern technologies and following the Figma design specifications.

## 🚀 Features

- **Dynamic Assignment Creation**: Custom form to configure institution, subject, class, due date, and variable question types
- **AI Paper Generation**: Utilizes Groq (Llama 3.3 70B) to generate pedagogically sound question papers in valid JSON format
- **Context Uploads**: Attach text files or notes as reference material for the AI
- **Real-Time Progress**: WebSocket (Socket.IO) integration for instant status updates
- **Robust Queue System**: BullMQ and Redis handle async background jobs with retry mechanisms
- **Print-Ready Output**: A4 document format with CSS media queries for clean printing or PDF saving
- **Glassmorphism UI**: Modern design with backdrop blur effects matching Figma specifications
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🏗️ Architecture & Tech Stack

This project is structured as a **Monorepo** with separated Next.js client and Express server.

### Frontend (`/client`)
- **Framework**: Next.js 16 (App Router with Turbopack)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: CSS Modules with Figma design tokens (Bricolage Grotesque font, glassmorphism)
- **WebSockets**: Socket.IO-Client for real-time state tracking
- **Type Safety**: TypeScript with strict mode

### Backend (`/server`)
- **Framework**: Node.js & Express with TypeScript
- **Database**: MongoDB (via Mongoose)
- **Caching & Queue**: Redis + BullMQ
- **AI Integration**: Groq SDK (`llama-3.3-70b-versatile`)
- **WebSockets**: Socket.IO Server
- **Validation**: Zod schemas

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v20+)
- MongoDB Atlas cluster URL (or local MongoDB)
- Redis URL (Upstash or local Redis server)
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

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install

# Create environment variables (if needed)
# The default values point to http://localhost:5000

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application
Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
TutorAI/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   │   ├── create/    # Assignment creation components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── layout/    # Layout components (Sidebar, Header)
│   │   │   ├── output/    # Question paper output components
│   │   │   └── ui/        # Reusable UI components
│   │   ├── services/      # API and WebSocket services
│   │   ├── store/         # Redux store and slices
│   │   └── types/         # TypeScript type definitions
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database, Redis, environment config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── queue/         # BullMQ queue and worker
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (LLM, PDF, Prompts)
│   │   ├── types/         # TypeScript type definitions
│   │   ├── websocket/     # Socket.IO configuration
│   │   └── index.ts       # Server entry point
│   └── package.json
│
└── README.md
```

## 🎨 Design Implementation

The UI has been built following the provided Figma design specifications:

- **Color Scheme**: Gradient backgrounds (#EEEEEE to #DADADA), white cards with glassmorphism
- **Typography**: Bricolage Grotesque font family with -0.04em letter spacing
- **Components**: Pill-shaped inputs, rounded cards (32px radius), realistic shadows
- **Status Indicators**: Green dots with ring effects for active states
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

## 🔄 Workflow

1. **Create Assignment**: Teacher fills out the form with assignment details
2. **Job Queued**: Backend creates a BullMQ job for AI generation
3. **AI Processing**: Worker processes the job using Groq LLM
4. **Real-time Updates**: WebSocket broadcasts progress to frontend
5. **View Output**: Generated question paper displayed in print-ready format
6. **Download/Print**: Export as PDF or print directly

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
```bash
cd server
npm run build
npm start
```

Ensure environment variables are set in your deployment platform.

## 🧪 Testing Locally

1. Start both servers (backend and frontend)
2. Navigate to `http://localhost:3000`
3. Click "Create Assignment" or the CTA button
4. Fill in the form with:
   - Due date
   - Question types (MCQ, Short Answer, etc.)
   - Number of questions and marks
   - Additional instructions (optional)
5. Submit and watch real-time progress
6. View the generated question paper

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
GROQ_API_KEY=your_groq_api_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

## 🤝 Contributing

This is a hiring assignment project. For production use, consider:
- Adding authentication and authorization
- Implementing rate limiting per user
- Adding file upload functionality for PDFs
- Implementing answer key generation
- Adding export to various formats (DOCX, PDF)
- Implementing assignment analytics

## 📄 License

This project is created as part of a hiring assignment for VedaAI.

## 👨‍💻 Developer

Built by Akash Patel as part of the VedaAI Full Stack Engineering Assignment.

---

**Note**: This application requires active internet connection for AI generation (Groq API) and database operations (MongoDB Atlas, Upstash Redis).
