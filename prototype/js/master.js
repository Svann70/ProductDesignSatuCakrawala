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
                <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
                <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
              <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
                    <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
                <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
                    <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
                    <button class="btn btn-ghost btn-sm" onclick="App.toast('Fitur edit akan datang')">Edit</button>
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
};
