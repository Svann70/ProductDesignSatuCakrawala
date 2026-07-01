/* ============================================
   Jadwal Kuliah Page - List, CRUD, Filter, Calendar View
   ============================================ */

const Jadwal = {
  filters: { search: '', jurusan: '', semester: '', gedung: '', hari: '', ketersediaan: '' },
  viewMode: 'kalender', // kalender | ruangan | dosen | jurusan | hari
  editingId: null,
  activeSemesterFocus: 2, // 2 | 4
  activeSystem: 'Blok', // 'Blok' | 'Non-Blok'
  activeBlockPeriod: 'Blok A', // 'Blok A' | 'Blok B'
  selectedWeek: 2,
  currentMonth: 5, // June
  currentYear: 2026,
  activeTab: 'master', // 'master' | 'mingguan'

  getAcademicWeek() {
    let monthOffset = this.currentMonth - 8; // September is index 8
    if (monthOffset < 0) monthOffset += 12;
    return (monthOffset * 4) + this.selectedWeek;
  },

  adjustSemesterFocus() {
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const isGanjil = activeSemester.jenis === 'Ganjil';
    if (isGanjil) {
      this.activeSemesterFocus = this.activeSystem === 'Blok' ? 1 : 3;
    } else {
      this.activeSemesterFocus = this.activeSystem === 'Blok' ? 2 : 4;
    }
  },

  render(container) {
    this.container = container;
    this.adjustSemesterFocus();
    this.renderPage();
  },

  renderPage() {
    const filtered = this.getFiltered();
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const isGanjil = activeSemester.jenis === 'Ganjil';
    const targetSem = this.activeSemesterFocus;

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[this.currentMonth];
    const weeks = [
      { num: 1, label: '1-7' },
      { num: 2, label: '8-14' },
      { num: 3, label: '15-21' },
      { num: 4, label: '22-28' },
      { num: 5, label: '29-31' },
    ];

    const blockRanges = DataStore.getBlockRanges();

    this.container.innerHTML = `
      <div class="page-content-inner">
        <!-- Cohort Switcher (Tingkat 1) -->
        <div style="display: flex; justify-content: center; margin-bottom: var(--space-3)">
          <div class="view-toggle" style="padding: 4px; border-radius: var(--radius-lg)">
            <button class="view-toggle-btn ${this.activeSystem === 'Blok' ? 'active' : ''}" style="padding: var(--space-2) var(--space-4)" id="btnSelectSistemBlok">Sistem Blok</button>
            <button class="view-toggle-btn ${this.activeSystem === 'Non-Blok' ? 'active' : ''}" style="padding: var(--space-2) var(--space-4)" id="btnSelectSistemNonBlok">Sistem Non-Blok (Reguler)</button>
          </div>
        </div>

        <!-- Period Switcher (Tingkat 2 - Only for Blok) -->
        ${(this.activeSystem === 'Blok') ? `
          <div style="display: flex; justify-content: center; margin-bottom: var(--space-2)">
            <div class="view-toggle" style="padding: 2px; border-radius: var(--radius-md); background: var(--color-surface-2)">
              <button class="view-toggle-btn btn-sm ${this.activeBlockPeriod === 'Blok A' ? 'active' : ''}" style="padding: var(--space-1) var(--space-3); font-size: var(--text-xs)" id="tabBlokA">Blok A (Bulan 1-3)</button>
              <button class="view-toggle-btn btn-sm ${this.activeBlockPeriod === 'Blok B' ? 'active' : ''}" style="padding: var(--space-1) var(--space-3); font-size: var(--text-xs)" id="tabBlokB">Blok B (Bulan 4-6)</button>
            </div>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: var(--space-4)">
            <div style="font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--color-ink-muted); padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle); background: var(--color-surface-1)">
              Rentang Tanggal ${this.activeBlockPeriod}: <strong>${this.activeBlockPeriod === 'Blok A' ? blockRanges.blokA.formatted : blockRanges.blokB.formatted}</strong>
            </div>
          </div>
        ` : ''}

        <!-- Month & Week Navigator -->
        <div style="margin-bottom: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3)">
            <div style="display: flex; align-items: center; gap: var(--space-2)">
              <button class="btn btn-ghost btn-icon btn-sm" id="btnPrevMonth" title="Bulan sebelumnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div style="font-weight: var(--weight-semibold); font-size: var(--text-lg); min-width: 180px; text-align: center">${monthName} ${this.currentYear}</div>
              <button class="btn btn-ghost btn-icon btn-sm" id="btnNextMonth" title="Bulan berikutnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm" id="btnOpenDateConfig" style="margin-left: var(--space-2); display: flex; align-items: center; gap: 4px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Pengaturan Tanggal
              </button>
            </div>
          </div>
          <!-- Week Cards -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2)">
            ${weeks.map(w => {
              const isActive = this.selectedWeek === w.num;
              return `
                <div class="week-card" data-week="${w.num}" style="
                  padding: var(--space-2) var(--space-3);
                  border: 1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'};
                  border-radius: var(--radius-md);
                  background: ${isActive ? 'var(--color-primary-subtle)' : 'var(--color-canvas)'};
                  cursor: pointer;
                  text-align: center;
                  transition: all 0.15s;
                ">
                  <div style="font-size: var(--text-xs); color: ${isActive ? 'var(--color-primary-deep)' : 'var(--color-ink-subdued)'}; font-weight: var(--weight-medium)">Minggu ${w.num}</div>
                  <div style="font-size: var(--text-xs); color: var(--color-ink-subdued); font-family: var(--font-mono)">${w.label}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Toolbar -->
        <div class="jadwal-toolbar">
          <div class="toolbar-search">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Cari mata kuliah atau dosen..." value="${this.filters.search}" id="jadwalSearch">
          </div>
          <div class="jadwal-filters">
            <select class="filter-select" id="filterJurusan">
              <option value="">Semua Jurusan</option>
              ${DataStore.jurusan.map(j => `<option value="${j.id}" ${this.filters.jurusan == j.id ? 'selected' : ''}>${j.nama}</option>`).join('')}
            </select>
            <select class="filter-select" id="filterGedung">
              <option value="">Semua Gedung</option>
              ${DataStore.gedung.map(g => `<option value="${g.id}" ${this.filters.gedung == g.id ? 'selected' : ''}>${g.nama}</option>`).join('')}
            </select>
          </div>
          <div style="margin-left: auto; display: flex; gap: var(--space-2); align-items: center">
            <div class="view-toggle">
              <button class="view-toggle-btn ${this.viewMode === 'kalender' ? 'active' : ''}" data-view="kalender">Kalender</button>
              <button class="view-toggle-btn ${this.viewMode === 'ruangan' ? 'active' : ''}" data-view="ruangan">Ruangan</button>
              <button class="view-toggle-btn ${this.viewMode === 'dosen' ? 'active' : ''}" data-view="dosen">Dosen</button>
            </div>
            ${this.activeSystem === 'Blok' ? `
              <button class="btn btn-primary" id="btnAutoRolling">Auto-Rolling ${this.activeBlockPeriod}</button>
            ` : `
              <button class="btn btn-primary" id="btnAutoRolling">Auto-Rolling Semester</button>
            `}
            <button class="btn btn-primary" id="btnAddJadwal">+ Tambah Jadwal</button>
          </div>
        </div>

        <div id="jadwalViewContent">
          ${this.renderView(filtered)}
        </div>
      </div>
    `;
    this.bindEvents();
  },

  bindEvents() {
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const isGanjil = activeSemester.jenis === 'Ganjil';
    const targetSem = isGanjil ? 1 : 2;

    document.getElementById('jadwalSearch').addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.updateView();
    });
    document.getElementById('filterJurusan').addEventListener('change', (e) => {
      this.filters.jurusan = e.target.value;
      this.updateView();
    });
    document.getElementById('filterGedung').addEventListener('change', (e) => {
      this.filters.gedung = e.target.value;
      this.updateView();
    });

    document.querySelectorAll('.view-toggle-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.dataset.view;
        document.querySelectorAll('.view-toggle-btn[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateView();
      });
    });

    // Cohort switcher
    const btnSelectSistemBlok = document.getElementById('btnSelectSistemBlok');
    if (btnSelectSistemBlok) {
      btnSelectSistemBlok.addEventListener('click', () => {
        this.activeSystem = 'Blok';
        this.adjustSemesterFocus();
        this.renderPage();
      });
    }
    const btnSelectSistemNonBlok = document.getElementById('btnSelectSistemNonBlok');
    if (btnSelectSistemNonBlok) {
      btnSelectSistemNonBlok.addEventListener('click', () => {
        this.activeSystem = 'Non-Blok';
        this.adjustSemesterFocus();
        this.renderPage();
      });
    }

    // Block period switcher
    const tabBlokA = document.getElementById('tabBlokA');
    if (tabBlokA) {
      tabBlokA.addEventListener('click', () => {
        this.activeBlockPeriod = 'Blok A';
        this.renderPage();
      });
    }
    const tabBlokB = document.getElementById('tabBlokB');
    if (tabBlokB) {
      tabBlokB.addEventListener('click', () => {
        this.activeBlockPeriod = 'Blok B';
        this.renderPage();
      });
    }

    // Date Configuration
    const btnOpenDateConfig = document.getElementById('btnOpenDateConfig');
    if (btnOpenDateConfig) {
      btnOpenDateConfig.addEventListener('click', () => {
        this.openDateConfig();
      });
    }

    // Rolling Ruangan

    // Month navigation
    document.getElementById('btnPrevMonth').addEventListener('click', () => this.changeMonth(-1));
    document.getElementById('btnNextMonth').addEventListener('click', () => this.changeMonth(1));

    // Week cards
    document.querySelectorAll('.week-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedWeek = parseInt(card.dataset.week);
        this.renderPage();
      });
    });

    document.getElementById('btnAddJadwal').addEventListener('click', () => {
      this.editingId = null;
      this.openForm();
    });

    const btnAutoRolling = document.getElementById('btnAutoRolling');
    if (btnAutoRolling) {
      btnAutoRolling.addEventListener('click', () => {
        const isBlock = this.activeSystem === 'Blok';
        const blockPeriod = isBlock ? this.activeBlockPeriod : null;
        const msg = isBlock 
          ? `Apakah Anda ingin menjadwalkan ulang (auto-rolling) seluruh kelas untuk ${this.activeBlockPeriod}? Tindakan ini akan menghapus jadwal ${this.activeBlockPeriod} saat ini dan membuat jadwal baru secara otomatis bebas dari konflik ruangan dan dosen.`
          : `Apakah Anda ingin menjadwalkan ulang (auto-rolling) seluruh kelas Semester ini? Tindakan ini akan menghapus jadwal Semester saat ini dan membuat jadwal baru secara otomatis bebas dari konflik ruangan dan dosen.`;
        
        if (confirm(msg)) {
          const count = DataStore.generateSemesterSchedule(targetSem, blockPeriod);
          const toastMsg = isBlock 
            ? `Berhasil melakukan rolling! ${count} kelas ${this.activeBlockPeriod} otomatis dijadwalkan tanpa konflik.`
            : `Berhasil melakukan rolling! ${count} kelas Semester otomatis dijadwalkan tanpa konflik.`;
          App.toast(toastMsg);
          this.updateView();
        }
      });
    }
  },

  changeMonth(dir) {
    this.currentMonth += dir;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    this.selectedWeek = 1;
    this.renderPage();
  },

  updateView() {
    const filtered = this.getFiltered();
    const viewContent = document.getElementById('jadwalViewContent');
    if (viewContent) viewContent.innerHTML = this.renderView(filtered);
    this.bindTableEvents();
  },

  getActiveList() {
    return DataStore.jadwal;
  },

  getFiltered() {
    const list = this.getActiveList();
    // Build set of occupied room-time slots
    const occupiedSlots = new Set(); // "ruanganId-hari-jamMulai-jamSelesai"
    list.forEach(j => {
      occupiedSlots.add(`${j.ruangan_id}-${j.hari}-${j.jam_mulai}-${j.jam_selesai}`);
    });

    // Build set of available rooms (rooms with at least 1 free slot in the week)
    const availableRoomIds = new Set();
    DataStore.ruangan.filter(r => r.is_active).forEach(r => {
      const timeSlots = DataStore.getTimeSlots();
      const hasFree = DataStore.hari.some(hari =>
        timeSlots.some(slot => !occupiedSlots.has(`${r.id}-${hari}-${slot.start}-${slot.end}`))
      );
      if (hasFree) availableRoomIds.add(r.id);
    });

    // Build set of fully occupied rooms
    const fullyOccupiedRoomIds = new Set();
    DataStore.ruangan.filter(r => r.is_active).forEach(r => {
      const timeSlots = DataStore.getTimeSlots();
      const allOccupied = DataStore.hari.every(hari =>
        timeSlots.every(slot => occupiedSlots.has(`${r.id}-${hari}-${slot.start}-${slot.end}`))
      );
      if (allOccupied) fullyOccupiedRoomIds.add(r.id);
    });

    return list
      .map(j => DataStore.getJadwalDetail(j))
      .filter(j => {
        // Filter by cohort (Semester 2 vs 4)
        if (j.semester !== this.activeSemesterFocus) return false;

        // If Semester 2 (Block), filter by block period
        if (this.activeSemesterFocus === 2) {
          const type = j.mata_kuliah?.jenis_penjadwalan || 'Reguler';
          if (type !== 'Reguler' && type !== this.activeBlockPeriod) return false;
        }

        if (this.filters.search) {
          const q = this.filters.search.toLowerCase();
          const mkNama = j.mata_kuliah?.nama?.toLowerCase() || '';
          const dosenNama = j.dosen?.nama?.toLowerCase() || '';
          const mkKode = j.mata_kuliah?.kode?.toLowerCase() || '';
          if (!mkNama.includes(q) && !dosenNama.includes(q) && !mkKode.includes(q)) return false;
        }
        if (this.filters.jurusan && j.jurusan_id != this.filters.jurusan) return false;
        if (this.filters.semester && j.semester != this.filters.semester) return false;
        if (this.filters.gedung && j.ruangan && j.ruangan.gedung_id != this.filters.gedung) return false;
        if (this.filters.hari && j.hari !== this.filters.hari) return false;
        // Room availability filter
        if (this.filters.ketersediaan === 'tersedia' && j.ruangan_id && !availableRoomIds.has(j.ruangan_id)) return false;
        if (this.filters.ketersediaan === 'terisi' && j.ruangan_id && !fullyOccupiedRoomIds.has(j.ruangan_id)) return false;
        return true;
      });
  },

  renderView(filtered) {
    if (filtered.length === 0) {
      return `<div class="card"><div class="empty-state">
        <div class="empty-state-title">Tidak ada jadwal ditemukan</div>
        <div class="empty-state-desc">Coba ubah filter atau tambah jadwal baru.</div>
      </div></div>`;
    }

    switch (this.viewMode) {
      case 'kalender': return this.viewKalender(filtered);
      case 'ruangan': return this.viewByRuangan(filtered);
      case 'dosen': return this.viewByDosen(filtered);
      case 'jurusan': return this.viewByJurusan(filtered);
      case 'hari': return this.viewByHari(filtered);
    }
  },

  // ---- KALENDER VIEW (Google Calendar Style) ----
  viewKalender(filtered) {
    const timeSlots = DataStore.getTimeSlots();

    // Build grid data: slot -> day -> [jadwal]
    const gridData = {};
    timeSlots.forEach(slot => {
      gridData[slot.label] = {};
      DataStore.hari.forEach(hari => {
        gridData[slot.label][hari] = [];
      });
    });

    filtered.forEach(j => {
      timeSlots.forEach(slot => {
        const timeOverlap = j.jam_mulai < slot.end && j.jam_selesai > slot.start;
        if (timeOverlap && gridData[slot.label] && gridData[slot.label][j.hari]) {
          gridData[slot.label][j.hari].push(j);
        }
      });
    });

    const uniqueMkIds = [...new Set(filtered.map(j => j.mata_kuliah_id))].slice(0, 6);
    const mkLegend = uniqueMkIds.map(id => DataStore.getMataKuliah(id)).filter(Boolean);

    return `
      <div style="margin-bottom: var(--space-3); display: flex; gap: var(--space-4); flex-wrap: wrap; align-items: center">
        <span style="font-size: var(--text-sm); color: var(--color-ink-muted)">${filtered.length} jadwal ditampilkan</span>
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-left: auto">
          ${mkLegend.map(mk => `
            <div style="display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs)">
              <div style="width: 10px; height: 10px; border-radius: 2px; background: ${DataStore.getMataKuliahColor(mk.id)}"></div>
              <span title="${mk.nama}">${mk.kode}</span>
            </div>
          `).join('')}
          ${uniqueMkIds.length > 6 ? '<span style="font-size: var(--text-xs); color: var(--color-ink-subdued)">...</span>' : ''}
        </div>
      </div>
      <div class="calendar-grid">
        <div class="calendar-time-header">Jam</div>
        ${DataStore.hari.map(h => `<div class="calendar-day-header">${h}</div>`).join('')}

        ${timeSlots.map(slot => `
          <div class="calendar-time-label">${slot.label}</div>
          ${DataStore.hari.map(hari => {
            const items = gridData[slot.label][hari] || [];
            return `
              <div class="calendar-cell" data-hari="${hari}" data-jam="${slot.start}" onclick="Jadwal.onCellClick('${hari}', '${slot.start}', '${slot.end}')">
                ${items.map(j => {
                  const color = DataStore.getMataKuliahColor(j.mata_kuliah_id);
                  return `
                    <div class="calendar-event" style="background: ${color}" title="${j.mata_kuliah?.nama || ''} - ${j.dosen?.nama?.split(',')[0] || ''} - ${j.ruangan?.nama || ''}" onclick="event.stopPropagation(); Jadwal.editingId=${j.id}; Jadwal.openForm()">
                      <button class="calendar-event-delete" onclick="event.stopPropagation(); Jadwal.deleteFromCalendar(${j.id})" title="Hapus jadwal">&times;</button>
                      <div class="calendar-event-title">${j.mata_kuliah?.nama || '-'} (${j.kelas})</div>
                      <div class="calendar-event-meta">${j.dosen?.nama?.split(',')[0] || '-'} | ${j.ruangan?.nama || '-'}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}
        `).join('')}
      </div>
    `;
  },

  onCellClick(hari, jamMulai, jamSelesai) {
    this.editingId = null;
    this.openForm(hari, jamMulai, jamSelesai);
  },

  deleteJadwal(id) {
    return DataStore.deleteJadwal(id);
  },

  deleteFromCalendar(id) {
    const list = this.getActiveList();
    const jadwal = list.find(j => j.id === id);
    if (!jadwal) return;
    const mk = DataStore.getMataKuliah(jadwal.mata_kuliah_id);
    const dosen = DataStore.getDosen(jadwal.dosen_id);
    if (confirm(`Hapus jadwal "${mk?.nama || '-'}" kelas ${jadwal.kelas} (${dosen?.nama?.split(',')[0] || '-'}) pada ${jadwal.hari} ${jadwal.jam_mulai}-${jadwal.jam_selesai}?`)) {
      this.deleteJadwal(id);
      App.toast('Jadwal berhasil dihapus.');
      this.updateView();
    }
  },

  // ---- TABLE VIEWS (existing, unchanged) ----
  viewByRuangan(filtered) {
    const grouped = {};
    filtered.forEach(j => {
      const key = j.ruangan_id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(j);
    });

    return DataStore.ruangan.filter(r => r.is_active).map(r => {
      const items = grouped[r.id] || [];
      const gedung = DataStore.getGedung(r.gedung_id);
      return `
        <div class="room-group">
          <div class="room-group-header">
            <div>
              <span class="room-group-title">${r.nama}</span>
              <span class="room-group-meta" style="margin-left: var(--space-2)">${gedung?.nama || ''}, Kapasitas: ${r.kapasitas}</span>
            </div>
            <span class="badge ${items.length > 0 ? 'badge-info' : 'badge-neutral'}">${items.length} jadwal</span>
          </div>
          ${items.length > 0 ? `
            <div class="table-container" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg); border-top: none">
              <table>
                <thead>
                  <tr>
                    <th>Hari</th>
                    <th>Jam</th>
                    <th>Mata Kuliah</th>
                    <th>Kelas</th>
                    <th>Dosen</th>
                    <th>Jurusan</th>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(j => `
                    <tr>
                      <td>${j.hari}</td>
                      <td class="mono">${j.jam_mulai} - ${j.jam_selesai}</td>
                      <td><strong>${j.mata_kuliah?.nama || '-'}</strong></td>
                      <td>${j.kelas}</td>
                      <td>${j.dosen?.nama?.split(',')[0] || '-'}</td>
                      <td>${j.jurusan?.kode || '-'}</td>
                      <td>${j.semester}</td>
                      <td>${getStatusBadge(j.status)}</td>
                      <td class="table-actions">
                        <button class="btn btn-ghost btn-sm btn-edit" data-id="${j.id}" title="Edit">Edit</button>
                        <button class="btn btn-ghost btn-sm btn-delete" data-id="${j.id}" title="Hapus" style="color: var(--color-error)">Hapus</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="room-group-empty">Belum ada jadwal terjadwal</div>`}
        </div>
      `;
    }).join('');
  },

  viewByDosen(filtered) {
    const grouped = {};
    filtered.forEach(j => {
      const key = j.dosen_id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(j);
    });

    return Object.entries(grouped).map(([dosenId, items]) => {
      const dosen = DataStore.getDosen(parseInt(dosenId));
      return `
        <div class="room-group">
          <div class="room-group-header">
            <div>
              <span class="room-group-title">${dosen?.nama || '-'}</span>
              <span class="room-group-meta" style="margin-left: var(--space-2)">${DataStore.getJurusan(dosen?.jurusan_id)?.kode || ''}</span>
            </div>
            <span class="badge badge-info">${items.length} jadwal</span>
          </div>
          <div class="table-container" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg); border-top: none">
            <table>
              <thead><tr><th>Hari</th><th>Jam</th><th>Mata Kuliah</th><th>Kelas</th><th>Ruangan</th><th>Jurusan</th><th>Aksi</th></tr></thead>
              <tbody>
                ${items.map(j => `
                  <tr>
                    <td>${j.hari}</td>
                    <td class="mono">${j.jam_mulai} - ${j.jam_selesai}</td>
                    <td><strong>${j.mata_kuliah?.nama || '-'}</strong></td>
                    <td>${j.kelas}</td>
                    <td>${j.ruangan?.nama || '-'}</td>
                    <td>${j.jurusan?.kode || '-'}</td>
                    <td class="table-actions">
                      <button class="btn btn-ghost btn-sm btn-edit" data-id="${j.id}">Edit</button>
                      <button class="btn btn-ghost btn-sm btn-delete" data-id="${j.id}" style="color: var(--color-error)">Hapus</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  },

  viewByJurusan(filtered) {
    const grouped = {};
    filtered.forEach(j => {
      const key = j.jurusan_id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(j);
    });

    return Object.entries(grouped).map(([jurId, items]) => {
      const jur = DataStore.getJurusan(parseInt(jurId));
      return `
        <div class="room-group">
          <div class="room-group-header">
            <span class="room-group-title">${jur?.nama || '-'}</span>
            <span class="badge badge-info">${items.length} jadwal</span>
          </div>
          <div class="table-container" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg); border-top: none">
            <table>
              <thead><tr><th>Hari</th><th>Jam</th><th>Mata Kuliah</th><th>Kelas</th><th>Dosen</th><th>Ruangan</th><th>Smt</th><th>Aksi</th></tr></thead>
              <tbody>
                ${items.map(j => `
                  <tr>
                    <td>${j.hari}</td>
                    <td class="mono">${j.jam_mulai} - ${j.jam_selesai}</td>
                    <td><strong>${j.mata_kuliah?.nama || '-'}</strong></td>
                    <td>${j.kelas}</td>
                    <td>${j.dosen?.nama?.split(',')[0] || '-'}</td>
                    <td>${j.ruangan?.nama || '-'}</td>
                    <td>${j.semester}</td>
                    <td class="table-actions">
                      <button class="btn btn-ghost btn-sm btn-edit" data-id="${j.id}">Edit</button>
                      <button class="btn btn-ghost btn-sm btn-delete" data-id="${j.id}" style="color: var(--color-error)">Hapus</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  },

  viewByHari(filtered) {
    const grouped = {};
    DataStore.hari.forEach(h => grouped[h] = []);
    filtered.forEach(j => {
      if (grouped[j.hari]) grouped[j.hari].push(j);
    });

    return DataStore.hari.map(hari => {
      const items = grouped[hari];
      if (items.length === 0) return '';
      return `
        <div class="room-group">
          <div class="room-group-header">
            <span class="room-group-title">${hari}</span>
            <span class="badge badge-info">${items.length} jadwal</span>
          </div>
          <div class="table-container" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg); border-top: none">
            <table>
              <thead><tr><th>Jam</th><th>Mata Kuliah</th><th>Kelas</th><th>Dosen</th><th>Ruangan</th><th>Jurusan</th><th>Aksi</th></tr></thead>
              <tbody>
                ${items.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai)).map(j => `
                  <tr>
                    <td class="mono">${j.jam_mulai} - ${j.jam_selesai}</td>
                    <td><strong>${j.mata_kuliah?.nama || '-'}</strong></td>
                    <td>${j.kelas}</td>
                    <td>${j.dosen?.nama?.split(',')[0] || '-'}</td>
                    <td>${j.ruangan?.nama || '-'}</td>
                    <td>${j.jurusan?.kode || '-'}</td>
                    <td class="table-actions">
                      <button class="btn btn-ghost btn-sm btn-edit" data-id="${j.id}">Edit</button>
                      <button class="btn btn-ghost btn-sm btn-delete" data-id="${j.id}" style="color: var(--color-error)">Hapus</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).filter(Boolean).join('');
  },

  bindTableEvents() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editingId = parseInt(btn.dataset.id);
        this.openForm();
      });
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        if (confirm('Yakin ingin menghapus jadwal ini?')) {
          DataStore.deleteJadwal(id);
          App.toast('Jadwal berhasil dihapus');
          this.updateView();
        }
      });
    });
  },

  openForm(presetHari, presetJamMulai, presetJamSelesai) {
    const isEdit = this.editingId !== null;
    const list = this.getActiveList();
    const jadwal = isEdit ? list.find(j => j.id === this.editingId) : null;

    // Build or reuse modal
    let modal = document.getElementById('jadwalModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'jadwalModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const defaultHari = jadwal?.hari || presetHari || 'Senin';
    const defaultJamMulai = jadwal?.jam_mulai || presetJamMulai || '08:00';
    const defaultJamSelesai = jadwal?.jam_selesai || presetJamSelesai || '10:00';
    const defaultSemester = jadwal?.semester || this.activeSemesterFocus || 2;

    const activeSem = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const isGanjil = activeSem.jenis === 'Ganjil';
    const semestersToShow = isGanjil ? [1, 3, 5, 7] : [2, 4, 6, 8];

    modal.innerHTML = `
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
          <button class="modal-close" id="closeJadwalModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Jurusan <span class="required">*</span></label>
              <select class="form-select" id="formJurusan">
                <option value="">Pilih Jurusan</option>
                ${DataStore.jurusan.map(j => `<option value="${j.id}" ${jadwal?.jurusan_id === j.id ? 'selected' : ''}>${j.nama}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Semester <span class="required">*</span></label>
              <select class="form-select" id="formSemester">
                ${semestersToShow.map(s => `<option value="${s}" ${defaultSemester === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Mata Kuliah <span class="required">*</span></label>
              <select class="form-select" id="formMataKuliah">
                <option value="">Pilih Mata Kuliah</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Kelas <span class="required">*</span></label>
              <select class="form-select" id="formKelas">
                ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(k => `<option value="${k}" ${jadwal?.kelas === k ? 'selected' : ''}>${k}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="form-row" style="margin-top: var(--space-4)">
            <div class="form-group">
              <label class="form-label">Hari <span class="required">*</span></label>
              <select class="form-select" id="formHari">
                ${DataStore.hari.map(h => `<option value="${h}" ${defaultHari === h ? 'selected' : ''}>${h}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jam <span class="required">*</span></label>
              <div class="time-slot">
                <input type="time" id="formJamMulai" value="${defaultJamMulai}">
                <span class="time-slot-sep">-</span>
                <input type="time" id="formJamSelesai" value="${defaultJamSelesai}">
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: var(--space-4)">
            <label class="form-label">Dosen <span class="required">*</span></label>
            <select class="form-select" id="formDosen">
              <option value="">Pilih Dosen</option>
            </select>
            <div id="dosenStatusDisplay" style="margin-top: 4px;"></div>
          </div>
          <div id="prefDisplay" style="margin-top: var(--space-2)"></div>

          <div class="form-group" style="margin-top: var(--space-4)">
            <label class="form-label">Ruangan <span class="required">*</span></label>
            <select class="form-select" id="formRuangan">
              <option value="">Pilih Ruangan</option>
            </select>
            <div class="form-hint" id="ruanganHint"></div>
            <div id="ruanganStatusDisplay" style="margin-top: 4px;"></div>
          </div>
          <div id="validationAlert" style="margin-top: var(--space-3)"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelJadwalModal">Batal</button>
          <button class="btn btn-primary" id="saveJadwal">Simpan</button>
        </div>
      </div>
    `;

    App.openModal('jadwalModal');

    // Auto duration calculator
    const updateAutoDuration = () => {
      const mkId = parseInt(document.getElementById('formMataKuliah').value);
      if (!mkId) return;
      const mk = DataStore.getMataKuliah(mkId);
      if (!mk) return;
      
      const jamMulaiInput = document.getElementById('formJamMulai');
      const jamSelesaiInput = document.getElementById('formJamSelesai');
      if (!jamMulaiInput || !jamSelesaiInput) return;
      
      const startStr = jamMulaiInput.value;
      if (!startStr) return;
      
      const [h, m] = startStr.split(':').map(Number);
      const isBlock = mk.jenis_penjadwalan === 'Blok A' || mk.jenis_penjadwalan === 'Blok B';
      const durationHours = isBlock ? 3 : 2;
      
      let endH = h + durationHours;
      if (endH > 22) endH = 22;
      
      const endStr = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      jamSelesaiInput.value = endStr;
      
      updateDosenAndRuanganLists();
      this.validateForm();
    };

    // Dynamic dropdown filtering & status displays
    const updateDosenStatus = () => {
      const dosenId = parseInt(document.getElementById('formDosen').value);
      const display = document.getElementById('dosenStatusDisplay');
      if (!display) return;
      if (!dosenId) {
        display.innerHTML = '';
        return;
      }
      const activeList = this.getActiveList();
      const dosenJadwal = activeList.filter(j => j.dosen_id === dosenId && j.id !== this.editingId);
      if (dosenJadwal.length > 0) {
        display.innerHTML = `
          <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1)">
            <strong>Status Dosen:</strong> Terjadwal di:
            <ul style="margin: 2px 0 0 16px; padding: 0;">
              ${dosenJadwal.map(j => {
                const mk = DataStore.getMataKuliah(j.mata_kuliah_id);
                return `<li>${mk?.nama || '-'} (${j.kelas}) pada ${j.hari} ${j.jam_mulai}-${j.jam_selesai}</li>`;
              }).join('')}
            </ul>
          </div>
        `;
      } else {
        display.innerHTML = `<div style="font-size: var(--text-xs); color: var(--color-success); margin-top: var(--space-1)">Dosen belum memiliki jadwal di hari lain.</div>`;
      }
    };

    const updateRuanganStatus = () => {
      const ruanganId = parseInt(document.getElementById('formRuangan').value);
      const display = document.getElementById('ruanganStatusDisplay');
      if (!display) return;
      if (!ruanganId) {
        display.innerHTML = '';
        return;
      }
      const activeList = this.getActiveList();
      const roomJadwal = activeList.filter(j => j.ruangan_id === ruanganId && j.id !== this.editingId);
      if (roomJadwal.length > 0) {
        display.innerHTML = `
          <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1)">
            <strong>Status Ruangan:</strong> Terpakai di:
            <ul style="margin: 2px 0 0 16px; padding: 0;">
              ${roomJadwal.map(j => {
                const mk = DataStore.getMataKuliah(j.mata_kuliah_id);
                return `<li>${mk?.nama || '-'} (${j.kelas}) pada ${j.hari} ${j.jam_mulai}-${j.jam_selesai}</li>`;
              }).join('')}
            </ul>
          </div>
        `;
      } else {
        display.innerHTML = `<div style="font-size: var(--text-xs); color: var(--color-success); margin-top: var(--space-1)">Ruangan belum terpakai di hari lain.</div>`;
      }
    };

    const updateDosenAndRuanganLists = () => {
      const hari = document.getElementById('formHari').value;
      const jamMulai = document.getElementById('formJamMulai').value;
      const jamSelesai = document.getElementById('formJamSelesai').value;

      const currentDosenId = parseInt(document.getElementById('formDosen').value) || (jadwal ? jadwal.dosen_id : null);
      const currentRuanganId = parseInt(document.getElementById('formRuangan').value) || (jadwal ? jadwal.ruangan_id : null);
      const currentMkId = parseInt(document.getElementById('formMataKuliah').value) || (jadwal ? jadwal.mata_kuliah_id : null);

      const activeList = this.getActiveList();

      // Populate Dosen dropdown
      const dosenSelect = document.getElementById('formDosen');
      dosenSelect.innerHTML = '<option value="">Pilih Dosen</option>';
      DataStore.dosen.filter(d => d.status === 'Aktif').forEach(d => {
        const conflicts = DataStore.checkConflict({
          hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: d.id, ruangan_id: 999999, mata_kuliah_id: currentMkId
        }, this.editingId, activeList);
        const isBusy = conflicts.some(c => c.type === 'dosen');
        if (!isBusy || d.id === currentDosenId) {
          const opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = d.nama;
          if (d.id === currentDosenId) opt.selected = true;
          dosenSelect.appendChild(opt);
        }
      });

      // Populate Ruangan dropdown
      const ruanganSelect = document.getElementById('formRuangan');
      ruanganSelect.innerHTML = '<option value="">Pilih Ruangan</option>';
      DataStore.ruangan.filter(r => r.is_active).forEach(r => {
        const conflicts = DataStore.checkConflict({
          hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: 999999, ruangan_id: r.id, mata_kuliah_id: currentMkId
        }, this.editingId, activeList);
        const isBusy = conflicts.some(c => c.type === 'ruangan');
        if (!isBusy || r.id === currentRuanganId) {
          const opt = document.createElement('option');
          opt.value = r.id;
          const g = DataStore.getGedung(r.gedung_id);
          opt.textContent = `${r.nama} - ${g?.nama || ''} (${r.kapasitas} kursi)`;
          if (r.id === currentRuanganId) opt.selected = true;
          ruanganSelect.appendChild(opt);
        }
      });

      this.showPreference();
      updateDosenStatus();
      updateRuanganStatus();
    };

    const updateMataKuliahSelect = () => {
      const selectedSemester = parseInt(document.getElementById('formSemester').value);
      const mkSelect = document.getElementById('formMataKuliah');
      if (!mkSelect) return;
      
      const filteredMK = DataStore.mataKuliah.filter(m => m.semester === selectedSemester);
      const currentMkId = jadwal ? jadwal.mata_kuliah_id : null;

      mkSelect.innerHTML = '<option value="">Pilih Mata Kuliah</option>' + 
        filteredMK.map(m => `<option value="${m.id}" ${currentMkId === m.id ? 'selected' : ''}>${m.nama} (${m.kode}) [${m.jenis_penjadwalan}]</option>`).join('');
    };

    // Events
    document.getElementById('closeJadwalModal').addEventListener('click', () => App.closeModal('jadwalModal'));
    document.getElementById('cancelJadwalModal').addEventListener('click', () => App.closeModal('jadwalModal'));

    // Dynamic bindings
    document.getElementById('formSemester').addEventListener('change', () => {
      updateMataKuliahSelect();
      updateAutoDuration();
    });
    document.getElementById('formDosen').addEventListener('change', () => {
      this.showPreference();
      updateDosenStatus();
    });
    document.getElementById('formRuangan').addEventListener('change', () => {
      updateRuanganStatus();
    });
    document.getElementById('formMataKuliah').addEventListener('change', () => {
      updateAutoDuration();
    });

    ['formHari', 'formJamMulai', 'formJamSelesai'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        updateDosenAndRuanganLists();
        this.validateForm();
      });
    });

    ['formRuangan', 'formDosen'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.validateForm());
    });

    // Save
    document.getElementById('saveJadwal').addEventListener('click', () => this.saveForm());

    // Initialize lists
    updateMataKuliahSelect();
    updateDosenAndRuanganLists();
  },

  showPreference() {
    const dosenId = parseInt(document.getElementById('formDosen').value);
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const pref = DataStore.preferensi.find(p => p.dosen_id === dosenId && p.semester_id === activeSemester.id);
    const display = document.getElementById('prefDisplay');
    if (!display) return;

    if (pref) {
      display.innerHTML = `
        <div style="padding: var(--space-2) var(--space-3); background: var(--color-primary-subtle); border-radius: var(--radius-md); font-size: var(--text-sm)">
          <strong>Preferensi Dosen:</strong> ${pref.details.map(d => `${d.hari} ${d.jam_mulai}-${d.jam_selesai}`).join(', ')}
        </div>
      `;
    } else {
      display.innerHTML = `<div style="font-size: var(--text-sm); color: var(--color-ink-subdued)">Dosen belum mengisi preferensi jadwal.</div>`;
    }
  },

  validateForm() {
    const mkId = parseInt(document.getElementById('formMataKuliah').value);
    const hari = document.getElementById('formHari').value;
    const jamMulai = document.getElementById('formJamMulai').value;
    const jamSelesai = document.getElementById('formJamSelesai').value;
    const dosenId = parseInt(document.getElementById('formDosen').value);
    const ruanganId = parseInt(document.getElementById('formRuangan').value);

    const alertDiv = document.getElementById('validationAlert');
    if (!alertDiv) return;

    if (!hari || !jamMulai || !jamSelesai || !dosenId || !ruanganId) {
      alertDiv.innerHTML = '';
      return;
    }

    const conflicts = DataStore.checkConflict({
      hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: dosenId, ruangan_id: ruanganId, mata_kuliah_id: mkId
    }, this.editingId, this.getActiveList());

    if (conflicts.length > 0) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <span class="alert-icon">!</span>
          <div>
            <strong>Konflik terdeteksi:</strong>
            <ul style="margin: var(--space-1) 0 0 var(--space-4); font-size: var(--text-sm)">
              ${conflicts.map(c => `<li>${c.message}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    } else {
      alertDiv.innerHTML = `<div class="alert alert-success"><span class="alert-icon">&#10003;</span> Tidak ada konflik terdeteksi.</div>`;
    }
  },

  saveForm() {
    const jurusanId = parseInt(document.getElementById('formJurusan').value);
    const semester = parseInt(document.getElementById('formSemester').value);
    const mkId = parseInt(document.getElementById('formMataKuliah').value);
    const kelas = document.getElementById('formKelas').value;
    const dosenId = parseInt(document.getElementById('formDosen').value);
    const hari = document.getElementById('formHari').value;
    const jamMulai = document.getElementById('formJamMulai').value;
    const jamSelesai = document.getElementById('formJamSelesai').value;
    const ruanganId = parseInt(document.getElementById('formRuangan').value);

    if (!jurusanId || !mkId || !dosenId || !hari || !jamMulai || !jamSelesai || !ruanganId) {
      App.toast('Harap lengkapi semua field yang wajib diisi.', 'error');
      return;
    }

    if (jamMulai >= jamSelesai) {
      App.toast('Jam mulai harus lebih awal dari jam selesai.', 'error');
      return;
    }

    const data = {
      mata_kuliah_id: mkId, kelas, dosen_id: dosenId, ruangan_id: ruanganId,
      hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, jurusan_id: jurusanId, semester,
    };

    const activeList = this.getActiveList();
    const conflicts = DataStore.checkConflict(data, this.editingId, activeList);
    if (conflicts.length > 0) {
      App.toast('Tidak dapat menyimpan: masih ada konflik jadwal.', 'error');
      return;
    }

    if (this.editingId) {
      DataStore.updateJadwal(this.editingId, data);
      App.toast('Jadwal berhasil diperbarui.');
    } else {
      DataStore.addJadwal(data);
      App.toast('Jadwal baru berhasil ditambahkan.');
    }

    App.closeModal('jadwalModal');
    this.updateView();
  },

  openDateConfig() {
    let modal = document.getElementById('dateConfigModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dateConfigModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Pengaturan Tanggal Semester</h3>
          <button class="modal-close" onclick="App.closeModal('dateConfigModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: var(--space-4)">
            <label class="form-label">Tanggal Mulai Semester <span class="required">*</span></label>
            <input type="date" class="form-input" id="cfgTanggalMulai" value="${DataStore.semesterConfig.tanggal_mulai}">
          </div>
          <div class="form-group">
            <label class="form-label">Durasi per Blok (Minggu) <span class="required">*</span></label>
            <input type="number" class="form-input" id="cfgWeeksPerBlock" value="${DataStore.semesterConfig.weeks_per_block}" min="1" max="24">
          </div>
          <div id="cfgPreview" style="margin-top: var(--space-4); padding: var(--space-3); background: var(--color-surface-1); border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--color-ink-muted)">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('dateConfigModal')">Batal</button>
          <button class="btn btn-primary" id="btnSaveDateConfig">Simpan Pengaturan</button>
        </div>
      </div>
    `;
    
    App.openModal('dateConfigModal');
    
    const updatePreview = () => {
      const startVal = document.getElementById('cfgTanggalMulai').value;
      const weeksVal = parseInt(document.getElementById('cfgWeeksPerBlock').value);
      if (!startVal || isNaN(weeksVal)) return;
      
      const start = new Date(startVal);
      
      const endA = new Date(start);
      endA.setDate(start.getDate() + (weeksVal * 7) - 1);
      
      const startB = new Date(endA);
      startB.setDate(endA.getDate() + 1);
      const endB = new Date(startB);
      endB.setDate(startB.getDate() + (weeksVal * 7) - 1);
      
      const formatDate = (d) => {
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      };
      
      document.getElementById('cfgPreview').innerHTML = `
        <strong>Estimasi Rentang Tanggal:</strong><br>
        • Blok A: ${formatDate(start)} s/d ${formatDate(endA)} (Minggu 1-${weeksVal})<br>
        • Blok B: ${formatDate(startB)} s/d ${formatDate(endB)} (Minggu ${weeksVal + 1}-${weeksVal * 2})
      `;
    };
    
    updatePreview();
    
    document.getElementById('cfgTanggalMulai').addEventListener('change', updatePreview);
    document.getElementById('cfgWeeksPerBlock').addEventListener('input', updatePreview);
    
    document.getElementById('btnSaveDateConfig').addEventListener('click', () => {
      const startVal = document.getElementById('cfgTanggalMulai').value;
      const weeksVal = parseInt(document.getElementById('cfgWeeksPerBlock').value);
      if (!startVal || isNaN(weeksVal)) {
        App.toast('Lengkapi semua data.', 'error');
        return;
      }
      DataStore.semesterConfig.tanggal_mulai = startVal;
      DataStore.semesterConfig.weeks_per_block = weeksVal;
      App.closeModal('dateConfigModal');
      App.toast('Rentang tanggal semester berhasil diperbarui.');
      this.renderPage();
    });
  },

  runRollingRuangan() {
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const targetBlock = this.activeSystem === 'Blok' ? this.activeBlockPeriod : 'Reguler';
    
    // Run room rolling for each day of week
    const allResults = [];
    DataStore.hari.forEach(hari => {
      const dayResults = DataStore.rollingRooms(hari, targetBlock);
      allResults.push(...dayResults.map(r => ({ ...r, hari })));
    });
    
    // Commit the results to the schedule database
    DataStore.commitRollingResults(allResults);
    
    // Show summary modal
    this.openRollingSummaryModal(allResults, targetBlock, activeSemester);
  },

  openRollingSummaryModal(results, targetBlock, activeSemester) {
    let modal = document.getElementById('rollingSummaryModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'rollingSummaryModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    
    const berhasil = results.filter(r => r.status === 'Terisi' || r.status === 'Dipindahkan').length;
    const konflik = results.filter(r => r.status === 'Konflik').length;
    const dipindahkan = results.filter(r => r.status === 'Dipindahkan').length;
    
    modal.innerHTML = `
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>Ringkasan Hasil Rolling Ruangan</h3>
          <button class="modal-close" onclick="App.closeModal('rollingSummaryModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: var(--space-4); font-size: var(--text-sm)">
            Target Rolling: <strong>Semester ${activeSemester.tahun_ajaran} ${activeSemester.jenis} (${targetBlock})</strong>
          </div>
          
          <div class="rolling-summary" style="display: flex; gap: var(--space-4); margin-bottom: var(--space-4)">
            <div class="rolling-summary-item" style="flex: 1; padding: var(--space-3); background: var(--color-surface-2); border-radius: var(--radius-md); text-align: center">
              <span class="rolling-summary-num" style="display: block; font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-success)">${berhasil}</span>
              <span style="font-size: var(--text-xs); color: var(--color-ink-muted)">Berhasil Ditempatkan</span>
            </div>
            <div class="rolling-summary-item" style="flex: 1; padding: var(--space-3); background: var(--color-surface-2); border-radius: var(--radius-md); text-align: center">
              <span class="rolling-summary-num" style="display: block; font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-warning)">${dipindahkan}</span>
              <span style="font-size: var(--text-xs); color: var(--color-ink-muted)">Dipindahkan Ruangan</span>
            </div>
            <div class="rolling-summary-item" style="flex: 1; padding: var(--space-3); background: var(--color-surface-2); border-radius: var(--radius-md); text-align: center">
              <span class="rolling-summary-num" style="display: block; font-size: var(--text-2xl); font-weight: var(--weight-bold); color: ${konflik > 0 ? 'var(--color-error)' : 'var(--color-ink-muted)'}">${konflik}</span>
              <span style="font-size: var(--text-xs); color: var(--color-ink-muted)">Bentrok / Tanpa Ruang</span>
            </div>
          </div>
          
          ${konflik > 0 ? `
            <div class="alert alert-error" style="margin-bottom: var(--space-4)">
              <span class="alert-icon">!</span>
              <div>
                <strong>Perhatian:</strong> Terdapat ${konflik} jadwal bentrok yang tidak mendapatkan ruangan kosong. Harap sesuaikan jadwal tersebut secara manual.
              </div>
            </div>
            
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-2)">Detail Bentrok:</div>
            <div class="table-container" style="max-height: 200px; overflow-y: auto">
              <table>
                <thead>
                  <tr>
                    <th>Hari</th>
                    <th>Jam</th>
                    <th>Mata Kuliah</th>
                    <th>Dosen</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.filter(r => r.status === 'Konflik').map(r => {
                    const mk = DataStore.getMataKuliah(r.jadwal.mata_kuliah_id);
                    return `
                      <tr>
                        <td>${r.hari}</td>
                        <td class="mono">${r.jadwal.jam_mulai} - ${r.jadwal.jam_selesai}</td>
                        <td><strong>${mk?.nama || '-'} (${r.jadwal.kelas})</strong></td>
                        <td>${r.dosen?.nama?.split(',')[0] || '-'}</td>
                        <td>
                          <button class="btn btn-secondary btn-sm" onclick="App.closeModal('rollingSummaryModal'); Jadwal.editingId=${r.jadwal.id}; Jadwal.openForm()">Resolusi Manual</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="alert alert-success">
              <span class="alert-icon">&#10003;</span>
              <strong>Berhasil:</strong> Seluruh kelas telah berhasil ditempatkan ke dalam ruangan yang kosong dan sesuai preferensi dosen tanpa bentrok!
            </div>
          `}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="App.closeModal('rollingSummaryModal'); Jadwal.updateView()">Selesai & Terapkan</button>
        </div>
      </div>
    `;
    
    App.openModal('rollingSummaryModal');
  },
};
