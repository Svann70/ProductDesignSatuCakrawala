/* ============================================
   App - Router, Sidebar, Global State
   ============================================ */

const App = {
  currentPage: 'jadwal',

  init() {
    this.bindSidebar();
    this.navigate('jadwal');
  },

  bindSidebar() {
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigate(page);
      });
    });
  },

  navigate(page) {
    this.currentPage = page;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update header title
    const titles = {
      jadwal: 'Jadwal Kuliah',
      gabungan: 'Kelas Gabungan',
      sinkronisasi: 'Status Sinkronisasi',
      master: 'Master Data',
      audit: 'Audit Log',
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Render page
    const content = document.getElementById('pageContent');
    content.innerHTML = '';

    switch (page) {
      case 'jadwal': Jadwal.render(content); break;
      case 'gabungan': Gabungan.render(content); break;
      case 'sinkronisasi': Sinkronisasi.render(content); break;
      case 'master': Master.render(content); break;
      case 'audit': Audit.render(content); break;
      default: Jadwal.render(content); break;
    }
  },

  // Toast notification
  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(16px)';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  },

  // Modal helper
  openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('active');
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal(id);
      });
    }
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.remove('active');
  },
};

// ---- Utility Functions ----
function el(tag, attrs = {}, ...children) {
  const elem = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') elem.className = val;
    else if (key === 'innerHTML') elem.innerHTML = val;
    else if (key === 'textContent') elem.textContent = val;
    else if (key.startsWith('on')) elem.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'dataset') Object.assign(elem.dataset, val);
    else if (key === 'style' && typeof val === 'object') Object.assign(elem.style, val);
    else elem.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === 'string') elem.appendChild(document.createTextNode(child));
    else if (child) elem.appendChild(child);
  }
  return elem;
}

function formatTime(t) { return t; }

function getStatusBadge(status) {
  const map = {
    'Draft': 'badge-info',
    'Aktif': 'badge-success',
    'Berhasil': 'badge-success',
    'Gagal': 'badge-error',
    'Menunggu': 'badge-warning',
    'Aktif': 'badge-success',
    'Non-Aktif': 'badge-neutral',
    'Cuti': 'badge-warning',
  };
  return `<span class="badge ${map[status] || 'badge-neutral'}">${status}</span>`;
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
