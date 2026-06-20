#  ANVIA – Animal Rescue Network

## 📌 Overview
ANVIA is a full-stack animal rescue platform built using the MERN stack.  
It helps users report animal rescue cases, allows volunteers to participate in rescue activities, enables donations, and provides an admin dashboard to manage rescue operations.

---

## 📖 Definitions

### MERN Stack
Full-stack development stack consisting of MongoDB, Express.js, React.js, and Node.js.

### JWT Authentication
Secure authentication method using JSON Web Tokens to verify users after login.

### Google Authentication
Login method that allows users to sign in using their Google account.

### Role-Based Access Control
System that provides different permissions and access levels based on user roles such as User, Volunteer, and Admin.

### REST API
Interface used for communication between frontend and backend using HTTP methods.

### React.js
JavaScript library used to build interactive user interfaces.

### Express.js
Backend framework used for building APIs and server-side logic.

### MongoDB
NoSQL database used to store users, rescue reports, volunteer details, donations, and admin data.

### Razorpay
Payment gateway used to handle online donations securely.

### Responsive UI
User interface that works properly on desktops, tablets, and mobile devices.

### Admin Dashboard
Control panel used by administrators to manage rescue cases, users, volunteers, and platform activities.

### API Integration
Connecting frontend pages with backend APIs for authentication, rescue reports, donations, and user management.

---

## 🚀 Features

### 1. Authentication & Authorization
- Secure login and registration using JWT  
- Google login authentication  
- Role-based access for Users, Volunteers, and Admin  

### 2. Rescue Case Management
- Users can report animal rescue cases  
- Users can view rescue feeds and rescue details  
- Volunteers can access and participate in rescue-related activities  

### 3. Volunteer Features
- Users can apply or work as volunteers  
- Volunteers can manage rescue involvement  
- Volunteer status and points are maintained  

### 4. Donation System
- Users can donate for animal rescue causes  
- Razorpay payment gateway integration  
- Rescue-specific and general donation options  

### 5. Admin Dashboard
- Admin can manage platform activities  
- Admin can monitor users, volunteers, rescues, and donations  
- Role-based protected access  

### 6. Role-Based Dashboards
- Separate dashboards for User, Volunteer, and Admin  
- Protected routes based on roles  
- Dynamic UI based on login status  

---

## 🛠️ Technologies Used
- React.js  
- Tailwind CSS  
- Node.js  
- Express.js  
- MongoDB  
- JWT Authentication  
- Google OAuth  
- Razorpay  
- REST APIs  
- Render (Backend Deployment)  
- Vercel (Frontend Deployment)  

---

⚙️ How to Run (Short)
1. Clone Project
git clone https://github.com/your-username/anvia.git
cd anvia
2. Backend
cd backend
npm install
npm run dev
3. Frontend
cd frontend
npm install
npm run dev
4. Open App
Frontend: http://localhost:5173
Backend: http://localhost:5000
5. Add .env

Make sure both frontend and backend .env files are configured before running.
