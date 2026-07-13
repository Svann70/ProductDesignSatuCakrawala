/* ============================================
   Preferensi Dosen Page - Course-based with original Checkbox Grid
   ============================================ */

const Preferensi = {
  tempDetails: [],
  currentDosenId: null,
  currentMkId: null,

  render(container) {
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const semId = activeSemester.id;

    const dosenList = DataStore.dosen.filter(d => d.status === 'Aktif');
    const prefMap = {};
    DataStore.preferensi.filter(p => p.semester_id === semId).forEach(p => { prefMap[p.dosen_id] = p; });

    container.innerHTML = `
      <div class="page-content-inner">
        <div class="card">
          <div class="card-header">
            <h3>Daftar Dosen</h3>
            <span style="font-size: var(--text-xs); color: var(--color-ink-subdued)">${Object.keys(prefMap).length}/${dosenList.length} mengisi</span>
          </div>
          <div style="padding: var(--space-2) var(--space-3)">
            <div style="display: flex; flex-direction: column; gap: 1px; background: var(--color-border-subtle); border-radius: var(--radius-md); overflow: hidden">
              ${dosenList.map(d => {
                const pref = prefMap[d.id];
                const jur = DataStore.getJurusan(d.jurusan_id);
                const color = DataStore.getJurusanColor(d.jurusan_id);
                const totalHours = pref ? pref.details.length : 0;
                
                // Get unique courses set up in preferences
                const mkCount = pref ? new Set(pref.details.map(det => det.mata_kuliah_id)).size : 0;

                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--color-canvas); cursor: pointer" onclick="Preferensi.openEdit(${d.id})">
                    <div style="display: flex; align-items: center; gap: var(--space-2)">
                      <div style="width: 6px; height: 6px; border-radius: 1px; background: ${color}"></div>
                      <span style="font-size: var(--text-sm); font-weight: var(--weight-medium)">${d.nama.split(',')[0]}</span>
                      <span style="font-size: var(--text-xs); color: var(--color-ink-subdued)">${jur?.kode || ''}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-2)">
                      ${totalHours > 0 ? `<span style="font-size: var(--text-xs); color: var(--color-ink-muted)">${totalHours} Jam (${mkCount} matkul)</span>` : ''}
                      ${pref ? '<span class="badge badge-success" style="font-size: 10px">Sudah</span>' : '<span class="badge badge-warning" style="font-size: 10px">Belum</span>'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  openEdit(dosenId) {
    const dosen = DataStore.getDosen(dosenId);
    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const semId = activeSemester.id;
    const pref = DataStore.preferensi.find(p => p.dosen_id === dosenId && p.semester_id === semId);
    const jur = DataStore.getJurusan(dosen.jurusan_id);

    // Initialize local state
    this.currentDosenId = dosenId;
    this.tempDetails = pref ? JSON.parse(JSON.stringify(pref.details)) : [];

    // Get qualified courses
    const qualifiedMkIds = dosen.mata_kuliah_ids || [];
    const qualifiedCourses = DataStore.mataKuliah.filter(m => qualifiedMkIds.includes(m.id));
    this.currentMkId = qualifiedCourses.length > 0 ? qualifiedCourses[0].id : null;

    let modal = document.getElementById('prefModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'prefModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal modal-wide" style="max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <h3>Preferensi Jadwal Mengajar (${activeSemester.tahun_ajaran} ${activeSemester.jenis})</h3>
          <button class="modal-close" onclick="App.closeModal('prefModal')">&times;</button>
        </div>
        <div class="modal-body" style="flex: 1; overflow-y: auto;">
          <div style="margin-bottom: var(--space-4); display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
            <div>
              <div style="font-weight: var(--weight-semibold); font-size: var(--text-lg)">${dosen.nama}</div>
              <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px;">
                Jurusan: ${jur?.nama || '-'} | Slot mengajar menggunakan interval per 1 jam
              </div>
            </div>
            
            <div class="form-group" style="min-width: 250px;">
              <label class="form-label" style="font-weight: 600">Pilih Mata Kuliah:</label>
              ${qualifiedCourses.length === 0 ? `
                <div style="font-size: 11px; color: var(--color-error); font-style: italic;">
                  Dosen belum dikelompokkan ke mata kuliah apa pun.
                </div>
              ` : `
                <select class="form-select" id="prefMKSelect" onchange="Preferensi.handleMKChange(this.value)" style="width: 100%">
                  ${qualifiedCourses.map(mk => `
                    <option value="${mk.id}" ${this.currentMkId === mk.id ? 'selected' : ''}>${mk.nama} (${mk.kode})</option>
                  `).join('')}
                </select>
              `}
            </div>
          </div>
          
          <div style="margin-bottom: var(--space-3)">
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink); margin-bottom: var(--space-2)">
              Centang slot waktu yang dikehendaki untuk mata kuliah di atas:
            </div>
          </div>

          <div id="prefGridContainer" style="overflow-x: auto">
            <!-- Grid rendered dynamically -->
          </div>

          <div style="margin-top: var(--space-2); display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-ink-muted)">
            <div style="display: flex; align-items: center; gap: var(--space-1)">
              <div style="width: 12px; height: 12px; border: 1px solid var(--color-border); border-radius: 2px; background: var(--color-canvas)"></div>
              <span>Tersedia</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-1)">
              <div style="width: 12px; height: 12px; border-radius: 2px; background: var(--color-primary-subtle)"></div>
              <span>Dipilih untuk mata kuliah ini</span>
            </div>
          </div>

          <div id="prefSummary" style="margin-top: var(--space-3)"></div>
        </div>
        <div class="pref-status-bar">
          <span>Status: <strong>${pref ? 'Sudah Diisi' : 'Belum Diisi'}</strong></span>
          <span id="prefSKSCount" style="margin-left: var(--space-3); font-size: var(--text-sm)"></span>
          <span style="margin-left: auto; font-size: var(--text-xs); color: var(--color-ink-subdued)">Dapat diubah kapan saja</span>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="App.closeModal('prefModal')">Batal</button>
          <button class="btn btn-primary" onclick="Preferensi.savePref(${dosenId})" ${qualifiedCourses.length === 0 ? 'disabled' : ''}>Simpan Preferensi</button>
        </div>
      </div>
    `;

    App.openModal('prefModal');
    this.renderPrefGrid();
  },

  handleMKChange(val) {
    this.currentMkId = parseInt(val);
    this.renderPrefGrid();
  },

  renderPrefGrid() {
    const container = document.getElementById('prefGridContainer');
    if (!container) return;

    // Build day slot data for THIS dosen and selected MK
    const daySlotData = {};
    DataStore.hari.forEach(h => { daySlotData[h] = {}; });
    
    this.tempDetails.forEach(d => {
      if (d.mata_kuliah_id === this.currentMkId && daySlotData[d.hari]) {
        const key = `${d.jam_mulai}-${d.jam_selesai}`;
        daySlotData[d.hari][key] = true;
      }
    });

    const prefSlots = DataStore.getPreferenceSlots();
    const morningSlots = prefSlots.filter(s => s.start < '12:00');
    const afternoonSlots = prefSlots.filter(s => s.start >= '12:00');

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm)">
        <thead>
          <tr style="background: var(--color-surface-1)">
            <th style="padding: var(--space-2) var(--space-3); text-align: left; font-weight: var(--weight-semibold); border-bottom: 1px solid var(--color-border); min-width: 100px">Slot</th>
            ${DataStore.hari.map(h => `<th style="padding: var(--space-2); text-align: center; font-weight: var(--weight-semibold); border-bottom: 1px solid var(--color-border)">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="7" style="padding: var(--space-1) var(--space-2); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-ink-subdued); background: var(--color-surface-2); text-transform: uppercase; letter-spacing: 0.05em">Sesi Pagi</td></tr>
          ${morningSlots.map(slot => `
            <tr>
              <td style="padding: var(--space-2) var(--space-3); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-ink-muted); border-bottom: 1px solid var(--color-border-subtle)">${slot.label}</td>
              ${DataStore.hari.map(hari => {
                const slotKey = `${slot.start}-${slot.end}`;
                const isChecked = daySlotData[hari][slotKey] || false;
                return `
                  <td style="padding: var(--space-2); text-align: center; border-bottom: 1px solid var(--color-border-subtle)">
                    <input type="checkbox" class="pref-slot-check" data-hari="${hari}" data-start="${slot.start}" data-end="${slot.end}" ${isChecked ? 'checked' : ''} onchange="Preferensi.handleCheckboxChange(this)" style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer">
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
          <tr><td colspan="7" style="padding: var(--space-1) var(--space-2); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-ink-subdued); background: var(--color-surface-2); text-transform: uppercase; letter-spacing: 0.05em">Sesi Siang</td></tr>
          ${afternoonSlots.map(slot => `
            <tr>
              <td style="padding: var(--space-2) var(--space-3); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-ink-muted); border-bottom: 1px solid var(--color-border-subtle)">${slot.label}</td>
              ${DataStore.hari.map(hari => {
                const slotKey = `${slot.start}-${slot.end}`;
                const isChecked = daySlotData[hari][slotKey] || false;
                return `
                  <td style="padding: var(--space-2); text-align: center; border-bottom: 1px solid var(--color-border-subtle)">
                    <input type="checkbox" class="pref-slot-check" data-hari="${hari}" data-start="${slot.start}" data-end="${slot.end}" ${isChecked ? 'checked' : ''} onchange="Preferensi.handleCheckboxChange(this)" style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer">
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    this.updatePrefSummary();
  },

  handleCheckboxChange(cb) {
    const hari = cb.dataset.hari;
    const start = cb.dataset.start;
    const end = cb.dataset.end;

    if (cb.checked) {
      // Add to tempDetails
      this.tempDetails.push({
        hari,
        jam_mulai: start,
        jam_selesai: end,
        mata_kuliah_id: this.currentMkId
      });
    } else {
      // Remove from tempDetails
      this.tempDetails = this.tempDetails.filter(d => 
        !(d.hari === hari && d.jam_mulai === start && d.jam_selesai === end && d.mata_kuliah_id === this.currentMkId)
      );
    }

    this.updatePrefSummary();
  },

  updatePrefSummary() {
    const summaryEl = document.getElementById('prefSummary');
    const countEl = document.getElementById('prefSKSCount');

    // Total hours for this specific Mata Kuliah
    const currentMkDetails = this.tempDetails.filter(d => d.mata_kuliah_id === this.currentMkId);
    
    if (countEl) {
      countEl.textContent = `${currentMkDetails.length} Jam dipilih untuk matkul ini`;
    }

    if (!summaryEl) return;

    if (this.tempDetails.length === 0) {
      summaryEl.innerHTML = '';
      return;
    }

    // Group all tempDetails by course
    const byCourse = {};
    this.tempDetails.forEach(d => {
      const mk = DataStore.getMataKuliah(d.mata_kuliah_id);
      const name = mk ? `${mk.nama} (${mk.kode})` : 'Lainnya';
      if (!byCourse[name]) byCourse[name] = [];
      byCourse[name].push(d);
    });

    summaryEl.innerHTML = `
      <div style="padding: var(--space-2) var(--space-3); background: var(--color-primary-subtle); border-radius: var(--radius-md); font-size: var(--text-sm); display: flex; flex-direction: column; gap: 4px;">
        <strong>Ringkasan Pilihan Seluruh Mata Kuliah:</strong>
        ${Object.entries(byCourse).map(([name, slots]) => {
          // group slots by day
          const byDay = {};
          slots.forEach(s => {
            if (!byDay[s.hari]) byDay[s.hari] = 0;
            byDay[s.hari]++;
          });
          const dayStr = Object.entries(byDay).map(([day, count]) => `${day} (${count} Jam)`).join(', ');
          return `<div style="padding-left: 8px;">&bull; <strong>${name}</strong>: ${dayStr} (Total: ${slots.length} Jam)</div>`;
        }).join('')}
        <div style="border-top: 1px solid rgba(41, 181, 232, 0.3); margin-top: 4px; padding-top: 4px;">
          Total Preferensi Kumulatif: <strong>${this.tempDetails.length} Jam</strong> per minggu
        </div>
      </div>
    `;
  },

  savePref(dosenId) {
    if (this.tempDetails.length === 0) {
      App.toast('Pilih minimal satu slot waktu.', 'error');
      return;
    }

    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const semId = activeSemester.id;

    const existingIdx = DataStore.preferensi.findIndex(p => p.dosen_id === dosenId && p.semester_id === semId);
    if (existingIdx >= 0) {
      DataStore.preferensi[existingIdx].details = this.tempDetails;
    } else {
      DataStore.preferensi.push({ id: DataStore.preferensi.length + 1, dosen_id: dosenId, semester_id: semId, details: this.tempDetails });
    }

    DataStore.auditLog.push({
      id: DataStore.auditLog.length + 1,
      entitas: 'Preferensi Dosen',
      entitas_id: dosenId,
      aksi: existingIdx >= 0 ? 'Update' : 'Create',
      perubahan: { 
        field: 'preferensi', 
        nilai_lama: null, 
        nilai_baru: this.tempDetails.map(d => {
          const mk = DataStore.getMataKuliah(d.mata_kuliah_id);
          return `${mk?.kode || 'MK'} (${d.hari} ${d.jam_mulai}-${d.jam_selesai})`;
        }).join(', ') 
      },
      user: DataStore.getDosen(dosenId)?.nama || 'Unknown',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    App.closeModal('prefModal');
    App.toast(`Preferensi berhasil disimpan (${this.tempDetails.length} Jam).`);
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },
};
