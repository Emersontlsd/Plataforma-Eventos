import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function run() {
  await connectDB();
  const exists = await User.findOne({ email: "admin@admin.com" });
  if (exists) {
    console.log("Admin já existe");
    process.exit(0);
  }
  const hash = bcrypt.hashSync("123", 10);
  await User.create({ nome: "Administrador", email: "admin@admin.com", senha: hash, role: "admin" });
  console.log("Admin criado: admin@admin.com / 123");
  process.exit(0);
}

run();
