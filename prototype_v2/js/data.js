/* ============================================
   Mock Data - Academic Schedule Management
   ============================================ */

const DataStore = {
  // ---- Weekly Schedules ----
  weeklyJadwal: {},

  // ---- Jurusan ----
  jurusan: [
    { id: 1, nama: 'Teknik Informatika', kode: 'TI', fakultas: 'Teknik' },
    { id: 2, nama: 'Sistem Informasi', kode: 'SI', fakultas: 'Teknik' },
    { id: 3, nama: 'Teknik Elektro', kode: 'TE', fakultas: 'Teknik' },
    { id: 4, nama: 'Teknik Sipil', kode: 'TS', fakultas: 'Teknik' },
    { id: 5, nama: 'Manajemen', kode: 'MJ', fakultas: 'Ekonomi' },
    { id: 6, nama: 'Akuntansi', kode: 'AK', fakultas: 'Ekonomi' },
    { id: 7, nama: 'Ilmu Komunikasi', kode: 'IK', fakultas: 'Ilmu Sosial' },
    { id: 8, nama: 'Psikologi', kode: 'PS', fakultas: 'Ilmu Sosial' },
    { id: 9, nama: 'Hukum', kode: 'HK', fakultas: 'Hukum' },
    { id: 10, nama: 'Kedokteran', kode: 'KD', fakultas: 'Kedokteran' },
  ],

  // ---- Gedung ----
  gedung: [
    { id: 1, nama: 'Gedung A' },
    { id: 2, nama: 'Gedung B' },
    { id: 3, nama: 'Gedung C' },
    { id: 4, nama: 'Gedung D' },
  ],

  // ---- Ruangan ----
  ruangan: [
    { id: 1, nama: 'R-301', gedung_id: 1, kapasitas: 40, fasilitas: 'Proyektor, AC, Whiteboard', is_active: true },
    { id: 2, nama: 'R-302', gedung_id: 1, kapasitas: 35, fasilitas: 'Proyektor, AC', is_active: true },
    { id: 3, nama: 'R-303', gedung_id: 1, kapasitas: 30, fasilitas: 'AC, Whiteboard', is_active: true },
    { id: 4, nama: 'R-304', gedung_id: 1, kapasitas: 45, fasilitas: 'Proyektor, AC, Sound System', is_active: true },
    { id: 5, nama: 'R-305', gedung_id: 1, kapasitas: 50, fasilitas: 'Proyektor, AC, Lab Komputer', is_active: true },
    { id: 6, nama: 'R-101', gedung_id: 2, kapasitas: 40, fasilitas: 'Proyektor, AC', is_active: true },
    { id: 7, nama: 'R-102', gedung_id: 2, kapasitas: 35, fasilitas: 'Proyektor, Whiteboard', is_active: true },
    { id: 8, nama: 'R-103', gedung_id: 2, kapasitas: 30, fasilitas: 'AC', is_active: true },
    { id: 9, nama: 'R-104', gedung_id: 2, kapasitas: 45, fasilitas: 'Proyektor, AC, Whiteboard', is_active: true },
    { id: 10, nama: 'R-201', gedung_id: 3, kapasitas: 60, fasilitas: 'Proyektor, AC, Sound System', is_active: true },
    { id: 11, nama: 'R-202', gedung_id: 3, kapasitas: 40, fasilitas: 'Proyektor, AC', is_active: true },
    { id: 12, nama: 'R-203', gedung_id: 3, kapasitas: 35, fasilitas: 'AC, Whiteboard', is_active: true },
    { id: 13, nama: 'R-204', gedung_id: 3, kapasitas: 30, fasilitas: 'Proyektor', is_active: true },
    { id: 14, nama: 'R-205', gedung_id: 3, kapasitas: 45, fasilitas: 'Proyektor, AC, Lab Komputer', is_active: true },
    { id: 15, nama: 'R-206', gedung_id: 3, kapasitas: 50, fasilitas: 'Proyektor, AC, Sound System, WiFi', is_active: true },
    { id: 16, nama: 'R-401', gedung_id: 4, kapasitas: 35, fasilitas: 'Proyektor, AC', is_active: true },
    { id: 17, nama: 'R-402', gedung_id: 4, kapasitas: 40, fasilitas: 'Proyektor, AC, Whiteboard', is_active: true },
    { id: 18, nama: 'R-403', gedung_id: 4, kapasitas: 30, fasilitas: 'AC', is_active: true },
  ],

  // ---- Dosen ----
  dosen: [
    { id: 1, nama: 'Dr. Budi Santoso, S.Kom., M.T.', nip: '198501152010121001', jurusan_id: 1, status: 'Aktif' },
    { id: 2, nama: 'Dr. Ani Wijaya, M.Kom.', nip: '198603222010122002', jurusan_id: 1, status: 'Aktif' },
    { id: 3, nama: 'Dr. Candra Putra, S.T., M.T.', nip: '198705102011121003', jurusan_id: 1, status: 'Aktif' },
    { id: 4, nama: 'Dr. Dedi Kurniawan, M.Kom.', nip: '198807142012121004', jurusan_id: 2, status: 'Aktif' },
    { id: 5, nama: 'Dr. Eka Rahayu, S.Kom., M.Si.', nip: '198909252013122005', jurusan_id: 2, status: 'Aktif' },
    { id: 6, nama: 'Dr. Fitri Handayani, M.T.', nip: '199002182014122006', jurusan_id: 3, status: 'Aktif' },
    { id: 7, nama: 'Dr. Gunawan Prasetyo, S.T.', nip: '199104052015121007', jurusan_id: 3, status: 'Aktif' },
    { id: 8, nama: 'Dr. Hadi Sucipto, M.Kom.', nip: '199208122016121008', jurusan_id: 4, status: 'Aktif' },
    { id: 9, nama: 'Dr. Indah Permata, S.E., M.M.', nip: '199303152017122009', jurusan_id: 5, status: 'Aktif' },
    { id: 10, nama: 'Dr. Joko Widodo, M.Ak.', nip: '199406202018121010', jurusan_id: 6, status: 'Aktif' },
    { id: 11, nama: 'Dr. Kartika Sari, S.I.Kom., M.I.Kom.', nip: '199501082019122011', jurusan_id: 7, status: 'Aktif' },
    { id: 12, nama: 'Dr. Lukman Hakim, M.Psi.', nip: '199602282020121012', jurusan_id: 8, status: 'Aktif' },
    { id: 13, nama: 'Dr. Maya Angelina, S.H., M.H.', nip: '199704152021122013', jurusan_id: 9, status: 'Aktif' },
    { id: 14, nama: 'Dr. Nur Hidayat, M.Ked.', nip: '199808052022121014', jurusan_id: 10, status: 'Aktif' },
    { id: 15, nama: 'Dr. Okta Syahputra, S.Kom.', nip: '199909102023121015', jurusan_id: 1, status: 'Non-Aktif' },
  ],

  // ---- Mata Kuliah ----
  mataKuliah: [
    { id: 1, nama: 'Algoritma dan Pemrograman', kode: 'TI101', sks: 3, jurusan_id: 1, semester: 1, jenis_penjadwalan: 'Reguler' },
    { id: 2, nama: 'Basis Data', kode: 'TI201', sks: 3, jurusan_id: 1, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 3, nama: 'Pemrograman Web', kode: 'TI202', sks: 3, jurusan_id: 1, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 4, nama: 'Jaringan Komputer', kode: 'TI301', sks: 3, jurusan_id: 1, semester: 5, jenis_penjadwalan: 'Reguler' },
    { id: 5, nama: 'Kecerdasan Buatan', kode: 'TI401', sks: 3, jurusan_id: 1, semester: 7, jenis_penjadwalan: 'Reguler' },
    { id: 6, nama: 'Sistem Operasi', kode: 'TI302', sks: 3, jurusan_id: 1, semester: 5, jenis_penjadwalan: 'Reguler' },
    { id: 7, nama: 'Rekayasa Perangkat Lunak', kode: 'TI303', sks: 3, jurusan_id: 1, semester: 5, jenis_penjadwalan: 'Reguler' },
    { id: 8, nama: 'Statistika', kode: 'SI101', sks: 3, jurusan_id: 2, semester: 1, jenis_penjadwalan: 'Reguler' },
    { id: 9, nama: 'Pemrograman Berorientasi Objek', kode: 'SI201', sks: 3, jurusan_id: 2, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 10, nama: 'Analisis dan Desain Sistem', kode: 'SI301', sks: 3, jurusan_id: 2, semester: 5, jenis_penjadwalan: 'Reguler' },
    { id: 11, nama: 'Kalkulus', kode: 'TE101', sks: 4, jurusan_id: 3, semester: 1, jenis_penjadwalan: 'Reguler' },
    { id: 12, nama: 'Rangkaian Listrik', kode: 'TE201', sks: 3, jurusan_id: 3, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 13, nama: 'Mekanika Tanah', kode: 'TS201', sks: 3, jurusan_id: 4, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 14, nama: 'Manajemen Keuangan', kode: 'MJ201', sks: 3, jurusan_id: 5, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 15, nama: 'Akuntansi Dasar', kode: 'AK101', sks: 3, jurusan_id: 6, semester: 1, jenis_penjadwalan: 'Reguler' },
    { id: 16, nama: 'Komunikasi Massa', kode: 'IK201', sks: 3, jurusan_id: 7, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 17, nama: 'Psikologi Umum', kode: 'PS101', sks: 3, jurusan_id: 8, semester: 1, jenis_penjadwalan: 'Reguler' },
    { id: 18, nama: 'Hukum Perdata', kode: 'HK201', sks: 3, jurusan_id: 9, semester: 3, jenis_penjadwalan: 'Reguler' },
    { id: 19, nama: 'Anatomi', kode: 'KD101', sks: 4, jurusan_id: 10, semester: 1, jenis_penjadwalan: 'Reguler' },
    
    // Semester 2 (Sistem Blok)
    { id: 21, nama: 'Struktur Data (Blok A)', kode: 'TI211', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok A' },
    { id: 22, nama: 'Sistem Basis Data (Blok A)', kode: 'TI212', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok A' },
    { id: 23, nama: 'Matematika Diskrit (Blok A)', kode: 'TI213', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok A' },
    { id: 24, nama: 'Pemrograman Fungsional (Blok B)', kode: 'TI214', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok B' },
    { id: 25, nama: 'Komputasi Awan (Blok B)', kode: 'TI215', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok B' },
    { id: 26, nama: 'Interaksi Manusia Komputer (Blok B)', kode: 'TI216', sks: 3, jurusan_id: 1, semester: 2, jenis_penjadwalan: 'Blok B' },

    // Semester 4 (Sistem Reguler)
    { id: 27, nama: 'Pemrograman Web Lanjut', kode: 'TI411', sks: 3, jurusan_id: 1, semester: 4, jenis_penjadwalan: 'Reguler' },
    { id: 28, nama: 'Keamanan Informasi', kode: 'TI412', sks: 3, jurusan_id: 1, semester: 4, jenis_penjadwalan: 'Reguler' },
    { id: 29, nama: 'Grafika Komputer', kode: 'TI413', sks: 3, jurusan_id: 1, semester: 4, jenis_penjadwalan: 'Reguler' },
  ],

  // ---- Semester ----
  semester: [
    { id: 1, tahun_ajaran: '2025/2026', jenis: 'Ganjil', is_aktif: true },
    { id: 2, tahun_ajaran: '2025/2026', jenis: 'Genap', is_aktif: false },
    { id: 3, tahun_ajaran: '2024/2025', jenis: 'Ganjil', is_aktif: false },
  ],

  // ---- Hari ----
  hari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],

  // ---- Jadwal Kuliah ----
  jadwal: [
    // Semester 4 (Reguler, full semester)
    { id: 101, mata_kuliah_id: 27, kelas: 'A', dosen_id: 1, ruangan_id: 2, hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:00', jurusan_id: 1, semester: 4, status: 'Draft', is_gabungan: false },
    { id: 102, mata_kuliah_id: 28, kelas: 'A', dosen_id: 3, ruangan_id: 3, hari: 'Selasa', jam_mulai: '10:00', jam_selesai: '12:00', jurusan_id: 1, semester: 4, status: 'Draft', is_gabungan: false },
    
    // Semester 2 (Blok A, Weeks 1-12)
    // Note: weekly duration is doubled, e.g. 3 SKS becomes 6 SKS or 2 meetings of 3 hours, or a long 3-hour class twice a week. Let's make it 3 hours per meeting, e.g. 08:00 - 11:00.
    { id: 201, mata_kuliah_id: 21, kelas: 'A', dosen_id: 2, ruangan_id: 1, hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '11:00', jurusan_id: 1, semester: 2, status: 'Draft', is_gabungan: false },
    { id: 202, mata_kuliah_id: 22, kelas: 'A', dosen_id: 4, ruangan_id: 1, hari: 'Kamis', jam_mulai: '08:00', jam_selesai: '11:00', jurusan_id: 1, semester: 2, status: 'Draft', is_gabungan: false },

    // Semester 2 (Blok B, Weeks 13-24)
    // Note: Sharing the SAME room R-1 (R-301) and SAME time as Blok A classes!
    // Since Blok B is in different weeks than Blok A, this is perfectly valid and should not cause conflicts!
    { id: 203, mata_kuliah_id: 24, kelas: 'A', dosen_id: 2, ruangan_id: 1, hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '11:00', jurusan_id: 1, semester: 2, status: 'Draft', is_gabungan: false },
    { id: 204, mata_kuliah_id: 25, kelas: 'A', dosen_id: 4, ruangan_id: 1, hari: 'Kamis', jam_mulai: '08:00', jam_selesai: '11:00', jurusan_id: 1, semester: 2, status: 'Draft', is_gabungan: false },
  ],

  // ---- Preferensi Dosen ----
  preferensi: [
    { id: 1, dosen_id: 1, semester_id: 1, details: [
      { hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Senin', jam_mulai: '13:00', jam_selesai: '15:00' },
      { hari: 'Selasa', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Rabu', jam_mulai: '10:00', jam_selesai: '12:00' },
    ]},
    { id: 2, dosen_id: 2, semester_id: 1, details: [
      { hari: 'Senin', jam_mulai: '10:00', jam_selesai: '12:00' },
      { hari: 'Kamis', jam_mulai: '08:00', jam_selesai: '10:00' },
    ]},
    { id: 3, dosen_id: 3, semester_id: 1, details: [
      { hari: 'Selasa', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Jumat', jam_mulai: '08:00', jam_selesai: '10:00' },
    ]},
    { id: 4, dosen_id: 4, semester_id: 1, details: [
      { hari: 'Selasa', jam_mulai: '10:00', jam_selesai: '12:00' },
    ]},
    { id: 5, dosen_id: 5, semester_id: 1, details: [
      { hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Rabu', jam_mulai: '13:00', jam_selesai: '15:00' },
    ]},
    { id: 6, dosen_id: 6, semester_id: 1, details: [
      { hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Rabu', jam_mulai: '10:00', jam_selesai: '12:00' },
    ]},
    { id: 7, dosen_id: 10, semester_id: 1, details: [
      { hari: 'Jumat', jam_mulai: '10:00', jam_selesai: '12:00' },
      { hari: 'Jumat', jam_mulai: '13:00', jam_selesai: '15:00' },
    ]},
    { id: 8, dosen_id: 12, semester_id: 1, details: [
      { hari: 'Senin', jam_mulai: '13:00', jam_selesai: '15:00' },
      { hari: 'Selasa', jam_mulai: '13:00', jam_selesai: '15:00' },
    ]},
    { id: 9, dosen_id: 14, semester_id: 1, details: [
      { hari: 'Kamis', jam_mulai: '08:00', jam_selesai: '10:00' },
      { hari: 'Kamis', jam_mulai: '10:00', jam_selesai: '12:00' },
    ]},
  ],

  // ---- Mahasiswa (for Grouping) ----
  mahasiswa: [
    { id: 1, nama: 'Ahmad Rizky Pratama', nim: '20241001', jurusan_id: 1 },
    { id: 2, nama: 'Bella Cahyani Putri', nim: '20241002', jurusan_id: 1 },
    { id: 3, nama: 'Citra Dewi Lestari', nim: '20241003', jurusan_id: 1 },
    { id: 4, nama: 'Dani Firmansyah', nim: '20241004', jurusan_id: 2 },
    { id: 5, nama: 'Eka Putri Ramadhani', nim: '20241005', jurusan_id: 2 },
    { id: 6, nama: 'Fajar Nugroho', nim: '20241006', jurusan_id: 2 },
    { id: 7, nama: 'Gita Puspita Sari', nim: '20241007', jurusan_id: 3 },
    { id: 8, nama: 'Hendra Kusuma', nim: '20241008', jurusan_id: 3 },
    { id: 9, nama: 'Indah Permatasari', nim: '20241009', jurusan_id: 4 },
    { id: 10, nama: 'Joko Susilo', nim: '20241010', jurusan_id: 4 },
    { id: 11, nama: 'Kartika Wulandari', nim: '20241011', jurusan_id: 5 },
    { id: 12, nama: 'Lukman Efendi', nim: '20241012', jurusan_id: 5 },
    { id: 13, nama: 'Maya Anggraeni', nim: '20241013', jurusan_id: 6 },
    { id: 14, nama: 'Nanda Prasetyo', nim: '20241014', jurusan_id: 6 },
    { id: 15, nama: 'Olivia Natalia', nim: '20241015', jurusan_id: 7 },
    { id: 16, nama: 'Putra Wijaya', nim: '20241016', jurusan_id: 7 },
    { id: 17, nama: 'Qori Amelia', nim: '20241017', jurusan_id: 8 },
    { id: 18, nama: 'Rizal Maulana', nim: '20241018', jurusan_id: 8 },
    { id: 19, nama: 'Siti Nurhaliza', nim: '20241019', jurusan_id: 9 },
    { id: 20, nama: 'Tono Sugiarto', nim: '20241020', jurusan_id: 10 },
    { id: 21, nama: 'Ulya Rahmawati', nim: '20241021', jurusan_id: 1 },
    { id: 22, nama: 'Vino Bastian', nim: '20241022', jurusan_id: 2 },
    { id: 23, nama: 'Widi Setiawan', nim: '20241023', jurusan_id: 3 },
    { id: 24, nama: 'Xena Putri', nim: '20241024', jurusan_id: 5 },
    { id: 25, nama: 'Yusuf Hidayat', nim: '20241025', jurusan_id: 1 },
  ],

  // ---- Jurusan Colors (for calendar & rolling) ----
  jurusanColors: {
    1: '#29B5E8', // TI - blue
    2: '#1E8E5A', // SI - green
    3: '#C77700', // TE - amber
    4: '#8B5CF6', // TS - purple
    5: '#D6402C', // MJ - red
    6: '#0EA5E9', // AK - sky
    7: '#F59E0B', // IK - yellow
    8: '#EC4899', // PS - pink
    9: '#6366F1', // HK - indigo
    10: '#14B8A6', // KD - teal
  },

  // ---- Kelas Gabungan (Grouping) ----
  kelasGabungan: [],

  // ---- Audit Log ----
  auditLog: [
    { id: 1, entitas: 'Jadwal Kuliah', entitas_id: 1, aksi: 'Create', perubahan: { field: 'jadwal', nilai_lama: null, nilai_baru: 'Algoritma TI-3A Senin 08:00' }, user: 'Staff Akademik', timestamp: '2026-06-18 09:15:00' },
    { id: 2, entitas: 'Jadwal Kuliah', entitas_id: 2, aksi: 'Create', perubahan: { field: 'jadwal', nilai_lama: null, nilai_baru: 'Basis Data TI-3A Senin 10:00' }, user: 'Staff Akademik', timestamp: '2026-06-18 09:16:00' },
    { id: 3, entitas: 'Preferensi Dosen', entitas_id: 1, aksi: 'Create', perubahan: { field: 'preferensi', nilai_lama: null, nilai_baru: 'Dr. Budi - Senin, Selasa, Rabu' }, user: 'Dr. Budi Santoso', timestamp: '2026-06-17 14:30:00' },
    { id: 4, entitas: 'Jadwal Kuliah', entitas_id: 3, aksi: 'Update', perubahan: { field: 'ruangan', nilai_lama: 'R-301', nilai_baru: 'R-302' }, user: 'Staff Akademik', timestamp: '2026-06-18 10:22:00' },
    { id: 5, entitas: 'Preferensi Dosen', entitas_id: 2, aksi: 'Create', perubahan: { field: 'preferensi', nilai_lama: null, nilai_baru: 'Dr. Ani - Senin, Kamis' }, user: 'Dr. Ani Wijaya', timestamp: '2026-06-17 15:45:00' },
    { id: 6, entitas: 'Jadwal Kuliah', entitas_id: 8, aksi: 'Create', perubahan: { field: 'jadwal', nilai_lama: null, nilai_baru: 'Jaringan Komputer TI-5A Rabu 10:00' }, user: 'Staff Akademik', timestamp: '2026-06-18 11:00:00' },
  ],

  // ---- Sync Log ----
  syncLog: [
    { id: 1, jadwal_id: 1, target_sistem: 'Sistem Akademik (TBD)', status: 'Berhasil', pesan_error: null, timestamp: '2026-06-18 14:32:00', retry_count: 0 },
    { id: 2, jadwal_id: 2, target_sistem: 'Sistem Akademik (TBD)', status: 'Berhasil', pesan_error: null, timestamp: '2026-06-18 14:32:00', retry_count: 0 },
    { id: 3, jadwal_id: 8, target_sistem: 'Sistem Akademik (TBD)', status: 'Gagal', pesan_error: 'Timeout - server tidak merespons', timestamp: '2026-06-18 14:31:00', retry_count: 2 },
    { id: 4, jadwal_id: 3, target_sistem: 'Sistem Akademik (TBD)', status: 'Berhasil', pesan_error: null, timestamp: '2026-06-18 14:32:00', retry_count: 0 },
    { id: 5, jadwal_id: 4, target_sistem: 'Sistem Akademik (TBD)', status: 'Berhasil', pesan_error: null, timestamp: '2026-06-18 14:32:00', retry_count: 0 },
  ],

  // ---- Helper Methods ----
  getJurusan(id) { return this.jurusan.find(j => j.id === id); },
  getDosen(id) { return this.dosen.find(d => d.id === id); },
  getRuangan(id) { return this.ruangan.find(r => r.id === id); },
  getMataKuliah(id) { return this.mataKuliah.find(m => m.id === id); },
  getGedung(id) { return this.gedung.find(g => g.id === id); },
  getMahasiswa(id) { return this.mahasiswa.find(m => m.id === id); },
  searchMahasiswa(query) {
    const q = query.toLowerCase();
    return this.mahasiswa.filter(m =>
      m.nama.toLowerCase().includes(q) || m.nim.includes(q)
    );
  },
  getJurusanColor(jurusanId) {
    return this.jurusanColors[jurusanId] || '#8A98A6';
  },

  getMataKuliahColor(mkId) {
    const colors = [
      '#29B5E8', // Cyan Blue
      '#1E8E5A', // Forest Green
      '#C77700', // Amber
      '#8B5CF6', // Purple
      '#D6402C', // Red
      '#0EA5E9', // Sky Blue
      '#F59E0B', // Yellow Gold
      '#EC4899', // Deep Pink
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#10B981', // Emerald
      '#3B82F6', // Blue
      '#84CC16', // Lime
      '#D946EF', // Fuchsia
      '#64748B', // Slate
      '#A855F7', // Purple-pink
      '#06B6D4', // Cyan
      '#F43F5E', // Rose
      '#059669'  // Dark Green
    ];
    return colors[(mkId - 1) % colors.length];
  },

  // ---- End of DataStore Helpers ----

  // Check preference conflicts ("war") - which dosen clash on same slot
  checkPreferenceConflicts() {
    const slotMap = {}; // "hari-jam_mulai-jam_selesai" -> [dosen_id]
    this.preferensi.forEach(p => {
      p.details.forEach(d => {
        const key = `${d.hari}-${d.jam_mulai}-${d.jam_selesai}`;
        if (!slotMap[key]) slotMap[key] = [];
        slotMap[key].push(p.dosen_id);
      });
    });
    const conflicts = [];
    Object.entries(slotMap).forEach(([key, dosenIds]) => {
      if (dosenIds.length > 1) {
        const [hari, jamMulai, jamSelesai] = key.split('-');
        conflicts.push({
          hari, jam_mulai: jamMulai, jam_selesai: jamSelesai,
          dosen_ids: dosenIds,
          dosen_list: dosenIds.map(id => this.getDosen(id)),
        });
      }
    });
    return conflicts;
  },
  getGedungByRuangan(ruanganId) {
    const r = this.getRuangan(ruanganId);
    return r ? this.getGedung(r.gedung_id) : null;
  },

  getJadwalDetail(j) {
    return {
      ...j,
      mata_kuliah: this.getMataKuliah(j.mata_kuliah_id),
      dosen: this.getDosen(j.dosen_id),
      ruangan: this.getRuangan(j.ruangan_id),
      jurusan: this.getJurusan(j.jurusan_id),
      gedung: this.getGedungByRuangan(j.ruangan_id),
    };
  },

  // Check conflict
  checkConflict(jadwal, excludeId, customList) {
    const conflicts = [];
    const listToCheck = customList || this.jadwal;
    for (const j of listToCheck) {
      if (excludeId && j.id === excludeId) continue;
      if (j.hari !== jadwal.hari) continue;

      const timeOverlap =
        jadwal.jam_mulai < j.jam_selesai &&
        jadwal.jam_selesai > j.jam_mulai;

      if (!timeOverlap) continue;

      // Check block period overlap
      const type1 = this.getMataKuliah(jadwal.mata_kuliah_id)?.jenis_penjadwalan || 'Reguler';
      const type2 = this.getMataKuliah(j.mata_kuliah_id)?.jenis_penjadwalan || 'Reguler';

      const blocksOverlap = (type1 === 'Reguler' || type2 === 'Reguler' || type1 === type2);
      if (!blocksOverlap) continue;

      // Dosen conflict
      if (j.dosen_id === jadwal.dosen_id) {
        conflicts.push({
          type: 'dosen',
          message: `${this.getDosen(j.dosen_id).nama} sudah mengajar "${this.getMataKuliah(j.mata_kuliah_id).nama}" pada ${j.hari} ${j.jam_mulai}-${j.jam_selesai}`,
        });
      }

      // Room conflict
      if (j.ruangan_id === jadwal.ruangan_id) {
        conflicts.push({
          type: 'ruangan',
          message: `${this.getRuangan(j.ruangan_id).nama} sudah digunakan oleh "${this.getMataKuliah(j.mata_kuliah_id).nama}" pada ${j.hari} ${j.jam_mulai}-${j.jam_selesai}`,
        });
      }
    }
    return conflicts;
  },

  // Get available rooms for a time slot
  getAvailableRooms(hari, jam_mulai, jam_selesai, excludeId, customList, targetMataKuliahId) {
    const occupiedIds = new Set();
    const listToCheck = customList || this.jadwal;
    const type1 = targetMataKuliahId ? (this.getMataKuliah(targetMataKuliahId)?.jenis_penjadwalan || 'Reguler') : 'Reguler';

    for (const j of listToCheck) {
      if (excludeId && j.id === excludeId) continue;
      if (j.hari !== hari) continue;
      const overlap = jam_mulai < j.jam_selesai && jam_selesai > j.jam_mulai;
      if (overlap) {
        const type2 = this.getMataKuliah(j.mata_kuliah_id)?.jenis_penjadwalan || 'Reguler';
        const blocksOverlap = (type1 === 'Reguler' || type2 === 'Reguler' || type1 === type2);
        if (blocksOverlap) occupiedIds.add(j.ruangan_id);
      }
    }
    return this.ruangan.filter(r => r.is_active && !occupiedIds.has(r.id));
  },

  // Add jadwal
  addJadwal(data) {
    const newId = Math.max(...this.jadwal.map(j => j.id)) + 1;
    const newJadwal = { id: newId, ...data, status: 'Draft', is_gabungan: false };
    this.jadwal.push(newJadwal);
    this.auditLog.push({
      id: this.auditLog.length + 1,
      entitas: 'Jadwal Kuliah',
      entitas_id: newId,
      aksi: 'Create',
      perubahan: { field: 'jadwal', nilai_lama: null, nilai_baru: `${this.getMataKuliah(data.mata_kuliah_id).nama} ${data.kelas} ${data.hari} ${data.jam_mulai}` },
      user: 'Staff Akademik',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    return newJadwal;
  },

  // Update jadwal
  updateJadwal(id, data) {
    const idx = this.jadwal.findIndex(j => j.id === id);
    if (idx === -1) return null;
    const old = { ...this.jadwal[idx] };
    this.jadwal[idx] = { ...this.jadwal[idx], ...data };
    this.auditLog.push({
      id: this.auditLog.length + 1,
      entitas: 'Jadwal Kuliah',
      entitas_id: id,
      aksi: 'Update',
      perubahan: { field: 'multiple', nilai_lama: 'data lama', nilai_baru: 'data baru' },
      user: 'Staff Akademik',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    return this.jadwal[idx];
  },

  // Delete jadwal
  deleteJadwal(id) {
    const idx = this.jadwal.findIndex(j => j.id === id);
    if (idx === -1) return false;
    const removed = this.jadwal.splice(idx, 1)[0];
    this.auditLog.push({
      id: this.auditLog.length + 1,
      entitas: 'Jadwal Kuliah',
      entitas_id: id,
      aksi: 'Delete',
      perubahan: { field: 'jadwal', nilai_lama: `${this.getMataKuliah(removed.mata_kuliah_id).nama} ${removed.kelas}`, nilai_baru: null },
      user: 'Staff Akademik',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    return true;
  },

  // Generate time slots for calendar views (hourly blocks from 07:00 to 22:00)
  getTimeSlots() {
    return [
      { label: '07:00 - 08:00', start: '07:00', end: '08:00' },
      { label: '08:00 - 09:00', start: '08:00', end: '09:00' },
      { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
      { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
      { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
      { label: '12:00 - 13:00', start: '12:00', end: '13:00' },
      { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
      { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
      { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
      { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
      { label: '17:00 - 18:00', start: '17:00', end: '18:00' },
      { label: '18:00 - 19:00', start: '18:00', end: '19:00' },
      { label: '19:00 - 20:00', start: '19:00', end: '20:00' },
      { label: '20:00 - 21:00', start: '20:00', end: '21:00' },
      { label: '21:00 - 22:00', start: '21:00', end: '22:00' },
    ];
  },

  // Generate individual SKS slots for preference input (1 SKS = 45 min, 15 min break)
  getPreferenceSlots() {
    return [
      { label: '08:00 - 08:45', start: '08:00', end: '08:45', sks: 1 },
      { label: '09:00 - 09:45', start: '09:00', end: '09:45', sks: 1 },
      { label: '10:00 - 10:45', start: '10:00', end: '10:45', sks: 1 },
      { label: '11:00 - 11:45', start: '11:00', end: '11:45', sks: 1 },
      { label: '13:00 - 13:45', start: '13:00', end: '13:45', sks: 1 },
      { label: '14:00 - 14:45', start: '14:00', end: '14:45', sks: 1 },
      { label: '15:00 - 15:45', start: '15:00', end: '15:45', sks: 1 },
      { label: '16:00 - 16:45', start: '16:00', end: '16:45', sks: 1 },
    ];
  },

  // Get jadwal for a specific day and time slot (with overlap checking so multi-hour events span multiple cells)
  getJadwalAtSlot(day, jamMulai, jamSelesai) {
    return this.jadwal.filter(j =>
      j.hari === day && j.jam_mulai < jamSelesai && j.jam_selesai > jamMulai
    ).map(j => this.getJadwalDetail(j));
  },

  // Get jadwal for a specific day
  getJadwalByDay(day) {
    return this.jadwal.filter(j => j.hari === day).map(j => this.getJadwalDetail(j));
  },

  // Rolling room assignment for a day
  rollingRooms(hari) {
    const results = [];
    const dayJadwal = this.jadwal.filter(j => j.hari === hari);
    const usedSlots = new Map(); // ruangan_id -> [{jam_mulai, jam_selesai}]

    for (const j of dayJadwal) {
      const preferred = this.preferensi.find(p => p.dosen_id === j.dosen_id);
      const prefInfo = preferred ? preferred.details.filter(d => d.hari === hari) : [];

      let assigned = j.ruangan_id;
      let status = 'Terisi';

      // Check if current room is available
      const slots = usedSlots.get(assigned) || [];
      const conflict = slots.some(s => j.jam_mulai < s.jam_selesai && j.jam_selesai > s.jam_mulai);

      if (conflict) {
        // Find next available room
        const available = this.getAvailableRooms(hari, j.jam_mulai, j.jam_selesai);
        const free = available.find(r => {
          const rSlots = usedSlots.get(r.id) || [];
          return !rSlots.some(s => j.jam_mulai < s.jam_selesai && j.jam_selesai > s.jam_mulai);
        });

        if (free) {
          assigned = free.id;
          status = 'Dipindahkan';
        } else {
          assigned = null;
          status = 'Konflik';
        }
      }

      if (assigned) {
        if (!usedSlots.has(assigned)) usedSlots.set(assigned, []);
        usedSlots.get(assigned).push({ jam_mulai: j.jam_mulai, jam_selesai: j.jam_selesai });
      }

      results.push({
        jadwal: j,
        dosen: this.getDosen(j.dosen_id),
        preferensi: prefInfo,
        ruangan: assigned ? this.getRuangan(assigned) : null,
        status,
      });
    }

    return results;
  },

  // Auto-schedule generator for a specific semester
  generateSemesterSchedule(semesterNum) {
    // 1. Clear existing schedules for this semester
    this.jadwal = this.jadwal.filter(j => j.semester !== semesterNum);

    // 2. Identify courses in this semester
    const courses = this.mataKuliah.filter(m => m.semester === semesterNum);

    // 3. For each course, define classes to schedule (e.g. 'A' and 'B')
    const classes = ['A', 'B'];
    const tempJadwal = [...this.jadwal]; // Start with other semesters' schedules

    const isSlotConflict = (dosenId, hari, jamMulai, jamSelesai, jurusanId, kelas) => {
      return tempJadwal.some(j => {
        if (j.hari !== hari) return false;
        const timeOverlap = jamMulai < j.jam_selesai && jamSelesai > j.jam_mulai;
        if (!timeOverlap) return false;
        
        // Lecturer conflict
        if (j.dosen_id === dosenId) return true;
        
        // Student class conflict: same department, same semester, same class letter
        if (j.jurusan_id === jurusanId && j.semester === semesterNum && j.kelas === kelas) return true;

        return false;
      });
    };

    const findAvailableRoom = (hari, jamMulai, jamSelesai) => {
      return this.ruangan.find(r => {
        if (!r.is_active) return false;
        const occupied = tempJadwal.some(j => {
          return j.ruangan_id === r.id && j.hari === hari &&
                 (jamMulai < j.jam_selesai && jamSelesai > j.jam_mulai);
        });
        return !occupied;
      });
    };

    // Build the tasks to schedule
    const tasks = [];
    courses.forEach(course => {
      // Find lecturer for this course from same department
      const lecturer = this.dosen.find(d => d.jurusan_id === course.jurusan_id && d.status === 'Aktif');
      if (lecturer) {
        classes.forEach(cls => {
          tasks.push({ course, lecturer, cls });
        });
      }
    });

    let successCount = 0;
    tasks.forEach(task => {
      // Get lecturer preferences
      const pref = this.preferensi.find(p => p.dosen_id === task.lecturer.id);
      const slots = pref ? pref.details : [];

      // Fallback slots if lecturer has no preference or if preference slots are exhausted
      const fallbackSlots = [
        { hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:00' },
        { hari: 'Senin', jam_mulai: '10:00', jam_selesai: '12:00' },
        { hari: 'Selasa', jam_mulai: '08:00', jam_selesai: '10:00' },
        { hari: 'Selasa', jam_mulai: '10:00', jam_selesai: '12:00' },
        { hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '10:00' },
        { hari: 'Rabu', jam_mulai: '10:00', jam_selesai: '12:00' },
        { hari: 'Kamis', jam_mulai: '08:00', jam_selesai: '10:00' },
        { hari: 'Kamis', jam_mulai: '10:00', jam_selesai: '12:00' },
        { hari: 'Jumat', jam_mulai: '08:00', jam_selesai: '10:00' },
        { hari: 'Jumat', jam_mulai: '10:00', jam_selesai: '12:00' },
      ];

      const allSlots = [...slots, ...fallbackSlots];
      
      // Find a slot and room
      for (const slot of allSlots) {
        if (!isSlotConflict(task.lecturer.id, slot.hari, slot.jam_mulai, slot.jam_selesai, task.course.jurusan_id, task.cls)) {
          const room = findAvailableRoom(slot.hari, slot.jam_mulai, slot.jam_selesai);
          if (room) {
            const nextId = Math.max(0, ...tempJadwal.map(j => j.id)) + 1;
            const newJadwal = {
              id: nextId,
              mata_kuliah_id: task.course.id,
              kelas: task.cls,
              dosen_id: task.lecturer.id,
              ruangan_id: room.id,
              hari: slot.hari,
              jam_mulai: slot.jam_mulai,
              jam_selesai: slot.jam_selesai,
              jurusan_id: task.course.jurusan_id,
              semester: semesterNum,
              status: 'Draft',
              is_gabungan: false
            };
            tempJadwal.push(newJadwal);
            
            // Add audit log
            this.auditLog.push({
              id: this.auditLog.length + 1,
              entitas: 'Jadwal Kuliah',
              entitas_id: nextId,
              aksi: 'Create',
              perubahan: { field: 'jadwal', nilai_lama: null, nilai_baru: `Auto-Rolling: ${task.course.nama} Kelas ${task.cls} di ${room.nama} pada ${slot.hari} ${slot.jam_mulai}-${slot.jam_selesai}` },
              user: 'Staff Akademik',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            });

            successCount++;
            break;
          }
        }
      }
    });

    // Commit generated schedule to this.jadwal
    this.jadwal = tempJadwal;
    return successCount;
  },
};
