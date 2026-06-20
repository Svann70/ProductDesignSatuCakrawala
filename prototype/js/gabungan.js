/* ============================================
   Kelas Gabungan Page - 2 Modes: By Class or By Student
   ============================================ */

const Gabungan = {
  selectedStudents: [],
  mode: 'kelas', // 'kelas' | 'mahasiswa'

  render(container) {
    this.selectedStudents = [];
    container.innerHTML = `
      <div class="page-content-inner">
        <div class="card">
          <div class="card-header">
            <h3>Grouping Mahasiswa Lintas Jurusan</h3>
            <button class="btn btn-primary" onclick="Gabungan.openCreate()">+ Buat Grouping</button>
          </div>
          <div class="card-body">
            ${DataStore.kelasGabungan.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-title">Belum ada grouping</div>
                <div class="empty-state-desc">Buat grouping untuk menggabungkan mahasiswa dari jurusan berbeda ke dalam satu ruangan. Bisa pilih per kelas atau per individu mahasiswa.</div>
              </div>
            ` : this.renderList()}
          </div>
        </div>
      </div>
    `;
  },

  renderList() {
    return `<div style="display: flex; flex-direction: column; gap: var(--space-3)">
      ${DataStore.kelasGabungan.map(kg => {
        const induk = DataStore.getJadwalDetail(DataStore.jadwal.find(j => j.id === kg.jadwal_induk_id));
        const ruangan = induk?.ruangan;
        const studentIds = kg.student_ids || [];
        const jurusanBreakdown = this.getJurusanBreakdown(studentIds);
        return `
          <div style="padding: var(--space-3) var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md)">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2)">
              <div>
                <strong>${induk?.mata_kuliah?.nama || '-'}</strong>
                <span class="mono" style="margin-left: var(--space-2); color: var(--color-ink-muted)">${induk?.hari} ${induk?.jam_mulai}</span>
              </div>
              <span class="badge ${studentIds.length > (ruangan?.kapasitas || 0) ? 'badge-error' : 'badge-info'}">${studentIds.length} mahasiswa</span>
            </div>
            <div style="font-size: var(--text-sm); color: var(--color-ink-muted)">${jurusanBreakdown}</div>
          </div>
        `;
      }).join('')}
    </div>`;
  },

  getJurusanBreakdown(studentIds) {
    const counts = {};
    studentIds.forEach(sid => {
      const m = DataStore.getMahasiswa(sid);
      if (m) {
        const jur = DataStore.getJurusan(m.jurusan_id);
        const key = jur?.kode || '-';
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([kode, cnt]) => `${cnt} ${kode}`).join(', ');
  },

  openCreate() {
    this.selectedStudents = [];
    this.mode = 'kelas';

    let modal = document.getElementById('gabunganModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gabunganModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const jadwalList = DataStore.jadwal.filter(j => !j.is_gabungan);

    modal.innerHTML = `
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>Buat Grouping Mahasiswa</h3>
          <button class="modal-close" onclick="App.closeModal('gabunganModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Pilih Jadwal Induk <span class="required">*</span></label>
            <select class="form-select" id="gabunganInduk">
              <option value="">Pilih jadwal sebagai induk</option>
              ${jadwalList.map(j => {
                const detail = DataStore.getJadwalDetail(j);
                return `<option value="${j.id}">${detail.mata_kuliah?.nama} - ${detail.ruangan?.nama} - ${j.hari} ${j.jam_mulai}</option>`;
              }).join('')}
            </select>
          </div>

          <div style="margin-top: var(--space-4)">
            <label class="form-label">Mode Penambahan:</label>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2)">
              <button class="btn btn-primary btn-sm" id="modeKelas" onclick="Gabungan.switchMode('kelas')">Per Kelas</button>
              <button class="btn btn-secondary btn-sm" id="modeMhs" onclick="Gabungan.switchMode('mahasiswa')">Per Mahasiswa</button>
            </div>
          </div>

          <div id="gabunganModeContent" style="margin-top: var(--space-4)"></div>
          <div id="gabunganSelectedArea" style="margin-top: var(--space-3)"></div>
          <div id="gabunganPreview" style="margin-top: var(--space-3)"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('gabunganModal')">Batal</button>
          <button class="btn btn-primary" onclick="Gabungan.saveGabungan()">Simpan Grouping</button>
        </div>
      </div>
    `;

    App.openModal('gabunganModal');
    this.switchMode('kelas');
  },

  switchMode(mode) {
    this.mode = mode;
    this.selectedStudents = [];

    const btnKelas = document.getElementById('modeKelas');
    const btnMhs = document.getElementById('modeMhs');
    if (btnKelas) {
      btnKelas.className = mode === 'kelas' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    }
    if (btnMhs) {
      btnMhs.className = mode === 'mahasiswa' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    }

    const content = document.getElementById('gabunganModeContent');
    if (!content) return;

    if (mode === 'kelas') {
      this.renderModeKelas(content);
    } else {
      this.renderModeMahasiswa(content);
    }

    this.updateSelectedArea();
  },

  // ---- MODE: PER KELAS ----
  renderModeKelas(container) {
    // Build unique kelas list from jadwal
    const kelasMap = {};
    DataStore.jadwal.forEach(j => {
      const detail = DataStore.getJadwalDetail(j);
      const key = `${j.jurusan_id}-${j.semester}-${j.kelas}`;
      if (!kelasMap[key]) {
        kelasMap[key] = {
          jurusan_id: j.jurusan_id,
          semester: j.semester,
          kelas: j.kelas,
          jurusan: detail.jurusan,
          mata_kuliah_list: [],
        };
      }
      kelasMap[key].mata_kuliah_list.push(detail.mata_kuliah?.nama || '-');
    });

    const kelasList = Object.values(kelasMap);

    // For each kelas, generate mock students
    const kelasStudents = {};
    kelasList.forEach(k => {
      const key = `${k.jurusan_id}-${k.semester}-${k.kelas}`;
      const jurStudents = DataStore.mahasiswa.filter(m => m.jurusan_id === k.jurusan_id);
      // Assign ~3-5 students per kelas deterministically
      const seed = k.kelas.charCodeAt(0) - 65;
      const count = 3 + (seed % 3);
      kelasStudents[key] = jurStudents.slice(seed * 2, seed * 2 + count);
    });

    container.innerHTML = `
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink); margin-bottom: var(--space-2)">
        Pilih kelas, lalu centang mahasiswa yang ingin digabungkan:
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-3)">
        ${kelasList.map(k => {
          const key = `${k.jurusan_id}-${k.semester}-${k.kelas}`;
          const students = kelasStudents[key] || [];
          const color = DataStore.getJurusanColor(k.jurusan_id);
          return `
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--color-surface-1); cursor: pointer" onclick="Gabungan.toggleKelasExpand('${key}')">
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
                  <strong style="font-size: var(--text-sm)">${k.jurusan?.kode || '-'}-${k.semester}${k.kelas}</strong>
                  <span style="font-size: var(--text-xs); color: var(--color-ink-muted)">${students.length} mahasiswa</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Gabungan.selectAllKelas('${key}')" style="font-size: var(--text-xs)">Select All</button>
                  <span style="font-size: var(--text-xs); color: var(--color-ink-subdued)" id="kelasCount-${key}">0 dipilih</span>
                </div>
              </div>
              <div id="kelasBody-${key}" style="display: none; padding: var(--space-2) var(--space-3)">
                ${students.map(m => `
                  <label class="form-check" style="padding: var(--space-1) 0; font-size: var(--text-sm)">
                    <input type="checkbox" class="kelas-mhs-check" data-key="${key}" data-id="${m.id}" onchange="Gabungan.onKelasCheckChange('${key}')">
                    <span>${m.nama}</span>
                    <span class="mono" style="font-size: var(--text-xs); color: var(--color-ink-subdued); margin-left: var(--space-2)">${m.nim}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  toggleKelasExpand(key) {
    const body = document.getElementById(`kelasBody-${key}`);
    if (body) {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }
  },

  selectAllKelas(key) {
    const checkboxes = document.querySelectorAll(`.kelas-mhs-check[data-key="${key}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => { cb.checked = !allChecked; });
    this.onKelasCheckChange(key);
  },

  onKelasCheckChange(key) {
    const checkboxes = document.querySelectorAll(`.kelas-mhs-check[data-key="${key}"]`);
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const countEl = document.getElementById(`kelasCount-${key}`);
    if (countEl) countEl.textContent = `${checkedCount} dipilih`;

    // Rebuild selectedStudents from ALL checked checkboxes
    this.selectedStudents = [];
    document.querySelectorAll('.kelas-mhs-check:checked').forEach(cb => {
      const id = parseInt(cb.dataset.id);
      const m = DataStore.getMahasiswa(id);
      if (m && !this.selectedStudents.some(s => s.id === id)) {
        this.selectedStudents.push(m);
      }
    });

    this.updateSelectedArea();
  },

  // ---- MODE: PER MAHASISWA (Search) ----
  renderModeMahasiswa(container) {
    container.innerHTML = `
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink); margin-bottom: var(--space-2)">
        Cari dan pilih mahasiswa secara individu:
      </div>
      <div class="gabungan-search-wrap">
        <input type="text" class="form-input" id="gabunganSearch" placeholder="Ketik nama atau NIM mahasiswa..." autocomplete="off">
        <div class="gabungan-search-results" id="gabunganSearchResults"></div>
      </div>
    `;
    this.bindSearchEvents();
  },

  bindSearchEvents() {
    const searchInput = document.getElementById('gabunganSearch');
    const resultsDiv = document.getElementById('gabunganSearchResults');
    if (!searchInput || !resultsDiv) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (query.length < 2) {
        resultsDiv.classList.remove('active');
        resultsDiv.innerHTML = '';
        return;
      }

      const results = DataStore.searchMahasiswa(query)
        .filter(m => !this.selectedStudents.some(s => s.id === m.id));

      if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: var(--space-3); font-size: var(--text-sm); color: var(--color-ink-subdued); text-align: center">Tidak ditemukan</div>';
        resultsDiv.classList.add('active');
        return;
      }

      resultsDiv.innerHTML = results.slice(0, 8).map(m => {
        const jur = DataStore.getJurusan(m.jurusan_id);
        const color = DataStore.getJurusanColor(m.jurusan_id);
        return `
          <div class="gabungan-search-item" data-id="${m.id}">
            <span class="gabungan-search-item-name">${m.nama}</span>
            <span class="gabungan-search-item-meta">
              <span class="mono">${m.nim}</span>
              <span style="color: ${color}; font-weight: var(--weight-medium)">${jur?.kode || '-'}</span>
            </span>
          </div>
        `;
      }).join('');
      resultsDiv.classList.add('active');

      resultsDiv.querySelectorAll('.gabungan-search-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = parseInt(item.dataset.id);
          const mahasiswa = DataStore.getMahasiswa(id);
          if (mahasiswa && !this.selectedStudents.some(s => s.id === id)) {
            this.selectedStudents.push(mahasiswa);
            searchInput.value = '';
            resultsDiv.classList.remove('active');
            this.updateSelectedArea();
          }
        });
      });
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => resultsDiv.classList.remove('active'), 200);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length >= 2) {
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  },

  // ---- SHARED: Selected Area & Preview ----
  updateSelectedArea() {
    const area = document.getElementById('gabunganSelectedArea');
    const preview = document.getElementById('gabunganPreview');
    if (!area) return;

    if (this.selectedStudents.length === 0) {
      area.innerHTML = '';
      if (preview) preview.innerHTML = '';
      return;
    }

    area.innerHTML = `
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink); margin-bottom: var(--space-2)">
        Mahasiswa Terpilih (${this.selectedStudents.length})
      </div>
      <div class="gabungan-selected-list">
        ${this.selectedStudents.map(m => {
          const jur = DataStore.getJurusan(m.jurusan_id);
          const color = DataStore.getJurusanColor(m.jurusan_id);
          return `
            <div class="gabungan-selected-item">
              <div class="gabungan-selected-info">
                <span style="width: 6px; height: 6px; border-radius: 1px; background: ${color}; flex-shrink: 0"></span>
                <span style="font-weight: var(--weight-medium)">${m.nama}</span>
                <span class="mono" style="font-size: var(--text-xs); color: var(--color-ink-subdued)">${m.nim}</span>
                <span style="color: ${color}; font-size: var(--text-xs); font-weight: var(--weight-semibold)">${jur?.kode || '-'}</span>
              </div>
              <button class="gabungan-selected-remove" onclick="Gabungan.removeStudent(${m.id})">Hapus</button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.updatePreview();
  },

  removeStudent(id) {
    this.selectedStudents = this.selectedStudents.filter(m => m.id !== id);
    // Uncheck if in kelas mode
    const cb = document.querySelector(`.kelas-mhs-check[data-id="${id}"]`);
    if (cb) cb.checked = false;
    // Update kelas counts
    document.querySelectorAll('.kelas-mhs-check[data-key]').forEach(el => {
      const key = el.dataset.key;
      const countEl = document.getElementById(`kelasCount-${key}`);
      if (countEl) {
        const checked = document.querySelectorAll(`.kelas-mhs-check[data-key="${key}"]:checked`).length;
        countEl.textContent = `${checked} dipilih`;
      }
    });
    this.updateSelectedArea();
  },

  updatePreview() {
    const preview = document.getElementById('gabunganPreview');
    if (!preview) return;

    if (this.selectedStudents.length === 0) {
      preview.innerHTML = '';
      return;
    }

    const indukId = parseInt(document.getElementById('gabunganInduk')?.value);
    const induk = indukId ? DataStore.getJadwalDetail(DataStore.jadwal.find(j => j.id === indukId)) : null;
    const capacity = induk?.ruangan?.kapasitas || 0;
    const totalStudents = this.selectedStudents.length;
    const overCapacity = capacity > 0 && totalStudents > capacity;

    const counts = {};
    this.selectedStudents.forEach(m => {
      const jur = DataStore.getJurusan(m.jurusan_id);
      const key = jur?.kode || '-';
      counts[key] = (counts[key] || 0) + 1;
    });
    const breakdown = Object.entries(counts)
      .map(([kode, cnt]) => {
        const jur = DataStore.jurusan.find(j => j.kode === kode);
        const color = jur ? DataStore.getJurusanColor(jur.id) : '#8A98A6';
        return `<span style="color: ${color}; font-weight: var(--weight-semibold)">${cnt} ${kode}</span>`;
      })
      .join(', ');

    preview.innerHTML = `
      <div class="gabungan-summary" style="${overCapacity ? 'background: var(--color-error-bg); border-color: var(--color-error)' : ''}">
        <div class="gabungan-summary-row">
          <span class="gabungan-summary-label">Total Mahasiswa</span>
          <span class="gabungan-summary-value">${totalStudents}${capacity > 0 ? ` / ${capacity} kapasitas` : ''}</span>
        </div>
        <div class="gabungan-summary-row">
          <span class="gabungan-summary-label">Breakdown Jurusan</span>
          <span class="gabungan-summary-value">${breakdown}</span>
        </div>
        ${induk ? `
          <div class="gabungan-summary-row">
            <span class="gabungan-summary-label">Jadwal Induk</span>
            <span class="gabungan-summary-value">${induk.mata_kuliah?.nama} - ${induk.ruangan?.nama}</span>
          </div>
        ` : ''}
        ${overCapacity ? `
          <div class="alert alert-error" style="margin-top: var(--space-2)">
            <span class="alert-icon">!</span>
            <span>PERINGATAN: Total mahasiswa melebihi kapasitas ruangan.</span>
          </div>
        ` : ''}
      </div>
    `;
  },

  saveGabungan() {
    const indukId = parseInt(document.getElementById('gabunganInduk')?.value);

    if (!indukId) {
      App.toast('Pilih jadwal induk terlebih dahulu.', 'error');
      return;
    }

    if (this.selectedStudents.length === 0) {
      App.toast('Pilih minimal satu mahasiswa untuk grouping.', 'error');
      return;
    }

    const newGabungan = {
      id: DataStore.kelasGabungan.length + 1,
      jadwal_induk_id: indukId,
      total_mahasiswa: this.selectedStudents.length,
      student_ids: this.selectedStudents.map(m => m.id),
    };

    DataStore.kelasGabungan.push(newGabungan);

    const induk = DataStore.jadwal.find(j => j.id === indukId);
    if (induk) induk.is_gabungan = true;

    App.closeModal('gabunganModal');
    App.toast(`Grouping berhasil dibuat dengan ${this.selectedStudents.length} mahasiswa.`);

    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },
};
