/* ============================================
   Kelas Gabungan - Edit, Delete, Dosen, Popup
   ============================================ */

const Gabungan = {
  selectedStudents: [],
  mode: 'kelas',
  expandedGroups: new Set(),
  editingId: null,

  render(container) {
    this.selectedStudents = [];
    this.editingId = null;
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
                <div class="empty-state-desc">Gabungkan mahasiswa dari jurusan berbeda ke dalam satu ruangan.</div>
              </div>
            ` : this.renderList()}
          </div>
        </div>
      </div>
    `;
  },

  renderList() {
    return `<div style="display: flex; flex-direction: column; gap: var(--space-2)">
      ${DataStore.kelasGabungan.map(kg => {
        const induk = DataStore.getJadwalDetail(DataStore.jadwal.find(j => j.id === kg.jadwal_induk_id));
        const ruangan = induk?.ruangan;
        const dosen = kg.dosen_id ? DataStore.getDosen(kg.dosen_id) : induk?.dosen;
        const studentIds = kg.student_ids || [];
        const jurusanBreakdown = this.getJurusanBreakdown(studentIds);
        const isExpanded = this.expandedGroups.has(kg.id);
        const overCapacity = studentIds.length > (ruangan?.kapasitas || 0);
        return `
          <div style="border: 1px solid ${overCapacity ? 'var(--color-error)' : 'var(--color-border)'}; border-radius: var(--radius-md); overflow: hidden">
            ${overCapacity ? `
              <div style="padding: var(--space-1) var(--space-3); background: var(--color-error-bg); font-size: var(--text-xs); color: var(--color-error); font-weight: var(--weight-medium)">
                Kapasitas terlampaui: ${studentIds.length}/${ruangan?.kapasitas || 0}
              </div>
            ` : ''}
            <div style="padding: var(--space-3) var(--space-4); cursor: pointer" onclick="Gabungan.toggleGroup(${kg.id})">
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <span style="font-size: 10px; color: var(--color-ink-subdued); transition: transform 0.15s; ${isExpanded ? 'transform: rotate(90deg)' : ''}">&#9654;</span>
                  <div>
                    <strong style="font-size: var(--text-sm)">${induk?.mata_kuliah?.nama || '-'}</strong>
                    <span class="mono" style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-left: var(--space-1)">${induk?.hari} ${induk?.jam_mulai}</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <span style="font-size: var(--text-xs); color: var(--color-ink-muted)">${dosen?.nama?.split(',')[0] || '-'}</span>
                  <span class="badge ${overCapacity ? 'badge-error' : 'badge-info'}" style="font-size: 10px">${studentIds.length} mhs</span>
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Gabungan.openEdit(${kg.id})" title="Edit" style="padding: 2px 6px; height: auto">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Gabungan.confirmDelete(${kg.id})" title="Hapus" style="padding: 2px 6px; height: auto; color: var(--color-error)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <div style="font-size: var(--text-xs); color: var(--color-ink-subdued); margin-top: 4px; margin-left: 18px">${jurusanBreakdown}</div>
            </div>
            ${isExpanded ? `
              <div style="padding: 0 var(--space-4) var(--space-3); border-top: 1px solid var(--color-border-subtle); margin-left: 18px">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-2); padding: var(--space-2) 0; font-size: var(--text-xs)">
                  <div><span style="color: var(--color-ink-subdued)">Dosen:</span> <strong>${dosen?.nama?.split(',')[0] || '-'}</strong></div>
                  <div><span style="color: var(--color-ink-subdued)">Ruangan:</span> <strong>${ruangan?.nama || '-'}</strong></div>
                  <div><span style="color: var(--color-ink-subdued)">Kapasitas:</span> <strong style="color: ${overCapacity ? 'var(--color-error)' : 'var(--color-ink)'}">${studentIds.length}/${ruangan?.kapasitas || 0}</strong></div>
                </div>
                <div style="margin-top: var(--space-2)">
                  ${studentIds.map(sid => {
                    const m = DataStore.getMahasiswa(sid);
                    if (!m) return '';
                    const jur = DataStore.getJurusan(m.jurusan_id);
                    const color = DataStore.getJurusanColor(m.jurusan_id);
                    return `
                      <div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; margin: 2px; background: var(--color-surface-1); border-radius: var(--radius-sm); font-size: var(--text-xs)">
                        <span style="width: 5px; height: 5px; border-radius: 1px; background: ${color}"></span>
                        ${m.nama} <span class="mono" style="color: var(--color-ink-subdued)">${m.nim}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>`;
  },

  toggleGroup(id) {
    if (this.expandedGroups.has(id)) this.expandedGroups.delete(id);
    else this.expandedGroups.add(id);
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  getJurusanBreakdown(studentIds) {
    const counts = {};
    studentIds.forEach(sid => {
      const m = DataStore.getMahasiswa(sid);
      if (m) {
        const jur = DataStore.getJurusan(m.jurusan_id);
        counts[jur?.kode || '-'] = (counts[jur?.kode || '-'] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([kode, cnt]) => `${cnt} ${kode}`).join(', ');
  },

  // ---- DELETE ----
  confirmDelete(id) {
    const kg = DataStore.kelasGabungan.find(g => g.id === id);
    if (!kg) return;
    const induk = DataStore.getJadwalDetail(DataStore.jadwal.find(j => j.id === kg.jadwal_induk_id));
    if (confirm(`Hapus grouping "${induk?.mata_kuliah?.nama || '-'}" dengan ${kg.student_ids?.length || 0} mahasiswa?`)) {
      DataStore.kelasGabungan = DataStore.kelasGabungan.filter(g => g.id !== id);
      App.toast('Grouping berhasil dihapus.');
      const content = document.getElementById('pageContent');
      if (content) this.render(content);
    }
  },

  // ---- CREATE ----
  openCreate() {
    this.selectedStudents = [];
    this.mode = 'kelas';
    this.editingId = null;
    this.openForm(null);
  },

  // ---- EDIT ----
  openEdit(id) {
    const kg = DataStore.kelasGabungan.find(g => g.id === id);
    if (!kg) return;
    this.editingId = id;
    this.selectedStudents = (kg.student_ids || []).map(sid => DataStore.getMahasiswa(sid)).filter(Boolean);
    this.mode = 'kelas';
    this.openForm(kg);
  },

  openForm(existing) {
    let modal = document.getElementById('gabunganModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gabunganModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const isEdit = existing !== null;
    const jadwalList = isEdit
      ? DataStore.jadwal.filter(j => !j.is_gabungan || j.id === existing.jadwal_induk_id)
      : DataStore.jadwal.filter(j => !j.is_gabungan);

    const selectedDosenId = existing?.dosen_id || '';

    modal.innerHTML = `
      <div class="modal modal-wide" style="position: relative">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Grouping' : 'Buat Grouping'}</h3>
          <button class="modal-close" onclick="App.closeModal('gabunganModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Jadwal Induk <span class="required">*</span></label>
              <select class="form-select" id="gabunganInduk" onchange="Gabungan.updatePreview()">
                <option value="">Pilih jadwal</option>
                ${jadwalList.map(j => {
                  const d = DataStore.getJadwalDetail(j);
                  return `<option value="${j.id}" ${existing?.jadwal_induk_id === j.id ? 'selected' : ''}>${d.mata_kuliah?.nama} - ${d.ruangan?.nama} - ${j.hari} ${j.jam_mulai}</option>`;
                }).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Dosen Pengajar</label>
              <select class="form-select" id="gabunganDosen">
                <option value="">Pilih dosen (opsional)</option>
                ${DataStore.dosen.filter(d => d.status === 'Aktif').map(d => {
                  const jur = DataStore.getJurusan(d.jurusan_id);
                  return `<option value="${d.id}" ${selectedDosenId === d.id ? 'selected' : ''}>${d.nama.split(',')[0]} (${jur?.kode || '-'})</option>`;
                }).join('')}
              </select>
            </div>
          </div>

          <!-- Mode Tabs -->
          <div style="display: flex; gap: 0; margin-top: var(--space-4); border-bottom: 1px solid var(--color-border)">
            <button class="tab ${this.mode === 'kelas' ? 'active' : ''}" id="tabKelas" onclick="Gabungan.switchMode('kelas')">Per Kelas</button>
            <button class="tab ${this.mode === 'mahasiswa' ? 'active' : ''}" id="tabMhs" onclick="Gabungan.switchMode('mahasiswa')">Per Mahasiswa</button>
          </div>

          <div id="gabunganModeContent" style="margin-top: var(--space-3)"></div>
          <div id="gabunganCapacityAlert" style="margin-top: var(--space-3)"></div>
          <div id="gabunganPreview" style="margin-top: var(--space-3)"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('gabunganModal')">Batal</button>
          <button class="btn btn-primary" onclick="Gabungan.saveGabungan()">${isEdit ? 'Simpan Perubahan' : 'Simpan'}</button>
        </div>

        <!-- Floating Button -->
        <div id="gabunganFloatingBtn" onclick="Gabungan.openSelectedPopup()" style="
          display: none;
          position: absolute;
          bottom: 60px;
          right: 16px;
          background: var(--color-primary-deep);
          color: #fff;
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          cursor: pointer;
          box-shadow: var(--shadow-elevated);
          z-index: 10;
          align-items: center;
          gap: 6px;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span id="gabunganFloatingCount">0</span> Mahasiswa
        </div>
      </div>
    `;

    App.openModal('gabunganModal');
    this.switchMode('kelas');
  },

  switchMode(mode) {
    this.mode = mode;
    const tabKelas = document.getElementById('tabKelas');
    const tabMhs = document.getElementById('tabMhs');
    if (tabKelas) tabKelas.className = mode === 'kelas' ? 'tab active' : 'tab';
    if (tabMhs) tabMhs.className = mode === 'mahasiswa' ? 'tab active' : 'tab';

    const content = document.getElementById('gabunganModeContent');
    if (!content) return;

    if (mode === 'kelas') this.renderModeKelas(content);
    else this.renderModeMahasiswa(content);

    this.updateSelectedSummary();
  },

  // ---- MODE: PER KELAS ----
  renderModeKelas(container) {
    const kelasMap = {};
    DataStore.jadwal.forEach(j => {
      const detail = DataStore.getJadwalDetail(j);
      const key = `${j.jurusan_id}-${j.semester}-${j.kelas}`;
      if (!kelasMap[key]) {
        kelasMap[key] = { jurusan_id: j.jurusan_id, semester: j.semester, kelas: j.kelas, jurusan: detail.jurusan };
      }
    });

    const kelasList = Object.values(kelasMap);
    const kelasStudents = {};
    kelasList.forEach(k => {
      const key = `${k.jurusan_id}-${k.semester}-${k.kelas}`;
      const jurStudents = DataStore.mahasiswa.filter(m => m.jurusan_id === k.jurusan_id);
      const seed = k.kelas.charCodeAt(0) - 65;
      kelasStudents[key] = jurStudents.slice(seed * 2, seed * 2 + 3 + (seed % 3));
    });

    container.innerHTML = `
      <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-bottom: var(--space-2)">Pilih kelas, centang mahasiswa:</div>
      <div style="display: flex; flex-direction: column; gap: var(--space-2)">
        ${kelasList.map(k => {
          const key = `${k.jurusan_id}-${k.semester}-${k.kelas}`;
          const students = kelasStudents[key] || [];
          const color = DataStore.getJurusanColor(k.jurusan_id);
          const selectedInClass = students.filter(m => this.selectedStudents.some(s => s.id === m.id));
          return `
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--color-surface-1); cursor: pointer" onclick="Gabungan.toggleKelasExpand('${key}')">
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <span style="font-size: 10px; color: var(--color-ink-subdued)" id="kelasArrow-${key}">&#9654;</span>
                  <div style="width: 6px; height: 6px; border-radius: 1px; background: ${color}"></div>
                  <strong style="font-size: var(--text-xs)">${k.jurusan?.kode || '-'}-${k.semester}${k.kelas}</strong>
                  <span style="font-size: 10px; color: var(--color-ink-subdued)">${students.length} mhs</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-2)">
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); Gabungan.selectAllKelas('${key}')" style="font-size: 10px; padding: 2px 6px; height: auto">Select All</button>
                  <span style="font-size: 10px; color: var(--color-primary-deep); font-weight: var(--weight-semibold)" id="kelasCount-${key}">${selectedInClass.length}</span>
                </div>
              </div>
              <div id="kelasBody-${key}" style="display: none; padding: var(--space-2) var(--space-3)">
                ${students.map(m => {
                  const isChecked = this.selectedStudents.some(s => s.id === m.id);
                  return `
                    <label style="display: flex; align-items: center; gap: var(--space-2); padding: 3px 0; font-size: var(--text-xs); cursor: pointer">
                      <input type="checkbox" class="kelas-mhs-check" data-key="${key}" data-id="${m.id}" ${isChecked ? 'checked' : ''} onchange="Gabungan.onKelasCheckChange('${key}')" style="accent-color: var(--color-primary)">
                      <span>${m.nama}</span>
                      <span class="mono" style="color: var(--color-ink-subdued)">${m.nim}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  toggleKelasExpand(key) {
    const body = document.getElementById(`kelasBody-${key}`);
    const arrow = document.getElementById(`kelasArrow-${key}`);
    if (body) {
      const show = body.style.display === 'none';
      body.style.display = show ? 'block' : 'none';
      if (arrow) arrow.style.transform = show ? 'rotate(90deg)' : '';
    }
  },

  selectAllKelas(key) {
    const checkboxes = document.querySelectorAll(`.kelas-mhs-check[data-key="${key}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => { cb.checked = !allChecked; });
    this.onKelasCheckChange(key);
  },

  onKelasCheckChange(key) {
    const count = document.querySelectorAll(`.kelas-mhs-check[data-key="${key}"]:checked`).length;
    const countEl = document.getElementById(`kelasCount-${key}`);
    if (countEl) countEl.textContent = count;

    this.selectedStudents = [];
    document.querySelectorAll('.kelas-mhs-check:checked').forEach(cb => {
      const id = parseInt(cb.dataset.id);
      const m = DataStore.getMahasiswa(id);
      if (m && !this.selectedStudents.some(s => s.id === id)) this.selectedStudents.push(m);
    });
    this.updateSelectedSummary();
  },

  // ---- MODE: PER MAHASISWA (Search) ----
  renderModeMahasiswa(container) {
    container.innerHTML = `
      <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-bottom: var(--space-2)">Cari mahasiswa lalu klik untuk menambahkan:</div>
      <div style="position: relative">
        <input type="text" class="form-input" id="gabunganSearch" placeholder="Ketik nama atau NIM..." autocomplete="off" style="width: 100%">
        <div class="gabungan-search-results" id="gabunganSearchResults"></div>
      </div>
    `;

    setTimeout(() => {
      const input = document.getElementById('gabunganSearch');
      const results = document.getElementById('gabunganSearchResults');
      if (!input || !results) return;

      input.addEventListener('input', function() {
        const q = this.value.trim();
        if (q.length < 2) { results.classList.remove('active'); results.innerHTML = ''; return; }

        const found = DataStore.searchMahasiswa(q).filter(m => !Gabungan.selectedStudents.some(s => s.id === m.id));

        if (found.length === 0) {
          results.innerHTML = '<div style="padding: 12px; font-size: 12px; color: var(--color-ink-subdued); text-align: center">Tidak ditemukan</div>';
        } else {
          results.innerHTML = found.slice(0, 6).map(m => {
            const jur = DataStore.getJurusan(m.jurusan_id);
            const color = DataStore.getJurusanColor(m.jurusan_id);
            return `<div class="gabungan-search-item" data-mhs-id="${m.id}" style="cursor: pointer; padding: 8px 12px; font-size: 13px; display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle)">
              <span style="font-weight: 500">${m.nama}</span>
              <span style="font-size: 11px; color: var(--color-ink-muted)"><span class="mono">${m.nim}</span> <span style="color: ${color}; font-weight: 600">${jur?.kode || ''}</span></span>
            </div>`;
          }).join('');
        }
        results.classList.add('active');

        results.querySelectorAll('.gabungan-search-item').forEach(item => {
          item.addEventListener('mousedown', function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.mhsId);
            const mhs = DataStore.getMahasiswa(id);
            if (mhs && !Gabungan.selectedStudents.some(s => s.id === id)) {
              Gabungan.selectedStudents.push(mhs);
              input.value = '';
              results.classList.remove('active');
              Gabungan.updateSelectedSummary();
            }
          });
        });
      });

      input.addEventListener('blur', () => { setTimeout(() => results.classList.remove('active'), 150); });
    }, 50);
  },

  // ---- SELECTED STUDENTS - Floating Button ----
  updateSelectedSummary() {
    const floatingBtn = document.getElementById('gabunganFloatingBtn');
    const floatingCount = document.getElementById('gabunganFloatingCount');
    const alertArea = document.getElementById('gabunganCapacityAlert');

    if (floatingBtn) {
      floatingBtn.style.display = this.selectedStudents.length > 0 ? 'flex' : 'none';
    }
    if (floatingCount) floatingCount.textContent = this.selectedStudents.length;

    const indukId = parseInt(document.getElementById('gabunganInduk')?.value);
    const induk = indukId ? DataStore.getJadwalDetail(DataStore.jadwal.find(j => j.id === indukId)) : null;
    const capacity = induk?.ruangan?.kapasitas || 0;
    const over = capacity > 0 && this.selectedStudents.length > capacity;

    if (alertArea) {
      alertArea.innerHTML = over ? `
        <div class="alert alert-error" style="font-size: var(--text-sm)">
          <span class="alert-icon" style="font-size: var(--text-base)">!</span>
          <span><strong>Kapasitas terlampaui!</strong> ${this.selectedStudents.length}/${capacity} kursi di ${induk?.ruangan?.nama || '-'}</span>
        </div>
      ` : '';
    }

    this.updatePreview();
  },

  // ---- POPUP: Edit Selected Students ----
  openSelectedPopup() {
    let popup = document.getElementById('gabunganPopup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'gabunganPopup';
      popup.className = 'modal-overlay';
      document.body.appendChild(popup);
    }

    const counts = {};
    this.selectedStudents.forEach(m => {
      const jur = DataStore.getJurusan(m.jurusan_id);
      const kode = jur?.kode || '-';
      counts[kode] = (counts[kode] || 0) + 1;
    });
    const breakdown = Object.entries(counts).map(([kode, cnt]) => {
      const jur = DataStore.jurusan.find(j => j.kode === kode);
      const color = DataStore.getJurusanColor(jur?.id);
      return `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; background: ${color}15; border-radius: var(--radius-pill); font-size: 11px; font-weight: 600; color: ${color}">${cnt} ${kode}</span>`;
    }).join(' ');

    const grouped = {};
    this.selectedStudents.forEach(m => {
      const jur = DataStore.getJurusan(m.jurusan_id);
      const kode = jur?.kode || '-';
      if (!grouped[kode]) grouped[kode] = { jur, students: [] };
      grouped[kode].students.push(m);
    });

    popup.innerHTML = `
      <div class="modal" style="max-width: 480px; max-height: 75vh">
        <div class="modal-header" style="padding: var(--space-3) var(--space-4)">
          <div>
            <h3 style="font-size: var(--text-md)">Mahasiswa Terpilih</h3>
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px">${this.selectedStudents.length} mahasiswa</div>
          </div>
          <button class="modal-close" onclick="App.closeModal('gabunganPopup')">&times;</button>
        </div>

        ${this.selectedStudents.length > 0 ? `
          <div style="padding: var(--space-2) var(--space-4); background: var(--color-surface-1); border-bottom: 1px solid var(--color-border-subtle); display: flex; gap: var(--space-2); flex-wrap: wrap">
            ${breakdown}
          </div>
        ` : ''}

        <div class="modal-body" style="max-height: 55vh; overflow-y: auto; padding: 0">
          ${this.selectedStudents.length === 0 ? `
            <div style="text-align: center; color: var(--color-ink-subdued); padding: 40px 20px">
              <div style="font-size: var(--text-sm)">Belum ada mahasiswa dipilih</div>
            </div>
          ` : ''}
          ${Object.entries(grouped).map(([kode, group]) => {
            const color = DataStore.getJurusanColor(group.jur?.id);
            return `
              <div>
                <div style="padding: 6px var(--space-4); background: ${color}08; border-bottom: 1px solid var(--color-border-subtle); font-size: 11px; font-weight: 600; color: ${color}; text-transform: uppercase; letter-spacing: 0.03em">
                  ${kode} - ${group.jur?.nama || '-'}
                </div>
                ${group.students.map(m => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px var(--space-4); border-bottom: 1px solid var(--color-border-subtle)">
                    <div style="display: flex; align-items: center; gap: var(--space-2)">
                      <span style="font-size: var(--text-sm)">${m.nama}</span>
                      <span class="mono" style="font-size: 11px; color: var(--color-ink-subdued)">${m.nim}</span>
                    </div>
                    <button style="background: none; border: none; color: var(--color-error); cursor: pointer; font-size: 11px; padding: 2px 6px; border-radius: 3px; font-family: var(--font-sans)" onclick="Gabungan.removeFromPopup(${m.id})" onmouseover="this.style.background='var(--color-error-bg)'" onmouseout="this.style.background='none'">Hapus</button>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
        <div class="modal-footer" style="padding: var(--space-2) var(--space-4)">
          <button class="btn btn-ghost btn-sm" style="color: var(--color-error)" onclick="Gabungan.clearAllSelected()">Hapus Semua</button>
          <button class="btn btn-secondary btn-sm" onclick="App.closeModal('gabunganPopup')">Tutup</button>
        </div>
      </div>
    `;

    App.openModal('gabunganPopup');
  },

  removeFromPopup(id) {
    this.selectedStudents = this.selectedStudents.filter(m => m.id !== id);
    const cb = document.querySelector(`.kelas-mhs-check[data-id="${id}"]`);
    if (cb) cb.checked = false;
    if (this.selectedStudents.length > 0) this.openSelectedPopup();
    else App.closeModal('gabunganPopup');
    this.updateSelectedSummary();
  },

  clearAllSelected() {
    this.selectedStudents = [];
    document.querySelectorAll('.kelas-mhs-check:checked').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('[id^="kelasCount-"]').forEach(el => { el.textContent = '0'; });
    App.closeModal('gabunganPopup');
    this.updateSelectedSummary();
  },

  // ---- SAVE (Create & Edit) ----
  saveGabungan() {
    const indukId = parseInt(document.getElementById('gabunganInduk')?.value);
    const dosenId = document.getElementById('gabunganDosen')?.value;
    if (!indukId) { App.toast('Pilih jadwal induk.', 'error'); return; }
    if (this.selectedStudents.length === 0) { App.toast('Pilih minimal 1 mahasiswa.', 'error'); return; }

    const isEdit = this.editingId !== null;

    if (isEdit) {
      // Update existing
      const kg = DataStore.kelasGabungan.find(g => g.id === this.editingId);
      if (kg) {
        kg.jadwal_induk_id = indukId;
        kg.dosen_id = dosenId ? parseInt(dosenId) : null;
        kg.total_mahasiswa = this.selectedStudents.length;
        kg.student_ids = this.selectedStudents.map(m => m.id);
      }
      App.toast(`Grouping berhasil diperbarui: ${this.selectedStudents.length} mahasiswa.`);
    } else {
      // Create new
      DataStore.kelasGabungan.push({
        id: DataStore.kelasGabungan.length + 1,
        jadwal_induk_id: indukId,
        dosen_id: dosenId ? parseInt(dosenId) : null,
        total_mahasiswa: this.selectedStudents.length,
        student_ids: this.selectedStudents.map(m => m.id),
      });

      const induk = DataStore.jadwal.find(j => j.id === indukId);
      if (induk) induk.is_gabungan = true;

      App.toast(`Grouping berhasil dibuat: ${this.selectedStudents.length} mahasiswa.`);
    }

    App.closeModal('gabunganModal');
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },
};
