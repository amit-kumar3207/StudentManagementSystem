
# Student Management System

A simple full-stack Student Management System built using HTML, CSS, JavaScript, Node.js, Express.js and MySQL.

## Features

- Dashboard with student statistics
- Add new students
- View all students
- Edit student details
- Delete student records
- Search students
- Filter students by course and status
- Sort student records
- Update student status
- Recent students section
- Responsive design

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

## Project Structure

```text
StudentManagementSystem/
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## How to Run the Project

1. Clone or download this repository.
2. Open the backend folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Configure your MySQL database credentials in the `.env` file.
5. Start the backend server:

```bash
node server.js
```

6. Open `frontend/index.html` using Live Server.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | Get all students |
| POST | /api/students | Add a student |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |

## Author

Created as a Full Stack Development Practice Project.
