import { Snippet } from '../types';

export const initialSnippets: Snippet[] = [
  // UBUNTU - NETWORKING
  {
    id: 'snip-1',
    title: 'Check Active Listening Ports and PID',
    description: 'Find all listening TCP/UDP ports with associated application processes',
    content: 'sudo ss -tulpn | grep LISTEN',
    language: 'bash',
    folderId: 'ubuntu-networking',
    tags: ['ubuntu', 'networking', 'ports', 'ss'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-27T14:20:00Z',
    usageCount: 42
  },
  {
    id: 'snip-2',
    title: 'UFW Firewall Port Enable Rule',
    description: 'Allow incoming SSH and custom application port through UFW',
    content: 'sudo ufw allow 22/tcp\nsudo ufw allow 8080/tcp\nsudo ufw status verbose',
    language: 'bash',
    folderId: 'ubuntu-networking',
    tags: ['ufw', 'firewall', 'security'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-21T11:30:00Z',
    updatedAt: '2026-07-25T09:15:00Z',
    usageCount: 18
  },
  {
    id: 'snip-3',
    title: 'Curl HTTP Response Time Benchmark',
    description: 'Measure DNS lookup, connect, and total request time in seconds',
    content: 'curl -s -o /dev/null -w "DNS: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTTFB: %{time_starttransfer}s\\nTotal: %{time_total}s\\n" https://api.github.com',
    language: 'bash',
    folderId: 'ubuntu-networking',
    tags: ['curl', 'benchmark', 'latency', 'http'],
    isFavorite: true,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-22T08:00:00Z',
    updatedAt: '2026-07-26T16:00:00Z',
    usageCount: 29
  },

  // UBUNTU - DOCKER
  {
    id: 'snip-4',
    title: 'Docker Cleanup Unused Containers & Volumes',
    description: 'Deep prune stop containers, dangling images, and anonymous volumes',
    content: 'docker system prune -a --volumes --force',
    language: 'bash',
    folderId: 'ubuntu-docker',
    tags: ['docker', 'cleanup', 'devops'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-28T08:10:00Z',
    usageCount: 88
  },
  {
    id: 'snip-5',
    title: 'Multi-stage Dockerfile for Node.js App',
    description: 'Production-ready minimal Alpine Node.js multi-stage build',
    content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
    language: 'dockerfile',
    folderId: 'ubuntu-docker',
    tags: ['docker', 'nodejs', 'multistage', 'alpine'],
    isFavorite: true,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-18T14:00:00Z',
    updatedAt: '2026-07-27T11:45:00Z',
    usageCount: 35
  },
  {
    id: 'snip-6',
    title: 'Docker Compose Postgres & Redis Dev Cluster',
    description: 'Local development setup with database volumes and health checks',
    content: `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d app_dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
    language: 'yaml',
    folderId: 'ubuntu-docker',
    tags: ['docker-compose', 'postgres', 'redis', 'dev'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-19T10:20:00Z',
    updatedAt: '2026-07-24T15:30:00Z',
    usageCount: 52
  },

  // UBUNTU - GIT
  {
    id: 'snip-7',
    title: 'Git Undo Last Commit Keep Changes',
    description: 'Soft reset back to previous commit while retaining local modifications',
    content: 'git reset --soft HEAD~1',
    language: 'bash',
    folderId: 'ubuntu-git',
    tags: ['git', 'reset', 'undo'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-07-28T07:50:00Z',
    usageCount: 94
  },
  {
    id: 'snip-8',
    title: 'Git Pretty Graph Log Alias',
    description: 'A readable colorized branch history terminal log',
    content: 'git config --global alias.lg "log --graph --oneline --decorate --all"',
    language: 'bash',
    folderId: 'ubuntu-git',
    tags: ['git', 'alias', 'log', 'terminal'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-12T09:30:00Z',
    updatedAt: '2026-07-22T10:10:00Z',
    usageCount: 23
  },
  {
    id: 'snip-9',
    title: 'Git Stash Specific File',
    description: 'Stash changes for a single file instead of working directory',
    content: 'git stash push -m "temp stash for feature" src/components/Sidebar.tsx',
    language: 'bash',
    folderId: 'ubuntu-git',
    tags: ['git', 'stash', 'workflow'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-14T15:40:00Z',
    updatedAt: '2026-07-26T12:00:00Z',
    usageCount: 16
  },

  // REACT
  {
    id: 'snip-10',
    title: 'Custom LocalStorage Hook in React 19',
    description: 'Type-safe React hook for syncing state with localStorage',
    content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}`,
    language: 'typescript',
    folderId: 'react',
    tags: ['react', 'hooks', 'typescript', 'localstorage'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-28T09:00:00Z',
    usageCount: 110
  },
  {
    id: 'snip-11',
    title: 'Debounce Search Input Hook',
    description: 'Delay search query state changes to prevent aggressive API triggering',
    content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
    language: 'typescript',
    folderId: 'react',
    tags: ['react', 'debounce', 'performance'],
    isFavorite: true,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-05T14:10:00Z',
    updatedAt: '2026-07-27T18:00:00Z',
    usageCount: 65
  },
  {
    id: 'snip-12',
    title: 'Zustand Store with Persist Middleware',
    description: 'Clean persistent global state store example using Zustand',
    content: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: 'app-settings' }
  )
);`,
    language: 'typescript',
    folderId: 'react',
    tags: ['zustand', 'react', 'state', 'persistence'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-08T11:00:00Z',
    updatedAt: '2026-07-24T09:30:00Z',
    usageCount: 41
  },
  {
    id: 'snip-13',
    title: 'Framer Motion Modal Transition Variant',
    description: 'Smooth backdrop overlay and modal scale-up animation preset',
    content: `import { motion, AnimatePresence } from 'motion/react';

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15, ease: 'easeIn' } }
};

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};`,
    language: 'typescript',
    folderId: 'react',
    tags: ['framer-motion', 'animation', 'modal', 'ui'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-12T16:20:00Z',
    updatedAt: '2026-07-23T14:10:00Z',
    usageCount: 27
  },

  // PYTHON
  {
    id: 'snip-14',
    title: 'FastAPI Async Middleware & CORS Setup',
    description: 'Production-ready FastAPI boilerplate with CORS and timing headers',
    content: `from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="Snippets API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": time.time()}`,
    language: 'python',
    folderId: 'python',
    tags: ['fastapi', 'python', 'cors', 'async'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-02T09:00:00Z',
    updatedAt: '2026-07-28T06:30:00Z',
    usageCount: 74
  },
  {
    id: 'snip-15',
    title: 'Python Asyncio Task Gathering pattern',
    description: 'Execute multiple API requests concurrently with exception safety',
    content: `import asyncio
import aiohttp

async def fetch_url(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url) as response:
        return await response.json()

async def main(urls: list[str]):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

# Run loop
# asyncio.run(main(['https://httpbin.org/get', 'https://api.github.com']))`,
    language: 'python',
    folderId: 'python',
    tags: ['python', 'asyncio', 'aiohttp', 'concurrency'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-06T13:45:00Z',
    updatedAt: '2026-07-21T10:00:00Z',
    usageCount: 38
  },
  {
    id: 'snip-16',
    title: 'Pydantic V2 BaseSettings Configuration',
    description: 'Type-validated environment variables loader for Python applications',
    content: `from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr

class Settings(BaseSettings):
    app_env: str = Field(default="development", alias="ENV")
    database_url: SecretStr
    redis_url: str = "redis://localhost:6379"
    api_key: SecretStr

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()`,
    language: 'python',
    folderId: 'python',
    tags: ['pydantic', 'python', 'config', 'env'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-11T10:00:00Z',
    updatedAt: '2026-07-25T11:20:00Z',
    usageCount: 22
  },

  // AI & ML
  {
    id: 'snip-17',
    title: 'Google GenAI SDK (Gemini 2.5/3.0) Text & JSON Schema Generation',
    description: 'Generate structured JSON responses with system instructions using @google/genai SDK',
    content: `import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function extractCodeMetadata(code: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Analyze this snippet and return metadata:\\n\\n\${code}\`,
    config: {
      systemInstruction: 'You are an expert developer assistant categorizing code snippets.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          language: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ['title', 'language', 'tags', 'summary']
      }
    }
  });

  return JSON.parse(response.text || '{}');
}`,
    language: 'typescript',
    folderId: 'ai',
    tags: ['ai', 'gemini', 'google-genai', 'typescript', 'json-schema'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-16T12:00:00Z',
    updatedAt: '2026-07-28T08:45:00Z',
    usageCount: 68
  },
  {
    id: 'snip-18',
    title: 'PyTorch Cosine Similarity Vector Embeddings Search',
    description: 'Compute top-K semantically similar vector embeddings in PyTorch',
    content: `import torch
import torch.nn.functional as F

def find_top_k_similar(query_embedding: torch.Tensor, docs_embeddings: torch.Tensor, k: int = 5):
    # Normalize vectors
    query_norm = F.normalize(query_embedding, p=2, dim=-1)
    docs_norm = F.normalize(docs_embeddings, p=2, dim=-1)
    
    # Cosine similarity scores
    scores = torch.mm(query_norm, docs_norm.T).squeeze(0)
    top_scores, top_indices = torch.topk(scores, k=k)
    
    return top_indices.tolist(), top_scores.tolist()`,
    language: 'python',
    folderId: 'ai',
    tags: ['ai', 'pytorch', 'vector-search', 'embeddings'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-17T15:00:00Z',
    updatedAt: '2026-07-26T14:30:00Z',
    usageCount: 31
  },
  {
    id: 'snip-19',
    title: 'LangChain Conversation Memory Buffer',
    description: 'Maintain stateful chat history in Python LangChain chains',
    content: `from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain
from langchain_community.llms import OpenAI

memory = ConversationBufferWindowMemory(k=5, return_messages=True)
conversation = ConversationChain(
    llm=OpenAI(temperature=0.7),
    memory=memory,
    verbose=True
)

response = conversation.predict(input="Summarize our architecture options")`,
    language: 'python',
    folderId: 'ai',
    tags: ['langchain', 'ai', 'llm', 'python'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-18T10:30:00Z',
    updatedAt: '2026-07-24T17:20:00Z',
    usageCount: 19
  },

  // SQL
  {
    id: 'snip-20',
    title: 'PostgreSQL Window Function CTE for Latest User Events',
    description: 'Extract row with max timestamp per group using ROW_NUMBER()',
    content: `WITH RankedLogs AS (
    SELECT 
        user_id,
        action,
        created_at,
        ROW_NUMBER() OVER (
            PARTITION BY user_id 
            ORDER BY created_at DESC
        ) AS rn
    FROM user_activity_logs
    WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT user_id, action, created_at
FROM RankedLogs
WHERE rn = 1;`,
    language: 'sql',
    folderId: 'sql',
    tags: ['sql', 'postgres', 'cte', 'window-functions'],
    isFavorite: true,
    isPinned: true,
    isTrashed: false,
    createdAt: '2026-07-04T08:00:00Z',
    updatedAt: '2026-07-27T09:10:00Z',
    usageCount: 82
  },
  {
    id: 'snip-21',
    title: 'PostgreSQL GIN Index on JSONB Column',
    description: 'Speed up JSON document attribute filtering queries',
    content: `-- Create GIN index for fast JSON queries
CREATE INDEX idx_users_metadata_gin ON users USING GIN (metadata);

-- Fast containment query
SELECT id, email, metadata->>'tier' AS plan
FROM users
WHERE metadata @> '{"status": "active", "verified": true}';`,
    language: 'sql',
    folderId: 'sql',
    tags: ['sql', 'postgres', 'jsonb', 'index'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-09T14:20:00Z',
    updatedAt: '2026-07-23T11:45:00Z',
    usageCount: 39
  },
  {
    id: 'snip-22',
    title: 'SQL Recursive CTE for Organizational Tree',
    description: 'Query hierarchical parent-child category or directory trees',
    content: `WITH RECURSIVE CategoryTree AS (
    SELECT id, name, parent_id, 1 AS depth, CAST(name AS VARCHAR(255)) AS path
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id, ct.depth + 1, CAST(ct.path || ' > ' || c.name AS VARCHAR(255))
    FROM categories c
    INNER JOIN CategoryTree ct ON c.parent_id = ct.id
)
SELECT * FROM CategoryTree ORDER BY path;`,
    language: 'sql',
    folderId: 'sql',
    tags: ['sql', 'recursive', 'tree', 'hierarchy'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-13T16:00:00Z',
    updatedAt: '2026-07-22T08:30:00Z',
    usageCount: 26
  },

  // LINUX
  {
    id: 'snip-23',
    title: 'Find and Replace Text in Directory recursively (sed/rg)',
    description: 'Replace occurrences across files skipping node_modules & .git',
    content: 'grep -rl "oldApiEndpoint" . --exclude-dir={node_modules,dist,.git} | xargs sed -i "s/oldApiEndpoint/newApiEndpoint/g"',
    language: 'bash',
    folderId: 'linux',
    tags: ['linux', 'sed', 'grep', 'terminal'],
    isFavorite: true,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-03T11:15:00Z',
    updatedAt: '2026-07-26T10:40:00Z',
    usageCount: 61
  },
  {
    id: 'snip-24',
    title: 'Disk Usage Top 10 Largest Folders',
    description: 'Inspect human-readable directory sizes sorted descending',
    content: 'du -ah /var/log | sort -rh | head -n 10',
    language: 'bash',
    folderId: 'linux',
    tags: ['linux', 'du', 'disk-space', 'sysadmin'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-07T08:30:00Z',
    updatedAt: '2026-07-20T13:10:00Z',
    usageCount: 47
  },
  {
    id: 'snip-25',
    title: 'Systemd Custom Service Configuration',
    description: 'Run background application service with automatic restart on crash',
    content: `[Unit]
Description=ClipVault Sync Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/clipvault
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target`,
    language: 'bash',
    folderId: 'linux',
    tags: ['systemd', 'linux', 'devops', 'service'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-15T11:00:00Z',
    updatedAt: '2026-07-25T14:00:00Z',
    usageCount: 29
  },

  // JAVA
  {
    id: 'snip-26',
    title: 'Spring Boot 3 Global Exception Handler',
    description: 'Structured RFC 7807 ProblemDetails API error response handler in Java',
    content: `package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.net.URI;
import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        problem.setType(URI.create("https://api.example.com/errors/not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}`,
    language: 'java',
    folderId: 'java',
    tags: ['java', 'spring-boot', 'exception-handling', 'rest-api'],
    isFavorite: true,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-10T14:00:00Z',
    updatedAt: '2026-07-26T17:30:00Z',
    usageCount: 33
  },
  {
    id: 'snip-27',
    title: 'Java 21 Virtual Threads Executor Service',
    description: 'High throughput lightweight concurrency with Java virtual threads',
    content: `import java.util.concurrent.Executors;

public class VirtualThreadExample {
    public static void main(String[] args) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 100_000; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    System.out.println("Processing task " + taskId + " on " + Thread.currentThread());
                    Thread.sleep(100);
                    return taskId;
                });
            }
        } // Auto-closes and waits for all tasks to complete
    }
}`,
    language: 'java',
    folderId: 'java',
    tags: ['java', 'concurrency', 'virtual-threads', 'java21'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-14T09:20:00Z',
    updatedAt: '2026-07-21T15:00:00Z',
    usageCount: 21
  },

  // ADDITIONAL REALISTIC SNIPPETS (TRASH & UNASSIGNED / RECENT)
  {
    id: 'snip-28',
    title: 'Quick NGINX Reverse Proxy Config',
    description: 'Reverse proxy HTTP traffic to Node/Python local app server',
    content: `server {
    listen 80;
    server_name api.local;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
    language: 'bash',
    folderId: 'ubuntu-networking',
    tags: ['nginx', 'proxy', 'ubuntu'],
    isFavorite: false,
    isPinned: false,
    isTrashed: false,
    createdAt: '2026-07-23T10:00:00Z',
    updatedAt: '2026-07-27T19:00:00Z',
    usageCount: 15
  },
  {
    id: 'snip-29',
    title: 'Old Deprecated Query Snippet',
    description: 'Temporary trash item example',
    content: 'SELECT * FROM legacy_users_table_v1 WHERE active = 0;',
    language: 'sql',
    folderId: 'sql',
    tags: ['deprecated', 'legacy'],
    isFavorite: false,
    isPinned: false,
    isTrashed: true,
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z',
    usageCount: 2
  }
];
