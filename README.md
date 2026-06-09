# 🚀 The BLAST Stack (SolidStart + Encore.ts + PostgreSQL)
The BLAST Stack is an opinionated, ultra-high-performance web architecture engineered for modern, AI-assisted development (Vibe Coding) where extreme speed, true multithreading, and a strict Single Source of Truth (SSOT) are non-negotiable.

* B — Bare-Metal Queries (Native raw database driver execution, zero ORM)
* L — Linear Truth (Database migration files act as the absolute Single Source of Truth)
* A — Atlas (Automated schema migration engine compiled by Encore)
* S — SolidStart (Fine-grained reactive UI with zero virtual-DOM overhead)
* T — Tokio-Backed Threads (Encore’s multi-threaded Rust networking core)

------------------------------
## 🏗️ Architecture Overview

```text
 ┌────────────────────────────────────────────────────────┐
 │        backend/migrations/1_init.up.sql (Plain SQL)    │ ◄─── SINGLE SOURCE OF TRUTH
 └───────────────────────────┬────────────────────────────┘
                             │
                             ├──────────────────────────────┐
                             ▼ (Encore via Atlas)           ▼ (Schema-to-TS Engine)
 ┌────────────────────────────────────────────────────────┐ ┌──────────────────────────────┐
 │               Live PostgreSQL Database                 │ │    Generated Database Types  │
 └───────────────────────────┬────────────────────────────┘ │     (db.d.ts - For Backend)  │
                             │                              └───────────────┬──────────────┘
                             ▼ (Direct Binary SQL Driver)                   │
 ┌────────────────────────────────────────────────────────┐                 │ Strong Typing
 │        Encore.ts Backend (Rust-Shielded Runtime)       │ ◄───────────────┘
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼ (Encore Type Engine)
 ┌────────────────────────────────────────────────────────┐
 │       SolidStart Frontend (Auto-Generated SDK)         │
 └────────────────────────────────────────────────────────┘
```

   1. Write Once: You alter your data structures entirely within plain, highly optimized SQL database migrations.
   2. Compile Downstream: The toolchain instantly updates the raw backend types and the end-to-end frontend type-safe client.
   3. Run Bare-Metal: At runtime, network routing is handled in Rust, while database calls execute directly via native drivers with zero ORM translation layers.

------------------------------
## ⚡ Why This Stack Destroys Performance Bottlenecks## 🚫 Zero ORM Overhead
Traditional ORMs (Prisma, TypeORM) waste massive CPU cycles parsing JavaScript objects into string queries and back again on every incoming request. The BLAST stack uses zero-runtime-cost raw SQL strings. Queries hit the database via binary protocols utilizing engine-level prepared statements.
## 🦀 Rust-Shielded Networking
The single-threaded Node.js event loop is completely protected. Encore's underlying multi-threaded Rust core (built on Hyper/Tokio) intercepts incoming connections, handles TLS handshakes, parses JSON payloads, and manages database connection pooling. Node.js workers are invoked purely to execute your core business logic.
## ⚛️ DOM-less Reactivity
SolidStart strips out the heavy Virtual DOM reconciliation found in frameworks like React. It compiles code directly down to fine-grained DOM-mutating primitives, maximizing user-side render speeds.
------------------------------
## 📂 Project Structure
```
my-blast-project/
├── backend/                  # Encore.ts Application
│   ├── encore.app            # Encore configuration
│   ├── db.d.ts               # AUTO-GENERATED: Backend DB types from SQL schema
│   ├── migrations/           # THE SOURCE OF TRUTH: Raw SQL migrations
│   │   └── 1_create_users.up.sql
│   └── user.ts               # Core API endpoints & business logic
└── frontend/                 # SolidStart Web Application
    ├── src/
    │   └── routes/           # Pages and reactive components
    └── package.json
```

------------------------------
## 🛠️ Code Blueprint## 1. The Source of Truth (backend/migrations/1_create_users.up.sql)
```
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- Optimize for extreme email query throughputCREATE INDEX idx_users_email ON users(email);
```

## 2. The Backend (backend/user.ts)
```
import { api } from "encore.dev/api";import { SQLDatabase } from "encore.dev/storage/sqldb";import { UsersTable } from "./db"; // Imported from the generated SQL type map
const DB = new SQLDatabase("primary");
export const getUserByEmail = api(
  { method: "GET", path: "/user" },
  async ({ email }: { email: string }): Promise<UsersTable> => {
    // Bare-metal binary query execution with zero translation overhead
    const user = await DB.queryRow<UsersTable>`
      SELECT id, email, display_name, created_at 
      FROM users 
      WHERE email = ${email}
    `;
    
    if (!user) throw new Error("User record not found");
    return user; 
  }
);
```

## 3. The Frontend (frontend/src/routes/index.tsx)
```
import { createResource } from "solid-js";import Client from "~/.encore/clients"; // Auto-generated SDK client updated live
const client = new Client("http://localhost:4000");
export default function Home() {
  const [user] = createResource(() => client.user.getUserByEmail({ email: "speed@blast.dev" }));

  return (
    <main>
      <h1>Welcome back, {user()?.display_name}</h1>
      <p>System Status: Extreme Throughput Engaged</p>
    </main>
  );
}
```

------------------------------
## 🚀 Getting Started

### Prerequisites

* Install the Encore CLI: `curl -L https://encore.dev | bash`
* A running PostgreSQL instance.

### Installation

   1. Clone your BLAST template directory.
   2. Spin up the backend and local test database:
   ```bash
   cd backend
   encore run
   ```
   
   3. Sync your types and fire up the frontend server:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

