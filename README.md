TraceFlow 🚀

A real-time API monitoring and observability platform built for developers to track requests, monitor performance, analyze failures, and debug backend systems with ease.

TraceFlow allows developers to create projects, generate secure API keys, ingest logs from external applications, and visualize logs & analytics through a clean dashboard interface.

✨ Features
🔐 API Key Authentication
Generate unique API keys per project
Secure log ingestion
Project-level isolation
📥 Real-Time Log Ingestion
Send logs from any backend/application
Track:
Endpoint
HTTP Method
Status Codes
Response Time
Timestamp
📊 Analytics Dashboard
Total requests
Error rate monitoring
Average response time
Status code distribution
Request activity over time
⚡ Real-Time Updates
WebSocket-powered live log streaming
Instant dashboard refresh without reload
🎯 Log Filtering

Filter logs by:

Errors (4xx, 5xx)
Slow requests
Recent activity
🧠 Developer-Focused UX
Clean dashboard UI
Fast navigation
Minimal & scalable architecture
Designed for observability workflows
🛠️ Tech Stack
Frontend
Next.js
React
Tailwind CSS
Backend
Next.js API Routes
Prisma ORM
Socket.IO
Database
PostgreSQL / SQLite
📂 Project Structure
app/
┣ api/
┃ ┣ log/
┃ ┃ ┗ route.ts
┃ ┣ logs/
┃ ┃ ┗ route.ts
┃ ┣ projects/
┃ ┃ ┗ route.ts
┃ ┗ analytics/
┃ ┗ route.ts
┣ dashboard/
┃ ┣ projects/
┃ ┃ ┣ page.tsx
┃ ┃ ┣ create/
┃ ┃ ┗ [id]/
┃ ┃ ┣ page.tsx
┃ ┃ ┣ logs/
┃ ┃ ┗ analytics/
┃ ┗ layout.tsx
┗ layout.tsx

lib/
┣ prisma.ts
┣ validateApiKey.ts
┣ socket.ts
┗ apiKey.ts

server/
┣ index.ts
┗ socket.ts

prisma/
┗ schema.prisma
🧱 Database Schema
Project Model
model Project {
id String @id @default(cuid())
name String
apiKey String @unique
createdAt DateTime @default(now())

logs Log[]
}
Log Model
model Log {
id String @id @default(cuid())
projectId String
endpoint String
method String
status Int
responseTime Int
createdAt DateTime @default(now())

project Project @relation(fields: [projectId], references: [id])
}
🚀 Getting Started

1. Clone Repository
   git clone <your-repo-url>
   cd traceflow
2. Install Dependencies
   npm install
3. Setup Environment Variables

Create .env

DATABASE_URL="file:./dev.db"

For PostgreSQL:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/traceflow" 4. Setup Prisma
npx prisma generate
npx prisma db push 5. Run Development Server
npm run dev
📡 API Reference
Create Project
POST /api/projects
{
"name": "My Backend API"
}
Send Logs
POST /api/log

Headers:

x-api-key: YOUR_API_KEY

Body:

{
"endpoint": "/api/user",
"method": "GET",
"status": 200,
"responseTime": 120
}
Fetch Logs
GET /api/logs?projectId=PROJECT_ID
Fetch Analytics
GET /api/analytics?projectId=PROJECT_ID
⚡ Real-Time Architecture
Client App
↓
POST /api/log
↓
Validate API Key
↓
Store in Database
↓
Emit WebSocket Event
↓
Dashboard Updates Instantly
🎨 UI Highlights
Minimal developer-focused dashboard
Status color indicators
Live updating logs
Responsive layout
Analytics visualizations
Clean observability-inspired design
🔮 Future Improvements
Authentication (Clerk / NextAuth)
Team collaboration
Rate limiting
Error grouping
Search & pagination
Alerting system
Deployments & uptime monitoring
AI-powered anomaly detection
🧠 What I Learned

Building TraceFlow helped strengthen my understanding of:

Full-stack architecture
API design
Real-time systems
WebSocket communication
Database relationships
Backend debugging
Observability tooling
Scalable dashboard design
📜 License

MIT License

👨‍💻 Author

Built by Akshat Thapliyal

GitHub: https://github.com/akiyl/
