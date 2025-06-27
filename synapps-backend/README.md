# Synapps Backend

This project is a modern, asynchronous backend application developed with **FastAPI**. It works in integration with a PostgreSQL database and includes core functionalities such as user authentication, task management, and event/assignment handling. It is designed using a modular structure, which makes maintenance and scalability easier.

---

## Project Structure

```
synapps-backend/
├── main.py # Application entry point
├── config.py # Configuration settings (e.g., database)
├── database.py # Database connection and session management
├── models/ # SQLAlchemy models
│ ├── init.py
│ ├── user.py
│ ├── board.py
│ ├── column.py
│ ├── task.py
│ ├── notification.py
│ └── board_member.py
├── schemas/ # Pydantic data validation schemas
│ ├── init.py
│ ├── user.py
│ ├── task.py
│ └── ...
├── routers/ # API endpoints (routes)
│ ├── init.py
│ ├── auth.py
│ ├── user.py
│ ├── task.py
│ ├── board.py
│ ├── column.py
│ ├── board_member.py
│ └── notification.py
└── requirements.txt # Project dependencies
```

---

## Requirements

- **Python**: 3.7 or above
- **Dependencies**:
  ```bash
  pip install -r requirements.txt
  ```
  Required libraries: `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `pydantic`

- **Database**: PostgreSQL (uses `asyncpg` for async support)

---

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure the database**:
   - Update `DATABASE_URL` in the `config.py` file:
     ```python
     DATABASE_URL = "postgresql+asyncpg://user:password@localhost/database"
     ```

3. **Run the application**:
   ```bash
   python main.py
   ```
   - The app runs at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

---

## Requirements

- Python: 3.7 or above  
- PostgreSQL: 12 or above

Dependencies:
```bash
pip install -r requirements.txt
```

Required libraries: fastapi, uvicorn, sqlalchemy, asyncpg, pydantic, python-jose, passlib, bcrypt

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure database:
Update `DATABASE_URL` in `config.py`:
```python
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/database"
```

3. Run the application:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- The app runs at http://localhost:8000  
- API documentation: http://localhost:8000/docs

## Endpoints

### Authentication (Auth)
- `POST /auth/login`: User login
- `POST /auth/register`: Register a new user
- `POST /auth/refresh`: Refresh token

### Users
- `POST /users/`: Create a new user
- `GET /users/`: List all users
- `GET /users/{user_id}`: Get user details
- `PUT /users/{user_id}`: Update user info
- `DELETE /users/{user_id}`: Delete user

### Tasks
- `POST /tasks/`: Create a new task
- `GET /tasks/`: List all tasks (filters: column_id, assigned_user_id)
- `GET /tasks/{task_id}`: Get task details
- `PUT /tasks/{task_id}`: Update task
- `DELETE /tasks/{task_id}`: Delete task

### Boards
- `POST /boards/`: Create a new board
- `GET /boards/`: List all boards
- `GET /boards/{board_id}`: Get board details
- `PUT /boards/{board_id}`: Update board
- `DELETE /boards/{board_id}`: Delete board

### Columns
- `POST /columns/`: Create a new column
- `GET /columns/`: List all columns (filter: board_id)
- `GET /columns/{column_id}`: Get column details
- `PUT /columns/{column_id}`: Update column
- `DELETE /columns/{column_id}`: Delete column

### Board Members
- `POST /board-members/`: Add a new board member
- `GET /board-members/`: List all board members (filter: board_id, user_id)
- `GET /board-members/{member_id}`: Get member details
- `PUT /board-members/{member_id}`: Update member role
- `DELETE /board-members/{member_id}`: Remove member

### Notifications
- `POST /notifications/`: Create a new notification
- `GET /notifications/`: List all notifications (filter: user_id, is_read)
- `GET /notifications/{notification_id}`: Get notification details
- `PUT /notifications/{notification_id}`: Update notification (e.g., mark as read)
- `DELETE /notifications/{notification_id}`: Delete notification

## Example Usage

### Create Task
```bash
curl -X POST "http://localhost:8000/tasks/" \
     -H "Content-Type: application/json" \
     -d '{"title": "Write API", "column_id": 1}'
```

### Create Board
```bash
curl -X POST "http://localhost:8000/boards/" \
     -H "Content-Type: application/json" \
     -d '{"name": "New Board", "description": "Project management"}'
```

### Create Column
```bash
curl -X POST "http://localhost:8000/columns/" \
     -H "Content-Type: application/json" \
     -d '{"title": "To Do", "board_id": 1}'
```

### Add Board Member
```bash
curl -X POST "http://localhost:8000/board-members/" \
     -H "Content-Type: application/json" \
     -d '{"board_id": 1, "user_id": 2, "role": "member"}'
```

### Create Notification
```bash
curl -X POST "http://localhost:8000/notifications/" \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "title": "New Task", "message": "A new task has been assigned to you"}'
```

## Security

- JWT-based authentication  
- Password hashing (bcrypt)  
- CORS configuration  
- Input validation (Pydantic)  
- Asynchronous database operations (asyncpg)

## License

This project is licensed under the MIT License.

## Contact

Furkan Genca - [@furkangenca](https://github.com/furkangenca)

Project Link: [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
