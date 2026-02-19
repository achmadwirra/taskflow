# 🚀 TaskFlow – Task Management SaaS Application

TaskFlow adalah aplikasi manajemen tugas berbasis SaaS-style yang dibangun dengan pendekatan production-ready architecture.  
Project ini mensimulasikan sistem manajemen project seperti Jira atau ClickUp dengan fokus pada backend design, security, dan clean architecture.

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js
- React
- Axios / Fetch API

---

## ✨ Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (Admin & Member)
- 🗂 Project Management
- 📋 Task Management
- 🛡 Authorization Middleware
- 🗑 Soft Delete (deletedAt)
- 📝 Audit Log System
- 📊 Admin Panel
- 🔎 Filtering & Pagination

---

## 🏗 Architecture Overview

Project ini menggunakan pendekatan separation of concern dengan struktur berikut:

```bash
src/
├── controllers/
├── services/
├── middleware/
├── routes/
├── prisma/
└── utils/
```


Pendekatan ini memudahkan maintenance, scalability, dan refactoring.

---

## 🔐 Authentication Flow

1. User login menggunakan email & password  
2. Server memverifikasi credential  
3. JWT di-generate dan dikirim ke client  
4. Middleware `auth` memverifikasi token pada setiap protected route  

Pendekatan ini membuat sistem stateless dan scalable.

---

## 🛡 Authorization Example

Endpoint:

PATCH /projects/:id

Request lifecycle:

auth middleware → isProjectOwner middleware → controller


- `auth` → memverifikasi JWT  
- `isProjectOwner` → memastikan hanya pemilik project yang dapat mengedit project  

---

## 🗂 Database Design

Relasi utama dalam sistem:

- User 1..* Project  
- Project 1..* Task  
- User many-to-many Project (member system)  

Soft delete menggunakan field:

deletedAt: DateTime?

Data tidak dihapus permanen, tetapi ditandai dengan timestamp untuk menjaga integritas dan audit trail.

---

## 📊 Audit Log

Setiap aktivitas penting seperti:

- Create project  
- Update task  
- Delete data  

Akan tercatat dalam sistem audit untuk monitoring dan accountability.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository

git clone https://github.com/achmadwirra/taskflow.git

cd taskflow

### 2️⃣ Install dependencies

npm install

### 3️⃣ Setup environment variables

Buat file `.env` lalu isi:

DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
JWT_SECRET="your-secret-key"


### 4️⃣ Run migration

npx prisma migrate dev


### 5️⃣ Start development server

npm run dev


---

## 🎯 Role in This Project

Saya berperan sebagai **Fullstack Developer**, bertanggung jawab atas:

- System design  
- Database modeling  
- REST API development  
- Authentication & authorization  
- Frontend integration  
- Audit log implementation  

---

## 🚀 Future Improvements

- Dockerization  
- CI/CD pipeline  
- Unit & integration testing  
- Microservices architecture  

---

## 📌 Conclusion

TaskFlow dirancang sebagai scalable task management system dengan fokus pada clean architecture, security, dan maintainability.

Project ini siap dikembangkan lebih lanjut ke production environment.

