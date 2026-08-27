# Egg Timer

Timer telur rebus bergaya pixel-art. Pilih tingkat kematangan, tekan START, tunggu belnya.

## Jalankan

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000

## Produksi

```bash
pnpm build
pnpm start
```

Tidak butuh environment variable, database, atau API key.

## Deploy

```bash
git init && git add . && git commit -m "egg timer"
git remote add origin <url-repo-kamu>
git push -u origin main
```

Lalu di Vercel: **Add New → Project → import repo → Deploy**. Next.js terdeteksi otomatis.

## Isi proyek

```
app/page.tsx          halaman tunggal
app/layout.tsx
app/globals.css       palet warna + komponen pixel (panel, tombol, animasi)
components/EggTimer.tsx   seluruh UI & state
components/PixelArt.tsx   renderer sprite, font bitmap 5x7, dial timer
lib/timer.ts          preset telur + hook hitung mundur
lib/sprites.ts        ilustrasi pixel (1 huruf = 1 piksel)
public/audio/timer-done.mp3
```

Hitung mundur memakai `Date.now()` sebagai deadline, jadi tab yang di-throttle browser
tidak membuat waktunya meleset. Semua aset lokal — setelah halaman terbuka, timer tetap
jalan tanpa koneksi.

## Mengubah waktu masak

Edit `PRESETS` di `lib/timer.ts`.
