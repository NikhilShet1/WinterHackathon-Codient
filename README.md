Project Name: Silent Signals

Description
Silent Signals is an AI-powered academic early-warning system designed to identify students who may be gradually disengaging from academics by analyzing routine behavioral signals.

Instead of relying on self-reported surveys or intrusive monitoring, the system uses objective academic indicators such as attendance patterns and sleep behavior to surface early warning signs. These signals are processed through explainable rule-based metrics, while Google Gemini AI interprets historical trends to generate meaningful insights and mentor recommendations.

The project emphasizes early intervention, explainability, and privacy-aware design, making it suitable for educational institutions, mentoring programs, and academic support systems.


Features:
-Supports manual entry and Excel (XLSX/CSV) uploads for attendance and sleep data
-Rule-based calculation of stress, mood, and risk levels (Low / Medium / High)
-Uses Gemini AI to analyze historical student patterns and generate actionable insights
-Detects disengagement trends before academic failure occurs
-Relies only on routine, non-intrusive academic signals
-Privacy-aware system design

## Tech Stack
Frontend
-Language:TypeScript
-Framework:React (Vite)
-UI Styling:Tailwind CSS
-Data Visualization:Recharts
-File Processing:XLSX(Excel sheet import)

Backend
-Runtime:Node.js(TypeScript)
-Backend Platform:Firebase Cloud Function
-AI Integration:Gemini (Gemini 1.5 Pro)

Database: Firebase Firestore
Data Model: NoSQL (student behavioral time-series records)

Development & Testing 
-Local Testing:Firebase Emulator Suite
-Package Management:npm
-Build Tool:Vite

## Google Technologies Used

- **Firebase Firestore**
- Intended to store student behavioral records (attendance, sleep hours, stress etc)
- Stores user profiles(mentor/student)
- **Firebase Cloud Functions**
- Acts as the secure backend API layer (handling authentication request, student data storage & retrieval)
- **Firebase Emulator Suite**
- Used to locally test backend logic during development
- Local testing of cloud functions and Firestore interactions.



## Team Members
- Nikhil Shet - Front end
- Ashwal Lawrence Dmello - Front end
- Aaron Tauro- Project backend lead
- Chris Dsouza-Firebase emulator backend

