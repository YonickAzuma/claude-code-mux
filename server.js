const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// 🔥 Serve file statis dari folder "public"
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = "data.json";
// Buat file data.json jika belum ada
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

// 📝 Endpoint untuk mendapatkan daftar catatan
app.get("/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(Object.keys(notes));
});

// 📖 Endpoint untuk mendapatkan isi catatan tertentu
app.get("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  res.json(notes[title] || { content: "", image: "" });
});

// ✍️ Endpoint untuk menyimpan atau mengupdate catatan
app.post("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  notes[title] = { content: req.body.content, image: req.body.image || "" };
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
  res.json({ message: "✅ Tersimpan!" });
});

// 🗑️ Endpoint untuk menghapus catatan tertentu
app.delete("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  if (notes[title]) {
    delete notes[title];
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
    res.json({ message: "🗑️ Catatan dihapus!" });
  } else {
    res.status(404).json({ message: "❌ Catatan tidak ditemukan!" });
  }
});

// 🏠 Redirect ke index.html jika akses "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Jalankan server di port 3000
app.listen(3000, () => console.log("🔥 Server jalan di http://localhost:3000"));
