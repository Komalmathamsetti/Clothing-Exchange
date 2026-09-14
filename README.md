ClothSwap — Clothing Exchange & Swap Marketplace

ClothSwap is a full-stack web application that provides a dedicated platform for users to list, discover, exchange, and manage pre-owned clothing. The platform simplifies clothing exchange through structured listings, swap requests, real-time communication, notifications, reviews, disputes, and administrative management.

✨ Features
👤 User Authentication & Profile
User registration and login
JWT-based authentication
Google Sign-In
Role-based authorization
User profile management
Profile picture upload
Password change
Account management
Dashboard statistics
👕 Clothing Management
Create clothing listings
Add detailed clothing information
Upload multiple clothing images
Cloud-based image storage using Cloudinary
Edit own listings
Manage listing availability
View detailed clothing information
🔎 Clothing Discovery
Browse available clothing
Category-based filtering
City-based clothing search
Optional state-based filtering
Case-insensitive location matching
Users' own listings are excluded from location results

Note: The current location feature uses city and state filtering. It does not perform GPS distance or radius calculations.

💰 Clothing Value Calculator
Provides an estimated value for clothing items
Helps users compare items during potential exchanges
🔄 Swap Management
Send swap requests
Receive incoming swap requests
Accept swap requests
Reject swap requests
Cancel applicable requests
View swap history
Track swap status
💬 Real-Time Chat
Chat between swap participants
Persistent message storage
Real-time message delivery
Socket.IO integration
Authorized access to swap conversations
🔔 Notifications

Notifications are generated for important events such as:

New clothing listings
New swap requests
Accepted swaps
Rejected swaps
Cancelled swaps
New messages
Raised disputes
Dispute status updates
Administrative announcements
⭐ Reviews & Ratings
Rate eligible swap participants
Add review comments
View received reviews
View submitted reviews
Prevent duplicate reviews for the same swap
Automatic average-rating calculation
Display latest reviews
⚠️ Dispute Management
Raise disputes related to swaps
Add dispute descriptions
Add dispute messages
Track dispute status
Administrator dispute management
🛡️ Admin Dashboard

Administrators can manage and monitor:

Users
Clothing listings
Swaps
Disputes
Platform statistics and analytics
🏗️ Project Architecture
ClothSwap
│
├── Frontend
│   ├── React.js
│   ├── React Router
│   ├── Tailwind CSS
│   ├── Axios
│   └── Socket.IO Client
│
└── Backend
    ├── Node.js
    ├── Express.js
    ├── PostgreSQL
    ├── JWT
    ├── bcrypt
    ├── Cloudinary
    └── Socket.IO
Application Flow
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │  User Interface     │
                    │  Forms & Pages      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Routes              │
                    │ Controllers         │
                    │ Services            │
                    │ Middleware          │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └──────────────┐
              ▼                                   ▼
     ┌─────────────────┐                 ┌─────────────────┐
     │   PostgreSQL    │                 │   Cloudinary    │
     │                 │                 │                 │
     │ Users           │                 │ Clothing Images │
     │ Listings        │                 │ Profile Images  │
     │ Swaps           │                 └─────────────────┘
     │ Messages        │
     │ Reviews         │
     │ Disputes        │
     │ Notifications   │
     └─────────────────┘
🛠️ Technology Stack
Technology	Purpose
React.js	Frontend development
React Router	Client-side routing
Tailwind CSS	UI styling
Axios	API communication
Node.js	Backend runtime
Express.js	REST API
PostgreSQL	Database
Neon	Cloud PostgreSQL hosting
JWT	Authentication
bcrypt	Password hashing
Google Sign-In	Google authentication
Cloudinary	Image storage
Socket.IO	Real-time chat and notifications
Git	Version control
GitHub	Source code management
📁 Project Structure
ClothSwap/
│
├── Backend/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── uploads/
│   ├── utils/
│   ├── validators/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
⚙️ Installation
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/clothswap.git
cd clothswap
2. Install Backend Dependencies
cd Backend
npm install
3. Install Frontend Dependencies
cd ../Frontend
npm install
🔐 Environment Variables
Backend

Create a .env file inside the Backend directory:

PORT=5000
NODE_ENV=development

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id

FRONTEND_URL=http://localhost:5173
Frontend

Create a .env file inside the Frontend directory:

VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

Never commit .env files or secret credentials to GitHub.

🗄️ Database Setup

ClothSwap uses PostgreSQL.

The database contains tables for:

users
categories
clothing_items
clothing_images
swap_requests
chats
messages
reviews
disputes
dispute_messages
notifications

Make sure the PostgreSQL database is running and the DATABASE_URL
points to the correct database before starting the backend.

▶️ Running the Application
Start Backend

Open a terminal:

cd Backend
npm start

The backend will run on:

http://localhost:5000
Start Frontend

Open another terminal:

cd Frontend
npm run dev

The frontend will run on:

http://localhost:5173
🔄 Main User Workflow
Register / Login
       │
       ▼
Complete Profile
       │
       ▼
Create Clothing Listing
       │
       ▼
Upload Clothing Images
       │
       ▼
Browse / Search Clothing
       │
       ▼
Select Another User's Item
       │
       ▼
Send Swap Request
       │
       ▼
Chat With Participant
       │
       ▼
Accept / Reject Request
       │
       ▼
View Swap History
       │
       ▼
Submit Review
       │
       ▼
Rate Participant
🔒 Security

The application implements several security measures:

JWT-based authentication
Password hashing with bcrypt
Role-based authorization
Protected API routes
Resource ownership checks
Parameterized PostgreSQL queries
Input validation
File upload validation
Environment-based secret management
CORS configuration
HTTP security middleware
🧪 Testing

The project should be tested across the following areas:

Authentication
Valid registration
Duplicate registration
Valid login
Invalid credentials
Invalid JWT
Google authentication
Unauthorized admin access
Clothing
Create listing
Edit listing
Multiple image upload
Invalid image upload
Category filtering
Clothing details
Location
City filtering
City + state filtering
Case-insensitive matching
Different city
Different state
Empty search results
Exclusion of own listings
Swaps
Create request
Accept request
Reject request
Cancel request
Unauthorized request operations
Swap history
Chat
Open authorized chat
Send message
Receive real-time message
Unauthorized chat access
Message notification
Reviews
Submit review
Rating validation
Duplicate review prevention
Self-review prevention
Average rating calculation
Latest reviews
Disputes
Create dispute
Add dispute message
Unauthorized access
Admin status update
Notifications
New swap notification
Swap status notification
Message notification
Dispute notification
🚀 Future Enhancements

Possible future improvements include:

GPS and radius-based clothing discovery
Map-based search
AI-based clothing recommendations
AI image analysis
Fraud detection
Advanced search filters
Improved reputation metrics
Mobile application
Redis caching
Background job processing
Advanced analytics and monitoring
🌱 Project Motivation

ClothSwap focuses on encouraging clothing reuse by making it easier
for people to exchange clothing instead of leaving usable garments
unused or discarding them.

The project combines sustainability with modern full-stack web
development to create a practical peer-to-peer exchange platform.

👩‍💻 Development Highlights

This project demonstrates practical experience with:

Full-stack application development
REST API design
React component development
PostgreSQL database design
Authentication and authorization
Cloud services
Real-time WebSocket communication
File uploads
Location-based filtering
Transaction workflows
Notification systems
Reviews and ratings
Dispute management
Admin dashboards
Git-based development
📄 License

This project was developed as an academic/project implementation.

⭐ ClothSwap

ClothSwap — Exchange. Reuse. Sustain.
