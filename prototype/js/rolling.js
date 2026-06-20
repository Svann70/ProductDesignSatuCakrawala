/* ============================================
   Rolling Penempatan Ruangan Page - Per Week Calendar View
   ============================================ */

const Rolling = {
  results: [],

  render(container) {
    this.results = [];
    container.innerHTML = `
      <div class="page-content-inner">
        <div class="rolling-controls">
          <div style="display: flex; align-items: center; gap: var(--space-3)">
            <span style="font-size: var(--text-sm); color: var(--color-ink-muted)">Semester: <strong>${DataStore.semester[0].tahun_ajaran} ${DataStore.semester[0].jenis}</strong></span>
            <button class="btn btn-primary" id="btnRollingWeek">Rolling Semua Hari (1 Minggu)</button>
          </div>
        </div>
        <div id="rollingResults"></div>
      </div>
    `;

    document.getElementById('btnRollingWeek').addEventListener('click', () => {
      this.runWeeklyRolling();
    });
  },

  runWeeklyRolling() {
    const allResults = [];
    DataStore.hari.forEach(hari => {
      const dayResults = DataStore.rollingRooms(hari);
      allResults.push(...dayResults.map(r => ({ ...r, hari })));
    });
    this.results = allResults;

    const berhasil = allResults.filter(r => r.status === 'Terisi' || r.status === 'Dipindahkan').length;
    const konflik = allResults.filter(r => r.status === 'Konflik').length;

    const resultsDiv = document.getElementById('rollingResults');
    resultsDiv.innerHTML = `
      <div class="rolling-summary">
        <div class="rolling-summary-item">
          <span class="rolling-summary-num" style="color: var(--color-success)">${berhasil}</span>
          <span>Berhasil</span>
        </div>
        <div class="rolling-summary-item">
          <span class="rolling-summary-num" style="color: ${konflik > 0 ? 'var(--color-error)' : 'var(--color-ink-muted)'}">${konflik}</span>
          <span>Konflik</span>
        </div>
        <div class="rolling-summary-item">
          <span class="rolling-summary-num">${allResults.length}</span>
          <span>Total</span>
        </div>
      </div>

      ${this.renderRollingCalendar(allResults)}

      ${konflik > 0 ? `
        <div style="margin-top: var(--space-4)">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-2)">Detail Konflik:</div>
          <div class="table-container">
            <table>
              <thead><tr><th>Hari</th><th>Dosen</th><th>Jam</th><th>Mata Kuliah</th><th>Preferensi</th><th>Aksi</th></tr></thead>
              <tbody>
                ${allResults.filter(r => r.status === 'Konflik').map(r => {
                  const mk = DataStore.getMataKuliah(r.jadwal.mata_kuliah_id);
                  return `
                    <tr>
                      <td>${r.hari}</td>
                      <td>${r.dosen?.nama?.split(',')[0] || '-'}</td>
                      <td class="mono">${r.jadwal.jam_mulai} - ${r.jadwal.jam_selesai}</td>
                      <td><strong>${mk?.nama || '-'}</strong></td>
                      <td style="font-size: var(--text-sm); color: var(--color-ink-muted)">${r.preferensi.map(p => `${p.hari} ${p.jam_mulai}-${p.jam_selesai}`).join(', ') || '-'}</td>
                      <td><button class="btn btn-secondary btn-sm" onclick="Rolling.overrideRoom(${r.jadwal.id})">Ubah Ruangan</button></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    `;
  },

  renderRollingCalendar(allResults) {
    const timeSlots = DataStore.getTimeSlots();

    const gridData = {};
    timeSlots.forEach(slot => {
      gridData[slot.label] = {};
      DataStore.hari.forEach(hari => {
        gridData[slot.label][hari] = [];
      });
    });

    allResults.forEach(r => {
      const slotKey = `${r.jadwal.jam_mulai} - ${r.jadwal.jam_selesai}`;
      if (gridData[slotKey] && gridData[slotKey][r.hari]) {
        gridData[slotKey][r.hari].push(r);
      }
    });

    return `
      <div style="margin-top: var(--space-4); margin-bottom: var(--space-3); font-size: var(--text-sm); color: var(--color-ink-muted)">
        Jadwal per minggu - warna berdasarkan jurusan
      </div>
      <div class="rolling-calendar">
        <div class="calendar-time-header">Jam</div>
        ${DataStore.hari.map(h => `<div class="calendar-day-header">${h}</div>`).join('')}

        ${timeSlots.map(slot => `
          <div class="calendar-time-label">${slot.label}</div>
          ${DataStore.hari.map(hari => {
            const items = gridData[slot.label][hari] || [];
            return `
              <div class="rolling-cell">
                ${items.map(r => {
                  const mk = DataStore.getMataKuliah(r.jadwal.mata_kuliah_id);
                  const color = DataStore.getJurusanColor(r.jadwal.jurusan_id);
                  const statusIcon = r.status === 'Konflik' ? ' !' : r.status === 'Dipindahkan' ? ' ~' : '';
                  return `
                    <div class="rolling-event" style="background: ${color}" title="${r.dosen?.nama?.split(',')[0] || ''} - ${mk?.nama || ''} ${r.ruangan ? '(' + r.ruangan.nama + ')' : '(No Room)'}">
                      <div class="rolling-event-title">${mk?.nama || '-'} ${r.jadwal.kelas}${statusIcon}</div>
                      <div class="rolling-event-meta">${r.dosen?.nama?.split(',')[0] || '-'} | ${r.ruangan ? r.ruangan.nama : '!'}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}
        `).join('')}
      </div>

      <div style="margin-top: var(--space-3); display: flex; gap: var(--space-4); flex-wrap: wrap">
        ${DataStore.jurusan.map(j => `
          <div style="display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs)">
            <div style="width: 12px; height: 12px; border-radius: 2px; background: ${DataStore.getJurusanColor(j.id)}"></div>
            <span>${j.kode}</span>
          </div>
        `).join('')}
        <div style="display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); margin-left: var(--space-2)">
          <span style="font-weight: var(--weight-semibold)">!</span> = Konflik
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs)">
          <span style="font-weight: var(--weight-semibold)">~</span> = Dipindahkan
        </div>
      </div>
    `;
  },

  overrideRoom(jadwalId) {
    const jadwal = DataStore.jadwal.find(j => j.id === jadwalId);
    if (!jadwal) return;

    const available = DataStore.getAvailableRooms(jadwal.hari, jadwal.jam_mulai, jadwal.jam_selesai, jadwalId);
    const currentRoom = DataStore.getRuangan(jadwal.ruangan_id);

    const newRoomId = prompt(`Ruangan saat ini: ${currentRoom?.nama}\n\nMasukkan ID ruangan baru:\n${available.map(r => `${r.id}: ${r.nama}`).join('\n')}`);
    if (newRoomId && parseInt(newRoomId)) {
      const parsed = parseInt(newRoomId);
      const room = DataStore.getRuangan(parsed);
      if (room) {
        jadwal.ruangan_id = parsed;
        App.toast(`Ruangan diubah ke ${room.nama}`);
        this.runWeeklyRolling();
      }
    }
  },
};
