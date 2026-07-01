/* ============================================
   Preferensi Dosen Page - 45min/SKS with Semester Filtering
   ============================================ */

const Preferensi = {
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
                const totalSKS = pref ? pref.details.length : 0;
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--color-canvas); cursor: pointer" onclick="Preferensi.openEdit(${d.id})">
                    <div style="display: flex; align-items: center; gap: var(--space-2)">
                      <div style="width: 6px; height: 6px; border-radius: 1px; background: ${color}"></div>
                      <span style="font-size: var(--text-sm); font-weight: var(--weight-medium)">${d.nama.split(',')[0]}</span>
                      <span style="font-size: var(--text-xs); color: var(--color-ink-subdued)">${jur?.kode || ''}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-2)">
                      ${totalSKS > 0 ? `<span style="font-size: var(--text-xs); color: var(--color-ink-muted)">${totalSKS} Jam</span>` : ''}
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

    let modal = document.getElementById('prefModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'prefModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    // Build day slot data for THIS dosen
    const daySlotData = {};
    DataStore.hari.forEach(h => { daySlotData[h] = {}; });
    if (pref) {
      pref.details.forEach(d => {
        if (daySlotData[d.hari]) {
          const key = `${d.jam_mulai}-${d.jam_selesai}`;
          daySlotData[d.hari][key] = true;
        }
      });
    }

    const prefSlots = DataStore.getPreferenceSlots();
    const morningSlots = prefSlots.filter(s => s.start < '12:00');
    const afternoonSlots = prefSlots.filter(s => s.start >= '12:00');

    modal.innerHTML = `
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>Preferensi Jadwal Mengajar (${activeSemester.tahun_ajaran} ${activeSemester.jenis})</h3>
          <button class="modal-close" onclick="App.closeModal('prefModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: var(--space-4)">
            <div style="font-weight: var(--weight-semibold); font-size: var(--text-lg)">${dosen.nama}</div>
            <div style="font-size: var(--text-sm); color: var(--color-ink-muted)">Jurusan: ${jur?.nama || '-'} | Slot mengajar menggunakan interval per 1 jam</div>
          </div>
          <div style="margin-bottom: var(--space-3)">
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink); margin-bottom: var(--space-2)">
              Centang slot waktu yang dikehendaki:
            </div>
          </div>

          <div style="overflow-x: auto">
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
                          <input type="checkbox" class="pref-slot-check" data-hari="${hari}" data-start="${slot.start}" data-end="${slot.end}" ${isChecked ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer">
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
                          <input type="checkbox" class="pref-slot-check" data-hari="${hari}" data-start="${slot.start}" data-end="${slot.end}" ${isChecked ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer">
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: var(--space-2); display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-ink-muted)">
            <div style="display: flex; align-items: center; gap: var(--space-1)">
              <div style="width: 12px; height: 12px; border: 1px solid var(--color-border); border-radius: 2px; background: var(--color-canvas)"></div>
              <span>Tersedia</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-1)">
              <div style="width: 12px; height: 12px; border-radius: 2px; background: var(--color-primary-subtle)"></div>
              <span>Dipilih</span>
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
          <button class="btn btn-primary" onclick="Preferensi.savePref(${dosenId})">Simpan Preferensi</button>
        </div>
      </div>
    `;

    App.openModal('prefModal');
    this.updatePrefSummary();

    // Bind checkbox change events for live summary
    modal.querySelectorAll('.pref-slot-check').forEach(cb => {
      cb.addEventListener('change', () => this.updatePrefSummary());
    });
  },

  updatePrefSummary() {
    const checked = document.querySelectorAll('.pref-slot-check:checked');
    const summaryEl = document.getElementById('prefSummary');
    const countEl = document.getElementById('prefSKSCount');

    if (countEl) countEl.textContent = `${checked.length} Jam dipilih`;

    if (!summaryEl) return;

    if (checked.length === 0) {
      summaryEl.innerHTML = '';
      return;
    }

    // Group by day
    const byDay = {};
    checked.forEach(cb => {
      const hari = cb.dataset.hari;
      if (!byDay[hari]) byDay[hari] = [];
      byDay[hari].push(`${cb.dataset.start}-${cb.dataset.end}`);
    });

    summaryEl.innerHTML = `
      <div style="padding: var(--space-2) var(--space-3); background: var(--color-primary-subtle); border-radius: var(--radius-md); font-size: var(--text-sm)">
        <strong>Ringkasan:</strong>
        ${Object.entries(byDay).map(([hari, slots]) =>
          ` ${hari} (${slots.length} Jam)`
        ).join(', ')}
        - Total <strong>${checked.length} Jam</strong> per minggu
      </div>
    `;
  },

  savePref(dosenId) {
    const checked = document.querySelectorAll('.pref-slot-check:checked');
    const details = [];

    checked.forEach(cb => {
      details.push({
        hari: cb.dataset.hari,
        jam_mulai: cb.dataset.start,
        jam_selesai: cb.dataset.end,
      });
    });

    if (details.length === 0) {
      App.toast('Pilih minimal satu slot waktu.', 'error');
      return;
    }

    const activeSemester = DataStore.semester.find(s => s.is_aktif) || DataStore.semester[0];
    const semId = activeSemester.id;

    const existingIdx = DataStore.preferensi.findIndex(p => p.dosen_id === dosenId && p.semester_id === semId);
    if (existingIdx >= 0) {
      DataStore.preferensi[existingIdx].details = details;
    } else {
      DataStore.preferensi.push({ id: DataStore.preferensi.length + 1, dosen_id: dosenId, semester_id: semId, details });
    }

    DataStore.auditLog.push({
      id: DataStore.auditLog.length + 1,
      entitas: 'Preferensi Dosen',
      entitas_id: dosenId,
      aksi: existingIdx >= 0 ? 'Update' : 'Create',
      perubahan: { field: 'preferensi', nilai_lama: null, nilai_baru: details.map(d => `${d.hari} ${d.jam_mulai}-${d.jam_selesai}`).join(', ') },
      user: DataStore.getDosen(dosenId)?.nama || 'Unknown',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    App.closeModal('prefModal');
    App.toast(`Preferensi berhasil disimpan (${details.length} SKS).`);
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },
};
