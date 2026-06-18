-- Seed Roles
INSERT INTO roles (id, name, description) VALUES
('user', 'User', 'Regular user'),
('admin', 'Admin', 'Administrator'),
('superadmin', 'Super Admin', 'Super Administrator')
ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description;

-- Seed Public User
INSERT INTO users (id, name, email, email_verified, created_at, updated_at) VALUES
('user_1', 'Test User', 'user@example.com', 1, strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(email) DO UPDATE SET name=excluded.name;

-- Seed Public User Account (Better Auth credential mapping)
INSERT INTO user_accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('account_user_1', 'user_1', 'credential', 'user_1', '8d75c2750932b4bc9568f0cb139ecc12:a6a12cd634483ff8f4c5a153d3137cac14952e9b0cc8687388bc958b6079766a67747d5cfad8117cd34c6fe5f8758e3ad6c72bcf4b25d5c70c7831fef70b9b2f', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;

-- Seed Public User Profile (Decoupled details referencing users and roles)
INSERT INTO profiles (id, username, display_name, role_id, created_at) VALUES
('user_1', 'testuser', 'Test User', 'user', strftime('%s', 'now'))
ON CONFLICT(id) DO UPDATE SET username=excluded.username, display_name=excluded.display_name, role_id=excluded.role_id;
