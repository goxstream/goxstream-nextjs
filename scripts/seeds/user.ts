export function getUserSql(userId: string, userAccountId: string, passwordHash: string): string {
  return `-- Seed Roles
INSERT INTO roles (id, name, description) VALUES
('user', 'User', 'Regular user'),
('admin', 'Admin', 'Administrator'),
('superadmin', 'Super Admin', 'Super Administrator')
ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description;

-- Seed Public User
INSERT INTO users (id, name, email, email_verified, created_at, updated_at) VALUES
('${userId}', 'Test User', 'user@example.com', 1, strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(email) DO UPDATE SET name=excluded.name;

-- Seed Public User Account (Better Auth credential mapping)
INSERT INTO user_accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('${userAccountId}', '${userId}', 'credential', '${userId}', '${passwordHash}', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;

-- Seed Public User Profile (Decoupled details referencing users and roles)
INSERT INTO profiles (id, username, display_name, role_id, created_at) VALUES
('${userId}', 'testuser', 'Test User', 'user', strftime('%s', 'now'))
ON CONFLICT(id) DO UPDATE SET username=excluded.username, display_name=excluded.display_name, role_id=excluded.role_id;
`;
}
