import { hashPassword } from "better-auth/crypto";
import * as fs from "fs";
import * as path from "path";
import { animeSql } from "./seeds/anime";
import { getUserSql } from "./seeds/user";
import { getAdminSql } from "./seeds/admin";

async function runSeeder() {
  console.log("Generating password hashes via Better Auth...");
  
  // Hashed passwords for static seeds
  const userPasswordHash = await hashPassword("user123");
  const adminPasswordHash = await hashPassword("admin123");

  const userId = "user_1";
  const userAccountId = "account_user_1";
  
  const adminId = "admin_1";
  const adminAccountId = "account_admin_1";

  // Build the compiled SQL query contents
  const userSql = getUserSql(userId, userAccountId, userPasswordHash);
  const adminSql = getAdminSql(adminId, adminAccountId, adminPasswordHash);

  const sqlDir = path.join(process.cwd(), "scripts", "seeds", "sql");

  // Ensure the output directory exists
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
  }

  // Output paths
  const animePath = path.join(sqlDir, "anime.sql");
  const userPath = path.join(sqlDir, "user.sql");
  const adminPath = path.join(sqlDir, "admin.sql");

  // Write isolated SQL queries to separate files
  fs.writeFileSync(animePath, animeSql, "utf-8");
  fs.writeFileSync(userPath, userSql, "utf-8");
  fs.writeFileSync(adminPath, adminSql, "utf-8");


  console.log("Database seeds successfully generated:");
  console.log(`- Anime seed: ${animePath}`);
  console.log(`- User seed: ${userPath}`);
  console.log(`- Admin seed: ${adminPath}`);
}

runSeeder().catch((err) => {
  console.error("Error generating database seeds:", err);
  process.exit(1);
});
