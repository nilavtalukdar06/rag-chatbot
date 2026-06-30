# 🤖 RAG Chatbot Application

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-Latest-black)
![LangChain](https://img.shields.io/badge/LangChain-Latest-green)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-purple)

A modern, highly interactive, and intelligent Retrieval-Augmented Generation (RAG) Chatbot built with cutting-edge web technologies. This application allows users to upload PDF documents, processes them into vector embeddings, and enables a conversational AI interface to answer questions based strictly on the provided context.

## ✨ Features

- **Document Ingestion**: Upload and parse PDF documents effortlessly.
- **Context-Aware AI Chat**: High-quality conversational interface powered by Google's Gemini models via Vercel AI SDK.
- **Retrieval-Augmented Generation (RAG)**: Integrates LangChain and Qdrant to retrieve precise, relevant document context before generating answers.
- **Modern User Interface**: Built with Tailwind CSS v4, Shadcn UI components, and Framer Motion for buttery-smooth animations.
- **Authentication**: Secure user login and management powered by Clerk.
- **Database**: Drizzle ORM with MySQL for robust relational data management (e.g., chat histories).
- **Streaming Responses**: Real-time token streaming for a snappy, ChatGPT-like user experience.
- **Dark Mode**: Fully supported dark/light themes.

## 🏗️ Architecture Diagram

Below is the high-level architecture of how the RAG pipeline processes user queries and document uploads:

```mermaid
graph TD
    %% Define styles
    classDef frontend fill:#3182ce,stroke:#2b6cb0,stroke-width:2px,color:#fff;
    classDef backend fill:#4a5568,stroke:#2d3748,stroke-width:2px,color:#fff;
    classDef ai fill:#805ad5,stroke:#553c9a,stroke-width:2px,color:#fff;
    classDef db fill:#38a169,stroke:#276749,stroke-width:2px,color:#fff;

    A[👤 User] -->|1. Uploads PDF| C
    A -->|3. Asks Question| B

    subgraph "Frontend (Next.js App Router)"
    B(Chat Interface UI):::frontend
    end

    subgraph "Document Processing Pipeline"
    C(PDF Parser & Text Splitter):::backend
    D[Embedding Model]:::ai
    C -->|Chunks| D
    D -->|Vectors| E
    end

    subgraph "Vector Storage & Retrieval"
    E[(Qdrant Vector DB)]:::db
    end

    subgraph "RAG Engine (API Routes)"
    F(API Route Handler):::backend
    end

    subgraph "Large Language Model"
    G[Gemini / AI SDK Model]:::ai
    end

    B -->|4. User Query| F
    F -->|5. Vector Search| E
    E -->|6. Relevant Context| F
    F -->|7. Query + Context Injected Prompt| G
    G -->|8. Streamed AI Response| B
```

## 🛠️ Tech Stack & Dependencies

### Core Framework & UI
- **[Next.js](https://nextjs.org/)** (v16.2.9): React framework for server-rendered applications and API routes.
- **[React](https://react.dev/)** (v19.2.4): UI library.
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.x): Utility-first CSS framework.
- **[Shadcn UI](https://ui.shadcn.com/)**: Reusable UI components.
- **[Motion](https://motion.dev/)**: For interactive micro-animations and page transitions.
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
- **[Next Themes](https://github.com/pacocoursey/next-themes)**: For seamless dark/light mode switching.

### AI & RAG Engine
- **[Vercel AI SDK](https://sdk.vercel.ai/docs)** (`ai`, `@ai-sdk/react`, `@ai-sdk/google`): Unified API for streaming text and chat UIs.
- **[LangChain](https://js.langchain.com/)** (`@langchain/core`, `@langchain/openai`, `@langchain/qdrant`, `@langchain/textsplitters`): Orchestration framework for LLMs and document chunking.
- **[Qdrant](https://qdrant.tech/)**: High-performance vector search engine for storing embeddings.
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)**: Extracting raw text from uploaded PDF files.

### Backend, Auth & DB
- **[Clerk](https://clerk.com/)** (`@clerk/nextjs`): Secure authentication and user management.
- **[Drizzle ORM](https://orm.drizzle.team/)**: Type-safe ORM for database interactions.
- **[MySQL2](https://github.com/sidorares/node-mysql2)**: Fast MySQL driver for Node.js.
- **[React Query](https://tanstack.com/query/latest)**: For robust client-side data fetching and caching.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) and [Bun](https://bun.sh/) installed.

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd rag-chatbot
bun install
```

### 2. Environment Variables
Create a `.env` file in the root directory and configure the necessary credentials:

```env
# Next.js App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=mysql://user:password@host:port/dbname

# Qdrant Vector DB
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key

# AI Providers
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key_for_embeddings
```

### 3. Database Migration
Push your Drizzle schema to your MySQL database:
```bash
bun run drizzle-kit push
```

### 4. Run the Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   │   ├── (auth)/    # Clerk authentication routes
│   │   ├── api/       # API endpoints (chat, document processing)
│   │   └── pricing/   # Pricing or subscription pages
│   ├── components/    # Reusable React UI components (Shadcn, layouts)
│   ├── db/            # Drizzle ORM schemas and database connection
│   ├── lib/           # Utility functions, system prompts, AI helpers
│   ├── server/        # Server actions or backend logic
│   ├── services/      # Abstractions for Qdrant, LangChain, etc.
│   ├── styles/        # Global CSS and Tailwind configurations
│   └── types/         # TypeScript definitions
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
