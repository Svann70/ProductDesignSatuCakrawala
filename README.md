# PRD: Academic Schedule Management System

> Product Requirements Document - Sistem Manajemen Jadwal Akademik Terintegrasi

---

## 1. Overview

| Field | Value |
|-------|-------|
| Feature Name | Academic Schedule Management System |
| Status | Draft |
| Owner | [TBD] |
| Target Date | [TBD] |
| Priority | P1 |

### Problem Statement

Tim akademik kampus saat ini hanya digerakkan oleh 1 orang staf yang menangani seluruh proses penyusunan dan pengelolaan jadwal kuliah. Beban kerja ini diproyeksikan melonjak drastis karena kampus akan membuka 15 jurusan baru. Proses kerja yang berjalan saat ini bersifat manual dan terfragmentasi antara dua sistem yang tidak terintegrasi: Mimosa Scheduling Software untuk penyusunan jadwal dan sistem akademik lainnya untuk input data akhir. Akibatnya, staf harus melakukan pekerjaan ganda (double-work) karena data yang sudah disusun di Mimosa harus diinput ulang satu per satu secara manual. Di sisi lain, sistem yang ada tidak memiliki logika validasi untuk mendeteksi bentrok jadwal dosen, ruangan, atau jam kuliah, sementara Mimosa tidak menyediakan fitur filtering dan grouping sehingga seluruh data menumpuk dan pencarian informasi dilakukan secara manual. Selain itu, proses penentuan ruangan untuk setiap kelas masih dilakukan secara manual tanpa mempertimbangkan preferensi jadwal yang diajukan oleh dosen. Jika kondisi ini dipertahankan, risiko terjadinya burnout dan human error akan sangat tinggi.

### Proposed Solution

Membangun Academic Schedule Management System sebagai satu-satunya platform kerja staf akademik yang menggantikan seluruh alur kerja manual. Sistem ini dirancang sebagai all-in-one platform yang memungkinkan staf menyusun, mengelola, dan memvalidasi jadwal kuliah dalam satu tempat. Alur kerja utama dimulai dari input preferensi jadwal oleh dosen (hari dan jam mengajar yang dikehendaki), kemudian staf akademik mengelola penempatan ruangan secara rolling berdasarkan ketersediaan yang ada. Sistem ini dilengkapi dengan fitur smart filtering dan dynamic view untuk mengelola data dari 15 jurusan baru agar tidak menumpuk, validasi bentrok real-time yang memberikan peringatan seketika saat terjadi konflik jadwal, serta kemampuan drag-and-drop interaktif untuk proses penyesuaian ruangan yang lebih efisien. Data yang telah disusun dapat disinkronisasikan ke sistem eksternal yang ditentukan kemudian.

### Success Metric

1. 100% proses penyusunan jadwal kuliah dilakukan melalui sistem baru tanpa kembali menggunakan Mimosa dalam 30 hari setelah launch.
2. Proses input preferensi jadwal oleh dosen terotomatisasi, menghilangkan pengumpulan manual dalam 14 hari setelah launch.
3. Staf akademik dapat menyelesaikan penyusunan jadwal untuk 1 jurusan dalam waktu kurang dari 2 jam (sebelumnya rata-rata 1 hari penuh).
4. Zero conflict error pada jadwal yang telah difinalisasi.

---

## 2. Scope

### In Scope
- Input preferensi jadwal dari dosen (hari dan jam mengajar yang dikehendaki)
- CRUD jadwal kuliah (mata kuliah, kelas, dosen, ruangan, hari, jam)
- Sistem validasi bentrok real-time (dosen, ruangan, jam kuliah)
- Smart Filtering (berdasarkan Jurusan, Semester, Gedung, Ketersediaan Ruangan)
- Dynamic View (pengelompokan per Ruangan atau per Dosen)
- Penempatan ruangan secara rolling berdasarkan preferensi dosen dan ketersediaan ruangan
- Manajemen kelas gabungan lintas jurusan dengan kalkulasi kuota otomatis
- Drag-and-drop penyesuaian ruangan dengan validasi ketersediaan
- Sinkronisasi ke sistem eksternal (target TBD)
- Dashboard ringkasan jadwal dan statistik kapasitas
- Manajemen master data (Jurusan, Dosen, Ruangan, Mata Kuliah)
- Import data awal dari Mimosa (one-time migration)
- Export jadwal ke PDF/Excel dengan pilihan range (hari ini, 7 hari ke depan, history)
- Riwayat perubahan jadwal (audit log)

### Out of Scope
- Sistem KRS mahasiswa
- Manajemen nilai dan kehadiran
- Sistem penggajian dosen
- Perencanaan kurikulum
- Sistem pendaftaran mahasiswa baru
- Notifikasi email/SMS ke dosen atau mahasiswa
- Mobile app (fase awal, web-based only)
- Integrasi dengan sistem keuangan
- Approval workflow oleh Kaprodi atau pihak lain

---

## 3. Users & Use Cases

### Target Users
| User Type | Description |
|-----------|-------------|
| Staf Akademik | Staf yang bertanggung jawab menyusun dan mengelola jadwal kuliah. Pengguna utama sistem dengan akses penuh ke seluruh fitur. Mengelola penempatan ruangan berdasarkan preferensi dosen. |
| Dosen | Menginput preferensi jadwal mengajar (hari dan jam yang dikehendaki) di awal semester. Dosen mengikuti ruangan yang telah ditentukan oleh staf akademik. |
| Superadmin | Mengelola master data sistem (dosen, ruangan, mata kuliah) dan konfigurasi integrasi dengan sistem eksternal. |

### Use Cases
| ID | Actor | Action | Expected Result |
|----|-------|--------|-----------------|
| UC-01 | Dosen | Menginput preferensi jadwal mengajar (hari dan jam) di awal semester | Preferensi tersimpan dan menjadi dasar penyusunan jadwal |
| UC-02 | Dosen | Melihat jadwal mengajar yang telah disusun | Dosen melihat jadwal tetap dengan ruangan yang sudah ditentukan |
| UC-03 | Dosen | Mengubah preferensi jadwal sebelum jadwal difinalisasi | Perubahan preferensi tersimpan |
| UC-04 | Staf Akademik | Melihat daftar preferensi jadwal dari semua dosen | Data preferensi terkumpul dan siap diolah |
| UC-05 | Staf Akademik | Menyusun jadwal berdasarkan preferensi dosen | Jadwal tersimpan dengan validasi bentrok otomatis |
| UC-06 | Staf Akademik | Mengedit jadwal kuliah yang sudah ada | Perubahan tersimpan, sistem memvalidasi ulang potensi bentrok |
| UC-07 | Staf Akademik | Menghapus jadwal kuliah | Jadwal dihapus dengan konfirmasi, riwayat tercatat |
| UC-08 | Staf Akademik | Menerapkan filter global (jurusan, semester, gedung) | Hanya jadwal yang sesuai filter yang ditampilkan |
| UC-09 | Staf Akademik | Memfilter ruangan berdasarkan ketersediaan (available/unavailable) | Daftar ruangan yang tersedia atau terisi ditampilkan |
| UC-10 | Staf Akademik | Mengubah dynamic view ke mode per Ruangan | Data dikelompokkan berdasarkan ruangan |
| UC-11 | Staf Akademik | Mengubah dynamic view ke mode per Dosen | Data dikelompokkan berdasarkan dosen |
| UC-12 | Staf Akademik | Mengatur kelas gabungan lintas jurusan | Sistem menghitung kuota ruangan dan menampilkan status |
| UC-13 | Staf Akademik | Melakukan drag-and-drop untuk memindahkan ruangan | Ruangan berpindah, sistem memvalidasi ketersediaan ruangan baru |
| UC-14 | Staf Akademik | Melakukan rolling penempatan ruangan | Ruangan dialokasikan otomatis berdasarkan ketersediaan |
| UC-15 | Staf Akademik | Menyinkronkan jadwal ke sistem eksternal | Data terkirim ke target sinkronisasi yang ditentukan |
| UC-16 | Staf Akademik | Mengekspor jadwal dengan range tertentu | File terunduh sesuai range yang dipilih |
| UC-17 | Staf Akademik | Melihat dashboard ringkasan | Statistik kapasitas, jadwal bentrok, dan overview ditampilkan |
| UC-18 | Staf Akademik | Melihat riwayat perubahan jadwal | Log perubahan dengan detail siapa, kapan, dan apa yang diubah |
| UC-19 | Superadmin | Mengelola master data Dosen | CRUD data dosen tersimpan |
| UC-20 | Superadmin | Mengelola master data Ruangan | CRUD data ruangan tersimpan |
| UC-21 | Superadmin | Mengelola master data Mata Kuliah | CRUD data mata kuliah tersimpan |
| UC-22 | Superadmin | Mengelola master data Jurusan | CRUD data jurusan tersimpan |
| UC-23 | Superadmin | Mengimport data dari Mimosa | Data Mimosa berhasil dimigrasikan ke sistem |
| UC-24 | Superadmin | Mengelola semester aktif | Semester aktif dapat diatur dan diganti |
| UC-25 | Superadmin | Mengelola konfigurasi integrasi sistem eksternal | Target sinkronisasi dapat diatur |

---

## 4. Requirements

### Functional Requirements

#### Preferensi Jadwal Dosen
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Allow dosen menginput preferensi hari mengajar (multi-select: Senin-Sabtu) | P0 |
| FR-02 | Allow dosen menginput preferensi jam mengajar (jam mulai dan jam selesai per hari) | P0 |
| FR-03 | Allow dosen menginput preferensi untuk beberapa slot waktu dalam satu hari | P0 |
| FR-04 | Allow dosen mengubah preferensi sebelum jadwal difinalisasi oleh staf akademik | P0 |
| FR-05 | Prevent dosen mengubah preferensi setelah jadwal difinalisasi | P1 |
| FR-06 | Provide tampilan ringkasan preferensi dosen untuk staf akademik | P0 |
| FR-07 | Tampilkan status pengisian preferensi: sudah mengisi, belum mengisi | P1 |

#### Jadwal Utama (Schedule CRUD)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08 | Allow create jadwal kuliah baru dengan field: mata kuliah, kelas, dosen, ruangan, hari, jam mulai, jam selesai | P0 |
| FR-09 | Allow edit semua field jadwal kuliah | P0 |
| FR-10 | Allow delete jadwal kuliah dengan confirmation dialog | P0 |
| FR-11 | Provide dropdown untuk Mata Kuliah yang populated dari master data | P0 |
| FR-12 | Provide dropdown untuk Dosen yang populated dari master data | P0 |
| FR-13 | Provide dropdown untuk Ruangan yang populated dari master data | P0 |
| FR-14 | Provide dropdown untuk Hari (Senin-Sabtu) | P0 |
| FR-15 | Provide time picker untuk Jam Mulai dan Jam Selesai | P0 |
| FR-16 | Provide dropdown untuk Kelas (A, B, C, dst.) | P0 |
| FR-17 | Provide dropdown untuk Jurusan yang populated dari master data | P0 |
| FR-18 | Provide dropdown untuk Semester (1-8) | P0 |
| FR-19 | Sistem menyesuaikan jadwal berdasarkan preferensi dosen yang sudah diinput | P0 |
| FR-20 | Dosen mengikuti ruangan yang sudah ditentukan oleh staf akademik | P0 |

#### Validasi Bentrok Real-time
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-21 | Sistem mendeteksi bentrok dosen secara real-time saat input jadwal | P0 |
| FR-22 | Sistem mendeteksi bentrok ruangan secara real-time saat input jadwal | P0 |
| FR-23 | Sistem mendeteksi bentrok jam kuliah secara real-time saat input jadwal | P0 |
| FR-24 | Tampilkan alert seketika (instant alert) dengan detail bentrok: nama dosen, nama ruangan, atau jam yang bertabrakan | P0 |
| FR-25 | Prevent save jadwal jika terdapat bentrok (hard block) | P0 |
| FR-26 | Tampilkan ringkasan total bentrok di dashboard | P1 |

#### Filter dan Grouping Pintar
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-27 | Provide Global Filter berdasarkan Jurusan (multi-select) | P0 |
| FR-28 | Provide Global Filter berdasarkan Semester (multi-select) | P0 |
| FR-29 | Provide Global Filter berdasarkan Gedung | P0 |
| FR-30 | Provide Global Filter berdasarkan Hari | P1 |
| FR-31 | Provide Global Filter berdasarkan Dosen | P1 |
| FR-32 | Provide Global Filter berdasarkan Ketersediaan Ruangan (available/unavailable) | P0 |
| FR-33 | Provide Dynamic View untuk mengelompokkan data per Ruangan | P0 |
| FR-34 | Provide Dynamic View untuk mengelompokkan data per Dosen | P0 |
| FR-35 | Provide Dynamic View untuk mengelompokkan data per Jurusan | P1 |
| FR-36 | Provide Dynamic View untuk mengelompokkan data per Hari | P1 |
| FR-37 | Simpan preferensi filter dan view terakhir pengguna | P2 |
| FR-38 | Provide search input untuk mencari jadwal berdasarkan mata kuliah atau dosen | P0 |

#### Kelas Gabungan
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-39 | Allow membuat kelas gabungan dengan menggabungkan mahasiswa dari jurusan yang berbeda ke dalam satu ruangan | P0 |
| FR-40 | Sistem menghitung kuota ruangan secara otomatis saat kelas gabungan dibuat | P0 |
| FR-41 | Tampilkan peringatan jika total mahasiswa kelas gabungan melebihi kapasitas ruangan | P0 |
| FR-42 | Tampilkan daftar kelas dan jurusan yang tergabung dalam satu jadwal gabungan | P0 |
| FR-43 | Allow menambah atau menghapus kelas dari gabungan | P0 |
| FR-44 | Tampilkan status kapasitas ruangan: tersedia, hampir penuh, penuh | P1 |

#### Drag-and-Drop Penyesuaian Ruangan
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-45 | Allow drag-and-drop jadwal ke slot hari dan jam yang berbeda | P0 |
| FR-46 | Sistem memvalidasi ketersediaan ruangan baru secara otomatis saat jadwal digeser | P0 |
| FR-47 | Sistem memvalidasi ketersediaan dosen secara otomatis saat jadwal digeser | P0 |
| FR-48 | Tampilkan visual feedback saat jadwal di-drag (highlight slot yang tersedia) | P1 |
| FR-49 | Allow undo penyesuaian (kembali ke posisi sebelumnya) | P1 |
| FR-50 | Tampilkan konfirmasi sebelum menyimpan hasil drag-and-drop | P1 |

#### Rolling Penempatan Ruangan
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-51 | Sistem mengalokasikan ruangan secara otomatis berdasarkan ketersediaan dan preferensi dosen | P0 |
| FR-52 | Tampilkan rekomendasi ruangan yang tersedia untuk setiap slot jadwal | P0 |
| FR-53 | Allow staf akademik mengubah alokasi ruangan secara manual | P0 |
| FR-54 | Tampilkan peta ketersediaan ruangan per hari dan jam | P1 |
| FR-55 | Allow batch rolling untuk beberapa jadwal sekaligus | P1 |

#### Sinkronisasi (TBD)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-56 | Sistem menyediakan mekanisme sinkronisasi data jadwal ke sistem eksternal | P1 |
| FR-57 | Tampilkan status sinkronisasi: Berhasil, Gagal, Menunggu | P1 |
| FR-58 | Provide retry mechanism untuk sinkronisasi yang gagal | P1 |
| FR-59 | Log setiap proses sinkronisasi dengan timestamp dan status | P1 |
| FR-60 | Prevent duplikasi data saat sinkronisasi diulang | P1 |
| FR-61 | Allow manual sync trigger untuk situasi darurat | P2 |

> Catatan: Target sinkronisasi (sistem tujuan) akan ditentukan kemudian. Saat ini tim tidak memiliki akses ke sistem akademik yang ada karena dikelola oleh pengembang berbeda.

#### Dashboard dan Overview
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-62 | Tampilkan ringkasan total jadwal per semester | P0 |
| FR-63 | Tampilkan statistik kapasitas ruangan (persentase penggunaan) | P0 |
| FR-64 | Tampilkan daftar jadwal yang bentrok (jika ada) | P0 |
| FR-65 | Tampilkan status sinkronisasi terakhir | P1 |
| FR-66 | Tampilkan jumlah jadwal per jurusan | P1 |
| FR-67 | Tampilkan status pengisian preferensi dosen | P1 |
| FR-68 | Tampilkan grafik distribusi jadwal per hari | P2 |

#### Export dan Import
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-69 | Allow export jadwal ke format PDF | P0 |
| FR-70 | Allow export jadwal ke format Excel (.xlsx) | P0 |
| FR-71 | Provide pilihan range export: hari ini, 7 hari ke depan, custom range | P0 |
| FR-72 | Export jadwal 7 hari ke depan dapat digunakan untuk ditempel di depan kelas | P0 |
| FR-73 | Provide export history untuk rekap jadwal yang sudah berlalu | P0 |
| FR-74 | Export dapat difilter berdasarkan jurusan, semester, atau view aktif | P1 |
| FR-75 | Allow import data awal dari format Mimosa (one-time migration) | P0 |
| FR-76 | Tampilkan preview data hasil import sebelum konfirmasi | P1 |
| FR-77 | Provide mapping field saat import dari Mimosa | P1 |

#### Audit Log
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-78 | Catat setiap perubahan jadwal (create, update, delete) | P0 |
| FR-79 | Tampilkan detail perubahan: siapa, kapan, field apa yang diubah, nilai lama dan baru | P0 |
| FR-80 | Allow filter audit log berdasarkan tanggal, pengguna, atau jenis perubahan | P1 |
| FR-81 | Simpan audit log minimal 12 bulan | P1 |

#### Master Data Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-82 | Allow Superadmin CRUD data Dosen (nama, NIP, jurusan, status aktif) | P0 |
| FR-83 | Allow Superadmin CRUD data Ruangan (nama, gedung, kapasitas, fasilitas) | P0 |
| FR-84 | Allow Superadmin CRUD data Mata Kuliah (nama, kode, SKS, jurusan, semester) | P0 |
| FR-85 | Allow Superadmin CRUD data Jurusan (nama, kode, fakultas) | P0 |
| FR-86 | Allow Superadmin mengelola Semester Aktif (tahun ajaran, ganjil/genap) | P0 |
| FR-87 | Prevent delete master data yang sedang digunakan oleh jadwal | P0 |
| FR-88 | Provide bulk import untuk master data dari file Excel | P1 |

### Non-Functional Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page load time | < 3 seconds |
| NFR-02 | Waktu respons validasi bentrok | < 500 milliseconds |
| NFR-03 | Waktu proses sinkronisasi (per batch) | < 30 seconds |
| NFR-04 | Kapasitas data jadwal per semester | Minimal 5.000 entri jadwal |
| NFR-05 | Jumlah concurrent users | Minimal 10 pengguna bersamaan |
| NFR-06 | Data persistence | Semua perubahan tersimpan secara permanen |
| NFR-07 | Availability | 99.5% uptime selama jam kerja (07.00-22.00) |
| NFR-08 | Backup | Backup otomatis harian dengan retensi 30 hari |
| NFR-09 | Audit trail | Semua perubahan data tercatat dengan timestamp dan user ID |
| NFR-10 | Browser compatibility | Chrome, Firefox, Edge (versi terbaru) |

---

## 5. User Stories

### Story 1: Dosen Menginput Preferensi Jadwal
```
As a Dosen,
I want to input my preferred teaching schedule at the beginning of the semester,
So that the academic staff can arrange room assignments based on my availability.

Acceptance Criteria:
- Given I am on the Preference page, when I select preferred days, then my selections are saved
- Given I input preferred time slots for each day, when I save, then the time slots are stored
- Given I have already saved preferences, when I want to change them before finalization, then I can update my preferences
- Given the schedule has been finalized by staff, when I try to edit preferences, then the system prevents changes
```

### Story 2: Staf Akademik Menyusun Jadwal dari Preferensi Dosen
```
As a Staf Akademik,
I want to view all lecturer preferences and arrange schedules with room assignments,
So that each lecturer gets their preferred teaching times with appropriate rooms.

Acceptance Criteria:
- Given all dosen have submitted preferences, when I view the preference summary, then I see all collected preferences in one place
- Given I assign a room to a dosen schedule, when there is a conflict, then a real-time alert appears
- Given I assign a room, when the room is already occupied at that time, then the system blocks the assignment
- Given I have arranged all schedules, when I finalize, then the schedules are locked and rooms are confirmed
```

### Story 3: Staf Akademik Melakukan Rolling Penempatan Ruangan
```
As a Staf Akademik,
I want the system to automatically allocate rooms based on availability and lecturer preferences,
So that I don't have to manually check each room one by one.

Acceptance Criteria:
- Given I trigger rolling allocation, when the system processes, then rooms are assigned based on availability
- Given a room is already occupied at a time slot, when rolling, then the system skips to the next available room
- Given the rolling is complete, when I review the results, then I see a summary of all room assignments
- Given I want to manually override a rolling result, when I edit, then I can change the room assignment
```

### Story 4: Menggunakan Filter dan Dynamic View
```
As a Staf Akademik,
I want to filter and group schedules by department, semester, building, or room availability,
So that I can quickly find and manage specific schedules without scrolling through all 15+ departments.

Acceptance Criteria:
- Given I select "Teknik Informatika" in the Department filter, when applied, then only schedules for that department are shown
- Given I select "Semester 3" in the Semester filter, when applied, then only semester 3 schedules are shown
- Given I filter by room availability, when I select "Available", then only empty room slots are shown
- Given I switch to "By Room" view, when activated, then schedules are grouped by room with availability status
- Given I switch to "By Lecturer" view, when activated, then schedules are grouped by lecturer showing their weekly load
```

### Story 5: Mengelola Kelas Gabungan Lintas Jurusan
```
As a Staf Akademik,
I want to combine students from different departments into a single shared class,
So that I can optimize room usage when multiple departments share common courses.

Acceptance Criteria:
- Given I select classes from different departments to combine, when I create a combined class, then the system calculates total students across all departments
- Given total students exceed room capacity, when combining, then a warning appears with capacity details
- Given a combined class is created, when viewing the schedule, then all merged classes from different departments are displayed under one entry
- Given I want to remove a department class from the combination, when I remove it, then the class returns to its individual schedule
```

### Story 6: Drag-and-Drop Penyesuaian Ruangan
```
As a Staf Akademik,
I want to drag a schedule to a different time slot or room,
So that I can quickly adjust room assignments without re-entering all the data.

Acceptance Criteria:
- Given I drag a schedule to a new time slot, when the target room is available, then the schedule moves and saves
- Given I drag a schedule to a new time slot, when the target room is occupied, then a conflict alert appears and the move is blocked
- Given I drag a schedule to a new time slot, when the lecturer has another class, then a conflict alert appears and the move is blocked
- Given I have moved a schedule, when I click Undo, then the schedule returns to its previous position
```

### Story 7: Mengekspor Jadwal dengan Range
```
As a Staf Akademik,
I want to export schedules with specific date ranges,
So that I can print weekly schedules for classroom walls and maintain historical records.

Acceptance Criteria:
- Given I select "Hari Ini" as export range, when exported, then only today's schedule is included
- Given I select "7 Hari Ke Depan" as export range, when exported, then the next 7 days schedule is included, ready to be printed and posted on classroom walls
- Given I select "History" as export range, when exported, then past schedules are included for recap purposes
- Given I select a custom date range, when exported, then only schedules within that range are included
```

### Story 8: Melihat Dashboard Ringkasan
```
As a Staf Akademik,
I want to see a summary dashboard of all schedules,
So that I can quickly identify issues and track overall progress.

Acceptance Criteria:
- Given I open the dashboard, when it loads, then I see total schedules, conflict count, and sync status
- Given there are room conflicts, when I look at the dashboard, then conflict items are highlighted
- Given I want to see room usage, when I view the statistics, then room utilization percentages are displayed
- Given some dosen have not submitted preferences, when I view the dashboard, then the preference status is visible
```

---

## 6. Data Model

### New Data Entities

#### Preferensi Dosen (Lecturer Preference)
```
Preferensi Dosen
- id: unique identifier
- dosen: links to Dosen
- semester: links to Semester
- created_at: timestamp
- updated_at: timestamp
```

#### Detail Preferensi Dosen (Lecturer Preference Detail)
```
Detail Preferensi Dosen
- id: unique identifier
- preferensi: links to Preferensi Dosen
- hari: enum (Senin, Selasa, Rabu, Kamis, Jumat, Sabtu)
- jam_mulai: time (format HH:MM)
- jam_selesai: time (format HH:MM)
- urutan: number (for ordering multiple slots in one day)
```

#### Jadwal Kuliah (Schedule)
```
Jadwal Kuliah
- id: unique identifier
- mata_kuliah: links to Mata Kuliah
- kelas: string (A, B, C, dst.)
- dosen: links to Dosen
- ruangan: links to Ruangan
- hari: enum (Senin, Selasa, Rabu, Kamis, Jumat, Sabtu)
- jam_mulai: time (format HH:MM)
- jam_selesai: time (format HH:MM)
- jurusan: links to Jurusan
- semester: number (1-8)
- status: enum (Draft, Difinalisasi)
- is_gabungan: boolean (default false)
- created_by: links to User
- created_at: timestamp
- updated_at: timestamp
```

#### Kelas Gabungan (Combined Class)
```
Kelas Gabungan
- id: unique identifier
- jadwal_induk: links to Jadwal Kuliah (the main combined schedule)
- jadwal_anak: links to Jadwal Kuliah (the individual class being combined)
- jurusan_asal: links to Jurusan (department of origin)
- total_mahasiswa: number (calculated)
- created_at: timestamp
```

#### Ruangan (Room)
```
Ruangan
- id: unique identifier
- nama: string (required, e.g., "R-301")
- gedung: string (required, e.g., "Gedung A")
- kapasitas: number (required, total seats)
- fasilitas: text (optional, e.g., "Proyektor, AC, Whiteboard")
- is_active: boolean (default true)
- created_at: timestamp
- updated_at: timestamp
```

#### Dosen (Lecturer)
```
Dosen
- id: unique identifier
- nama: string (required)
- nip: string (required, unique)
- jurusan: links to Jurusan
- status: enum (Aktif, Non-Aktif, Cuti)
- created_at: timestamp
- updated_at: timestamp
```

#### Mata Kuliah (Course)
```
Mata Kuliah
- id: unique identifier
- nama: string (required)
- kode: string (required, unique)
- sks: number (required, 1-6)
- jurusan: links to Jurusan
- semester: number (1-8)
- is_active: boolean (default true)
- created_at: timestamp
- updated_at: timestamp
```

#### Jurusan (Department)
```
Jurusan
- id: unique identifier
- nama: string (required, unique)
- kode: string (required, unique)
- fakultas: string (required)
- is_active: boolean (default true)
- created_at: timestamp
- updated_at: timestamp
```

#### Semester
```
Semester
- id: unique identifier
- tahun_ajaran: string (required, e.g., "2025/2026")
- jenis: enum (Ganjil, Genap)
- is_aktif: boolean (default false)
- created_at: timestamp
```

#### Audit Log
```
Audit Log
- id: unique identifier
- entitas: string (e.g., "Jadwal Kuliah", "Preferensi Dosen")
- entitas_id: links to entity
- aksi: enum (Create, Update, Delete)
- perubahan: JSON (field, nilai_lama, nilai_baru)
- user: links to User
- timestamp: timestamp
```

#### Sync Log
```
Sync Log
- id: unique identifier
- jadwal: links to Jadwal Kuliah
- target_sistem: string (TBD)
- status: enum (Berhasil, Gagal, Menunggu)
- pesan_error: text (nullable)
- timestamp: timestamp
- retry_count: number (default 0)
```

### Entity Relationships
```
Jurusan 1───* Dosen
Jurusan 1───* Mata Kuliah
Dosen 1───* Preferensi Dosen
Preferensi Dosen 1───* Detail Preferensi Dosen
Semester 1───* Preferensi Dosen
Mata Kuliah 1───* Jadwal Kuliah
Dosen 1───* Jadwal Kuliah
Ruangan 1───* Jadwal Kuliah
Jurusan 1───* Jadwal Kuliah
Semester 1───* Jadwal Kuliah
Jadwal Kuliah 1───* Kelas Gabungan (as induk)
Jadwal Kuliah 1───* Kelas Gabungan (as anak)
Jurusan 1───* Kelas Gabungan (as jurusan asal)
Jadwal Kuliah 1───* Sync Log
```

### Data Flow
```
[Dosen] → [Input Preferensi Jadwal] → [Penyimpanan Preferensi]
       ↓
[Staf Akademik] → [Review Preferensi] → [Penyusunan Jadwal]
       ↓
[Validasi Bentrok Real-time] → [Penempatan Ruangan (Rolling)]
       ↓
[Finalisasi Jadwal] → [Sinkronisasi ke Sistem Eksternal (TBD)]
       ↓
[Audit Log] ← [Semua Perubahan Tercatat]
```

---

## 7. Dependencies

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| Sistem Eksternal (TBD) | External | Pending | Target sinkronisasi akan ditentukan kemudian. Tim tidak memiliki akses ke sistem akademik yang ada (dikelola pengembang berbeda). |
| Database System | Internal | TBD | PostgreSQL atau MySQL untuk penyimpanan data |
| File Storage | Internal | TBD | Untuk file export dan import |
| Auth System | Internal | TBD | Role-based access untuk 3 tipe pengguna |
| Data Mimosa | External | Available | File data historis dari Mimosa untuk migrasi awal |

---

## 8. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Target sinkronisasi belum ditentukan | Medium | High | Rancang sistem sinkronisasi dengan arsitektur adapter agar mudah diarahkan ke target manapun nantinya |
| Data Mimosa memiliki format yang tidak konsisten | Medium | High | Buat tool mapping dan validasi data sebelum migrasi; lakukan dry-run terlebih dahulu |
| Dosen tidak menginput preferensi tepat waktu | High | Medium | Tetapkan deadline pengisian preferensi; sediakan pengingat; staf akademik dapat mengisi manual jika dosen tidak merespons |
| Staf akademik resisten terhadap perubahan sistem baru | Medium | Medium | Lakukan pelatihan bertahap; sediakan panduan penggunaan lengkap; jalankan sistem paralel selama 2 minggu pertama |
| Performa lambat saat data jadwal mencapai ribuan entri | High | Low | Implementasi pagination, indexing pada database, dan lazy loading pada UI |
| Bentrok jadwal yang terlewat saat validasi | High | Low | Lakukan double-check validation sebelum finalisasi; sediakan laporan bentrok di dashboard |
| Kapasitas server tidak mencukupi saat 15 jurusan baru aktif | Medium | Medium | Lakukan load testing sebelum rollout; siapkan skala vertikal/horizontal |

---

## 9. Questions / Open Items

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Sistem eksternal apa yang akan menjadi target sinkronisasi data jadwal? | TBD | Open |
| 2 | Berapa jumlah tepat jurusan baru yang akan dibuka dan kapan jadwal efektifnya? | TBD | Open |
| 3 | Apakah diperlukan fitur pengajuan perubahan jadwal oleh dosen setelah finalisasi? | TBD | Open |
| 4 | Bagaimana mekanisme jika dosen tidak menginput preferensi sebelum deadline? | TBD | Open |
| 5 | Apakah perlu fitur notifikasi (email/WhatsApp) untuk dosen saat deadline preferensi mendekat? | TBD | Open |
| 6 | Berapa lama data audit log perlu disimpan? Apakah 12 bulan cukup? | TBD | Open |
| 7 | Apakah ada batasan jumlah kelas yang bisa digabungkan dalam satu kelas gabungan lintas jurusan? | TBD | Open |
| 8 | Format file Mimosa apa yang perlu didukung untuk migrasi awal? | TBD | Open |
| 9 | Apakah perlu fitur cetak jadwal dosen individual? | TBD | Open |
| 10 | Apakah sistem perlu mendukung penjadwalan untuk kelas malam atau weekend? | TBD | Open |
| 11 | Berapa jumlah slot waktu maksimal yang bisa diinput dosen per hari? | TBD | Open |
| 12 | Apakah rolling penempatan ruangan dilakukan otomatis penuh atau semi-otomatis (rekomendasi + konfirmasi manual)? | TBD | Open |

---

## 10. UI Reference

> Note: UI berikut hanya untuk referensi fitur dan konten. Implementasi mengikuti system design yang ada (shadcn/ui, Tailwind, React).

### Dashboard Overview
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Dashboard Akademik                     [Semester: 2025/2026 Ganjil ▼] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Total Jadwal│  │ Bentrok     │  │ Preferensi  │  │ Sync        │  │
│  │    342      │  │     3       │  │ Belum: 5    │  │ Berhasil:330│  │
│  │             │  │  [Lihat ->] │  │ [Lihat ->]  │  │ Gagal: 0    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                         │
│  KAPASITAS RUANGAN                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Gedung A  ████████████████████░░░░░░░░░░  65%                     │ │
│  │ Gedung B  ████████████░░░░░░░░░░░░░░░░░░  40%                     │ │
│  │ Gedung C  ██████████████████████████░░░░  85% [!]                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  JADWAL BENTROK                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ [!] Dr. Budi - Algoritma (Selasa 08:00) vs Pemrograman Web       │ │
│  │ [!] R-301 - Basis Data (Rabu 10:00) vs Jaringan Komputer         │ │
│  │ [!] Dr. Ani - Statistika (Kamis 13:00) vs Kalkulus               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  STATUS PREFERENSI DOSEN                                                │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Sudah Mengisi: 45 dosen                                          │ │
│  │ Belum Mengisi: 5 dosen  [Dr. X, Dr. Y, Dr. Z, ...]              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dosen Preference Input Page
```
┌─────────────────────────────────────────────────────────────────────┐
│  Preferensi Jadwal Mengajar                    [Semester: Ganjil ▼] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Dosen: Dr. Budi Santoso, S.Kom., M.T.                            │
│  Jurusan: Teknik Informatika                                        │
│                                                                     │
│  PREFERENSI HARI DAN JAM                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  Senin     [x]  Jam: [08:00] - [10:00]                     │   │
│  │                  Jam: [13:00] - [15:00]  [+ Tambah Slot]   │   │
│  │                                                             │   │
│  │  Selasa    [x]  Jam: [08:00] - [10:00]                     │   │
│  │                                                             │   │
│  │  Rabu      [x]  Jam: [10:00] - [12:00]                     │   │
│  │                                                             │   │
│  │  Kamis     [ ]                                               │   │
│  │  Jumat     [ ]                                               │   │
│  │  Sabtu     [ ]                                               │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Status: Belum Difinalisasi (dapat diubah)                         │
│                                                                     │
│                                              [Cancel]  [Simpan]     │
└─────────────────────────────────────────────────────────────────────┘
```

### Schedule List Page
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Jadwal Kuliah                           [+ Add Schedule]  [Export ▼]   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ [🔍 Search mata kuliah/dosen...]  [Jurusan ▼]  [Semester ▼]      │ │
│  │ [Gedung ▼]  [Hari ▼]  [Ruangan: All ▼]                           │ │
│  │ [View: Ruangan | Dosen | Jurusan | Hari]                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  VIEW: PER RUANGAN                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ R-301 (Gedung A, Kapasitas: 40)                [3/5 slot terisi]  │ │
│  │ ┌─────────────────────────────────────────────────────────────┐   │ │
│  │ │ Senin   │ 08:00-10:00 │ Algoritma    │ Dr. Budi  │ TI-3A   │   │ │
│  │ │         │ 10:00-12:00 │ Basis Data   │ Dr. Ani   │ TI-3B   │   │ │
│  │ │ Selasa  │ 08:00-10:00 │ Pemrog. Web  │ Dr. Candra│ SI-3A   │   │ │
│  │ └─────────────────────────────────────────────────────────────┘   │ │
│  │                                                                   │ │
│  │ R-302 (Gedung A, Kapasitas: 35)                [KOSONG]           │ │
│  │ ┌─────────────────────────────────────────────────────────────┐   │ │
│  │ │ (Belum ada jadwal terjadwal)                                │   │ │
│  │ └─────────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Showing 1-2 of 15 rooms                           [< 1 2 3 ... >]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Schedule Form Page
```
┌─────────────────────────────────────────────────────────────────────┐
│  Add New Schedule                                      [Save] [x]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SCHEDULE INFORMATION                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Jurusan*:     [Teknik Informatika                ▼]         │   │
│  │ Semester*:    [3]                                             │   │
│  │ Mata Kuliah*: [Algoritma dan Pemrograman         ▼]         │   │
│  │ Kelas*:       [A]                                             │   │
│  │ Dosen*:       [Dr. Budi Santoso, S.Kom., M.T.    ▼]         │   │
│  │                                                             │   │
│  │ Preferensi Dosen: Senin 08:00-10:00, Selasa 08:00-10:00    │   │
│  │                   Rabu 10:00-12:00                          │   │
│  │                                                             │   │
│  │ Hari*:        [Selasa                           ▼]         │   │
│  │ Jam Mulai*:   [08:00]                                         │   │
│  │ Jam Selesai*: [10:00]                                         │   │
│  │                                                             │   │
│  │ Ruangan*:     [R-301 - Gedung A (40 kursi)      ▼]         │   │
│  │               [Lihat Ruangan Tersedia ->]                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  VALIDATION STATUS                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [x] R-301 sudah digunakan oleh "Basis Data" pada            │   │
│  │     Selasa 08:00-10:00                                      │   │
│  │                                                             │   │
│  │ Rekomendasi: R-302 (tersedia, kapasitas 35)                 │   │
│  │                                                             │   │
│  │ Simpan diblokir: 1 konflik terdeteksi                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                              [Cancel]  [Save Draft] │
└─────────────────────────────────────────────────────────────────────┘
```

### Combined Class Modal (Lintas Jurusan)
```
┌─────────────────────────────────────────────────────────────┐
│  Buat Kelas Gabungan Lintas Jurusan                   [x]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Jadwal Induk: Algoritma - R-301 - Senin 08:00             │
│                                                             │
│  Kelas yang Digabungkan:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [x] TI-3A   (Teknik Informatika, 25 mahasiswa)      │   │
│  │ [x] SI-3A   (Sistem Informasi, 20 mahasiswa)        │   │
│  │ [ ] TI-3B   (Teknik Informatika, 22 mahasiswa)      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Total Mahasiswa: 45 / 40 (kapasitas R-301)                │
│  [!] PERINGATAN: Total melebihi kapasitas ruangan           │
│                                                             │
│  Rekomendasi: Gunakan R-501 (kapasitas: 60)                 │
│                                                             │
│                                [Cancel]  [Simpan Gabungan]  │
└─────────────────────────────────────────────────────────────┘
```

### Rolling Room Assignment Page
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Rolling Penempatan Ruangan          [Semester: 2025/2026 Ganjil ▼]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pilih Hari: [Senin ▼]  [Mulai Rolling]                                │
│                                                                         │
│  HASIL ROLLING - Senin                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Dosen          │ Jam        │ Preferensi  │ Ruangan    │ Status   │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ Dr. Budi       │ 08:00-10:00│ Sen, Sel, Rab│ R-301     │ Terisi   │ │
│  │ Dr. Ani        │ 08:00-10:00│ Sen, Kam     │ R-302     │ Terisi   │ │
│  │ Dr. Candra     │ 10:00-12:00│ Sen, Jum     │ R-301     │ Terisi   │ │
│  │ Dr. Dedi       │ 13:00-15:00│ Sen          │ R-303     │ Terisi   │ │
│  │ Dr. Eka        │ 08:00-10:00│ Sen          │ -         │ [!]Konflik│ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Ringkasan: 4 Berhasil, 1 Konflik              [Resolve Konflik]       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Export Modal
```
┌─────────────────────────────────────────────────────────────┐
│  Export Jadwal                                        [x]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Format:  (o) PDF   ( ) Excel                               │
│                                                             │
│  Range Export:                                                │
│  (o) Hari Ini - 18 Juni 2026                                │
│  ( ) 7 Hari Ke Depan - 18 s/d 25 Juni 2026                 │
│  ( ) History (Rekap jadwal yang sudah berlalu)              │
│  ( ) Custom Range: [________] s/d [________]                │
│                                                             │
│  Filter:                                                      │
│  Jurusan:   [Semua Jurusan                       ▼]         │
│  Semester:  [Semua Semester                      ▼]         │
│  View:      [Mengikuti view aktif                ▼]         │
│                                                             │
│  Catatan:                                                     │
│  - "7 Hari Ke Depan" cocok untuk ditempel di depan kelas    │
│  - "History" digunakan untuk rekap jadwal yang sudah berlalu │
│                                                             │
│                                [Cancel]  [Export]            │
└─────────────────────────────────────────────────────────────┘
```

### Sync Status Page
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Status Sinkronisasi                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Target Sistem: [TBD - Belum Ditentukan]                               │
│  Terakhir Sync: 18 Juni 2026, 14:32 WIB                               │
│  Status: Berhasil (342 jadwal tersinkronisasi)                         │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ [🔍 Filter...]  [Status: All ▼]  [Tanggal: Hari Ini ▼]           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Timestamp       │ Jadwal           │ Status    │ Aksi             │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ 14:32           │ Algoritma TI-3A  │ Berhasil  │ -                │ │
│  │ 14:32           │ Basis Data TI-3B │ Berhasil  │ -                │ │
│  │ 14:31           │ Jaringan TI-5A   │ Gagal     │ [Retry] [Detail] │ │
│  │ 14:31           │ Pemrog. Web SI-3A│ Berhasil  │ -                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Total: 341 Berhasil, 1 Gagal                  [Retry All Failed]      │
│                                                                         │
│  Catatan: Target sinkronisasi akan ditentukan kemudian.                │
│  Konfigurasi dapat diubah melalui halaman Superadmin.                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Implementation Phases

### Phase 1: Core Infrastructure dan Master Data (P0)
- Setup database dan backend architecture
- Implementasi master data management (Jurusan, Dosen, Ruangan, Mata Kuliah, Semester)
- Halaman login dan role-based access (Staf Akademik, Dosen, Superadmin)
- Import data dari Mimosa (one-time migration tool)

### Phase 2: Preferensi Dosen dan Schedule CRUD (P0)
- Halaman input preferensi jadwal dosen
- Implementasi CRUD jadwal kuliah berdasarkan preferensi
- Schedule form dengan dropdown dari master data
- Validasi bentrok real-time (dosen, ruangan, jam)

### Phase 3: Filter, View, dan Rolling Ruangan (P0)
- Global filter (Jurusan, Semester, Gedung, Ketersediaan Ruangan)
- Dynamic view (per Ruangan, per Dosen)
- Rolling penempatan ruangan (otomatis + manual)
- Search functionality

### Phase 4: Kelas Gabungan dan Drag-and-Drop (P0-P1)
- Fitur kelas gabungan lintas jurusan dengan kalkulasi kuota
- Drag-and-drop penyesuaian ruangan dengan validasi otomatis
- Visual feedback untuk slot tersedia
- Undo penyesuaian

### Phase 5: Dashboard dan Export (P1)
- Dashboard overview dengan statistik
- Kapasitas ruangan visualization
- Status preferensi dosen
- Export jadwal ke PDF dan Excel dengan range selection
- Export history untuk rekap

### Phase 6: Sinkronisasi dan Audit (P1-P2)
- Arsitektur sinkronisasi adapter (target TBD)
- Sync log dan retry mechanism
- Dashboard status sinkronisasi
- Audit log untuk semua perubahan
- Grafik distribusi jadwal

---

## Appendix: Validation Rules

| Field | Rule |
|-------|------|
| Preferensi Hari | Required, pilihan: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu |
| Preferensi Jam Mulai | Required, format HH:MM, harus lebih awal dari Jam Selesai |
| Preferensi Jam Selesai | Required, format HH:MM, harus lebih akhir dari Jam Mulai |
| Mata Kuliah | Required, harus dari master data |
| Kelas | Required, format huruf kapital (A, B, C, dst.) |
| Dosen | Required, harus dari master data dengan status Aktif |
| Ruangan | Required, harus dari master data dengan is_active = true |
| Hari | Required, pilihan: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu |
| Jam Mulai | Required, format HH:MM, harus lebih awal dari Jam Selesai |
| Jam Selesai | Required, format HH:MM, harus lebih akhir dari Jam Mulai |
| Jurusan | Required, harus dari master data |
| Semester | Required, integer 1-8 |
| Ruangan Kapasitas | Required, positive integer, minimal 1 |
| Dosen NIP | Required, unique, format sesuai ketentuan institusi |
| Mata Kuliah Kode | Required, unique, format alphanumeric |
| Mata Kuliah SKS | Required, integer 1-6 |
| Kelas Gabungan Total | Tidak boleh melebihi kapasitas ruangan yang dipilih |

---

## Appendix: Master Data Seeds

### Contoh Jurusan (15 jurusan baru akan ditambahkan)
- Teknik Informatika
- Sistem Informasi
- Teknik Elektro
- Teknik Sipil
- Manajemen
- Akuntansi
- Ilmu Komunikasi
- Psikologi
- Hukum
- Kedokteran

### Contoh Gedung
- Gedung A (5 ruangan)
- Gedung B (4 ruangan)
- Gedung C (6 ruangan)
- Gedung D (3 ruangan)

### Contoh Fasilitas Ruangan
- Proyektor
- AC (Air Conditioning)
- Whiteboard
- Sound System
- Laboratorium Komputer
- WiFi
