# Naruto Character Guesser

Sebuah game web interaktif untuk menebak karakter dari semesta Naruto berdasarkan gambar. Dibangun dengan HTML, CSS, dan JavaScript murni tanpa framewor.

---

## Cara Bermain

1. Sebuah gambar karakter Naruto akan ditampilkan
2. Ketik nama karakter di kolom tebakan (dilengkapi autocomplete)
3. Tekan **Tebak** atau **Enter** untuk mengirim jawaban
4. Jawaban benar → +5 poin, streak bertambah
5. Jawaban salah → nyawa berkurang. Tersisa **5 nyawa** per sesi
6. Game berakhir saat semua nyawa habis

---

## Fitur

| Fitur | Keterangan |
|---|---|
| **Autocomplete** | Saran nama karakter otomatis saat mengetik |
| **Scoreboard Live** | Skor, streak, ronde, dan sisa nyawa diperbarui real-time |
| **Feedback Visual** | Animasi flash hijau/merah pada gambar saat jawaban masuk |
| **Anti-repetisi** | Karakter yang sudah muncul tidak akan tampil ulang dalam sesi yang sama |
| **Responsif** | Tampilan menyesuaikan layar mobile dan desktop |
| **Karakter Banyak** | Mengambil data dari beberapa halaman API (80+ karakter) |

---

## Struktur Proyek

```
naruto-guesser/
├── index.html   # Markup utama & struktur UI
├── style.css    # Seluruh styling & animasi
└── app.js       # Logika game, fetch API, autocomplete
```

---

## Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling, animasi flash, dan desain responsif
- **JavaScript (Vanilla ES6+)** - Logika game & DOM manipulation
- **[Axios](https://axios-http.com/)** - HTTP client untuk fetch data karakter
- **[Dattebayo API](https://dattebayo-api.onrender.com)** - Data & gambar karakter Naruto

---

## Menjalankan Proyek

Tidak perlu instalasi atau build tool. Cukup:

```bash
# Clone repo
git clone https://github.com/username/naruto-character-guesser.git

# Masuk ke folder
cd naruto-character-guesser

# Buka langsung di browser
open index.html
```

> **Catatan:** Karena mengambil data dari API eksternal, pastikan perangkat terhubung ke internet saat bermain.

---

## Konfigurasi

Di bagian atas `app.js`, terdapat dua konstanta yang bisa disesuaikan:

```js
const API_BASE = "https://dattebayo-api.onrender.com"; // Base URL API
const PAGES_TO_FETCH = [1, 2, 3, 4];                  // Halaman yang diambil (20 karakter/halaman)
```

Tambahkan angka ke `PAGES_TO_FETCH` untuk memperbanyak pool karakter.

---

## Sistem Skor

| Aksi | Efek |
|---|---|
| Jawaban benar | +5 poin, streak +1 |
| Jawaban salah | Streak reset, nyawa -1 |
| Nyawa habis (0) | Game over, tampil skor akhir |

---

## API

Game menggunakan **[Dattebayo API](https://dattebayo-api.onrender.com)** - API publik gratis yang menyediakan data karakter dari serial Naruto.

Endpoint yang digunakan:
```
GET /characters?page={n}&limit=20
```

Hanya karakter yang memiliki **nama** dan minimal **satu gambar** yang dimasukkan ke pool permainan.

---
<!--
## Lisensi

MIT License - bebas digunakan, dimodifikasi, dan didistribusikan. -->
