# SwiftQ - Queue Management System

SwiftQ is a modern web-based queue management system designed to streamline waiting experiences in various settings such as restaurants, clinics, offices, or any place where people need to wait in line. The application allows businesses to create and manage virtual queues, while providing customers with real-time updates about their position in line.

![SwiftQ Logo](/public/swiftqIcon.png)

## Features

### For Queue Hosts

- **Easy Queue Creation**: Create queues with customizable settings
- **Real-time Queue Management**: View and manage customers in your queues
- **Customer Notification**: Notify customers when it's their turn
- **QR Code Generation**: Generate scannable QR codes for easy queue joining
- **Wait Time Estimation**: Set estimated wait times per customer
- **Analytics**: View statistics about queue performance and wait times
- **Multiple Queue Support**: Create and manage multiple queues simultaneously

### For Customers

- **Simple Queue Joining**: Join queues through QR codes or queue codes
- **Real-time Position Updates**: See position in queue and estimated wait time
- **Notifications**: Receive notifications when it's their turn
- **No Account Required**: Join queues without creating an account

## Technologies Used

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Routing**: React Router v7
- **UI Components**: Custom components with Tailwind
- **QR Code**: qrcode.react for generation
- **Notifications**: Browser notifications and audio alerts

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/MohamDahALU/foundations-swiftq.git
cd foundations-swiftq
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication (Email/Password)
   - Set up Firestore Database

4. Configure Firebase credentials
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage Guide

### Host Flow

1. **Create an Account/Sign In**
   - Register as a new user or sign in with existing credentials

2. **Create a Queue**
   - Click "Create Queue" and fill in the queue details
   - Set queue name, enable/disable name requirement, and set estimated wait time per customer

3. **Manage Your Queue**
   - View all customers in your queue
   - Serve customers when it's their turn
   - Skip customers if needed
   - Generate QR codes for easy joining

4. **View Analytics**
   - Track queue performance metrics
   - Analyze wait times and customer flow

### Customer Flow

1. **Join a Queue**
   - Scan the QR code provided by the host
   - Or enter the queue code manually on the join page
   - Fill in required information (name if required)

2. **Monitor Position**
   - View real-time position in queue
   - See estimated wait time
   - Receive notification when it's your turn

## Project Structure

```
foundations-swiftq/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── firebase/        # Firebase configuration and services
│   │   ├── config.ts    # Firebase initialization
│   │   ├── schema.ts    # TypeScript interfaces for data models
│   │   └── services/    # Firebase service functions
│   ├── pages/           # Application pages/routes
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
├── .env                 # Environment variables (not in repo)
└── package.json         # Project dependencies
```

## Team

This project was developed by:

- Mohamed Dahab - Lead Developer & Project Coordinator
- Josiane Mukeshimana - Frontend Developer & Component Specialist
- Ihuoma Goodluck Ogbonna - Backend Developer & Firebase Expert
- Joshua Chukwuebuka Moses - UI Designer & Frontend Implementation
- Fawziyyah Oke - Project Manager & User Experience Designer
- Hassan Luqman - Technical Architect & Code Reviewer
