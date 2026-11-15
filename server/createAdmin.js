// Chạy một lần để tạo tài khoản admin:
//   node server/createAdmin.js "Tên admin" email@vidu.com matkhau
import fs from "fs";
import bcrypt from "bcryptjs";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log(
    'Cách dùng: node server/createAdmin.js "Tên admin" email@vidu.com matkhau',
  );
  process.exit(1);
}

const file = new URL("./data.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(file, "utf-8"));
const cleanEmail = email.trim().toLowerCase();

if (data.users.some((u) => u.email === cleanEmail)) {
  console.log("Email này đã tồn tại trong data.json.");
  process.exit(1);
}

data.users.push({
  id: Date.now(),
  name: name.trim(),
  email: cleanEmail,
  passwordHash: bcrypt.hashSync(password, 10),
  role: "admin",
});
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Đã tạo admin:", cleanEmail);
