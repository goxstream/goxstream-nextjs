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
('account_user_1', 'user_1', 'credential', 'user_1', 'd3ccc6d964ac705c6f8f913d5400b8f1:f3944629eb96753dc721585746f683b7fc0d60fc2e219be83b754e0b0beda39daab134e97ff978122be2b9e708dee5bfe6a2377fbe2e8d6cc6e8378d814294d0', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;

-- Seed Public User Profile (Decoupled details referencing users and roles)
INSERT INTO profiles (id, username, display_name, role_id, created_at) VALUES
('user_1', 'testuser', 'Test User', 'user', strftime('%s', 'now'))
ON CONFLICT(id) DO UPDATE SET username=excluded.username, display_name=excluded.display_name, role_id=excluded.role_id;
