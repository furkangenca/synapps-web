# 📂 SynApps – Full-Stack Project Management Platform

**SynApps** is a production-grade, full-stack project management application built with **Next.js** and **FastAPI**.  
It enables real-time team collaboration through task boards, notifications, and secure user management.

> 🚀 Built from scratch with modular architecture, JWT-based authentication, and real-time WebSocket integration.

---

### Interfaces  
![screen1](https://github.com/user-attachments/assets/21a35a89-60e9-4abe-86b5-8a2ff0b1a998)  
![screen2](https://github.com/user-attachments/assets/10cace1d-5789-49d6-8b40-ed53d9b1f067)  
![screen3](https://github.com/user-attachments/assets/f457f21d-29dc-4453-a35a-faf8e6d5a94d)

---

## 🧠 Overview

A responsive and scalable application that enables:

- Task management with boards and columns  
- Team collaboration with role-based access  
- Real-time notifications (via WebSocket)  
- Admin-level access control and analytics  

---

## 🧱 Project Structure

```text
synapps/
├── synapps-frontend/   # Next.js frontend (App Router)
└── synapps-backend/    # FastAPI backend with PostgreSQL
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)  
- **React 19** + **TypeScript**  
- **Tailwind CSS** + **Shadcn UI**  
- **React Query**, **Radix UI**, **Zod**, **React Hook Form**  
- **@hello-pangea/dnd** for drag-and-drop

### Backend
- **FastAPI** + **asyncpg**  
- **PostgreSQL** + **SQLAlchemy**  
- **Pydantic** for validation  
- **JWT Authentication**  
- **CORS**, **CSRF**, and input sanitization

---

## ⚙️ Setup

### Requirements
- Node.js 18+  
- Python 3.8+  
- PostgreSQL 12+  
- `pnpm` or `npm`

### Backend

```bash
cd synapps-backend
python -m venv venv
source venv/bin/activate     # Mac/Linux
# .\venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

1. Create a PostgreSQL database  
2. Configure `config.py` with DB credentials  
3. Run the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd synapps-frontend
pnpm install        # or npm install
pnpm dev            # or npm run dev
```

---

## 🔑 Features

### 👥 User Management
- Register/login, profile control  
- Role-based access control with permissions

### 🗂️ Project Boards
- Create/update boards and task columns  
- Drag-and-drop task sorting

### ✅ Task Handling
- Assignments, due dates, priorities  
- Edit/delete with instant sync

### 🔔 Notifications
- Real-time task updates via WebSocket  
- System-wide alerts

### 👨‍👩‍👧‍👦 Team Collaboration
- Invite/remove users  
- Role assignment with scopes

---

## 📚 API Documentation

- [Swagger UI](http://localhost:8000/docs)  
- [ReDoc](http://localhost:8000/redoc)

---

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
pnpm build && pnpm start
# or
npm run build && npm start
```

---

## 🖼️ UI & Database

### Database Diagram  
![DB](https://github.com/user-attachments/assets/e33c0138-55ac-45b0-af60-808beb4ea325)


---

## 🧪 Dev Scripts

### Backend
```bash
uvicorn main:app --reload
```

### Frontend
```bash
pnpm dev
# or
npm run dev
```

---

## 🔐 Security Measures

- JWT-based session management  
- Password hashing (bcrypt)  
- Input sanitization  
- XSS, CORS, and CSRF protection

---

## 🤝 Contribution

1. Fork the repo  
2. Create a branch: `feature/xyz`  
3. Commit: `git commit -m 'Add xyz'`  
4. Push & open PR

---

## 📬 Contact

**Furkan Gença** — [@furkangenca](https://github.com/furkangenca)  
Project URL → [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
