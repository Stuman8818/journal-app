Daily Quest Book App
A cozy habit-tracking application inspired by the aesthetics of Stardew Valley. Track your daily habits, monitor your progress, and build a healthier lifestyle through consistent tracking and community support.
Features
Current Features:

User Accounts & Profiles - Create accounts and set up your profile with personal stats
Daily Habit Tracking - Log your daily activities including:

Water intake
Sleep hours
Cooking at home vs. eating out
Time spent outside
Physical activity
Daily journal entries

Calendar View - Browse your complete history of entries and see all logged activities
Monthly Statistics - Automatic tracking and display of monthly totals across all categories
Flexible Data Entry - Go back to any past date and add or update entries
Persistent Storage - All data saved to MongoDB for long-term tracking

Planned Features:

Community features and social interactions
Gamification system with achievements and progression
Comprehensive workout sheet and exercise tracking
Additional habit categories and customization options
Performance insights and personalized feedback

Tech Stack

Frontend: Next.js (TypeScript), Tailwind CSS
Backend: Next.js API routes
Database: MongoDB
UI Inspiration: Stardew Valley aesthetic

Getting Started
Prerequisites

Node.js (v16 or higher)
MongoDB instance (local or cloud)
npm or yarn

Installation

Clone the repository

bashgit clone [repository-url]
cd daily-quest-book-app

Install dependencies

bashnpm install

Create a .env.local file with your environment variables

MONGODB_URI=your_mongodb_connection_string

Run the development server

bashnpm run dev
Open http://localhost:3000 in your browser to see the application.
Development
Edit the application by modifying files in the app/ directory. Changes will hot-reload automatically.
This project uses next/font for font optimization and Tailwind CSS for styling.
Project Vision
Daily Quest Book is designed to help users understand their daily habits through consistent tracking and visualization. The Stardew Valley-inspired interface creates a cozy, non-judgmental space for self-reflection and improvement. Future iterations will build a supportive community where users can share progress, challenge each other, and celebrate achievements together.
