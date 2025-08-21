
# 📌 Project Todo Backend

A backend service for managing **to-do tasks**. This API provides endpoints for creating, updating, deleting, and retrieving tasks, along with authentication and user management.

---

## 🚀 Features

* User authentication (JWT-based)
* CRUD operations for todos
* Role-based access control (optional)
* Secure password hashing
* RESTful API design
* Error handling and validation

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT + bcrypt
* **Validation:** Joi / express-validator

---

## 📂 Project Structure

```
project-todo-backend/
│── src/
│   ├── config/         # Configuration files (DB, env, etc.)
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth, error handlers
│   ├── utils/          # Helpers/utilities
│   └── server.js       # App entry point
│
│── .env.example        # Example environment variables
│── package.json
│── README.md
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/your-username/project-todo-backend.git

cd project-todo-backend

# Install dependencies
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root folder:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at:
👉 `http://localhost:5000/api`

---

## 📖 API Endpoints

### Auth

* `POST /api/auth/register` → Register a new user
* `POST /api/auth/login` → Login user

### Todos

* `GET /api/todos` → Get all todos (user-specific)
* `POST /api/todos` → Create a new todo
* `PUT /api/todos/:id` → Update a todo
* `DELETE /api/todos/:id` → Delete a todo

---

## 🧪 Testing

```bash
npm test
```

---

## 📌 Roadmap

* [ ] Add unit/integration tests
* [ ] Add Swagger API documentation
* [ ] Add pagination for todos
* [ ] Deploy to cloud (Heroku / Render / Railway)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
