import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { UsersTable } from "./db";

// ---------------------------------------------------------------------------
// Database connection
// The Encore.ts Rust engine manages the connection pool; we declare the DB
// reference once and reuse it across all queries — zero overhead per request.
// ---------------------------------------------------------------------------
const DB = new SQLDatabase("blast", { migrations: "./migrations" });

// ---------------------------------------------------------------------------
// Request / Response types
// ---------------------------------------------------------------------------
interface GetUserByEmailParams {
  email: string;
}

// The response mirrors UsersTable exactly so callers get full type safety.
type GetUserByEmailResponse = UsersTable;

// ---------------------------------------------------------------------------
// API route
// ---------------------------------------------------------------------------

/**
 * getUserByEmail — retrieve a single user row by email address.
 *
 * Uses a raw SQL template literal so the query hits the B-Tree index on
 * `email` directly — no ORM translation layer, no hidden full-table scans.
 */
export const getUserByEmail = api(
  // Using a query parameter avoids URL-encoding issues with special characters
  // in email addresses (e.g. '+') and keeps emails out of server access logs.
  { method: "GET", path: "/users", expose: true },
  async ({ email }: GetUserByEmailParams): Promise<GetUserByEmailResponse> => {
    const row = await DB.queryRow<UsersTable>`
      SELECT id, email, display_name
      FROM   users
      WHERE  email = ${email}
      LIMIT  1
    `;

    if (!row) {
      // Intentionally generic — do not echo the email back to avoid leaking
      // PII in logs, error-tracking systems, or client-facing error messages.
      throw new Error("user not found");
    }

    return row;
  }
);
