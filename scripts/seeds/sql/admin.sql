-- Seed Admin User
INSERT INTO admins (id, name, email, email_verified, created_at, updated_at) VALUES
('admin_1', 'Admin User', 'admin@example.com', 1, strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(email) DO UPDATE SET name=excluded.name;

-- Seed Admin Account (Better Auth admin panel credential mapping)
INSERT INTO admin_accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('account_admin_1', 'admin_1', 'credential', 'admin_1', '0e53fbe6d95079c58cd9abc179716cb5:6b8e05cde63657ffe50fdeb9c6f21a594bfc08f8d818379f5569ebc8e2d0b5087083724c48b3f8a577ca6db58824e54a55a559ce91318d6054edd052061250c8', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;
