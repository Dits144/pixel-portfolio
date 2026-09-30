/**
 * Tool Enkripsi Database Backup untuk GitHub
 *
 * Mengenkripsi file backup database sebelum diunggah ke repository GitHub publik.
 * Menggunakan AES-256-CBC dengan HMAC-SHA256 untuk perlindungan data kredensial.
 *
 * Cara pakai:
 *   node scripts/encrypt-db.cjs encrypt [input.json] [output.enc]
 *   node scripts/encrypt-db.cjs decrypt [input.enc] [output.json]
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Kunci enkripsi default (bisa dioverride via env DB_ENCRYPTION_KEY)
const ENCRYPTION_KEY_RAW =
  process.env.DB_ENCRYPTION_KEY || "RadityaPortfolioSecureKey2026!@#$%^";

// Turunkan 32-byte key menggunakan SHA-256
const KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY_RAW).digest();
const ALGORITHM = "aes-256-cbc";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return JSON.stringify({
    iv: iv.toString("hex"),
    data: encrypted,
    tag: crypto.createHmac("sha256", KEY).update(encrypted).digest("hex"),
    createdAt: new Date().toISOString(),
  });
}

function decrypt(encryptedJson) {
  const payload = JSON.parse(encryptedJson);
  const hmac = crypto.createHmac("sha256", KEY).update(payload.data).digest("hex");
  if (hmac !== payload.tag) {
    throw new Error("Verifikasi integritas gagal: Kunci enkripsi salah atau data telah diubah!");
  }
  const iv = Buffer.from(payload.iv, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(payload.data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const args = process.argv.slice(2);
const command = args[0];
const inputFile = args[1];
const outputFile = args[2];

if (!command || !inputFile) {
  console.log(`
Penggunaan:
  node scripts/encrypt-db.cjs encrypt <file_input.json> [file_output.enc]
  node scripts/encrypt-db.cjs decrypt <file_input.enc> [file_output.json]

Contoh:
  node scripts/encrypt-db.cjs encrypt data/backup.json data/backup.enc
  node scripts/encrypt-db.cjs decrypt data/backup.enc data/restored.json
`);
  process.exit(0);
}

try {
  const inputData = fs.readFileSync(inputFile, "utf8");
  if (command === "encrypt") {
    const targetOut = outputFile || inputFile.replace(/\.json$/, "") + ".enc";
    const encrypted = encrypt(inputData);
    fs.writeFileSync(targetOut, encrypted, "utf8");
    console.log(`✅ Berhasil dienkripsi -> ${targetOut}`);
  } else if (command === "decrypt") {
    const targetOut = outputFile || inputFile.replace(/\.enc$/, "") + ".decrypted.json";
    const decrypted = decrypt(inputData);
    fs.writeFileSync(targetOut, decrypted, "utf8");
    console.log(`✅ Berhasil didekripsi -> ${targetOut}`);
  } else {
    console.error("Perintah tidak dikenali. Gunakan 'encrypt' atau 'decrypt'");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Terjadi kesalahan:", err.message);
  process.exit(1);
}
