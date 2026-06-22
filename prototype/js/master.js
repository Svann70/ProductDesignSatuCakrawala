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
      !query || j.nama.toLowerCase().includes(query) || j.kode.toLowerCase().includes(query) || j.fakultas.toLowerCase().includes(query)
    );

    container.innerHTML = `
      <div class="master-search-bar">
        <input type="text" class="form-input" id="searchJurusan" placeholder="Cari jurusan..." value="${this.searchQuery.jurusan}">
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah jurusan akan datang')">+ Tambah</button>
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-3)">${filtered.length} jurusan</div>
      <div class="master-card-grid">
        ${filtered.map(j => {
          const matkulCount = DataStore.mataKuliah.filter(m => m.jurusan_id === j.id).length;
          const dosenCount = DataStore.dosen.filter(d => d.jurusan_id === j.id).length;
          const jadwalCount = DataStore.jadwal.filter(jd => jd.jurusan_id === j.id).length;
          const mhsCount = DataStore.mahasiswa.filter(m => m.jurusan_id === j.id).length;
          const color = DataStore.getJurusanColor(j.id);
          return `
            <div class="master-card">
              <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2)">
                <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
                <span class="master-card-code">${j.kode}</span>
              </div>
              <div class="master-card-name">${j.nama}</div>
              <div class="master-card-info">${j.fakultas}</div>
              <div class="master-card-meta">
                <span class="master-card-tag">${matkulCount} mata kuliah</span>
                <span class="master-card-tag">${dosenCount} dosen</span>
                <span class="master-card-tag">${mhsCount} mahasiswa</span>
                <span class="master-card-tag">${jadwalCount} jadwal</span>
              </div>
              <div class="master-card-actions">
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
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah mata kuliah akan datang')">+ Tambah</button>
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
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah mahasiswa akan datang')">+ Tambah</button>
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
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah dosen akan datang')">+ Tambah</button>
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
                  <td><strong>${d.nama}</strong></td>
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
        <button class="btn btn-primary btn-sm" onclick="App.toast('Fitur tambah ruangan akan datang')">+ Tambah</button>
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
          { name: 'fakultas', label: 'Fakultas', value: item?.fakultas || '', required: true },
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

    modal.innerHTML = `
      <div class="modal" style="max-width: 480px">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="App.closeModal('masterEditModal')">&times;</button>
        </div>
        <div class="modal-body">
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
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('masterEditModal')">Batal</button>
          <button class="btn btn-primary" onclick="Master.saveEdit('${type}', ${id})">Simpan</button>
        </div>
      </div>
    `;

    App.openModal('masterEditModal');
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
        const fakultas = getValue('fakultas');
        if (!nama || !kode || !fakultas) { App.toast('Harap lengkapi semua field', 'error'); return; }
        item.nama = nama;
        item.kode = kode;
        item.fakultas = fakultas;
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
        item.nama = nama;
        item.nip = nip;
        item.jurusan_id = jurusan_id;
        item.status = status || 'Aktif';
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
};
