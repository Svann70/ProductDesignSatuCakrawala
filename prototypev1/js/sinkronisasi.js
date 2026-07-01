/* ============================================
   Sinkronisasi Page
   ============================================ */

const Sinkronisasi = {
  render(container) {
    const berhasil = DataStore.syncLog.filter(s => s.status === 'Berhasil').length;
    const gagal = DataStore.syncLog.filter(s => s.status === 'Gagal').length;
    const menunggu = DataStore.syncLog.filter(s => s.status === 'Menunggu').length;

    container.innerHTML = `
      <div class="page-content-inner">
        <div class="sync-overview">
          <div class="card">
            <div class="card-body">
              <div class="sync-info-item">
                <span class="sync-info-label">Target Sistem</span>
                <span class="sync-info-value">TBD - Belum Ditentukan</span>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="sync-info-item">
                <span class="sync-info-label">Terakhir Sync</span>
                <span class="sync-info-value">18 Juni 2026, 14:32 WIB</span>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="sync-info-item">
                <span class="sync-info-label">Status Ringkasan</span>
                <span class="sync-info-value">
                  <span class="badge badge-success">${berhasil} Berhasil</span>
                  ${gagal > 0 ? `<span class="badge badge-error">${gagal} Gagal</span>` : ''}
                  ${menunggu > 0 ? `<span class="badge badge-warning">${menunggu} Menunggu</span>` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Log Sinkronisasi</h3>
            <div style="display: flex; gap: var(--space-2)">
              <select class="filter-select" id="syncStatusFilter">
                <option value="">Semua Status</option>
                <option value="Berhasil">Berhasil</option>
                <option value="Gagal">Gagal</option>
                <option value="Menunggu">Menunggu</option>
              </select>
              ${gagal > 0 ? '<button class="btn btn-secondary btn-sm" onclick="Sinkronisasi.retryAll()">Retry Semua Gagal</button>' : ''}
            </div>
          </div>
          <div class="table-container" style="border: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg)">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Jadwal</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th>Pesan Error</th>
                  <th>Retry</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${DataStore.syncLog.map(s => {
                  const jadwal = DataStore.jadwal.find(j => j.id === s.jadwal_id);
                  const mk = jadwal ? DataStore.getMataKuliah(jadwal.mata_kuliah_id) : null;
                  const jur = jadwal ? DataStore.getJurusan(jadwal.jurusan_id) : null;
                  return `
                    <tr data-status="${s.status}">
                      <td class="mono" style="white-space: nowrap">${s.timestamp}</td>
                      <td>${mk ? `${mk.nama} ${jur ? jur.kode : ''}-${jadwal.kelas}` : `Jadwal #${s.jadwal_id}`}</td>
                      <td style="font-size: var(--text-sm); color: var(--color-ink-muted)">${s.target_sistem}</td>
                      <td>${getStatusBadge(s.status)}</td>
                      <td style="font-size: var(--text-sm); color: ${s.pesan_error ? 'var(--color-error)' : 'var(--color-ink-subdued)'}">${s.pesan_error || '-'}</td>
                      <td style="font-family: var(--font-mono); font-size: var(--text-sm)">${s.retry_count}</td>
                      <td>
                        ${s.status === 'Gagal' ? `<button class="btn btn-secondary btn-sm" onclick="Sinkronisasi.retryOne(${s.id})">Retry</button>` : '-'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="alert alert-info" style="margin-top: var(--space-4)">
          <span class="alert-icon">i</span>
          <div style="font-size: var(--text-sm)">Target sinkronisasi akan ditentukan kemudian. Konfigurasi dapat diubah melalui halaman Master Data.</div>
        </div>
      </div>
    `;

    document.getElementById('syncStatusFilter')?.addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('#pageContent tbody tr').forEach(tr => {
        if (!val || tr.dataset.status === val) {
          tr.style.display = '';
        } else {
          tr.style.display = 'none';
        }
      });
    });
  },

  retryOne(id) {
    const log = DataStore.syncLog.find(s => s.id === id);
    if (log) {
      log.status = 'Menunggu';
      log.retry_count++;
      App.toast(`Retry sinkronisasi untuk jadwal #${log.jadwal_id}...`, 'warning');
      setTimeout(() => {
        log.status = 'Berhasil';
        log.pesan_error = null;
        log.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        App.toast('Sinkronisasi berhasil.', 'success');
        const content = document.getElementById('pageContent');
        if (content && App.currentPage === 'sinkronisasi') this.render(content);
      }, 1500);
    }
  },

  retryAll() {
    const failed = DataStore.syncLog.filter(s => s.status === 'Gagal');
    failed.forEach(s => {
      s.status = 'Menunggu';
      s.retry_count++;
    });
    App.toast(`Retry ${failed.length} sinkronisasi gagal...`, 'warning');
    setTimeout(() => {
      failed.forEach(s => {
        s.status = 'Berhasil';
        s.pesan_error = null;
        s.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      });
      App.toast('Semua sinkronisasi berhasil.', 'success');
      const content = document.getElementById('pageContent');
      if (content && App.currentPage === 'sinkronisasi') this.render(content);
    }, 2000);
  },
};
