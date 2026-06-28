# NexMeet 🚀

A real-time video conferencing web application built using the **MERN stack**, enabling secure authentication, live meetings, chat, and screen sharing.

## 🔗 Live & Source

* **Live Demo:** [https://nextmeet-jkhf.onrender.com](https://nexmeet-jkhf.onrender.com)
* **GitHub Repository:** [https://github.com/rishik-karthik/NexMeet](https://github.com/rishik-karthik/NexMeet)

---

## 🛠 Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Real-Time Communication:** WebRTC, Socket.IO
* **Authentication:** JWT, bcrypt (password encryption)
* **API Handling:** Axios

---

## ✨ Features

* Secure user authentication
* Real-time video calling using **WebRTC**
* Live chat during meetings
* Screen sharing support
* Meeting history tracking
* Real-time signaling using **Socket.IO**
* Encrypted passwords with **bcrypt**

---

## 📂 Project Structure

```
NexMeet/
├── client/        # React frontend
├── server/        # Node + Express backend
├── models/        # MongoDB schemas
├── routes/        # API routes
├── controllers/   # Business logic
└── socket/        # Socket.IO logic
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rishik-karthik/NexMeet.git
cd NexMeet
```

### 2️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the **server** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run the application

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```

---

## 📌 Learning Outcomes

* Built a complete **full-stack MERN application**
* Implemented **real-time communication** using WebRTC and Socket.IO
* Gained hands-on experience with authentication & security
* Understood signaling, peer connections, and media streams

---

## 🚧 Future Improvements

* Recording meetings
* Improved UI/UX
* Mobile responsiveness
* Notifications & invite links

---

## 🤝 Feedback

Suggestions and improvements are always welcome. Feel free to open an issue or contribute!
