🌌 Gemini Frontend Clone – Kuvaka Tech Assignment
A Gemini-style conversational AI chat application built as part of the Frontend Developer assignment for Kuvaka Tech.
This project demonstrates modern UI/UX patterns, OTP-based authentication, chatroom management, simulated AI messaging, image uploads, and fully responsive design – all crafted with React and Zustand.

🚀 Live Demo
🌐 View Live App

🔑 Default OTP for Login: 1234

📌 Features
1. Authentication
OTP-based Login/Signup with country code selection.

Live country dial code fetch via restcountries.com API.

OTP sending & validation simulated using setTimeout.

Form validation powered by React Hook Form + Zod.

Error handling with Toast notifications.

2. Dashboard
List of all user chatrooms.

Create/Delete chatrooms with confirmation toasts.

Debounced search to quickly filter chatrooms by title.

3. Chatroom Interface
Interactive chat UI with:

User & AI messages (timestamps included).

Typing indicator → "Gemini is typing...".

Simulated AI responses with delay throttling.

Reverse infinite scroll for older messages.

Client-side pagination (20 messages per load).

Image uploads with instant local preview.

Copy-to-clipboard on message hover.

Auto-scroll to the latest message.

4. Global UX Enhancements
Mobile-responsive and adaptive design.

LocalStorage persistence for authentication and chat history.

Loading skeletons for smooth UI experience.

Keyboard accessibility for all major actions.

🛠️ Tech Stack
Feature	Tech Used
Framework	React 18
State Management	Zustand
Form Validation	React Hook Form + Zod
Styling	Tailwind CSS
Deployment	Netlify
API	restcountries.com
Image Upload	Base64 / Local Preview URL
AI Simulation	setTimeout (Simulated + Throttled)

📂 Installation & Setup
1️⃣ Clone the repository

bash
Copy
Edit
git clone <your-repo-url>
cd gemini-frontend-clone
2️⃣ Install dependencies

bash
Copy
Edit
npm install
3️⃣ Start development server

bash
Copy
Edit
npm start
4️⃣ Login using default OTP

plaintext
Copy
Edit
OTP: 1234
