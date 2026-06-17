export function getAdminSql(adminId: string, adminAccountId: string, passwordHash: string): string {
  return `-- Seed Admin User
INSERT INTO admins (id, name, email, email_verified, created_at, updated_at) VALUES
('${adminId}', 'Admin User', 'admin@example.com', 1, strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(email) DO UPDATE SET name=excluded.name;

-- Seed Admin Account (Better Auth admin panel credential mapping)
INSERT INTO admin_accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('${adminAccountId}', '${adminId}', 'credential', '${adminId}', '${passwordHash}', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;
`;
}
