/* ============================================
   Rolling Penempatan Ruangan Page - Per Week Calendar View
   ============================================ */

const Rolling = {
  results: [],
  selectedWeek: 1,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),

  render(container) {
    this.results = [];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[this.currentMonth];
    const now = new Date();
    const isCurrentMonth = this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
    const currentWeek = isCurrentMonth ? Math.ceil(now.getDate() / 7) : 1;

    const weeks = [
      { num: 1, label: '1-7' },
      { num: 2, label: '8-14' },
      { num: 3, label: '15-21' },
      { num: 4, label: '22-28' },
      { num: 5, label: '29-31' },
    ];

    container.innerHTML = `
      <div class="page-content-inner">
        <!-- Month & Week Selector -->
        <div style="margin-bottom: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3)">
            <div style="display: flex; align-items: center; gap: var(--space-2)">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Rolling.changeMonth(-1)" title="Bulan sebelumnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div style="font-weight: var(--weight-semibold); font-size: var(--text-lg); min-width: 180px; text-align: center">${monthName} ${this.currentYear}</div>
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Rolling.changeMonth(1)" title="Bulan berikutnya">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <span class="badge badge-info" style="margin-left: var(--space-2)">${DataStore.semester[0].tahun_ajaran} ${DataStore.semester[0].jenis}</span>
            </div>
          </div>
          <!-- Week Cards -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2)">
            ${weeks.map(w => {
              const isActive = this.selectedWeek === w.num;
              const isCurrent = isCurrentMonth && currentWeek === w.num;
              return `
                <div onclick="Rolling.selectWeek(${w.num})" style="
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
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Rolling Button -->
        <div style="margin-bottom: var(--space-4)">
          <button class="btn btn-primary" id="btnRollingWeek">Rolling Minggu ${this.selectedWeek}</button>
        </div>

        <div id="rollingResults"></div>
      </div>
    `;

    document.getElementById('btnRollingWeek').addEventListener('click', () => {
      this.runWeeklyRolling();
    });
  },

  changeMonth(dir) {
    this.currentMonth += dir;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    this.selectedWeek = 1;
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
  },

  selectWeek(num) {
    this.selectedWeek = num;
    const content = document.getElementById('pageContent');
    if (content) this.render(content);
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
              <thead><tr><th>Hari</th><th>Dosen</th><th>Jam</th><th>Mata Kuliah</th><th>Aksi</th></tr></thead>
              <tbody>
                ${allResults.filter(r => r.status === 'Konflik').map(r => {
                  const mk = DataStore.getMataKuliah(r.jadwal.mata_kuliah_id);
                  return `
                    <tr>
                      <td>${r.hari}</td>
                      <td>${r.dosen?.nama?.split(',')[0] || '-'}</td>
                      <td class="mono">${r.jadwal.jam_mulai} - ${r.jadwal.jam_selesai}</td>
                      <td><strong>${mk?.nama || '-'}</strong></td>
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
      <div style="margin-bottom: var(--space-3); font-size: var(--text-sm); color: var(--color-ink-muted)">
        Minggu ${this.selectedWeek} - ${DataStore.semester[0].tahun_ajaran} ${DataStore.semester[0].jenis}
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
        ${DataStore.jurusan.slice(0, 6).map(j => `
          <div style="display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs)">
            <div style="width: 10px; height: 10px; border-radius: 2px; background: ${DataStore.getJurusanColor(j.id)}"></div>
            <span>${j.kode}</span>
          </div>
        `).join('')}
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
