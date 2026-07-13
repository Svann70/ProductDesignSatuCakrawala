/* ============================================
   Master Data Management Page - Card Layout with Search
   ============================================ */

const Master = {
  activeTab: 'jurusan',
  searchQuery: { jurusan: '', dosen: '', ruangan: '', matakuliah: '', semester: '', mahasiswa: '' },

  render(container) {
    container.innerHTML = `
      <div class="page-content-inner">
        <div class="tabs" id="masterTabs">
          <button class="tab ${this.activeTab === 'jurusan' ? 'active' : ''}" data-tab="jurusan">Jurusan</button>
          <button class="tab ${this.activeTab === 'dosen' ? 'active' : ''}" data-tab="dosen">Dosen</button>
          <button class="tab ${this.activeTab === 'ruangan' ? 'active' : ''}" data-tab="ruangan">Ruangan</button>
          <button class="tab ${this.activeTab === 'matakuliah' ? 'active' : ''}" data-tab="matakuliah">Mata Kuliah</button>
          <button class="tab ${this.activeTab === 'mahasiswa' ? 'active' : ''}" data-tab="mahasiswa">Mahasiswa</button>
          <button class="tab ${this.activeTab === 'semester' ? 'active' : ''}" data-tab="semester">Semester</button>
        </div>
        <div id="masterContent"></div>
      </div>
    `;

    document.querySelectorAll('#masterTabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.tab;
        document.querySelectorAll('#masterTabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderTab();
      });
    });

    this.renderTab();
  },

  renderTab() {
    const content = document.getElementById('masterContent');
    switch (this.activeTab) {
      case 'jurusan': this.renderJurusan(content); break;
      case 'dosen': this.renderDosen(content); break;
      case 'ruangan': this.renderRuangan(content); break;
      case 'matakuliah': this.renderMataKuliah(content); break;
      case 'mahasiswa': this.renderMahasiswa(content); break;
      case 'semester': this.renderSemester(content); break;
    }
  },

  // ---- JURUSAN - Card Grid ----
  renderJurusan(container) {
    const query = this.searchQuery.jurusan.toLowerCase();
    const filtered = DataStore.jurusan.filter(j =>
      !query || j.nama.toLowerCase().includes(query) || j.kode.toLowerCase().includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <input type="text" class="form-input" id="searchJurusan" placeholder="Cari program studi..." value="${this.searchQuery.jurusan}" style="flex: 1;">
        <button class="btn btn-primary btn-sm" onclick="Master.openAddJurusanModal()">+ Tambah Prodi / Jurusan</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} prodi / jurusan</div>
      <div class="master-card-grid">
        ${filtered.map(j => {
          const matkulCount = DataStore.mataKuliah.filter(m => m.jurusan_id === j.id).length;
          const dosenCount = DataStore.dosen.filter(d => d.jurusan_id === j.id).length;
          const jadwalCount = DataStore.jadwal.filter(jd => jd.jurusan_id === j.id).length;
          const mhsCount = DataStore.mahasiswa.filter(m => m.jurusan_id === j.id).length;
          const color = DataStore.getJurusanColor(j.id);
          
          return `
            <div class="master-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2)">
                  <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
                  <span class="master-card-code">${j.kode}</span>
                </div>
                <div class="master-card-name" style="font-weight: 700; font-size: var(--text-base); color: var(--color-ink);">${j.nama}</div>
                
                <div class="master-card-meta" style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
                  <span class="master-card-tag">${matkulCount} mk</span>
                  <span class="master-card-tag">${dosenCount} dosen</span>
                  <span class="master-card-tag">${mhsCount} mhs</span>
                  <span class="master-card-tag">${jadwalCount} jadwal</span>
                </div>
              </div>

              <div class="master-card-actions" style="margin-top: var(--space-3); border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-2)">
                <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('jurusan', ${j.id})">Edit</button>
                <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh jadwal', 'error')">Hapus</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('searchJurusan')?.addEventListener('input', (e) => {
      this.searchQuery.jurusan = e.target.value;
      this.renderJurusan(container);
    });
  },

  // ---- MATA KULIAH - Card Grid ----
  renderMataKuliah(container) {
    const query = this.searchQuery.matakuliah.toLowerCase();
    const filtered = DataStore.mataKuliah.filter(m =>
      !query || m.nama.toLowerCase().includes(query) || m.kode.toLowerCase().includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar">
        <input type="text" class="form-input" id="searchMatkul" placeholder="Cari mata kuliah..." value="${this.searchQuery.matakuliah}">
        <select class="filter-select" id="filterMatkulJurusan" style="height: 32px">
          <option value="">Semua Jurusan</option>
          ${DataStore.jurusan.map(j => `<option value="${j.id}">${j.nama}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="Master.openAddModal('matakuliah')">+ Tambah</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} mata kuliah</div>
      <div class="master-card-grid">
        ${filtered.map(m => {
          const jur = DataStore.getJurusan(m.jurusan_id);
          const color = DataStore.getJurusanColor(m.jurusan_id);
          const jadwalCount = DataStore.jadwal.filter(jd => jd.mata_kuliah_id === m.id).length;
          return `
            <div class="master-card">
              <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2)">
                <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
                <span class="master-card-code">${m.kode}</span>
              </div>
              <div class="master-card-name">${m.nama}</div>
              <div class="master-card-info">${jur?.nama || '-'} - Semester ${m.semester}</div>
              <div class="master-card-meta">
                <span class="master-card-tag">${m.sks} SKS</span>
                <span class="master-card-tag">${jadwalCount} jadwal</span>
              </div>
              <div class="master-card-actions">
                <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('matakuliah', ${m.id})">Edit</button>
                <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh jadwal', 'error')">Hapus</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('searchMatkul')?.addEventListener('input', (e) => {
      this.searchQuery.matakuliah = e.target.value;
      this.renderMataKuliah(container);
    });

    document.getElementById('filterMatkulJurusan')?.addEventListener('change', (e) => {
      const jurId = e.target.value;
      const grid = container.querySelector('.master-card-grid');
      if (!grid) return;
      const filtered2 = DataStore.mataKuliah.filter(m => !jurId || m.jurusan_id == parseInt(jurId));
      grid.innerHTML = filtered2.map(m => {
        const jur = DataStore.getJurusan(m.jurusan_id);
        const color = DataStore.getJurusanColor(m.jurusan_id);
        const jadwalCount = DataStore.jadwal.filter(jd => jd.mata_kuliah_id === m.id).length;
        return `
          <div class="master-card">
            <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2)">
              <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
              <span class="master-card-code">${m.kode}</span>
            </div>
            <div class="master-card-name">${m.nama}</div>
            <div class="master-card-info">${jur?.nama || '-'} - Semester ${m.semester}</div>
            <div class="master-card-meta">
              <span class="master-card-tag">${m.sks} SKS</span>
              <span class="master-card-tag">${jadwalCount} jadwal</span>
            </div>
            <div class="master-card-actions">
              <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('matakuliah', ${m.id})">Edit</button>
              <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh jadwal', 'error')">Hapus</button>
            </div>
          </div>
        `;
      }).join('');
      const countEl = container.querySelector('[style*="font-size: var(--text-sm)"][style*="color: var(--color-ink-muted)"]');
      if (countEl) countEl.textContent = `${filtered2.length} mata kuliah`;
    });
  },

  // ---- MAHASISWA - Table with Search ----
  renderMahasiswa(container) {
    const query = this.searchQuery.mahasiswa.toLowerCase();
    const filtered = DataStore.mahasiswa.filter(m =>
      !query || m.nama.toLowerCase().includes(query) || m.nim.includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar">
        <input type="text" class="form-input" id="searchMahasiswa" placeholder="Cari mahasiswa (nama atau NIM)..." value="${this.searchQuery.mahasiswa}">
        <select class="filter-select" id="filterMhsJurusan" style="height: 32px">
          <option value="">Semua Jurusan</option>
          ${DataStore.jurusan.map(j => `<option value="${j.id}">${j.nama}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="Master.openAddModal('mahasiswa')">+ Tambah</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} mahasiswa</div>
      <div class="table-container">
        <table>
          <thead><tr><th>NIM</th><th>Nama</th><th>Jurusan</th><th>Aksi</th></tr></thead>
          <tbody>
            ${filtered.map(m => {
              const jur = DataStore.getJurusan(m.jurusan_id);
              const color = DataStore.getJurusanColor(m.jurusan_id);
              return `
                <tr>
                  <td class="mono">${m.nim}</td>
                  <td><strong>${m.nama}</strong></td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: var(--space-1)">
                      <span style="width: 6px; height: 6px; border-radius: 1px; background: ${color}"></span>
                      ${jur?.kode || '-'}
                    </span>
                  </td>
                  <td class="table-actions">
                    <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('mahasiswa', ${m.id})">Edit</button>
                    <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh grouping', 'error')">Hapus</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('searchMahasiswa')?.addEventListener('input', (e) => {
      this.searchQuery.mahasiswa = e.target.value;
      this.renderMahasiswa(container);
    });

    document.getElementById('filterMhsJurusan')?.addEventListener('change', (e) => {
      const jurId = e.target.value;
      this.searchQuery.mahasiswa = '';
      const tbody = container.querySelector('tbody');
      const countEl = container.querySelector('[style*="font-size: var(--text-sm)"][style*="color: var(--color-ink-muted)"]');
      const filtered2 = DataStore.mahasiswa.filter(m => !jurId || m.jurusan_id == parseInt(jurId));
      if (tbody) {
        tbody.innerHTML = filtered2.map(m => {
          const jur = DataStore.getJurusan(m.jurusan_id);
          const color = DataStore.getJurusanColor(m.jurusan_id);
          return `
            <tr>
              <td class="mono">${m.nim}</td>
              <td><strong>${m.nama}</strong></td>
              <td>
                <span style="display: inline-flex; align-items: center; gap: var(--space-1)">
                  <span style="width: 6px; height: 6px; border-radius: 1px; background: ${color}"></span>
                  ${jur?.kode || '-'}
                </span>
              </td>
              <td class="table-actions">
                <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('mahasiswa', ${m.id})">Edit</button>
                <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh grouping', 'error')">Hapus</button>
              </td>
            </tr>
          `;
        }).join('');
      }
      if (countEl) countEl.textContent = `${filtered2.length} mahasiswa`;
    });
  },

  // ---- DOSEN - Table ----
  renderDosen(container) {
    const query = this.searchQuery.dosen.toLowerCase();
    const filtered = DataStore.dosen.filter(d =>
      !query || d.nama.toLowerCase().includes(query) || d.nip.includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar">
        <input type="text" class="form-input" id="searchDosen" placeholder="Cari dosen..." value="${this.searchQuery.dosen}">
        <button class="btn btn-primary btn-sm" onclick="Master.openAddModal('dosen')">+ Tambah</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} dosen</div>
      <div class="table-container">
        <table>
          <thead><tr><th>NIP</th><th>Nama</th><th>Jurusan</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            ${filtered.map(d => {
              const jur = DataStore.getJurusan(d.jurusan_id);
              return `
                <tr>
                  <td class="mono">${d.nip}</td>
                  <td>
                    <strong>${d.nama}</strong>
                    <div style="margin-top: var(--space-1); display: flex; flex-wrap: wrap; gap: 4px;">
                      ${(d.mata_kuliah_ids || []).map(mkId => {
                        const mk = DataStore.getMataKuliah(mkId);
                        return mk ? `<span class="badge" style="font-size: 10px; background: var(--color-primary-subtle); color: var(--color-primary-deep); border: 1px solid rgba(41, 181, 232, 0.2); padding: 2px 6px;">${mk.nama} (${mk.kode})</span>` : '';
                      }).join('')}
                      ${(d.mata_kuliah_ids || []).length === 0 ? '<span style="font-size: 11px; color: var(--color-ink-subdued); font-style: italic;">Belum ada mata kuliah diajar</span>' : ''}
                    </div>
                  </td>
                  <td>${jur?.kode || '-'}</td>
                  <td>${getStatusBadge(d.status)}</td>
                  <td class="table-actions">
                    <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('dosen', ${d.id})">Edit</button>
                    <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh jadwal', 'error')">Hapus</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('searchDosen')?.addEventListener('input', (e) => {
      this.searchQuery.dosen = e.target.value;
      this.renderDosen(container);
    });
  },

  // ---- RUANGAN - Table ----
  renderRuangan(container) {
    const query = this.searchQuery.ruangan.toLowerCase();
    const filtered = DataStore.ruangan.filter(r =>
      !query || r.nama.toLowerCase().includes(query) || (DataStore.getGedung(r.gedung_id)?.nama || '').toLowerCase().includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar">
        <input type="text" class="form-input" id="searchRuangan" placeholder="Cari ruangan..." value="${this.searchQuery.ruangan}">
        <button class="btn btn-primary btn-sm" onclick="Master.openAddModal('ruangan')">+ Tambah</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} ruangan</div>
      <div class="table-container">
        <table>
          <thead><tr><th>Nama</th><th>Gedung</th><th>Kapasitas</th><th>Fasilitas</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            ${filtered.map(r => {
              const gedung = DataStore.getGedung(r.gedung_id);
              return `
                <tr>
                  <td class="mono"><strong>${r.nama}</strong></td>
                  <td>${gedung?.nama || '-'}</td>
                  <td style="font-family: var(--font-mono)">${r.kapasitas}</td>
                  <td style="font-size: var(--text-sm); color: var(--color-ink-muted)">${r.fasilitas || '-'}</td>
                  <td>${r.is_active ? getStatusBadge('Aktif') : '<span class="badge badge-neutral">Non-Aktif</span>'}</td>
                  <td class="table-actions">
                    <button class="btn btn-ghost btn-sm" onclick="Master.openEditModal('ruangan', ${r.id})">Edit</button>
                    <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="App.toast('Tidak dapat menghapus: data digunakan oleh jadwal', 'error')">Hapus</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('searchRuangan')?.addEventListener('input', (e) => {
      this.searchQuery.ruangan = e.target.value;
      this.renderRuangan(container);
    });
  },

  // ---- SEMESTER - Table ----
  renderSemester(container) {
    container.innerHTML = `
      <div class="master-header">
        <h3>Data Semester</h3>
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah semester akan datang')">+ Tambah Semester</button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Tahun Ajaran</th><th>Jenis</th><th>Status Aktif</th><th>Aksi</th></tr></thead>
          <tbody>
            ${DataStore.semester.map(s => `
              <tr>
                <td><strong>${s.tahun_ajaran}</strong></td>
                <td>${s.jenis}</td>
                <td>${s.is_aktif ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-neutral">Non-Aktif</span>'}</td>
                <td class="table-actions">
                  ${s.is_aktif ? '<span style="font-size: var(--text-sm); color: var(--color-ink-subdued)">Semester aktif</span>' : `<button class="btn btn-secondary btn-sm" onclick="App.toast('Semester berhasil diaktifkan')">Aktifkan</button>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ---- EDIT METHODS ----
  openEditModal(type, id) {
    let item, title, fields;
    switch (type) {
      case 'jurusan':
        item = DataStore.jurusan.find(j => j.id === id);
        title = 'Edit Jurusan';
        fields = [
          { name: 'nama', label: 'Nama Jurusan', value: item?.nama || '', required: true },
          { name: 'kode', label: 'Kode', value: item?.kode || '', required: true },
        ];
        break;
      case 'dosen':
        item = DataStore.dosen.find(d => d.id === id);
        title = 'Edit Dosen';
        fields = [
          { name: 'nama', label: 'Nama', value: item?.nama || '', required: true },
          { name: 'nip', label: 'NIP', value: item?.nip || '', required: true },
          { name: 'jurusan_id', label: 'Jurusan', value: item?.jurusan_id || '', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true },
          { name: 'status', label: 'Status', value: item?.status || 'Aktif', type: 'select', options: [{ value: 'Aktif', label: 'Aktif' }, { value: 'Non-Aktif', label: 'Non-Aktif' }, { value: 'Cuti', label: 'Cuti' }] },
        ];
        break;
      case 'ruangan':
        item = DataStore.ruangan.find(r => r.id === id);
        title = 'Edit Ruangan';
        fields = [
          { name: 'nama', label: 'Nama Ruangan', value: item?.nama || '', required: true },
          { name: 'gedung_id', label: 'Gedung', value: item?.gedung_id || '', type: 'select', options: DataStore.gedung.map(g => ({ value: g.id, label: g.nama })), required: true },
          { name: 'kapasitas', label: 'Kapasitas', value: item?.kapasitas || '', type: 'number', required: true },
          { name: 'fasilitas', label: 'Fasilitas', value: item?.fasilitas || '' },
        ];
        break;
      case 'matakuliah':
        item = DataStore.mataKuliah.find(m => m.id === id);
        title = 'Edit Mata Kuliah';
        fields = [
          { name: 'nama', label: 'Nama Mata Kuliah', value: item?.nama || '', required: true },
          { name: 'kode', label: 'Kode', value: item?.kode || '', required: true },
          { name: 'sks', label: 'SKS', value: item?.sks || '', type: 'number', required: true },
          { name: 'jurusan_id', label: 'Jurusan', value: item?.jurusan_id || '', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true },
          { name: 'semester', label: 'Semester', value: item?.semester || '', type: 'select', options: [1,2,3,4,5,6,7,8].map(s => ({ value: s, label: `Semester ${s}` })), required: true },
        ];
        break;
      case 'mahasiswa':
        item = DataStore.mahasiswa.find(m => m.id === id);
        title = 'Edit Mahasiswa';
        fields = [
          { name: 'nama', label: 'Nama', value: item?.nama || '', required: true },
          { name: 'nim', label: 'NIM', value: item?.nim || '', required: true },
          { name: 'jurusan_id', label: 'Jurusan', value: item?.jurusan_id || '', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true },
        ];
        break;
      default:
        App.toast('Tipe data tidak dikenali', 'error');
        return;
    }

    if (!item) {
      App.toast('Data tidak ditemukan', 'error');
      return;
    }

    let modal = document.getElementById('masterEditModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'masterEditModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    let dosenCoursesHtml = '';
    let jurusanStudentsHtml = '';

    if (type === 'dosen') {
      const allMK = DataStore.mataKuliah;
      const groupedMK = {};
      allMK.forEach(mk => {
        const jur = DataStore.getJurusan(mk.jurusan_id);
        const jurName = jur ? jur.nama : 'Lainnya';
        if (!groupedMK[jurName]) groupedMK[jurName] = [];
        groupedMK[jurName].push(mk);
      });

      dosenCoursesHtml = `
        <div class="form-group" style="margin-top: var(--space-4)">
          <label class="form-label" style="font-weight: var(--weight-semibold)">Mata Kuliah Yang Diajar (Grouping)</label>
          <input type="text" class="form-input" id="searchEditMK" placeholder="Cari mata kuliah..." style="margin-bottom: 8px; width: 100%">
          <div id="editMKContainer" style="max-height: 160px; overflow-y: auto; border: 1px solid var(--color-border); padding: var(--space-2); border-radius: var(--radius-md); background: var(--color-surface-1)">
            ${Object.entries(groupedMK).map(([jurName, courses]) => `
              <div class="jur-group" data-jur="${jurName}">
                <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--color-primary-deep); text-transform: uppercase; margin: 8px 0 4px; border-bottom: 1px solid var(--color-border); padding-bottom: 2px;">${jurName}</div>
                ${courses.map(mk => {
                  const isChecked = (item.mata_kuliah_ids || []).includes(mk.id);
                  return `
                    <label class="mk-checkbox-label" data-name="${mk.nama.toLowerCase()}" data-kode="${mk.kode.toLowerCase()}" style="display: flex; align-items: center; gap: var(--space-2); padding: 4px 0; font-size: var(--text-sm); cursor: pointer">
                      <input type="checkbox" class="edit-dosen-mk-check" value="${mk.id}" ${isChecked ? 'checked' : ''} style="width: 15px; height: 15px; accent-color: var(--color-primary); cursor: pointer">
                      <span>${mk.nama} <span class="mono" style="color: var(--color-ink-subdued); font-size: 11px;">(${mk.kode})</span></span>
                    </label>
                  `;
                }).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (type === 'jurusan') {
      const currentStudents = DataStore.mahasiswa.filter(m => m.jurusan_id === id);
      jurusanStudentsHtml = `
        <div class="form-group" style="margin-top: var(--space-4)">
          <label class="form-label" style="font-weight: var(--weight-semibold)">Daftar Mahasiswa di Prodi Ini (<span id="editProdiMhsCount">${currentStudents.length}</span> terpilih)</label>
          <input type="text" class="form-input" id="searchEditProdiMhs" placeholder="Cari nama mahasiswa..." style="margin-bottom: 8px; width: 100%">
          <div id="editProdiMhsContainer" style="max-height: 160px; overflow-y: auto; border: 1px solid var(--color-border); padding: var(--space-2); border-radius: var(--radius-md); background: var(--color-surface-1)">
            ${DataStore.mahasiswa.map(m => {
              const isChecked = m.jurusan_id === id;
              const currentJur = DataStore.getJurusan(m.jurusan_id);
              const jurLabel = currentJur ? `Prodi: ${currentJur.nama}` : 'Belum ada prodi';
              return `
                <label class="edit-prodi-mhs-label" data-name="${m.nama.toLowerCase()}" style="display: flex; align-items: center; gap: var(--space-2); padding: 4px 0; font-size: var(--text-sm); cursor: pointer">
                  <input type="checkbox" class="edit-jurusan-mhs-check" value="${m.id}" ${isChecked ? 'checked' : ''} onchange="Master.updateEditProdiMhsCount()" style="width: 15px; height: 15px; accent-color: var(--color-primary); cursor: pointer">
                  <span>${m.nama} <span style="color: var(--color-ink-subdued); font-size: 11px;">(${m.nim} &bull; ${jurLabel})</span></span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal" style="max-width: 480px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="App.closeModal('masterEditModal')">&times;</button>
        </div>
        <div class="modal-body" style="overflow-y: auto; flex: 1;">
          ${fields.map(f => {
            if (f.type === 'select') {
              return `
                <div class="form-group">
                  <label class="form-label">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>
                  <select class="form-select" id="edit_${f.name}">
                    <option value="">Pilih ${f.label}</option>
                    ${f.options.map(o => `<option value="${o.value}" ${f.value == o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
                  </select>
                </div>
              `;
            }
            return `
              <div class="form-group">
                <label class="form-label">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>
                <input type="${f.type || 'text'}" class="form-input" id="edit_${f.name}" value="${f.value}">
              </div>
            `;
          }).join('')}
          ${dosenCoursesHtml}
          ${jurusanStudentsHtml}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('masterEditModal')">Batal</button>
          <button class="btn btn-primary" onclick="Master.saveEdit('${type}', ${id})">Simpan</button>
        </div>
      </div>
    `;

    App.openModal('masterEditModal');

    if (type === 'dosen') {
      const searchInput = document.getElementById('searchEditMK');
      const container = document.getElementById('editMKContainer');
      if (searchInput && container) {
        searchInput.addEventListener('input', function() {
          const q = this.value.toLowerCase().trim();
          container.querySelectorAll('.mk-checkbox-label').forEach(lbl => {
            const match = lbl.dataset.name.includes(q) || lbl.dataset.kode.includes(q);
            lbl.style.display = match ? 'flex' : 'none';
          });
          container.querySelectorAll('.jur-group').forEach(grp => {
            const visibleChecks = grp.querySelectorAll('.mk-checkbox-label[style="display: flex"]').length;
            grp.style.display = (q === '' || visibleChecks > 0) ? 'block' : 'none';
          });
        });
      }
    }

    if (type === 'jurusan') {
      const searchInput = document.getElementById('searchEditProdiMhs');
      const container = document.getElementById('editProdiMhsContainer');
      if (searchInput && container) {
        searchInput.addEventListener('input', function() {
          const q = this.value.toLowerCase().trim();
          container.querySelectorAll('.edit-prodi-mhs-label').forEach(lbl => {
            const match = lbl.dataset.name.includes(q);
            lbl.style.display = match ? 'flex' : 'none';
          });
        });
      }
    }
  },

  updateEditProdiMhsCount() {
    const checked = document.querySelectorAll('.edit-jurusan-mhs-check:checked').length;
    const el = document.getElementById('editProdiMhsCount');
    if (el) el.textContent = checked;
  },

  saveEdit(type, id) {
    const getValue = (name) => {
      const el = document.getElementById(`edit_${name}`);
      return el ? el.value.trim() : '';
    };

    switch (type) {
      case 'jurusan': {
        const item = DataStore.jurusan.find(j => j.id === id);
        if (!item) return;
        const nama = getValue('nama');
        const kode = getValue('kode');
        if (!nama || !kode) { App.toast('Harap lengkapi semua field', 'error'); return; }
        item.nama = nama;
        item.kode = kode;

        // Mass update students
        const checkedStudents = Array.from(document.querySelectorAll('.edit-jurusan-mhs-check:checked')).map(cb => parseInt(cb.value));
        DataStore.mahasiswa.forEach(m => {
          if (checkedStudents.includes(m.id)) {
            m.jurusan_id = id;
          } else if (m.jurusan_id === id) {
            m.jurusan_id = null; // Unassigned
          }
        });
        break;
      }
      case 'dosen': {
        const item = DataStore.dosen.find(d => d.id === id);
        if (!item) return;
        const nama = getValue('nama');
        const nip = getValue('nip');
        const jurusan_id = parseInt(getValue('jurusan_id'));
        const status = getValue('status');
        if (!nama || !nip || !jurusan_id) { App.toast('Harap lengkapi semua field', 'error'); return; }

        const selectedMK = Array.from(document.querySelectorAll('.edit-dosen-mk-check:checked')).map(cb => parseInt(cb.value));

        item.nama = nama;
        item.nip = nip;
        item.jurusan_id = jurusan_id;
        item.status = status || 'Aktif';
        item.mata_kuliah_ids = selectedMK;

        // Log audit
        DataStore.auditLog.push({
          id: DataStore.auditLog.length + 1,
          entitas: 'Dosen',
          entitas_id: id,
          aksi: 'Update',
          perubahan: { field: 'mata_kuliah_ids', nilai_lama: null, nilai_baru: selectedMK.join(',') },
          user: 'Staff Akademik',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        break;
      }
      case 'ruangan': {
        const item = DataStore.ruangan.find(r => r.id === id);
        if (!item) return;
        const nama = getValue('nama');
        const gedung_id = parseInt(getValue('gedung_id'));
        const kapasitas = parseInt(getValue('kapasitas'));
        const fasilitas = getValue('fasilitas');
        if (!nama || !gedung_id || !kapasitas) { App.toast('Harap lengkapi semua field', 'error'); return; }
        item.nama = nama;
        item.gedung_id = gedung_id;
        item.kapasitas = kapasitas;
        item.fasilitas = fasilitas;
        break;
      }
      case 'matakuliah': {
        const item = DataStore.mataKuliah.find(m => m.id === id);
        if (!item) return;
        const nama = getValue('nama');
        const kode = getValue('kode');
        const sks = parseInt(getValue('sks'));
        const jurusan_id = parseInt(getValue('jurusan_id'));
        const semester = parseInt(getValue('semester'));
        if (!nama || !kode || !sks || !jurusan_id || !semester) { App.toast('Harap lengkapi semua field', 'error'); return; }
        item.nama = nama;
        item.kode = kode;
        item.sks = sks;
        item.jurusan_id = jurusan_id;
        item.semester = semester;
        break;
      }
      case 'mahasiswa': {
        const item = DataStore.mahasiswa.find(m => m.id === id);
        if (!item) return;
        const nama = getValue('nama');
        const nim = getValue('nim');
        const jurusan_id = parseInt(getValue('jurusan_id'));
        if (!nama || !nim || !jurusan_id) { App.toast('Harap lengkapi semua field', 'error'); return; }
        item.nama = nama;
        item.nim = nim;
        item.jurusan_id = jurusan_id;
        break;
      }
    }

    App.closeModal('masterEditModal');
    App.toast('Data berhasil diperbarui.');
    this.renderTab();
  },

  openAddJurusanModal() {
    let modal = document.getElementById('addJurusanModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'addJurusanModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    this.selectedProdiMhs = [];

    modal.innerHTML = `
      <div class="modal" style="max-width: 480px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <h3>Tambah Jurusan / Prodi Baru</h3>
          <button class="modal-close" onclick="App.closeModal('addJurusanModal')">&times;</button>
        </div>
        <div class="modal-body" style="overflow-y: auto; flex: 1;">
          <div class="form-group">
            <label class="form-label">Nama Jurusan / Prodi <span class="required">*</span></label>
            <input type="text" class="form-input" id="newJurusanNama" placeholder="Contoh: Ilmu Komputer" style="width: 100%">
          </div>
          <div class="form-group" style="margin-top: 12px;">
            <label class="form-label">Kode Jurusan / Prodi <span class="required">*</span></label>
            <input type="text" class="form-input" id="newJurusanKode" placeholder="Contoh: ILKOM" style="width: 100%">
          </div>

          <div style="margin-top: 16px;">
            <label class="form-label" style="font-weight: 600; margin-bottom: 4px;">Daftarkan Mahasiswa ke Prodi Ini (<span id="prodiMhsCount">0</span> terpilih):</label>
            <input type="text" class="form-input" id="searchProdiMhs" placeholder="Cari nama mahasiswa..." style="width: 100%; margin-bottom: 6px;">
            <div id="prodiMhsContainer" style="border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-1); padding: 8px; max-height: 200px; overflow-y: auto;">
              ${DataStore.mahasiswa.map(m => {
                const currentJur = DataStore.getJurusan(m.jurusan_id);
                const jurLabel = currentJur ? `Prodi: ${currentJur.nama}` : 'Belum ada prodi';
                return `
                  <label class="prodi-mhs-label" data-name="${m.nama.toLowerCase()}" style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: var(--text-sm); cursor: pointer;">
                    <input type="checkbox" class="prodi-mhs-cb" value="${m.id}" onchange="Master.updateProdiMhsSelection()" style="width: 15px; height: 15px; cursor: pointer; accent-color: var(--color-primary);">
                    <span>${m.nama} <span style="color: var(--color-ink-subdued); font-size: 11px;">(${m.nim} &bull; ${jurLabel})</span></span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('addJurusanModal')">Batal</button>
          <button class="btn btn-primary" onclick="Master.saveNewJurusan()">Simpan</button>
        </div>
      </div>
    `;
    App.openModal('addJurusanModal');

    // Bind search
    const searchInput = document.getElementById('searchProdiMhs');
    const container = document.getElementById('prodiMhsContainer');
    if (searchInput && container) {
      searchInput.addEventListener('input', function() {
        const q = this.value.toLowerCase().trim();
        container.querySelectorAll('.prodi-mhs-label').forEach(lbl => {
          const match = lbl.dataset.name.includes(q);
          lbl.style.display = match ? 'flex' : 'none';
        });
      });
    }
  },

  updateProdiMhsSelection() {
    const checked = Array.from(document.querySelectorAll('.prodi-mhs-cb:checked')).map(cb => parseInt(cb.value));
    this.selectedProdiMhs = checked;
    const label = document.getElementById('prodiMhsCount');
    if (label) label.textContent = checked.length;
  },

  saveNewJurusan() {
    const nama = document.getElementById('newJurusanNama')?.value.trim();
    const kode = document.getElementById('newJurusanKode')?.value.trim().toUpperCase();
    if (!nama || !kode) { App.toast('Harap lengkapi semua field', 'error'); return; }

    const newId = DataStore.jurusan.length > 0 ? Math.max(...DataStore.jurusan.map(j => j.id)) + 1 : 1;
    
    // Add prodi
    DataStore.jurusan.push({ id: newId, nama, kode });

    // Mass assign checked students to this new prodi
    if (this.selectedProdiMhs && this.selectedProdiMhs.length > 0) {
      this.selectedProdiMhs.forEach(sid => {
        const m = DataStore.mahasiswa.find(student => student.id === sid);
        if (m) m.jurusan_id = newId;
      });
      App.toast(`Jurusan "${nama}" (${kode}) berhasil ditambahkan dan ${this.selectedProdiMhs.length} mahasiswa dipindahkan.`);
    } else {
      App.toast(`Jurusan "${nama}" (${kode}) berhasil ditambahkan.`);
    }

    App.closeModal('addJurusanModal');
    this.renderTab();
  },

  openAddModal(type) {
    let title = '';
    let fields = [];
    
    switch (type) {
      case 'mahasiswa':
        title = 'Tambah Mahasiswa Baru';
        fields = [
          { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Contoh: Budi Pratama', required: true },
          { name: 'nim', label: 'NIM', type: 'text', placeholder: 'Contoh: 210102003', required: true },
          { name: 'jurusan_id', label: 'Jurusan / Prodi', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true }
        ];
        break;
      case 'matakuliah':
        title = 'Tambah Mata Kuliah Baru';
        fields = [
          { name: 'nama', label: 'Nama Mata Kuliah', type: 'text', placeholder: 'Contoh: Pemrograman Web', required: true },
          { name: 'kode', label: 'Kode Mata Kuliah', type: 'text', placeholder: 'Contoh: IF102', required: true },
          { name: 'sks', label: 'SKS', type: 'select', options: [1,2,3,4,6].map(s => ({ value: s, label: `${s} SKS` })), required: true },
          { name: 'jurusan_id', label: 'Jurusan / Prodi', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true },
          { name: 'semester', label: 'Semester', type: 'select', options: [1,2,3,4,5,6,7,8].map(s => ({ value: s, label: `Semester ${s}` })), required: true }
        ];
        break;
      case 'dosen':
        title = 'Tambah Dosen Baru';
        fields = [
          { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Contoh: Dr. Eko Wahyudi', required: true },
          { name: 'nip', label: 'NIP / NIDN', type: 'text', placeholder: 'Contoh: 1985031201', required: true },
          { name: 'jurusan_id', label: 'Jurusan Homebase', type: 'select', options: DataStore.jurusan.map(j => ({ value: j.id, label: j.nama })), required: true },
          { name: 'status', label: 'Status', type: 'select', options: [{ value: 'Aktif', label: 'Aktif' }, { value: 'Non-Aktif', label: 'Non-Aktif' }], required: true }
        ];
        break;
      case 'ruangan':
        title = 'Tambah Ruangan Baru';
        fields = [
          { name: 'nama', label: 'Nama Ruangan', type: 'text', placeholder: 'Contoh: Lab Komputer 3', required: true },
          { name: 'gedung_id', label: 'Gedung', type: 'select', options: DataStore.gedung.map(g => ({ value: g.id, label: g.nama })), required: true },
          { name: 'kapasitas', label: 'Kapasitas (Orang)', type: 'number', placeholder: 'Contoh: 30', required: true },
          { name: 'fasilitas', label: 'Fasilitas (pisahkan dengan koma)', type: 'text', placeholder: 'Contoh: AC, Proyektor, PC', required: false }
        ];
        break;
      default:
        App.toast('Tipe data tidak dikenali', 'error');
        return;
    }

    let modal = document.getElementById('masterAddModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'masterAddModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    let extraHtml = '';
    if (type === 'dosen') {
      const allMK = DataStore.mataKuliah;
      const groupedMK = {};
      allMK.forEach(mk => {
        const jur = DataStore.getJurusan(mk.jurusan_id);
        const jurName = jur ? jur.nama : 'Lainnya';
        if (!groupedMK[jurName]) groupedMK[jurName] = [];
        groupedMK[jurName].push(mk);
      });

      extraHtml = `
        <div class="form-group" style="margin-top: var(--space-4)">
          <label class="form-label" style="font-weight: var(--weight-semibold)">Mata Kuliah Yang Diajar (Grouping)</label>
          <input type="text" class="form-input" id="searchAddMK" placeholder="Cari mata kuliah..." style="margin-bottom: 8px; width: 100%">
          <div id="addMKContainer" style="max-height: 160px; overflow-y: auto; border: 1px solid var(--color-border); padding: var(--space-2); border-radius: var(--radius-md); background: var(--color-surface-1)">
            ${Object.entries(groupedMK).map(([jurName, courses]) => `
              <div class="jur-group" data-jur="${jurName}">
                <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--color-primary-deep); text-transform: uppercase; margin: 8px 0 4px; border-bottom: 1px solid var(--color-border); padding-bottom: 2px;">${jurName}</div>
                ${courses.map(mk => `
                  <label class="mk-checkbox-label" data-name="${mk.nama.toLowerCase()}" data-kode="${mk.kode.toLowerCase()}" style="display: flex; align-items: center; gap: var(--space-2); padding: 4px 0; font-size: var(--text-sm); cursor: pointer">
                    <input type="checkbox" class="add-dosen-mk-check" value="${mk.id}" style="width: 15px; height: 15px; accent-color: var(--color-primary); cursor: pointer">
                    <span>${mk.nama} <span class="mono" style="color: var(--color-ink-subdued); font-size: 11px;">(${mk.kode})</span></span>
                  </label>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal" style="max-width: 480px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="App.closeModal('masterAddModal')">&times;</button>
        </div>
        <div class="modal-body" style="overflow-y: auto; flex: 1;">
          ${fields.map(f => {
            if (f.type === 'select') {
              return `
                <div class="form-group">
                  <label class="form-label">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>
                  <select class="form-select" id="add_${f.name}" style="width: 100%">
                    <option value="">Pilih ${f.label}</option>
                    ${f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                  </select>
                </div>
              `;
            }
            return `
              <div class="form-group">
                <label class="form-label">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>
                <input type="${f.type || 'text'}" class="form-input" id="add_${f.name}" placeholder="${f.placeholder || ''}" style="width: 100%">
              </div>
            `;
          }).join('')}
          ${extraHtml}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('masterAddModal')">Batal</button>
          <button class="btn btn-primary" onclick="Master.saveAdd('${type}')">Simpan</button>
        </div>
      </div>
    `;

    App.openModal('masterAddModal');

    if (type === 'dosen') {
      const searchInput = document.getElementById('searchAddMK');
      const container = document.getElementById('addMKContainer');
      if (searchInput && container) {
        searchInput.addEventListener('input', function() {
          const q = this.value.toLowerCase().trim();
          container.querySelectorAll('.mk-checkbox-label').forEach(lbl => {
            const match = lbl.dataset.name.includes(q) || lbl.dataset.kode.includes(q);
            lbl.style.display = match ? 'flex' : 'none';
          });
          container.querySelectorAll('.jur-group').forEach(grp => {
            const visibleChecks = grp.querySelectorAll('.mk-checkbox-label[style="display: flex"]').length;
            grp.style.display = (q === '' || visibleChecks > 0) ? 'block' : 'none';
          });
        });
      }
    }
  },

  saveAdd(type) {
    const getValue = (name) => {
      const el = document.getElementById(`add_${name}`);
      return el ? el.value.trim() : '';
    };

    let newId = 1;
    let dataObj = {};

    switch (type) {
      case 'mahasiswa': {
        const nama = getValue('nama');
        const nim = getValue('nim');
        const jurusan_id = parseInt(getValue('jurusan_id'));
        if (!nama || !nim || !jurusan_id) { App.toast('Harap lengkapi semua field', 'error'); return; }

        newId = DataStore.mahasiswa.length > 0 ? Math.max(...DataStore.mahasiswa.map(m => m.id)) + 1 : 1;
        dataObj = { id: newId, nama, nim, jurusan_id };
        DataStore.mahasiswa.push(dataObj);
        break;
      }
      case 'matakuliah': {
        const nama = getValue('nama');
        const kode = getValue('kode').toUpperCase();
        const sks = parseInt(getValue('sks'));
        const jurusan_id = parseInt(getValue('jurusan_id'));
        const semester = parseInt(getValue('semester'));
        if (!nama || !kode || !sks || !jurusan_id || !semester) { App.toast('Harap lengkapi semua field', 'error'); return; }

        newId = DataStore.mataKuliah.length > 0 ? Math.max(...DataStore.mataKuliah.map(m => m.id)) + 1 : 1;
        dataObj = { id: newId, nama, kode, sks, jurusan_id, semester, jenis_penjadwalan: 'Teori' };
        DataStore.mataKuliah.push(dataObj);
        break;
      }
      case 'dosen': {
        const nama = getValue('nama');
        const nip = getValue('nip');
        const jurusan_id = parseInt(getValue('jurusan_id'));
        const status = getValue('status') || 'Aktif';
        if (!nama || !nip || !jurusan_id) { App.toast('Harap lengkapi semua field', 'error'); return; }

        newId = DataStore.dosen.length > 0 ? Math.max(...DataStore.dosen.map(d => d.id)) + 1 : 1;
        const selectedMK = Array.from(document.querySelectorAll('.add-dosen-mk-check:checked')).map(cb => parseInt(cb.value));
        dataObj = { id: newId, nama, nip, jurusan_id, status, mata_kuliah_ids: selectedMK };
        DataStore.dosen.push(dataObj);
        break;
      }
      case 'ruangan': {
        const nama = getValue('nama');
        const gedung_id = parseInt(getValue('gedung_id'));
        const kapasitas = parseInt(getValue('kapasitas'));
        const fasilitas = getValue('fasilitas') ? getValue('fasilitas').split(',').map(f => f.trim()) : [];
        if (!nama || !gedung_id || !kapasitas) { App.toast('Harap lengkapi semua field', 'error'); return; }

        newId = DataStore.ruangan.length > 0 ? Math.max(...DataStore.ruangan.map(r => r.id)) + 1 : 1;
        dataObj = { id: newId, nama, gedung_id, kapasitas, fasilitas, status: 'Tersedia' };
        DataStore.ruangan.push(dataObj);
        break;
      }
    }

    // Log Audit
    DataStore.auditLog.push({
      id: DataStore.auditLog.length + 1,
      entitas: type.charAt(0).toUpperCase() + type.slice(1),
      entitas_id: newId,
      aksi: 'Create',
      perubahan: { field: 'all', nilai_lama: null, nilai_baru: JSON.stringify(dataObj) },
      user: 'Staff Akademik',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    App.closeModal('masterAddModal');
    App.toast(`Data baru berhasil ditambahkan.`);
    this.renderTab();
  }
};
