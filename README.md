# SynApps

**SynApps** is a full-stack project management platform built with **Next.js** and **FastAPI**, designed to streamline team collaboration and project tracking. With real-time features, intuitive UI, and a modular architecture, it provides a seamless experience for managing tasks, users, and workflows.

🎯 This project showcases my ability to design and develop production-grade applications from scratch — including modern frontend architecture, RESTful backend APIs, authentication, and real-time communication systems.

## ⚙️ Project Structure

```text
synapps/
├── synapps-frontend/   # Next.js-based frontend application
│   ├── app/            # App routing structure
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom hooks for state & behavior
│   └── ...
│
└── synapps-backend/    # FastAPI-based backend service
    ├── routers/        # Modular route handlers (tasks, users, boards)
    ├── models/         # SQLAlchemy ORM models
    ├── schemas/        # Pydantic for validation & typing
    └── ...
```

## 🚀 Technologies

### Frontend
- **Next.js 15** — App Router, SSR, optimized routing  
- **React 19** — Declarative UI with concurrent features  
- **TypeScript** — Strong typing for scalability  
- **Tailwind CSS** — Utility-first styling for responsive design  
- **Radix UI** — Accessible UI primitives  
- **React Hook Form + Zod** — Reliable form handling & validation  
- **@hello-pangea/dnd** — Smooth drag-and-drop task management  

### Backend
- **FastAPI** — High-performance async Python framework  
- **PostgreSQL** — Relational database  
- **SQLAlchemy** — ORM for complex data modeling  
- **Pydantic** — Strict input/output validation  
- **JWT Authentication** — Token-based access control  
- **asyncpg** — Async PostgreSQL driver for speed

## 🧰 Setup

### Requirements
- Node.js 18.0.0+  
- Python 3.8+  
- PostgreSQL 12+  
- pnpm or npm

### Backend Setup

```bash
cd synapps-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

1. Create a PostgreSQL database  
2. Update `config.py` with your DB connection info  
3. Start the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd synapps-frontend
pnpm install
# or
npm install

pnpm dev
# or
npm run dev
```

## 🔑 Features

### 👥 User Management
- Registration, login, and profile control  
- Role-based access control  

### 📋 Project Boards
- Create/update boards and columns  
- Drag-and-drop task management  

### ✅ Task Management
- Assignments, priorities, and status tracking  
- Create/edit/delete tasks  

### 🔔 Notifications
- Real-time task assignments  
- System-level alerts (via WebSocket)

### 👨‍👩‍👧‍👦 Team Collaboration
- Invite/remove members  
- Role assignment and permission control

## 📚 API Documentation

- Swagger UI → http://localhost:8000/docs  
- ReDoc → http://localhost:8000/redoc

## 🧪 Development Scripts

### Backend

```bash
cd synapps-backend
uvicorn main:app --reload
```

### Frontend

```bash
cd synapps-frontend
pnpm dev
# or
npm run dev
```

## 🚀 Deployment

### Backend

```bash
cd synapps-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd synapps-frontend
pnpm build
# or
npm run build

pnpm start
# or
npm start
```

## 🗂️ Database Diagram

![image](https://github.com/user-attachments/assets/e33c0138-55ac-45b0-af60-808beb4ea325)

## 🖼️ Interfaces

![screenshot](https://github.com/user-attachments/assets/21a35a89-60e9-4abe-86b5-8a2ff0b1a998)  
![screenshot](https://github.com/user-attachments/assets/10cace1d-5789-49d6-8b40-ed53d9b1f067)  
![screenshot](https://github.com/user-attachments/assets/f457f21d-29dc-4453-a35a-faf8e6d5a94d)

## 🤝 Contribution

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/awesome`)  
3. Commit your changes (`git commit -m 'Add awesome feature'`)  
4. Push to GitHub (`git push origin feature/awesome`)  
5. Open a Pull Request

## 🔒 Security

- JWT-based authentication  
- Password hashing (bcrypt)  
- CORS configuration  
- Input sanitization  
- XSS & CSRF protection


## 📬 Contact

Furkan Genca — [@furkangenca](https://github.com/furkangenca)  
Project Link → [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
