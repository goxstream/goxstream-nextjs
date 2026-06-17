-- Seed Admin User
INSERT INTO admins (id, name, email, email_verified, created_at, updated_at) VALUES
('admin_1', 'Admin User', 'admin@example.com', 1, strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(email) DO UPDATE SET name=excluded.name;

-- Seed Admin Account (Better Auth admin panel credential mapping)
INSERT INTO admin_accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('account_admin_1', 'admin_1', 'credential', 'admin_1', 'a66a2fa99e3850557c5eda7e19cebe48:11c0dabed4b3a9f16f9b5cd62abc6cf3fcce62b178b1da95c1597dd248337675bbefbfcd242561277146ebe96cd67d9d77dec88f8c3657d108055f563616c7d7', strftime('%s', 'now'), strftime('%s', 'now'))
ON CONFLICT(id) DO NOTHING;
