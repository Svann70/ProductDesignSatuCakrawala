/* ============================================
   Jadwal Kuliah Page - List, CRUD, Filter, Calendar View
   ============================================ */

const Jadwal = {
  filters: { search: '', jurusan: '', semester: '', gedung: '', hari: '', ketersediaan: '' },
  viewMode: 'kalender', // kalender | ruangan | dosen | jurusan | hari
  editingId: null,
  selectedWeek: 1,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),

  render(container) {
    this.container = container;
    this.renderPage();
  },

  renderPage() {
    const filtered = this.getFiltered();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[this.currentMonth];
    const now = new Date();
    const isCurrentMonth = this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
    const currentWeek = isCurrentMonth ? Math.ceil(now.getDate() / 7) : 1;

    // Week date ranges
    const weeks = [
      { num: 1, label: '1-7' },
      { num: 2, label: '8-14' },
      { num: 3, label: '15-21' },
      { num: 4, label: '22-28' },
      { num: 5, label: '29-31' },
    ];

    this.container.innerHTML = `
      <div class="page-content-inner">
        <!-- Month & Week Selector -->
        <div style="margin-bottom: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3)">
            <div style="display: flex; align-items: center; gap: var(--space-2)">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Jadwal.changeMonth(-1)" title="Bulan sebelumnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div style="font-weight: var(--weight-semibold); font-size: var(--text-lg); min-width: 180px; text-align: center">${monthName} ${this.currentYear}</div>
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Jadwal.changeMonth(1)" title="Bulan berikutnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              ${!isCurrentMonth ? '<button class="btn btn-ghost btn-sm" onclick="Jadwal.goToToday()" style="margin-left: var(--space-2)">Hari Ini</button>' : ''}
            </div>
          </div>
          <!-- Week Cards -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2)">
            ${weeks.map(w => {
              const isActive = this.selectedWeek === w.num;
              const isCurrent = isCurrentMonth && currentWeek === w.num;
              const jadwalCount = this.getJadwalCountForWeek(w.num);
              return `
                <div onclick="Jadwal.selectWeek(${w.num})" style="
                  padding: var(--space-2) var(--space-3);
                  border: 1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'};
                  border-radius: var(--radius-md);
                  background: ${isActive ? 'var(--color-primary-subtle)' : 'var(--color-canvas)'};
                  cursor: pointer;
                  text-align: center;
                  transition: all 0.15s;
                  position: relative;
                ">
                  ${isCurrent ? '<div style="position: absolute; top: 4px; right: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary)"></div>' : ''}
                  <div style="font-size: var(--text-xs); color: ${isActive ? 'var(--color-primary-deep)' : 'var(--color-ink-subdued)'}; font-weight: var(--weight-medium)">Minggu ${w.num}</div>
                  <div style="font-size: var(--text-xs); color: var(--color-ink-subdued); font-family: var(--font-mono)">${w.label}</div>
                  <div style="font-size: var(--text-xs); color: ${isActive ? 'var(--color-primary-deep)' : 'var(--color-ink-muted)'}; margin-top: 2px">${jadwalCount} jadwal</div>
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
            <select class="filter-select" id="filterSemester">
              <option value="">Semua Semester</option>
              ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${this.filters.semester == s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
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
            <button class="btn" id="btnAutoRolling" style="background: var(--color-primary-deep); color: white;">Auto-Rolling Semester 1</button>
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
    document.getElementById('jadwalSearch').addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.updateView();
    });
    document.getElementById('filterJurusan').addEventListener('change', (e) => {
      this.filters.jurusan = e.target.value;
      this.updateView();
    });
    document.getElementById('filterSemester').addEventListener('change', (e) => {
      this.filters.semester = e.target.value;
      this.updateView();
    });
    document.getElementById('filterGedung').addEventListener('change', (e) => {
      this.filters.gedung = e.target.value;
      this.updateView();
    });

    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.dataset.view;
        document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateView();
      });
    });

    document.getElementById('btnAddJadwal').addEventListener('click', () => {
      this.editingId = null;
      this.openForm();
    });

    document.getElementById('btnAutoRolling').addEventListener('click', () => {
      if (confirm('Apakah Anda ingin menjadwalkan ulang (auto-rolling) seluruh kelas Semester 1? Tindakan ini akan menghapus jadwal Semester 1 saat ini dan membuat jadwal baru secara otomatis bebas dari konflik ruangan dan dosen.')) {
        const count = DataStore.generateSemesterSchedule(1);
        App.toast(`Berhasil melakukan rolling! ${count} kelas Semester 1 otomatis dijadwalkan tanpa konflik.`);
        this.updateView();
      }
    });
  },

  updateView() {
    const filtered = this.getFiltered();
    const viewContent = document.getElementById('jadwalViewContent');
    if (viewContent) viewContent.innerHTML = this.renderView(filtered);
    this.bindTableEvents();
  },

  getFiltered() {
    // Build set of occupied room-time slots
    const occupiedSlots = new Set(); // "ruanganId-hari-jamMulai-jamSelesai"
    DataStore.jadwal.forEach(j => {
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

    return DataStore.jadwal
      .map(j => DataStore.getJadwalDetail(j))
      .filter(j => {
        if (this.filters.search) {
          const q = this.filters.search.toLowerCase();
          if (!j.mata_kuliah?.nama.toLowerCase().includes(q) &&
              !j.dosen?.nama.toLowerCase().includes(q) &&
              !j.mata_kuliah?.kode.toLowerCase().includes(q)) return false;
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

  changeMonth(dir) {
    this.currentMonth += dir;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    this.selectedWeek = 1;
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  goToToday() {
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
    this.selectedWeek = Math.ceil(now.getDate() / 7);
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  selectWeek(num) {
    this.selectedWeek = num;
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  getJadwalCountForWeek(weekNum) {
    // Simulate jadwal count per week based on existing data
    const base = DataStore.jadwal.length;
    const perWeek = Math.ceil(base / 4);
    if (weekNum <= 4) return perWeek;
    return Math.max(0, base - perWeek * 4);
  },

  deleteFromCalendar(id) {
    const jadwal = DataStore.jadwal.find(j => j.id === id);
    if (!jadwal) return;
    const mk = DataStore.getMataKuliah(jadwal.mata_kuliah_id);
    const dosen = DataStore.getDosen(jadwal.dosen_id);
    if (confirm(`Hapus jadwal "${mk?.nama || '-'}" kelas ${jadwal.kelas} (${dosen?.nama?.split(',')[0] || '-'}) pada ${jadwal.hari} ${jadwal.jam_mulai}-${jadwal.jam_selesai}?`)) {
      DataStore.deleteJadwal(id);
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
    const jadwal = isEdit ? DataStore.jadwal.find(j => j.id === this.editingId) : null;

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
                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${jadwal?.semester === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Mata Kuliah <span class="required">*</span></label>
              <select class="form-select" id="formMataKuliah">
                <option value="">Pilih Mata Kuliah</option>
                ${DataStore.mataKuliah.map(m => `<option value="${m.id}" ${jadwal?.mata_kuliah_id === m.id ? 'selected' : ''}>${m.nama} (${m.kode})</option>`).join('')}
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

    // Dynamic dropdown filtering & status displays
    const updateDosenStatus = () => {
      const dosenId = parseInt(document.getElementById('formDosen').value);
      const display = document.getElementById('dosenStatusDisplay');
      if (!display) return;
      if (!dosenId) {
        display.innerHTML = '';
        return;
      }
      const list = DataStore.jadwal.filter(j => j.dosen_id === dosenId && j.id !== this.editingId);
      if (list.length > 0) {
        display.innerHTML = `
          <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1)">
            <strong>Status Dosen:</strong> Terjadwal di:
            <ul style="margin: 2px 0 0 16px; padding: 0;">
              ${list.map(j => {
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
      const list = DataStore.jadwal.filter(j => j.ruangan_id === ruanganId && j.id !== this.editingId);
      if (list.length > 0) {
        display.innerHTML = `
          <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1)">
            <strong>Status Ruangan:</strong> Terpakai di:
            <ul style="margin: 2px 0 0 16px; padding: 0;">
              ${list.map(j => {
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

      // Populate Dosen dropdown
      const dosenSelect = document.getElementById('formDosen');
      dosenSelect.innerHTML = '<option value="">Pilih Dosen</option>';
      DataStore.dosen.filter(d => d.status === 'Aktif').forEach(d => {
        const conflicts = DataStore.checkConflict({
          hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: d.id, ruangan_id: 999999
        }, this.editingId);
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
          hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: 999999, ruangan_id: r.id
        }, this.editingId);
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

    // Events
    document.getElementById('closeJadwalModal').addEventListener('click', () => App.closeModal('jadwalModal'));
    document.getElementById('cancelJadwalModal').addEventListener('click', () => App.closeModal('jadwalModal'));

    // Dynamic bindings
    document.getElementById('formDosen').addEventListener('change', () => {
      this.showPreference();
      updateDosenStatus();
    });
    document.getElementById('formRuangan').addEventListener('change', () => {
      updateRuanganStatus();
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
    updateDosenAndRuanganLists();
  },

  showPreference() {
    const dosenId = parseInt(document.getElementById('formDosen').value);
    const pref = DataStore.preferensi.find(p => p.dosen_id === dosenId);
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
      hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, dosen_id: dosenId, ruangan_id: ruanganId,
    }, this.editingId);

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

    const conflicts = DataStore.checkConflict(data, this.editingId);
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
};
