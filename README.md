# Courier Life Simulator 3D

Prototype game simulasi kurir 3D berbasis browser. Milestone pertama berfokus pada satu siklus pengiriman yang bisa dimainkan sebelum dunia dan sistem simulasi diperluas.

## Teknologi

- React 19 + TypeScript
- Vite
- Three.js melalui React Three Fiber
- Drei untuk elemen bantu 3D
- Zustand untuk state permainan

## Menjalankan proyek

Pastikan Node.js versi 20.19+ atau 22.12+ tersedia.

```bash
npm install
npm run dev
```

Untuk memeriksa TypeScript dan membuat build produksi:

```bash
npm run typecheck
npm run build
npm run preview
```

## Kontrol prototipe

| Aksi | Keyboard | HP |
| --- | --- | --- |
| Maju | W / ↑ | Tombol ↑ |
| Mundur / rem | S / ↓ | Tombol ↓ |
| Belok kiri | A / ← | Tombol ← |
| Belok kanan | D / → | Tombol → |
| Ambil / serahkan paket | E | Tombol AKSI |

Dekati penanda paket di area gudang untuk mengambilnya. Setelah paket diambil, ikuti penanda hijau menuju pelanggan. Selesaikan pengiriman untuk memperoleh Rp75.000 dan membuka misi berikutnya.

## Status saat ini — vertical slice 0.1

Sudah tersedia:
- Scene 3D lingkungan kota percobaan dengan jalan, bangunan, gudang, dan titik tujuan.
- Kendaraan kurir sederhana dengan kontrol gerak.
- Model motor dan kurir low-poly dengan helm, roda, setang, dan paket belakang.
- Kamera third-person yang mengikuti kendaraan.
- Lingkungan kota percobaan dengan trotoar, pepohonan, marka jalan, dan lampu jalan.
- Tiga tujuan pengiriman yang bergantian dengan alamat dan nilai hadiah berbeda.
- Progres uang, XP, reputasi, dan jumlah pengiriman.
- Penyimpanan progres lokal melalui browser (Zustand persist).
- HUD uang, nomor misi, alamat tujuan, petunjuk, dan kontrol sentuh.

Belum tersedia:
- Model karakter dan motor realistis, animasi, serta audio.
- Fisika kendaraan dan tabrakan yang realistis.
- Dunia terbuka, lalu lintas, NPC, dan sistem alamat.
- Inventaris paket kompleks, variasi jenis misi, ekonomi lanjutan, upgrade kendaraan, dan perekrutan staf.
- Sinkronisasi cloud dan instalasi Android/PWA.

Fitur yang belum tersedia di atas merupakan rencana pengembangan, bukan fitur yang sudah selesai.

## Struktur utama

```text
src/
  game/
    store.ts     # state dan progres misi
    World.tsx    # scene 3D, kendaraan, kamera, dan marker
  App.tsx        # HUD dan kontrol
  main.tsx       # entry point
  styles.css     # tampilan responsif
```

## Roadmap

1. Stabilkan vertical slice dan validasi build.
2. Tingkatkan model motor, karakter, animasi, dan fisika.
3. Bangun sistem gudang dan manajemen paket.
4. Tambahkan alamat pelanggan, NPC, lalu lintas, dan area kota yang lebih luas.
5. Tambahkan ekonomi, reputasi, upgrade, karier, dan perusahaan kurir.
6. Tambahkan penyimpanan progres dan optimasi perangkat Android.

Pengembangan aktif dilakukan pada branch `development`.
