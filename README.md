# MaziwaHub – Dairy Cooperative Management System

## 1. Project Overview

MaziwaHub is a web-based dairy cooperative management system designed to help Elgon Valley Dairy Cooperative manage farmer information, milk deliveries, payments and monthly reports.

The system improves record keeping, data accuracy, security and reporting.

## 2. Technologies Used

- Node.js
- Express.js
- MySQL
- HTML, CSS and JavaScript
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- Jest
- Supertest
- Postman

## 3. Main Features

- Farmer registration and authentication.
- Role-based access control for farmers, clerks and managers.
- Secure login using password hashing.
- Recording milk deliveries.
- Viewing farmer and collection centre reports.
- Certificate file uploads.
- Automated API testing.

## 4. User Roles

- Farmer: Can view their own payment information.
- Clerk: Can record deliveries and access permitted farmer records.
- Manager: Can manage cooperative operations and access management reports.

## 5. Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd MaziwaHub
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and configure the required environment variables.

## 6. Environment Variables

The application requires:

- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- PORT

Do not upload the `.env` file to GitHub.

## 7. Running the Application

Start the server:

```bash
npm start
```

The application runs on the configured port, using port 3000 by default.

## 8. Automated Testing

Run the automated tests:

```bash
npm test
```

The delivery API includes tests for successful delivery recording, missing litres, missing authentication tokens and non-existent farmers.

## 9. Health Check

The application provides a health-check endpoint:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

## 10. Project Purpose

MaziwaHub demonstrates how web technologies can support dairy cooperative operations through secure authentication, delivery management, reporting and automated testing.