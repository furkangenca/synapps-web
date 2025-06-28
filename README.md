# 📂 SynApps — Full-Stack Project Management Platform

**SynApps** is a production-ready project management application that enables real-time team collaboration through task boards, notifications, and secure user workflows.

Built from scratch using **Next.js**, **FastAPI**, and **PostgreSQL**, it demonstrates advanced frontend architecture, modular backend design, and full-stack integration.

---

### 🖼️ Interfaces  
![screen1](https://github.com/user-attachments/assets/21a35a89-60e9-4abe-86b5-8a2ff0b1a998)  
![screen2](https://github.com/user-attachments/assets/10cace1d-5789-49d6-8b40-ed53d9b1f067)  
![screen3](https://github.com/user-attachments/assets/f457f21d-29dc-4453-a35a-faf8e6d5a94d)

---

## 🧠 Overview

- 📋 Create and manage tasks across project boards  
- 👥 Handle team roles and user authentication  
- 🔔 Receive real-time notifications (WebSocket)  
- 🔐 Protected admin interface with access control  
- 📊 Track changes and system events

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** · **TypeScript** · **Tailwind CSS**
- **Shadcn UI** · **React Query** · **Zod**
- **React Hook Form** · **@hello-pangea/dnd**

### Backend
- **FastAPI** (Async Python Framework)
- **PostgreSQL** · **SQLAlchemy** · **Pydantic**
- **JWT Authentication** · **asyncpg**
- **Security:** CSRF, CORS, input sanitization

---

## 🧱 Project Structure

```text
synapps/
├── synapps-frontend/   # Next.js + Tailwind UI
└── synapps-backend/    # FastAPI + PostgreSQL service
```

---

## ⚙️ Setup & Development

### Requirements
- Node.js 18+  
- Python 3.8+  
- PostgreSQL 12+  
- pnpm or npm

### Backend

```bash
cd synapps-backend
python -m venv venv
source venv/bin/activate   # or .\venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn main:app --reload
```

Configure your PostgreSQL DB credentials in `config.py`.

### Frontend

```bash
cd synapps-frontend
pnpm install
pnpm dev
```

---

## 🚀 Deployment

### Backend

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
pnpm build && pnpm start
```

---

## 🔑 Key Features

### 👤 Authentication & Access
- JWT-based login
- Role-based permissions
- Protected routes for admin actions

### 📂 Task Management
- Boards with drag-and-drop columns
- Task creation, editing, deletion
- Priorities, status, due dates

### 🧑‍🤝‍🧑 Team Collaboration
- Invite/remove team members
- Assign tasks and roles
- Shared project spaces

### 🔔 Realtime Notifications
- Instant updates on task events
- Socket-powered alert system

---

## 🧪 API Docs

- [Swagger UI](http://localhost:8000/docs)  
- [ReDoc](http://localhost:8000/redoc)

---

## Database Diagram  
![DB](https://github.com/user-attachments/assets/e33c0138-55ac-45b0-af60-808beb4ea325)



---

## 🧰 For Contributors

```bash
# Fork, clone, then:
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

Open a Pull Request with a clear description.

---

## 🔐 Security

- Hashed passwords (bcrypt)  
- Strict schema validation (Pydantic + Zod)  
- XSS/CORS/CSRF prevention layers  
- Environment-based config for secrets

---

## 📬 Contact

**Furkan Gença** — [@furkangenca](https://github.com/furkangenca)  
Repo → [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
