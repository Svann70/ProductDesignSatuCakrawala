/* ============================================
   Manajemen Grouping & Kelas Mahasiswa Page - Card Based Layout (Cleaned)
   ============================================ */

const Gabungan = {
  selectedStudents: [],
  mode: 'kelas', // 'kelas' or 'mahasiswa' for custom class selection tab
  activeTab: 'prodi', // 'prodi' or 'kustom'
  editingClassId: null,

  render(container) {
    container.innerHTML = `
      <div class="page-content-inner">
        <!-- Header Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <div style="display: flex; gap: var(--space-2); background: var(--color-surface-2); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle)">
            <button class="btn ${this.activeTab === 'prodi' ? 'btn-primary' : 'btn-ghost'}" onclick="Gabungan.switchTab('prodi')" style="padding: 6px 16px; font-size: var(--text-sm);">Kelas per Prodi / Jurusan</button>
            <button class="btn ${this.activeTab === 'kustom' ? 'btn-primary' : 'btn-ghost'}" onclick="Gabungan.switchTab('kustom')" style="padding: 6px 16px; font-size: var(--text-sm);">Kelas Kustomisasi (Lintas Jurusan)</button>
          </div>
          
          ${this.activeTab === 'kustom' ? `
            <button class="btn btn-primary" onclick="Gabungan.openAddClassModal(null)">+ Tambah Kelas Kustom</button>
          ` : ''}
        </div>

        ${this.activeTab === 'prodi' ? `
          <div style="background: var(--color-primary-subtle); padding: 8px 12px; border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--color-primary-deep); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: space-between;">
            <span>Daftar program studi disinkronkan langsung dari Master Data.</span>
            <a href="#" onclick="App.navigate('master'); return false;" style="text-decoration: underline; font-weight: 700; color: var(--color-primary-deep)">+ Kelola Prodi di Master Data</a>
          </div>
        ` : ''}

        <!-- Content Area -->
        <div id="groupingContent">
          ${this.activeTab === 'prodi' ? this.renderProdiCards() : this.renderKustomClasses()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  // ---- RENDER PRODI CARDS (CARD-BASED PRODI GROUPING) ----
  renderProdiCards() {
    const prodis = DataStore.jurusan;

    if (prodis.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-title">Belum ada Prodi / Jurusan</div>
          <div class="empty-state-desc">Silakan tambahkan prodi/jurusan baru terlebih dahulu di Master Data untuk mulai membuat kelas.</div>
        </div>
      `;
    }

    return `
      <div class="master-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
        ${prodis.map(j => {
          const classes = DataStore.kelasMahasiswa.filter(c => c.jurusan_id === j.id && c.tipe !== 'kustom');
          const mhsCount = DataStore.mahasiswa.filter(m => m.jurusan_id === j.id).length;
          const color = DataStore.getJurusanColor(j.id);
          
          return `
            <div class="master-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 250px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); box-shadow: var(--shadow-card);">
              <div>
                <!-- Card Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2)">
                  <div style="display: flex; align-items: center; gap: var(--space-2)">
                    <div style="width: 8px; height: 8px; border-radius: 2px; background: ${color}"></div>
                    <span class="master-card-code" style="font-weight: 700; font-size: var(--text-xs); color: var(--color-ink-muted); font-family: var(--font-mono);">${j.kode || j.code}</span>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="Gabungan.openAddClassModal(${j.id})" style="font-size: 10px; padding: 2px 8px; height: auto;">+ Kelas</button>
                </div>
                
                <!-- Major Info -->
                <div style="font-weight: 700; font-size: var(--text-base); color: var(--color-ink); margin-bottom: 2px;">${j.nama}</div>
                <div style="font-size: var(--text-xs); color: var(--color-ink-subdued); margin-bottom: 12px;">Total Mahasiswa Terdaftar: ${mhsCount} mhs</div>

                <!-- Classes List -->
                <div style="border-top: 1px dashed var(--color-border-subtle); padding-top: var(--space-3); margin-top: var(--space-2);">
                  <div style="font-size: 11px; font-weight: 600; color: var(--color-ink-muted); margin-bottom: var(--space-2)">Daftar Kelas Mahasiswa:</div>
                  <div style="display: flex; flex-direction: column; gap: var(--space-2)">
                    ${classes.map(k => `
                      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--color-surface-1); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-sm); font-size: var(--text-sm)">
                        <span><strong>${k.nama}</strong> <span style="font-size: 11px; color: var(--color-ink-subdued);">(${k.student_ids.length} mhs)</span></span>
                        <div style="display: flex; gap: 4px;">
                          <span onclick="Gabungan.openEditClassModal(${k.id})" style="cursor: pointer; color: var(--color-primary-deep); font-size: 12px; padding: 2px 4px;" title="Edit Kelas">&#9998;</span>
                          <span onclick="Gabungan.deleteClass(${k.id})" style="cursor: pointer; color: var(--color-error); font-size: 14px; font-weight: bold; padding: 0 4px;" title="Hapus Kelas">&times;</span>
                        </div>
                      </div>
                    `).join('')}
                    ${classes.length === 0 ? `
                      <div style="font-size: 11px; color: var(--color-ink-subdued); font-style: italic; text-align: center; padding: 8px;">
                        Belum ada kelas dibentuk
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ---- RENDER KUSTOM CLASSES (CUSTOM/LINTAS JURUSAN VIEW) ----
  renderKustomClasses() {
    const classes = DataStore.kelasMahasiswa.filter(c => c.tipe === 'kustom');

    if (classes.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-title">Belum ada Kelas Kustomisasi</div>
          <div class="empty-state-desc">Kelas Kustomisasi digunakan untuk menggabungkan mahasiswa lintas jurusan (ad-hoc).</div>
          <button class="btn btn-primary" onclick="Gabungan.openAddClassModal(null)" style="margin-top: var(--space-3)">+ Buat Kelas Kustom Pertama</button>
        </div>
      `;
    }

    return `
      <div class="master-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
        ${classes.map(k => {
          const studentIds = k.student_ids || [];
          return `
            <div class="master-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 250px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); box-shadow: var(--shadow-card); border-left: 4px solid var(--color-warning);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2)">
                  <span class="badge badge-warning" style="font-size: 10px; padding: 2px 6px;">Kelas Kustom</span>
                  <div style="display: flex; gap: 4px;">
                    <span onclick="Gabungan.openEditClassModal(${k.id})" style="cursor: pointer; color: var(--color-primary-deep); font-size: 12px; padding: 2px 4px;" title="Edit Kelas">&#9998;</span>
                    <span onclick="Gabungan.deleteClass(${k.id})" style="cursor: pointer; color: var(--color-error); font-size: 14px; font-weight: bold; padding: 0 4px;" title="Hapus Kelas">&times;</span>
                  </div>
                </div>
                <div style="font-weight: 700; font-size: var(--text-base); color: var(--color-ink);">${k.nama}</div>
                <div style="font-size: var(--text-xs); color: var(--color-ink-subdued); margin-bottom: 12px;">Total Terdaftar: ${studentIds.length} mahasiswa</div>
                
                <div style="border-top: 1px dashed var(--color-border-subtle); padding-top: var(--space-2); margin-top: var(--space-2); max-height: 120px; overflow-y: auto;">
                  <div style="font-size: 10px; font-weight: 600; color: var(--color-ink-muted); margin-bottom: 4px;">Daftar Mahasiswa:</div>
                  ${studentIds.map(sid => {
                    const m = DataStore.getMahasiswa(sid);
                    if (!m) return '';
                    return `<div style="font-size: 11px; padding: 2px 0; color: var(--color-ink-muted); border-bottom: 1px solid var(--color-surface-2); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">&bull; ${m.nama} (${DataStore.getJurusan(m.jurusan_id)?.kode || 'Kustom'})</div>`;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ---- CLASS MANAGEMENT MODAL (INTEGRATED) ----
  openAddClassModal(jurusanId) {
    this.editingClassId = null;
    this.selectedStudents = [];
    this.openClassForm(jurusanId, null);
  },

  openEditClassModal(classId) {
    const k = DataStore.kelasMahasiswa.find(c => c.id === classId);
    if (!k) return;
    this.editingClassId = classId;
    this.selectedStudents = (k.student_ids || []).map(sid => DataStore.getMahasiswa(sid)).filter(Boolean);
    this.openClassForm(k.jurusan_id, k);
  },

  openClassForm(jurusanId, existing) {
    let modal = document.getElementById('gabunganModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gabunganModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const isEdit = existing !== null;
    const isKustom = (existing && existing.tipe === 'kustom') || (jurusanId === null);
    const jur = jurusanId ? DataStore.getJurusan(jurusanId) : null;
    const mhsInJur = jur ? DataStore.mahasiswa.filter(m => m.jurusan_id === jurusanId) : [];

    if (isKustom) {
      // Custom class layout (Split search layout)
      modal.innerHTML = `
        <div class="modal modal-wide" style="max-width: 850px; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Kelas Kustom' : 'Tambah Kelas Kustom Baru'}</h3>
            <button class="modal-close" onclick="App.closeModal('gabunganModal')">&times;</button>
          </div>
          <div class="modal-body" style="flex: 1; overflow: hidden; display: flex; gap: var(--space-4); padding: var(--space-4)">
            <!-- Left panel: details -->
            <div style="flex: 0 0 320px; display: flex; flex-direction: column; gap: var(--space-3); border-right: 1px solid var(--color-border); padding-right: var(--space-3)">
              <div class="form-group">
                <label class="form-label">Nama Kelas Kustom <span class="required">*</span></label>
                <input type="text" class="form-input" id="classGroupNama" placeholder="Contoh: Kelas Gabungan Pagi" value="${existing?.nama || ''}" style="width: 100%">
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; min-height: 180px;">
                <label class="form-label" style="font-weight: 600">Mahasiswa Terpilih (<span id="selectedCount">0</span>)</label>
                <div id="selectedStudentsList" style="flex: 1; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-1); padding: 8px; overflow-y: auto;">
                  <!-- Dynamic selection -->
                </div>
              </div>
            </div>

            <!-- Right panel: search -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-3); overflow: hidden;">
              <label class="form-label" style="font-weight: 600">Cari Mahasiswa Lintas Jurusan</label>
              <input type="text" class="form-input" id="gabunganSearch" placeholder="Cari nama atau NIM..." style="width: 100%">
              <div id="gabunganSearchResults" style="flex: 1; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; overflow-y: auto;">
                <!-- Results -->
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="App.closeModal('gabunganModal')">Batal</button>
            <button class="btn btn-primary" onclick="Gabungan.saveClassGroup(null)">Simpan</button>
          </div>
        </div>
      `;

      this.initKustomSearch();
    } else {
      // Prodi-based class layout
      modal.innerHTML = `
        <div class="modal" style="max-width: 480px; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h3>
            <button class="modal-close" onclick="App.closeModal('gabunganModal')">&times;</button>
          </div>
          <div class="modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-3)">
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted)">
              Program Studi: <strong>${jur?.nama || '-'} (${jur?.kode || '-'})</strong>
            </div>
            <div class="form-group">
              <label class="form-label">Nama Kelas <span class="required">*</span></label>
              <input type="text" class="form-input" id="classGroupNama" placeholder="Contoh: Bisdig A, TI-A" value="${existing?.nama || ''}" style="width: 100%">
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px; margin-top: 4px; min-height: 200px;">
              <label class="form-label" style="font-weight: 600">Pilih Mahasiswa (<span id="classMhsCount">0</span> terpilih)</label>
              <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-1); padding: 8px; overflow-y: auto; flex: 1;">
                ${mhsInJur.map(m => {
                  const isChecked = this.selectedStudents.some(s => s.id === m.id);
                  return `
                    <label style="display: flex; align-items: center; gap: 8px; padding: var(--space-1) 0; font-size: var(--text-sm); cursor: pointer;">
                      <input type="checkbox" class="class-mhs-cb" value="${m.id}" ${isChecked ? 'checked' : ''} onchange="Gabungan.updateClassMhsSelection()" style="width: 15px; height: 15px; cursor: pointer; accent-color: var(--color-primary);">
                      <span>${m.nama} <span class="mono" style="color: var(--color-ink-subdued); font-size: 11px;">(${m.nim})</span></span>
                    </label>
                  `;
                }).join('')}
                ${mhsInJur.length === 0 ? `<div style="text-align: center; color: var(--color-ink-subdued); padding: 20px; font-size: var(--text-xs)">Belum ada mahasiswa di jurusan ini</div>` : ''}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="App.closeModal('gabunganModal')">Batal</button>
            <button class="btn btn-primary" onclick="Gabungan.saveClassGroup(${jurusanId})">Simpan</button>
          </div>
        </div>
      `;

      this.updateClassMhsSelection();
    }

    App.openModal('gabunganModal');
  },

  initKustomSearch() {
    this.updateSelectedSummary();
    
    setTimeout(() => {
      const input = document.getElementById('gabunganSearch');
      const results = document.getElementById('gabunganSearchResults');
      if (!input || !results) return;

      input.addEventListener('input', function() {
        const q = this.value.trim();
        if (q.length < 2) {
          results.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-ink-subdued); font-size: var(--text-xs);">Ketik minimal 2 karakter untuk mencari...</div>';
          return;
        }

        const found = DataStore.searchMahasiswa(q).filter(m => !Gabungan.selectedStudents.some(s => s.id === m.id));

        if (found.length === 0) {
          results.innerHTML = '<div style="padding: 20px; font-size: var(--text-xs); color: var(--color-ink-subdued); text-align: center">Tidak ditemukan mahasiswa</div>';
        } else {
          results.innerHTML = found.map(m => {
            const jur = DataStore.getJurusan(m.jurusan_id);
            const color = DataStore.getJurusanColor(m.jurusan_id);
            return `
              <div class="gabungan-search-item" data-mhs-id="${m.id}" style="cursor: pointer; padding: var(--space-2) var(--space-3); font-size: var(--text-xs); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-subtle); transition: background var(--duration-fast);" onmouseover="this.style.background='var(--color-surface-1)'" onmouseout="this.style.background='none'">
                <div>
                  <span style="font-weight: 600; color: var(--color-ink)">${m.nama}</span>
                  <div style="font-size: 10px; color: var(--color-ink-subdued); font-family: var(--font-mono)">${m.nim}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge" style="font-size: 9px; background: ${color}20; color: ${color}; border: 1px solid ${color}40; padding: 2px 6px;">${jur?.kode || ''}</span>
                  <button class="btn btn-primary btn-sm" style="font-size: 10px; height: 20px; padding: 0 6px;">+ Tambah</button>
                </div>
              </div>
            `;
          }).join('');
        }

        results.querySelectorAll('.gabungan-search-item').forEach(item => {
          item.addEventListener('click', function() {
            const id = parseInt(this.dataset.mhsId);
            const mhs = DataStore.getMahasiswa(id);
            if (mhs) {
              Gabungan.selectedStudents.push(mhs);
              input.value = '';
              input.dispatchEvent(new Event('input'));
              Gabungan.updateSelectedSummary();
            }
          });
        });
      });
      input.dispatchEvent(new Event('input'));
    }, 50);
  },

  updateSelectedSummary() {
    const selectedCount = document.getElementById('selectedCount');
    const selectedListEl = document.getElementById('selectedStudentsList');
    if (!selectedListEl) return;

    if (selectedCount) selectedCount.textContent = this.selectedStudents.length;

    if (this.selectedStudents.length === 0) {
      selectedListEl.innerHTML = '<div style="text-align: center; color: var(--color-ink-subdued); padding: 20px; font-size: var(--text-xs);">Belum ada mahasiswa terpilih</div>';
    } else {
      selectedListEl.innerHTML = this.selectedStudents.map(m => {
        const jur = DataStore.getJurusan(m.jurusan_id);
        const color = DataStore.getJurusanColor(m.jurusan_id);
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-sm); margin-bottom: 4px; border-left: 3px solid ${color}">
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">
              <div style="font-size: var(--text-xs); font-weight: 600; color: var(--color-ink)">${m.nama}</div>
              <div style="font-size: 9px; color: var(--color-ink-subdued); font-family: var(--font-mono)">${m.nim} &bull; ${jur?.kode || ''}</div>
            </div>
            <button onclick="Gabungan.removeFromSelected(${m.id})" style="background: none; border: none; color: var(--color-error); cursor: pointer; font-size: 14px; font-weight: bold; padding: 0 2px;">&times;</button>
          </div>
        `;
      }).join('');
    }
  },

  removeFromSelected(id) {
    this.selectedStudents = this.selectedStudents.filter(m => m.id !== id);
    this.updateSelectedSummary();
    const input = document.getElementById('gabunganSearch');
    if (input) input.dispatchEvent(new Event('input'));
  },

  updateClassMhsSelection() {
    const checked = Array.from(document.querySelectorAll('.class-mhs-cb:checked')).map(cb => parseInt(cb.value));
    this.selectedStudents = checked.map(id => DataStore.getMahasiswa(id)).filter(Boolean);
    const label = document.getElementById('classMhsCount');
    if (label) label.textContent = checked.length;
  },

  saveClassGroup(jurusanId) {
    const nama = document.getElementById('classGroupNama')?.value.trim();
    if (!nama) { App.toast('Nama kelas harus diisi', 'error'); return; }

    if (this.selectedStudents.length === 0) {
      App.toast('Pilih minimal 1 mahasiswa', 'error');
      return;
    }

    if (this.editingClassId !== null) {
      // Edit
      const k = DataStore.kelasMahasiswa.find(c => c.id === this.editingClassId);
      if (k) {
        k.nama = nama;
        k.student_ids = this.selectedStudents.map(s => s.id);
      }
      App.toast(`Kelas "${nama}" berhasil diperbarui.`);
    } else {
      // Add
      const newId = DataStore.kelasMahasiswa.length > 0 ? Math.max(...DataStore.kelasMahasiswa.map(c => c.id)) + 1 : 1;
      DataStore.kelasMahasiswa.push({
        id: newId,
        nama,
        tipe: jurusanId ? 'akademik' : 'kustom',
        jurusan_id: jurusanId,
        student_ids: this.selectedStudents.map(s => s.id)
      });
      App.toast(`Kelas "${nama}" berhasil ditambahkan.`);
    }

    App.closeModal('gabunganModal');
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  deleteClass(classId) {
    const k = DataStore.kelasMahasiswa.find(c => c.id === classId);
    if (!k) return;
    if (confirm(`Hapus kelas "${k.nama}"?`)) {
      DataStore.kelasMahasiswa = DataStore.kelasMahasiswa.filter(c => c.id !== classId);
      App.toast('Kelas berhasil dihapus.');
      const content = document.getElementById('pageContent');
      if (content) this.render(content);
    }
  }
};
