-- Migration: 1_init.up.sql
-- Creates the `users` table. This file is the Single Source of Truth (SSOT)
-- for the schema. TypeScript types are derived from this schema via pg-to-ts.

CREATE TABLE users (
    id           BIGSERIAL    PRIMARY KEY,
    -- The UNIQUE constraint implicitly creates a B-Tree index named
    -- `users_email_key`, used automatically for O(log n) point lookups.
    email        TEXT         NOT NULL UNIQUE,
    display_name TEXT         NOT NULL
);
