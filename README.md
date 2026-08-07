<h1 align="center">DebugDeer 🦌</h1>

<p align="center">
  An AI-powered code review and debugging assistant that analyzes pull requests, detects issues, and helps developers ship cleaner, more reliable code faster.
</p>

<div align="center">
  <img src="./client/public/banner-readme.jpg" alt="DebugDeer Banner" width="900">
</div>

## 🔋 Features

- 🧠 **AI-powered code reviews** for pull requests and commits
- 🐞 **Automatic bug detection** with actionable suggestions
- 🔍 **Code quality analysis** covering best practices and anti-patterns
- 🔐 **Secure authentication** with GitHub OAuth integration
- ⚙️ **Repository-level insights** with contextual feedback
- 🤖 **Developer-friendly comments** directly on PRs
- ⚡ **Fast and scalable architecture** for real-time analysis
- 🧩 **Language-agnostic design** with an extensible rule engine

## ⚙️ Tech Stack

- 🧠 **AI Engine:** Gemini
- 🌐 **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- 🛠 **Backend:** Express.js, TypeScript, Bun
- 🔐 **Authentication:** Better Auth
- 🔄 **Integrations:** GitHub Webhooks, REST APIs, Octokit
- 📦 **Database:** PostgreSQL, Drizzle ORM
- ⚡ **Background Jobs:** Inngest
- 🧠 **Vector Database:** Pinecone

## 🤸 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- PostgreSQL database
- GitHub OAuth App credentials
- Pinecone account and index
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/soumadip-dev/DebugDeer.git
cd DebugDeer
```

### 2. Backend Setup

```bash
cd server
bun install
```

Create a `.env` file in the `server` directory:

```env
# Server
PORT=8080
BUN_ENV=development

# Database
DATABASE_URL=<YOUR_DATABASE_URL>

# Better Auth
BETTER_AUTH_SECRET=<YOUR_BETTER_AUTH_SECRET>
BETTER_AUTH_URL=http://localhost:8080

# Github
GITHUB_CLIENT_ID=<YOUR_GITHUB_CLIENT_ID>
GITHUB_CLIENT_SECRET=<YOUR_GITHUB_CLIENT_SECRET>

# URLs
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8080

# For webhook development (ngrok URL)
PUBLIC_APP_BASE_URL=<YOUR_NGROK_URL>

# Pinecone
PINECONE_DB_API_KEY=<YOUR_PINECONE_API_KEY>
PINECONE_DB_INDEX_NAME=<YOUR_PINECONE_INDEX_NAME>

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=<YOUR_GEMINI_API_KEY>
```

### 3. Database Setup

Generate and apply migrations:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

For development, you can directly push the schema:

```bash
bunx drizzle-kit push
```

### 4. Frontend Setup

```bash
cd ../client
bun install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 5. Run the Application

You'll need to run several services simultaneously:

#### Terminal 1 - Backend Server

```bash
cd server
bun run dev
```

#### Terminal 2 - Frontend Client

```bash
cd client
bun run dev
```

#### Terminal 3 - Ngrok (for GitHub Webhooks)

```bash
ngrok http 8080
```

After running ngrok, copy the generated URL and update:

- `PUBLIC_APP_BASE_URL` in server `.env`
- GitHub App webhook URL to `your-ngrok-url/api/github/webhook`

#### Terminal 4 - Inngest Dev Server (for background jobs)

```bash
npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:8080/api/inngest
```

## 🔧 Development

- Frontend runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:8080`
- Inngest dev server: `http://localhost:8288` (default)

## 🔐 GitHub App Setup

1. Create a GitHub OAuth App at GitHub Developer Settings
2. Set Homepage URL: `http://localhost:5173`
3. Set Authorization callback URL: `http://localhost:8080/api/auth/callback/github`
4. Copy Client ID and Secret to server `.env`

## 🧪 Testing Webhooks Locally

1. Start ngrok: `ngrok http 8080`
2. Update `PUBLIC_APP_BASE_URL` with ngrok URL
3. Configure GitHub App webhook with ngrok URL
4. Test by creating a PR in your test repository

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[MIT](LICENSE)

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Background jobs by [Inngest](https://www.inngest.com)
- Vector database by [Pinecone](https://www.pinecone.io)
