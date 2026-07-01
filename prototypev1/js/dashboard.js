/* ============================================
   Dashboard Page
   ============================================ */

const Dashboard = {
  render(container) {
    const totalJadwal = DataStore.jadwal.length;
    const conflicts = this.getConflicts();
    const belumPreferensi = this.getBelumPreferensi();
    const syncStats = this.getSyncStats();

    container.innerHTML = `
      <div class="page-content-inner">
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-card-label">Total Jadwal</div>
            <div class="stat-card-value">${totalJadwal}</div>
            <div class="stat-card-footer">Semester ${DataStore.semester[0].tahun_ajaran} ${DataStore.semester[0].jenis}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Bentrok Terdeteksi</div>
            <div class="stat-card-value" style="color: ${conflicts.length > 0 ? 'var(--color-error)' : 'var(--color-success)'}">${conflicts.length}</div>
            <div class="stat-card-footer">${conflicts.length > 0 ? '<a href="#" onclick="App.navigate(\'jadwal\'); return false;">Lihat detail</a>' : 'Tidak ada konflik'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Preferensi Belum Diisi</div>
            <div class="stat-card-value" style="color: ${belumPreferensi.length > 0 ? 'var(--color-warning)' : 'var(--color-success)'}">${belumPreferensi.length}</div>
            <div class="stat-card-footer">${belumPreferensi.length > 0 ? 'dosen belum mengisi' : 'Semua dosen sudah mengisi'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Sinkronisasi</div>
            <div class="stat-card-value" style="color: var(--color-success)">${syncStats.berhasil}</div>
            <div class="stat-card-footer">Berhasil${syncStats.gagal > 0 ? `, <span style="color:var(--color-error)">${syncStats.gagal} gagal</span>` : ''}</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div>
            <div class="card" style="margin-bottom: var(--space-4)">
              <div class="card-header">
                <h3>Kapasitas Ruangan</h3>
                <span class="badge badge-info">${DataStore.gedung.length} Gedung</span>
              </div>
              <div class="card-body">
                ${this.renderCapacityBars()}
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Jadwal Bentrok</h3>
                ${conflicts.length > 0 ? `<span class="badge badge-error">${conflicts.length} konflik</span>` : '<span class="badge badge-success">Aman</span>'}
              </div>
              <div class="card-body">
                ${conflicts.length > 0 ? this.renderConflicts(conflicts) : '<div class="empty-state" style="padding: var(--space-6)"><div class="empty-state-title">Tidak ada bentrok</div><div class="empty-state-desc">Semua jadwal sudah terverifikasi aman dari konflik.</div></div>'}
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom: var(--space-4)">
              <div class="card-header">
                <h3>Status Preferensi Dosen</h3>
              </div>
              <div class="card-body">
                <div class="preference-summary">
                  <div class="preference-count">
                    <div class="preference-count-num" style="color: var(--color-success)">${this.getSudahPreferensi().length}</div>
                    <div class="preference-count-label">Sudah Mengisi</div>
                  </div>
                  <div class="preference-count">
                    <div class="preference-count-num" style="color: var(--color-warning)">${belumPreferensi.length}</div>
                    <div class="preference-count-label">Belum Mengisi</div>
                  </div>
                </div>
                ${belumPreferensi.length > 0 ? `
                  <div style="margin-top: var(--space-3)">
                    <div class="preference-list">
                      <strong>Belum mengisi:</strong> ${belumPreferensi.map(d => d.nama.split(',')[0]).join(', ')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Distribusi per Jurusan</h3>
              </div>
              <div class="card-body">
                ${this.renderJurusanDistribution()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getConflicts() {
    const conflicts = [];
    for (const j of DataStore.jadwal) {
      const found = DataStore.checkConflict(j, j.id);
      if (found.length > 0) {
        conflicts.push({ jadwal: j, issues: found });
      }
    }
    return conflicts;
  },

  getBelumPreferensi() {
    const aktifDosen = DataStore.dosen.filter(d => d.status === 'Aktif');
    const sudahIds = new Set(DataStore.preferensi.map(p => p.dosen_id));
    return aktifDosen.filter(d => !sudahIds.has(d.id));
  },

  getSudahPreferensi() {
    const aktifDosen = DataStore.dosen.filter(d => d.status === 'Aktif');
    const sudahIds = new Set(DataStore.preferensi.map(p => p.dosen_id));
    return aktifDosen.filter(d => sudahIds.has(d.id));
  },

  getSyncStats() {
    const berhasil = DataStore.syncLog.filter(s => s.status === 'Berhasil').length;
    const gagal = DataStore.syncLog.filter(s => s.status === 'Gagal').length;
    const menunggu = DataStore.syncLog.filter(s => s.status === 'Menunggu').length;
    return { berhasil, gagal, menunggu };
  },

  renderCapacityBars() {
    return DataStore.gedung.map(g => {
      const rooms = DataStore.ruangan.filter(r => r.gedung_id === g.id && r.is_active);
      const totalSlots = rooms.length * 6; // 6 days
      const usedSlots = DataStore.jadwal.filter(j => {
        const r = DataStore.getRuangan(j.ruangan_id);
        return r && r.gedung_id === g.id;
      }).length;
      const pct = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;
      const barClass = pct >= 80 ? 'error' : pct >= 60 ? 'warning' : '';

      return `
        <div class="capacity-item">
          <div class="capacity-item-header">
            <span class="capacity-item-name">${g.nama}</span>
            <span class="capacity-item-pct" style="color: ${pct >= 80 ? 'var(--color-error)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-ink)'}">${pct}%</span>
          </div>
          <div class="capacity-bar">
            <div class="capacity-bar-track">
              <div class="capacity-bar-fill ${barClass}" style="width: ${pct}%; background: ${pct >= 80 ? 'var(--color-error)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-primary)'}"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderConflicts(conflicts) {
    return `<div class="conflict-list">${conflicts.map(c => {
      const j = DataStore.getJadwalDetail(c.jadwal);
      return c.issues.map(issue => `
        <div class="conflict-item">
          <span class="conflict-icon">!</span>
          <span>${issue.message}</span>
        </div>
      `).join('');
    }).join('')}</div>`;
  },

  renderJurusanDistribution() {
    const counts = {};
    DataStore.jadwal.forEach(j => {
      const jur = DataStore.getJurusan(j.jurusan_id);
      if (jur) counts[jur.kode] = (counts[jur.kode] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    return entries.map(([kode, count]) => `
      <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-medium); width: 40px; color: var(--color-ink)">${kode}</span>
        <div style="flex: 1; height: 6px; background: var(--color-surface-2); border-radius: var(--radius-pill); overflow: hidden">
          <div style="height: 100%; width: ${(count / Math.max(...entries.map(e => e[1]))) * 100}%; background: var(--color-primary); border-radius: var(--radius-pill)"></div>
        </div>
        <span style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-ink-muted); min-width: 20px; text-align: right">${count}</span>
      </div>
    `).join('');
  },
};
