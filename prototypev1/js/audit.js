/* ============================================
   Audit Log Page
   ============================================ */

const Audit = {
  filterDate: '',
  filterUser: '',
  filterAksi: '',

  render(container) {
    container.innerHTML = `
      <div class="page-content-inner">
        <div class="card">
          <div class="card-header">
            <h3>Riwayat Perubahan Jadwal</h3>
            <span class="badge badge-info">${DataStore.auditLog.length} entri</span>
          </div>
          <div style="padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-border-subtle); background: var(--color-surface-1)">
            <div class="audit-filter-bar" style="margin-bottom: 0">
              <select class="filter-select" id="auditAksiFilter">
                <option value="">Semua Aksi</option>
                <option value="Create">Create</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
              </select>
              <input type="text" class="form-input" id="auditUserFilter" placeholder="Filter pengguna..." style="height: 28px; font-size: var(--text-sm); width: 180px">
            </div>
          </div>
          <div class="table-container" style="border: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg)">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Entitas</th>
                  <th>Aksi</th>
                  <th>Detail Perubahan</th>
                  <th>Oleh</th>
                </tr>
              </thead>
              <tbody>
                ${DataStore.auditLog.slice().reverse().map(log => {
                  const aksiClass = log.aksi === 'Create' ? 'badge-success' : log.aksi === 'Delete' ? 'badge-error' : 'badge-warning';
                  return `
                    <tr data-aksi="${log.aksi}" data-user="${log.user}">
                      <td class="mono" style="white-space: nowrap; font-size: var(--text-sm)">${log.timestamp}</td>
                      <td>${log.entitas} #${log.entitas_id}</td>
                      <td><span class="badge ${aksiClass}">${log.aksi}</span></td>
                      <td style="font-size: var(--text-sm)">
                        ${log.perubahan.nilai_lama
                          ? `<span style="color: var(--color-ink-muted)">${log.perubahan.nilai_lama}</span> &rarr; <strong>${log.perubahan.nilai_baru || '-'}</strong>`
                          : `<strong>${log.perubahan.nilai_baru || '-'}</strong>`
                        }
                      </td>
                      <td style="font-size: var(--text-sm)">${log.user}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="margin-top: var(--space-3); font-size: var(--text-sm); color: var(--color-ink-subdued)">
          Audit log disimpan minimal 12 bulan. Data menampilkan perubahan terbaru.
        </div>
      </div>
    `;

    // Filter events
    document.getElementById('auditAksiFilter')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('auditUserFilter')?.addEventListener('input', () => this.applyFilters());
  },

  applyFilters() {
    const aksi = document.getElementById('auditAksiFilter')?.value || '';
    const user = (document.getElementById('auditUserFilter')?.value || '').toLowerCase();

    document.querySelectorAll('#pageContent tbody tr').forEach(tr => {
      const rowAksi = tr.dataset.aksi || '';
      const rowUser = (tr.dataset.user || '').toLowerCase();

      const matchAksi = !aksi || rowAksi === aksi;
      const matchUser = !user || rowUser.includes(user);

      tr.style.display = (matchAksi && matchUser) ? '' : 'none';
    });
  },
};
