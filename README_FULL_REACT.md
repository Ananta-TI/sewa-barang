# SewaBarangSekitar - Full React

Versi ini sudah dibuat sebagai aplikasi React penuh tanpa backend Laravel/API.
Semua data demo berjalan dari `src/data/seed.js` dan tersimpan di browser melalui `localStorage`.

## Cara menjalankan

1. Buka folder ini di VS Code.
2. Jalankan:

```bash
npm install
npm run dev
```

3. Buka alamat yang muncul, biasanya:

```txt
http://localhost:5173
```

## Login demo

Admin:

```txt
Email: admin@sewabarang.id
Password: admin123
```

User:

```txt
Email: ridwan@demo.id
Password: password123
```

## Catatan gambar

Gambar barang sudah berada di:

```txt
public/items/
```

Path gambar di data barang memakai format:

```txt
/items/nama-file-gambar.jpg
```

Kalau gambar belum berubah di browser, lakukan reset data demo dari halaman profil atau hapus localStorage browser untuk website ini.

## Build final

Untuk membuat hasil siap upload hosting statis:

```bash
npm run build
```

Hasilnya masuk ke folder:

```txt
dist/
```

Karena routing memakai `HashRouter`, aplikasi lebih aman dibuka di hosting statis tanpa konfigurasi server tambahan.
