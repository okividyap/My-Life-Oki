/* ==========================================================================
   MY LIFE - Master Application Controller (Versi Final 1.0)
   Semua Fitur Edit Lengkap di Seluruh 15 Modul Sistem
   ========================================================================== */

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.isLocked = false;
    this.pomoState = {
      mode: 'focus',
      timeLeft: 25 * 60,
      isRunning: false,
      intervalId: null
    };
  }

  init() {
    // Check PIN lock
    const settings = window.store.get('settings') || {};
    if (settings.pin_enabled) {
      this.isLocked = true;
    }

    // Subscribe store changes
    window.store.subscribe(() => {
      if (!this.isLocked) {
        this.render();
      }
    });

    // Start live WITA clock
    this.startLiveClock();

    // Start alarm watcher
    window.alarmWatcher.start();

    // Render initial view
    this.render();

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration:', err));
    }
  }

  startLiveClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      const headerClock = document.getElementById('header-live-clock');
      if (headerClock) {
        headerClock.textContent = `${timeStr} WITA`;
      }

      const remindersClock = document.getElementById('live-wita-clock');
      if (remindersClock) {
        remindersClock.textContent = `${timeStr} WITA`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  navigate(viewName) {
    this.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();

    // Update active class on desktop sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Update active class on mobile bottom bar
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
  }

  render() {
    const appEl = document.getElementById('app-main-content');
    if (!appEl) return;

    // Update dynamic sidebar widgets
    const profile = window.store.get('profile') || {};
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = profile.name || 'Pengguna';
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    if (sidebarAvatar && profile.avatar) sidebarAvatar.src = profile.avatar;
    const taskBadge = document.getElementById('sidebar-task-badge');
    if (taskBadge) {
      const activeTasksCount = (window.store.getAll('tasks') || []).filter(t => t.status !== 'done').length;
      taskBadge.textContent = activeTasksCount;
    }

    if (this.isLocked) {
      this.renderLockScreen();
      return;
    }

    switch (this.currentView) {
      case 'dashboard':
        appEl.innerHTML = Components.renderDashboard();
        break;
      case 'finance':
        appEl.innerHTML = Components.renderFinance();
        break;
      case 'academic':
        appEl.innerHTML = Components.renderAcademic();
        break;
      case 'calendar':
        appEl.innerHTML = Components.renderCalendar();
        break;
      case 'reminders':
        appEl.innerHTML = Components.renderReminders();
        break;
      case 'meals':
        appEl.innerHTML = Components.renderMeals();
        break;
      case 'routines':
        appEl.innerHTML = Components.renderRoutines();
        break;
      case 'health':
        appEl.innerHTML = Components.renderHealth();
        break;
      case 'notes':
        appEl.innerHTML = Components.renderNotes();
        break;
      case 'goals':
        appEl.innerHTML = Components.renderGoals();
        break;
      case 'shopping':
        appEl.innerHTML = Components.renderShopping();
        break;
      case 'documents':
        appEl.innerHTML = Components.renderDocuments();
        break;
      case 'productivity':
        appEl.innerHTML = Components.renderProductivity();
        this.updatePomoDisplay();
        break;
      case 'reports':
        appEl.innerHTML = Components.renderReports();
        break;
      case 'settings':
        appEl.innerHTML = Components.renderSettings();
        break;
      default:
        appEl.innerHTML = Components.renderDashboard();
    }
  }

  // =========================================================================
  // LOCK SCREEN & AUTH
  // =========================================================================
  renderLockScreen() {
    const appEl = document.getElementById('app-main-content');
    const profile = window.store.get('profile') || {};

    appEl.innerHTML = `
      <div style="min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div class="glow-card" style="width: 100%; max-width: 400px; padding: 36px 28px; text-align: center; border-image: linear-gradient(135deg, #c084fc, #38bdf8) 1; box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);">
          <div style="width: 70px; height: 70px; margin: 0 auto 16px; border-radius: 50%; overflow: hidden; border: 2px solid #c084fc; box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);">
            <img src="${profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="glow-pill" style="margin-bottom: 8px;">AKUN PRIBADI TERKUNCI</div>
          <h2 style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 4px;">${profile.name || 'Pemilik Akun'}</h2>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 24px;">Masukkan Master PIN untuk membuka sistem MY LIFE.</p>
          
          <form onsubmit="window.app.unlockApp(event)">
            <input type="password" id="lock-pin-input" maxlength="6" autofocus placeholder="••••••" class="form-input" style="font-size: 28px; text-align: center; letter-spacing: 0.3em; margin-bottom: 20px; font-family: var(--font-mono); font-weight: 800; color: #38bdf8;">
            <button type="submit" class="btn-primary" style="width: 100%; padding: 12px; font-size: 15px;">
              ${Icons.unlock('w-4 h-4')} Buka Kunci
            </button>
          </form>
          <div style="font-size: 11px; color: #64748b; margin-top: 16px;">
            Default Master PIN: <strong>123456</strong>
          </div>
        </div>
      </div>
    `;
  }

  unlockApp(e) {
    if (e) e.preventDefault();
    const pin = document.getElementById('lock-pin-input').value;
    const settings = window.store.get('settings') || {};
    if (pin === (settings.master_pin || '123456')) {
      this.isLocked = false;
      this.showToast('Selamat Datang Kembali!');
      this.render();
    } else {
      this.showToast('PIN salah! Silakan coba lagi.', 'error');
    }
  }

  lockNow() {
    this.isLocked = true;
    this.render();
    this.showToast('Aplikasi terkunci.');
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  showToast(message, type = 'success') {
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? '#34d399' : '#f87171'}; font-size: 16px;">
        ${type === 'success' ? Icons.checkCircle('w-5 h-5') : '⚠️'}
      </span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // MODAL CONTROLLERS & FORM HANDLERS
  // =========================================================================
  openModal(htmlContent) {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.id = 'app-active-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = htmlContent;
    overlay.onclick = (e) => {
      if (e.target === overlay) this.closeModal();
    };
    document.body.appendChild(overlay);
  }

  closeModal() {
    const existing = document.getElementById('app-active-modal');
    if (existing) existing.remove();
  }

  // =========================================================================
  // 1. TRANSACTIONS CRUD (TAMBAH & EDIT)
  // =========================================================================
  openTransactionModal(defaultType = 'expense') {
    const today = new Date().toISOString().slice(0, 10);
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${defaultType === 'income' ? 'Catat Pemasukan Baru' : 'Catat Pengeluaran Baru'}</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveTransaction(event)">
          <div class="form-group">
            <label class="form-label">Jenis Transaksi</label>
            <select id="m-tx-type" class="form-select">
              <option value="expense" ${defaultType === 'expense' ? 'selected' : ''}>Pengeluaran (-)</option>
              <option value="income" ${defaultType === 'income' ? 'selected' : ''}>Pemasukan (+)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nominal (Rupiah)</label>
            <input type="number" id="m-tx-amount" min="1000" step="500" placeholder="Contoh: 50000" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select id="m-tx-category" class="form-select">
              <option value="Makan & Minum">Makan &amp; Minum</option>
              <option value="Kuliah & Buku">Kuliah &amp; Buku</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Hiburan & Hobi">Hiburan &amp; Hobi</option>
              <option value="Belanja">Belanja</option>
              <option value="Tagihan">Tagihan &amp; Kuota</option>
              <option value="Uang Saku / Gaji">Uang Saku / Gaji</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi / Keterangan</label>
            <input type="text" id="m-tx-desc" placeholder="Contoh: Beli makan siang ayam geprek" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input type="date" id="m-tx-date" value="${today}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Metode Pembayaran</label>
              <select id="m-tx-payment" class="form-select">
                <option value="QRIS">QRIS / E-Wallet</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Tunai">Tunai / Cash</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Transaksi</button>
        </form>
      </div>
    `);
  }

  saveTransaction(e) {
    e.preventDefault();
    window.store.add('transactions', {
      type: document.getElementById('m-tx-type').value,
      amount: Number(document.getElementById('m-tx-amount').value),
      category: document.getElementById('m-tx-category').value,
      description: document.getElementById('m-tx-desc').value,
      date: document.getElementById('m-tx-date').value,
      payment_method: document.getElementById('m-tx-payment').value
    });
    this.closeModal();
    this.showToast('Transaksi berhasil dicatat!');
    if (window.soundEngine) window.soundEngine.playSuccessSound();
  }

  openEditTransactionModal(id) {
    const t = window.store.get('transactions', id);
    if (!t) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Transaksi</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditTransaction(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Jenis Transaksi</label>
            <select id="m-tx-type" class="form-select">
              <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Pengeluaran (-)</option>
              <option value="income" ${t.type === 'income' ? 'selected' : ''}>Pemasukan (+)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nominal (Rupiah)</label>
            <input type="number" id="m-tx-amount" min="1000" step="500" value="${t.amount}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select id="m-tx-category" class="form-select">
              ${['Makan & Minum', 'Kuliah & Buku', 'Transportasi', 'Hiburan & Hobi', 'Belanja', 'Tagihan', 'Uang Saku / Gaji', 'Lainnya'].map(cat => 
                `<option value="${cat}" ${t.category === cat ? 'selected' : ''}>${cat}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi / Keterangan</label>
            <input type="text" id="m-tx-desc" value="${t.description}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input type="date" id="m-tx-date" value="${t.date}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Metode Pembayaran</label>
              <select id="m-tx-payment" class="form-select">
                <option value="QRIS" ${t.payment_method === 'QRIS' ? 'selected' : ''}>QRIS / E-Wallet</option>
                <option value="Transfer Bank" ${t.payment_method === 'Transfer Bank' ? 'selected' : ''}>Transfer Bank</option>
                <option value="Tunai" ${t.payment_method === 'Tunai' ? 'selected' : ''}>Tunai / Cash</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Transaksi</button>
        </form>
      </div>
    `);
  }

  saveEditTransaction(e, id) {
    e.preventDefault();
    window.store.update('transactions', id, {
      type: document.getElementById('m-tx-type').value,
      amount: Number(document.getElementById('m-tx-amount').value),
      category: document.getElementById('m-tx-category').value,
      description: document.getElementById('m-tx-desc').value,
      date: document.getElementById('m-tx-date').value,
      payment_method: document.getElementById('m-tx-payment').value
    });
    this.closeModal();
    this.showToast('Transaksi berhasil diperbarui!');
  }

  deleteTransaction(id) {
    if (confirm('Hapus transaksi ini secara permanen?')) {
      window.store.delete('transactions', id);
      this.showToast('Transaksi dihapus.');
    }
  }

  // =========================================================================
  // 2. BUDGET & TABUNGAN CRUD
  // =========================================================================
  openBudgetModal() {
    const budget = window.store.get('budget') || { monthly_limit: 0 };
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Atur Batas Anggaran Bulanan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveBudget(event)">
          <div class="form-group">
            <label class="form-label">Batas Maksimal Pengeluaran (Rupiah)</label>
            <input type="number" id="m-budget-limit" value="${budget.monthly_limit || 0}" step="50000" class="form-input" required>
            <span style="font-size: 11px; color: #94a3b8;">Sistem akan memberi peringatan jika pengeluaran melebihi 80% dari batas ini.</span>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Anggaran</button>
        </form>
      </div>
    `);
  }

  saveBudget(e) {
    e.preventDefault();
    const limit = Number(document.getElementById('m-budget-limit').value);
    window.store.update('budget', null, { monthly_limit: limit });
    this.closeModal();
    this.showToast('Batas anggaran bulanan diperbarui!');
  }

  openSavingsModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Pos Tabungan Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveSavings(event)">
          <div class="form-group">
            <label class="form-label">Nama Pos Tabungan</label>
            <input type="text" id="m-sav-name" placeholder="Contoh: Dana Darurat / Laptop Baru" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Target Nominal (Rp)</label>
              <input type="number" id="m-sav-target" placeholder="Contoh: 10000000" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Saldo Awal Terkumpul (Rp)</label>
              <input type="number" id="m-sav-current" value="0" class="form-input" required>
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Target Tanggal Selesai</label>
              <input type="date" id="m-sav-deadline" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Ikon / Emoji</label>
              <input type="text" id="m-sav-icon" value="💰" class="form-input" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Pos Tabungan</button>
        </form>
      </div>
    `);
  }

  saveSavings(e) {
    e.preventDefault();
    window.store.add('savings', {
      name: document.getElementById('m-sav-name').value,
      target_amount: Number(document.getElementById('m-sav-target').value),
      current_amount: Number(document.getElementById('m-sav-current').value),
      deadline: document.getElementById('m-sav-deadline').value,
      icon: document.getElementById('m-sav-icon').value
    });
    this.closeModal();
    this.showToast('Pos tabungan berhasil dibuat!');
  }

  openEditSavingsModal(id) {
    const s = window.store.get('savings', id);
    if (!s) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Pos Tabungan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditSavings(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Nama Pos Tabungan</label>
            <input type="text" id="m-sav-name" value="${s.name}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Target Nominal (Rp)</label>
              <input type="number" id="m-sav-target" value="${s.target_amount}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Saldo Terkumpul (Rp)</label>
              <input type="number" id="m-sav-current" value="${s.current_amount}" class="form-input" required>
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Target Tanggal Selesai</label>
              <input type="date" id="m-sav-deadline" value="${s.deadline || ''}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Ikon / Emoji</label>
              <input type="text" id="m-sav-icon" value="${s.icon || '💰'}" class="form-input" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Pos Tabungan</button>
        </form>
      </div>
    `);
  }

  saveEditSavings(e, id) {
    e.preventDefault();
    window.store.update('savings', id, {
      name: document.getElementById('m-sav-name').value,
      target_amount: Number(document.getElementById('m-sav-target').value),
      current_amount: Number(document.getElementById('m-sav-current').value),
      deadline: document.getElementById('m-sav-deadline').value,
      icon: document.getElementById('m-sav-icon').value
    });
    this.closeModal();
    this.showToast('Pos tabungan berhasil diperbarui!');
  }

  addSavingsDeposit(id) {
    const amountStr = prompt('Masukkan nominal setoran tabungan (Rp):', '100000');
    const amount = Number(amountStr);
    if (amount > 0) {
      const s = window.store.get('savings', id);
      if (s) {
        window.store.update('savings', id, { current_amount: s.current_amount + amount });
        this.showToast(`Berhasil menambah tabungan sebesar ${formatRupiah(amount)}!`);
        if (window.soundEngine) window.soundEngine.playSuccessSound();
      }
    }
  }

  deleteSavings(id) {
    if (confirm('Hapus pos tabungan ini?')) {
      window.store.delete('savings', id);
      this.showToast('Pos tabungan dihapus.');
    }
  }

  // =========================================================================
  // 3. TUGAS, MATA KULIAH & UJIAN CRUD
  // =========================================================================
  openTaskModal() {
    const courses = window.store.getAll('courses') || [];
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Tugas Kuliah Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveTask(event)">
          <div class="form-group">
            <label class="form-label">Nama Tugas</label>
            <input type="text" id="m-task-title" placeholder="Contoh: Laporan Praktikum Jaringan Komputer" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Mata Kuliah Terkait</label>
            <select id="m-task-course" class="form-select">
              <option value="|Tugas Umum">Tugas Umum / Non-Mata Kuliah</option>
              ${courses.map(c => `<option value="${c.id}|${c.name}">${c.name} (${c.code})</option>`).join('')}
            </select>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Tanggal Deadline</label>
              <input type="date" id="m-task-date" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Jam (WITA)</label>
              <input type="time" id="m-task-time" value="23:59" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Prioritas</label>
            <select id="m-task-priority" class="form-select">
              <option value="high">Tinggi (Mendesak)</option>
              <option value="medium" selected>Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tautan Pengumpulan (Opsional)</label>
            <input type="url" id="m-task-link" placeholder="https://classroom.google.com/..." class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Catatan / Detail Instruksi</label>
            <textarea id="m-task-notes" class="form-textarea" rows="2" placeholder="Ketentuan format, referensi, dll."></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Tugas</button>
        </form>
      </div>
    `);
  }

  saveTask(e) {
    e.preventDefault();
    const [course_id, course_name] = document.getElementById('m-task-course').value.split('|');
    window.store.add('tasks', {
      title: document.getElementById('m-task-title').value,
      course_id,
      course_name,
      deadline_date: document.getElementById('m-task-date').value,
      deadline_time: document.getElementById('m-task-time').value,
      priority: document.getElementById('m-task-priority').value,
      status: 'todo',
      link: document.getElementById('m-task-link').value,
      notes: document.getElementById('m-task-notes').value
    });
    this.closeModal();
    this.showToast('Tugas kuliah berhasil ditambahkan!');
  }

  openEditTaskModal(id) {
    const t = window.store.get('tasks', id);
    if (!t) return;
    const courses = window.store.getAll('courses') || [];

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Tugas Kuliah</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditTask(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Nama Tugas</label>
            <input type="text" id="m-task-title" value="${t.title}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Mata Kuliah Terkait</label>
            <select id="m-task-course" class="form-select">
              <option value="|Tugas Umum" ${!t.course_id ? 'selected' : ''}>Tugas Umum / Non-Mata Kuliah</option>
              ${courses.map(c => `<option value="${c.id}|${c.name}" ${t.course_id === c.id ? 'selected' : ''}>${c.name} (${c.code})</option>`).join('')}
            </select>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Tanggal Deadline</label>
              <input type="date" id="m-task-date" value="${t.deadline_date}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Jam (WITA)</label>
              <input type="time" id="m-task-time" value="${t.deadline_time || '23:59'}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Prioritas</label>
            <select id="m-task-priority" class="form-select">
              <option value="high" ${t.priority === 'high' ? 'selected' : ''}>Tinggi (Mendesak)</option>
              <option value="medium" ${t.priority === 'medium' ? 'selected' : ''}>Sedang</option>
              <option value="low" ${t.priority === 'low' ? 'selected' : ''}>Rendah</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status Pengerjaan</label>
            <select id="m-task-status" class="form-select">
              <option value="todo" ${t.status === 'todo' ? 'selected' : ''}>Belum Selesai</option>
              <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>Sedang Dikerjakan</option>
              <option value="done" ${t.status === 'done' ? 'selected' : ''}>Selesai ✓</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tautan Pengumpulan</label>
            <input type="url" id="m-task-link" value="${t.link || ''}" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea id="m-task-notes" class="form-textarea" rows="2">${t.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Tugas</button>
        </form>
      </div>
    `);
  }

  saveEditTask(e, id) {
    e.preventDefault();
    const [course_id, course_name] = document.getElementById('m-task-course').value.split('|');
    window.store.update('tasks', id, {
      title: document.getElementById('m-task-title').value,
      course_id,
      course_name,
      deadline_date: document.getElementById('m-task-date').value,
      deadline_time: document.getElementById('m-task-time').value,
      priority: document.getElementById('m-task-priority').value,
      status: document.getElementById('m-task-status').value,
      link: document.getElementById('m-task-link').value,
      notes: document.getElementById('m-task-notes').value
    });
    this.closeModal();
    this.showToast('Tugas berhasil diperbarui!');
  }

  toggleTaskStatus(id) {
    const task = window.store.get('tasks', id);
    if (task) {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      window.store.update('tasks', id, { status: newStatus });
      this.showToast(newStatus === 'done' ? 'Tugas diselesaikan! 🎉' : 'Status tugas dikembalikan.');
      if (newStatus === 'done' && window.soundEngine) window.soundEngine.playSuccessSound();
    }
  }

  changeTaskStatus(id, newStatus) {
    window.store.update('tasks', id, { status: newStatus });
    this.showToast('Status tugas diperbarui.');
  }

  deleteTask(id) {
    if (confirm('Hapus tugas ini?')) {
      window.store.delete('tasks', id);
      this.showToast('Tugas dihapus.');
    }
  }

  // Course Modal & Edit
  openCourseModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Mata Kuliah Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveCourse(event)">
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kode MK</label>
              <input type="text" id="m-course-code" placeholder="IF3101" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah SKS</label>
              <input type="number" id="m-course-sks" value="3" min="1" max="6" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Mata Kuliah</label>
            <input type="text" id="m-course-name" placeholder="Contoh: Arsitektur Cloud &amp; DevOps" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Dosen Pengampu</label>
            <input type="text" id="m-course-lecturer" placeholder="Contoh: Dr. Ir. Budi Santoso, M.T" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Hari Kuliah</label>
              <select id="m-course-day" class="form-select">
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jam (WITA)</label>
              <input type="text" id="m-course-time" placeholder="08:00 - 10:30 WITA" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Ruang / Link Kuliah</label>
            <input type="text" id="m-course-room" placeholder="Lab Komputasi Lt. 2 / Zoom" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Mata Kuliah</button>
        </form>
      </div>
    `);
  }

  saveCourse(e) {
    e.preventDefault();
    window.store.add('courses', {
      code: document.getElementById('m-course-code').value,
      name: document.getElementById('m-course-name').value,
      sks: Number(document.getElementById('m-course-sks').value),
      lecturer: document.getElementById('m-course-lecturer').value,
      day: document.getElementById('m-course-day').value,
      time: document.getElementById('m-course-time').value,
      room: document.getElementById('m-course-room').value
    });
    this.closeModal();
    this.showToast('Mata kuliah berhasil ditambahkan!');
  }

  openEditCourseModal(id) {
    const c = window.store.get('courses', id);
    if (!c) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Mata Kuliah</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditCourse(event, '${id}')">
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kode MK</label>
              <input type="text" id="m-course-code" value="${c.code}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah SKS</label>
              <input type="number" id="m-course-sks" value="${c.sks}" min="1" max="6" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Mata Kuliah</label>
            <input type="text" id="m-course-name" value="${c.name}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Dosen Pengampu</label>
            <input type="text" id="m-course-lecturer" value="${c.lecturer || ''}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Hari Kuliah</label>
              <select id="m-course-day" class="form-select">
                ${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => `<option value="${d}" ${c.day === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jam (WITA)</label>
              <input type="text" id="m-course-time" value="${c.time || ''}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Ruang / Link Kuliah</label>
            <input type="text" id="m-course-room" value="${c.room || ''}" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Mata Kuliah</button>
        </form>
      </div>
    `);
  }

  saveEditCourse(e, id) {
    e.preventDefault();
    window.store.update('courses', id, {
      code: document.getElementById('m-course-code').value,
      name: document.getElementById('m-course-name').value,
      sks: Number(document.getElementById('m-course-sks').value),
      lecturer: document.getElementById('m-course-lecturer').value,
      day: document.getElementById('m-course-day').value,
      time: document.getElementById('m-course-time').value,
      room: document.getElementById('m-course-room').value
    });
    this.closeModal();
    this.showToast('Mata kuliah berhasil diperbarui!');
  }

  deleteCourse(id) {
    if (confirm('Hapus mata kuliah ini?')) {
      window.store.delete('courses', id);
      this.showToast('Mata kuliah dihapus.');
    }
  }

  // Exam Modal & Edit
  openExamModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Jadwal Ujian</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveExam(event)">
          <div class="form-group">
            <label class="form-label">Mata Kuliah</label>
            <input type="text" id="m-exam-course" placeholder="Contoh: Kecerdasan Buatan" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Jenis Ujian</label>
              <select id="m-exam-type" class="form-select">
                <option value="UAS Teori">UAS Teori</option>
                <option value="UAS Praktik">UAS Praktik</option>
                <option value="UTS Teori">UTS Teori</option>
                <option value="UTS Praktik">UTS Praktik</option>
                <option value="Kuis / Evaluasi">Kuis / Evaluasi</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Ujian</label>
              <input type="date" id="m-exam-date" class="form-input" required>
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Waktu (WITA)</label>
              <input type="text" id="m-exam-time" placeholder="08:30 WITA" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Ruangan</label>
              <input type="text" id="m-exam-room" placeholder="Gedung Rektorat Lt. 2" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan Materi Ujian</label>
            <textarea id="m-exam-notes" class="form-textarea" rows="2" placeholder="Bab yang diujikan, open book/close book, dll."></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Jadwal Ujian</button>
        </form>
      </div>
    `);
  }

  saveExam(e) {
    e.preventDefault();
    window.store.add('exams', {
      course: document.getElementById('m-exam-course').value,
      type: document.getElementById('m-exam-type').value,
      date: document.getElementById('m-exam-date').value,
      time: document.getElementById('m-exam-time').value,
      room: document.getElementById('m-exam-room').value,
      notes: document.getElementById('m-exam-notes').value
    });
    this.closeModal();
    this.showToast('Jadwal ujian berhasil ditambahkan!');
  }

  openEditExamModal(id) {
    const ex = window.store.get('exams', id);
    if (!ex) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Jadwal Ujian</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditExam(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Mata Kuliah</label>
            <input type="text" id="m-exam-course" value="${ex.course}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Jenis Ujian</label>
              <select id="m-exam-type" class="form-select">
                ${['UAS Teori', 'UAS Praktik', 'UTS Teori', 'UTS Praktik', 'Kuis / Evaluasi'].map(t => `<option value="${t}" ${ex.type === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Ujian</label>
              <input type="date" id="m-exam-date" value="${ex.date}" class="form-input" required>
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Waktu (WITA)</label>
              <input type="text" id="m-exam-time" value="${ex.time}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Ruangan</label>
              <input type="text" id="m-exam-room" value="${ex.room || ''}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea id="m-exam-notes" class="form-textarea" rows="2">${ex.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Jadwal Ujian</button>
        </form>
      </div>
    `);
  }

  saveEditExam(e, id) {
    e.preventDefault();
    window.store.update('exams', id, {
      course: document.getElementById('m-exam-course').value,
      type: document.getElementById('m-exam-type').value,
      date: document.getElementById('m-exam-date').value,
      time: document.getElementById('m-exam-time').value,
      room: document.getElementById('m-exam-room').value,
      notes: document.getElementById('m-exam-notes').value
    });
    this.closeModal();
    this.showToast('Jadwal ujian berhasil diperbarui!');
  }

  deleteExam(id) {
    if (confirm('Hapus jadwal ujian ini?')) {
      window.store.delete('exams', id);
      this.showToast('Jadwal ujian dihapus.');
    }
  }

  switchAcademicTab(tabKey, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');

    document.getElementById('academic-tab-tasks').style.display = tabKey === 'tasks' ? 'block' : 'none';
    document.getElementById('academic-tab-courses').style.display = tabKey === 'courses' ? 'block' : 'none';
    document.getElementById('academic-tab-exams').style.display = tabKey === 'exams' ? 'block' : 'none';
  }

  // =========================================================================
  // 4. KALENDER CRUD
  // =========================================================================
  openCalendarEventModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Agenda Kalender</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveCalendarEvent(event)">
          <div class="form-group">
            <label class="form-label">Judul Acara / Agenda</label>
            <input type="text" id="m-cal-title" placeholder="Contoh: Rapat Koordinasi Tim" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Tanggal Mulai</label>
              <input type="date" id="m-cal-date" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Waktu (WITA)</label>
              <input type="text" id="m-cal-time" placeholder="10:00 WITA" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Lokasi / Tautan</label>
            <input type="text" id="m-cal-location" placeholder="Ruang Rapat / Zoom Meeting" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Catatan Tambahan</label>
            <textarea id="m-cal-notes" class="form-textarea" rows="2"></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Agenda</button>
        </form>
      </div>
    `);
  }

  saveCalendarEvent(e) {
    e.preventDefault();
    window.store.add('calendar_events', {
      title: document.getElementById('m-cal-title').value,
      start_date: document.getElementById('m-cal-date').value,
      time: document.getElementById('m-cal-time').value,
      location: document.getElementById('m-cal-location').value,
      notes: document.getElementById('m-cal-notes').value
    });
    this.closeModal();
    this.showToast('Agenda berhasil dijadwalkan!');
  }

  openEditCalendarEventModal(id) {
    const ev = window.store.get('calendar_events', id);
    if (!ev) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Agenda Kalender</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditCalendarEvent(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Judul Acara / Agenda</label>
            <input type="text" id="m-cal-title" value="${ev.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input type="date" id="m-cal-date" value="${ev.start_date}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Waktu (WITA)</label>
              <input type="text" id="m-cal-time" value="${ev.time || ''}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Lokasi / Tautan</label>
            <input type="text" id="m-cal-location" value="${ev.location || ''}" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea id="m-cal-notes" class="form-textarea" rows="2">${ev.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Agenda</button>
        </form>
      </div>
    `);
  }

  saveEditCalendarEvent(e, id) {
    e.preventDefault();
    window.store.update('calendar_events', id, {
      title: document.getElementById('m-cal-title').value,
      start_date: document.getElementById('m-cal-date').value,
      time: document.getElementById('m-cal-time').value,
      location: document.getElementById('m-cal-location').value,
      notes: document.getElementById('m-cal-notes').value
    });
    this.closeModal();
    this.showToast('Agenda berhasil diperbarui!');
  }

  deleteCalendarEvent(id) {
    if (confirm('Hapus agenda ini?')) {
      window.store.delete('calendar_events', id);
      this.showToast('Agenda dihapus.');
    }
  }

  // =========================================================================
  // 5. ALARM & PENGINGAT CRUD
  // =========================================================================
  openReminderModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Pengingat / Alarm Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveReminder(event)">
          <div class="form-group">
            <label class="form-label">Judul Pengingat</label>
            <input type="text" id="m-rem-title" placeholder="Contoh: Minum Vitamin &amp; Air Putih" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Waktu Alarm (WITA)</label>
              <input type="time" id="m-rem-time" value="07:00" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Pengulangan</label>
              <select id="m-rem-repeat" class="form-select">
                <option value="daily">Setiap Hari</option>
                <option value="workdays">Hari Kerja (Sen-Jum)</option>
                <option value="once">Sekali Saja</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select id="m-rem-category" class="form-select">
              <option value="routine">Rutinitas Harian</option>
              <option value="meals">Makan &amp; Minum</option>
              <option value="academic">Kuliah &amp; Belajar</option>
              <option value="health">Kesehatan &amp; Olahraga</option>
            </select>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Pasang Alarm</button>
        </form>
      </div>
    `);
  }

  saveReminder(e) {
    e.preventDefault();
    window.store.add('reminders', {
      title: document.getElementById('m-rem-title').value,
      time: document.getElementById('m-rem-time').value,
      repeat: document.getElementById('m-rem-repeat').value,
      category: document.getElementById('m-rem-category').value,
      active: true,
      sound: 'melodic'
    });
    this.closeModal();
    this.showToast('Alarm pengingat dipasang!');
  }

  openEditReminderModal(id) {
    const r = window.store.get('reminders', id);
    if (!r) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Pengingat / Alarm</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditReminder(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Judul Pengingat</label>
            <input type="text" id="m-rem-title" value="${r.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Waktu Alarm (WITA)</label>
              <input type="time" id="m-rem-time" value="${r.time}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Pengulangan</label>
              <select id="m-rem-repeat" class="form-select">
                <option value="daily" ${r.repeat === 'daily' ? 'selected' : ''}>Setiap Hari</option>
                <option value="workdays" ${r.repeat === 'workdays' ? 'selected' : ''}>Hari Kerja (Sen-Jum)</option>
                <option value="once" ${r.repeat === 'once' ? 'selected' : ''}>Sekali Saja</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select id="m-rem-category" class="form-select">
              <option value="routine" ${r.category === 'routine' ? 'selected' : ''}>Rutinitas Harian</option>
              <option value="meals" ${r.category === 'meals' ? 'selected' : ''}>Makan &amp; Minum</option>
              <option value="academic" ${r.category === 'academic' ? 'selected' : ''}>Kuliah &amp; Belajar</option>
              <option value="health" ${r.category === 'health' ? 'selected' : ''}>Kesehatan &amp; Olahraga</option>
            </select>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Alarm</button>
        </form>
      </div>
    `);
  }

  saveEditReminder(e, id) {
    e.preventDefault();
    window.store.update('reminders', id, {
      title: document.getElementById('m-rem-title').value,
      time: document.getElementById('m-rem-time').value,
      repeat: document.getElementById('m-rem-repeat').value,
      category: document.getElementById('m-rem-category').value
    });
    this.closeModal();
    this.showToast('Pengingat berhasil diperbarui!');
  }

  toggleReminder(id) {
    const rem = window.store.get('reminders', id);
    if (rem) {
      window.store.update('reminders', id, { active: !rem.active });
      this.showToast(rem.active ? 'Alarm dimatikan.' : 'Alarm diaktifkan.');
    }
  }

  deleteReminder(id) {
    if (confirm('Hapus pengingat ini?')) {
      window.store.delete('reminders', id);
      this.showToast('Pengingat dihapus.');
    }
  }

  loadPrdPresetsConfirm() {
    if (confirm('Muat 10 Jadwal Standar PRD (Bangun tidur, Sarapan, Makan siang, Olahraga, Belajar, dll)?')) {
      window.store.loadPrdStandardSchedules();
      this.showToast('10 Jadwal standar PRD berhasil dimuat!');
    }
  }

  // =========================================================================
  // 6. MEALS CRUD
  // =========================================================================
  openMealModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Catat Menu Makanan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveMeal(event)">
          <div class="form-group">
            <label class="form-label">Waktu Makan</label>
            <select id="m-meal-time" class="form-select">
              <option value="Sarapan">Sarapan (Pagi)</option>
              <option value="Makan Siang">Makan Siang</option>
              <option value="Camilan Sore">Camilan Sore</option>
              <option value="Makan Malam">Makan Malam</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Menu Makanan</label>
            <input type="text" id="m-meal-title" placeholder="Contoh: Nasi Putih + Telur Dadar + Sayur Sop" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Jam Jadwal (WITA)</label>
              <input type="text" id="m-meal-sched" value="12:00 WITA" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Estimasi Kalori (kcal)</label>
              <input type="number" id="m-meal-calories" value="500" class="form-input" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Menu</button>
        </form>
      </div>
    `);
  }

  saveMeal(e) {
    e.preventDefault();
    window.store.add('meals', {
      meal_time: document.getElementById('m-meal-time').value,
      scheduled_time: document.getElementById('m-meal-sched').value,
      title: document.getElementById('m-meal-title').value,
      calories: Number(document.getElementById('m-meal-calories').value),
      consumed: true,
      date: new Date().toISOString().slice(0, 10)
    });
    this.closeModal();
    this.showToast('Menu makan berhasil dicatat!');
  }

  openEditMealModal(id) {
    const m = window.store.get('meals', id);
    if (!m) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Menu Makanan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditMeal(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Waktu Makan</label>
            <select id="m-meal-time" class="form-select">
              <option value="Sarapan" ${m.meal_time === 'Sarapan' ? 'selected' : ''}>Sarapan (Pagi)</option>
              <option value="Makan Siang" ${m.meal_time === 'Makan Siang' ? 'selected' : ''}>Makan Siang</option>
              <option value="Camilan Sore" ${m.meal_time === 'Camilan Sore' ? 'selected' : ''}>Camilan Sore</option>
              <option value="Makan Malam" ${m.meal_time === 'Makan Malam' ? 'selected' : ''}>Makan Malam</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Menu Makanan</label>
            <input type="text" id="m-meal-title" value="${m.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Jam Jadwal (WITA)</label>
              <input type="text" id="m-meal-sched" value="${m.scheduled_time || '12:00 WITA'}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Estimasi Kalori (kcal)</label>
              <input type="number" id="m-meal-calories" value="${m.calories || 0}" class="form-input" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Menu</button>
        </form>
      </div>
    `);
  }

  saveEditMeal(e, id) {
    e.preventDefault();
    window.store.update('meals', id, {
      meal_time: document.getElementById('m-meal-time').value,
      scheduled_time: document.getElementById('m-meal-sched').value,
      title: document.getElementById('m-meal-title').value,
      calories: Number(document.getElementById('m-meal-calories').value)
    });
    this.closeModal();
    this.showToast('Menu makan berhasil diperbarui!');
  }

  toggleMealConsumed(id) {
    const meal = window.store.get('meals', id);
    if (meal) {
      window.store.update('meals', id, { consumed: !meal.consumed });
      this.showToast(meal.consumed ? 'Status makan dibatalkan.' : 'Menu makan tercatat sudah dikonsumsi! 🍽️');
    }
  }

  deleteMeal(id) {
    if (confirm('Hapus jadwal menu ini?')) {
      window.store.delete('meals', id);
      this.showToast('Menu dihapus.');
    }
  }

  // =========================================================================
  // 7. HABITS CRUD
  // =========================================================================
  openHabitModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Rutinitas Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveHabit(event)">
          <div class="form-group">
            <label class="form-label">Nama Rutinitas</label>
            <input type="text" id="m-habit-title" placeholder="Contoh: Meditasi 10 Menit" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Rutinitas</button>
        </form>
      </div>
    `);
  }

  saveHabit(e) {
    e.preventDefault();
    window.store.add('habits', {
      title: document.getElementById('m-habit-title').value,
      streak: 0,
      target_days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      completed_today: false
    });
    this.closeModal();
    this.showToast('Rutinitas baru ditambahkan!');
  }

  openEditHabitModal(id) {
    const h = window.store.get('habits', id);
    if (!h) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Rutinitas</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditHabit(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Nama Rutinitas</label>
            <input type="text" id="m-habit-title" value="${h.title}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Jumlah Hari Beruntun (Streak)</label>
            <input type="number" id="m-habit-streak" value="${h.streak || 0}" min="0" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Rutinitas</button>
        </form>
      </div>
    `);
  }

  saveEditHabit(e, id) {
    e.preventDefault();
    window.store.update('habits', id, {
      title: document.getElementById('m-habit-title').value,
      streak: Number(document.getElementById('m-habit-streak').value)
    });
    this.closeModal();
    this.showToast('Rutinitas berhasil diperbarui!');
  }

  toggleHabit(id) {
    const habit = window.store.get('habits', id);
    if (habit) {
      const completed = !habit.completed_today;
      const newStreak = completed ? (habit.streak + 1) : Math.max(0, habit.streak - 1);
      window.store.update('habits', id, { completed_today: completed, streak: newStreak });
      this.showToast(completed ? `Rutinitas selesai! Streak ${newStreak} hari! 🔥` : 'Rutinitas belum selesai.');
      if (completed && window.soundEngine) window.soundEngine.playSuccessSound();
    }
  }

  deleteHabit(id) {
    if (confirm('Hapus rutinitas ini?')) {
      window.store.delete('habits', id);
      this.showToast('Rutinitas dihapus.');
    }
  }

  // =========================================================================
  // 8. HEALTH & WORKOUTS CRUD
  // =========================================================================
  openEditHealthStatsModal() {
    const h = window.store.get('health') || { current_weight: 0, target_weight: 0, height: 0 };
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Atur Berat &amp; Tinggi Badan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveHealthStats(event)">
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Berat Badan Saat Ini (kg)</label>
              <input type="number" id="m-health-weight" value="${h.current_weight || ''}" step="0.1" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Target Berat Badan (kg)</label>
              <input type="number" id="m-health-target" value="${h.target_weight || ''}" step="0.1" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tinggi Badan (cm)</label>
            <input type="number" id="m-health-height" value="${h.height || ''}" step="1" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Data Fisik</button>
        </form>
      </div>
    `);
  }

  saveHealthStats(e) {
    e.preventDefault();
    window.store.update('health', null, {
      current_weight: Number(document.getElementById('m-health-weight').value),
      target_weight: Number(document.getElementById('m-health-target').value),
      height: Number(document.getElementById('m-health-height').value)
    });
    this.closeModal();
    this.showToast('Data fisik berhasil diperbarui!');
  }

  openWorkoutModal() {
    const today = new Date().toISOString().slice(0, 10);
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Catat Sesi Olahraga</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveWorkout(event)">
          <div class="form-group">
            <label class="form-label">Jenis Olahraga</label>
            <input type="text" id="m-wo-type" placeholder="Contoh: Gym &amp; Angkat Beban / Jogging" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Durasi (Menit)</label>
              <input type="number" id="m-wo-duration" value="45" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Kalori Terbakar (kcal)</label>
              <input type="number" id="m-wo-calories" value="300" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" id="m-wo-date" value="${today}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea id="m-wo-notes" class="form-textarea" rows="2" placeholder="Catatan beban, jarak, repetisi, dll."></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Workout</button>
        </form>
      </div>
    `);
  }

  saveWorkout(e) {
    e.preventDefault();
    const currentHealth = window.store.get('health') || { workouts: [] };
    const newWo = {
      id: `wo-${Date.now()}`,
      type: document.getElementById('m-wo-type').value,
      duration: Number(document.getElementById('m-wo-duration').value),
      calories: Number(document.getElementById('m-wo-calories').value),
      date: document.getElementById('m-wo-date').value,
      notes: document.getElementById('m-wo-notes').value
    };
    currentHealth.workouts.unshift(newWo);
    window.store.update('health', null, currentHealth);
    this.closeModal();
    this.showToast('Workout berhasil dicatat!');
  }

  openEditWorkoutModal(id) {
    const health = window.store.get('health') || { workouts: [] };
    const wo = health.workouts.find(w => w.id === id);
    if (!wo) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Sesi Olahraga</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditWorkout(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Jenis Olahraga</label>
            <input type="text" id="m-wo-type" value="${wo.type}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Durasi (Menit)</label>
              <input type="number" id="m-wo-duration" value="${wo.duration}" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Kalori Terbakar (kcal)</label>
              <input type="number" id="m-wo-calories" value="${wo.calories || 0}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" id="m-wo-date" value="${wo.date}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea id="m-wo-notes" class="form-textarea" rows="2">${wo.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Workout</button>
        </form>
      </div>
    `);
  }

  saveEditWorkout(e, id) {
    e.preventDefault();
    const health = window.store.get('health') || { workouts: [] };
    const idx = health.workouts.findIndex(w => w.id === id);
    if (idx !== -1) {
      health.workouts[idx] = {
        ...health.workouts[idx],
        type: document.getElementById('m-wo-type').value,
        duration: Number(document.getElementById('m-wo-duration').value),
        calories: Number(document.getElementById('m-wo-calories').value),
        date: document.getElementById('m-wo-date').value,
        notes: document.getElementById('m-wo-notes').value
      };
      window.store.update('health', null, health);
    }
    this.closeModal();
    this.showToast('Workout berhasil diperbarui!');
  }

  deleteWorkout(id) {
    if (confirm('Hapus sesi olahraga ini?')) {
      const health = window.store.get('health') || { workouts: [] };
      health.workouts = health.workouts.filter(w => w.id !== id);
      window.store.update('health', null, health);
      this.showToast('Sesi olahraga dihapus.');
    }
  }

  // =========================================================================
  // 9. NOTES CRUD
  // =========================================================================
  openNoteModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Catatan Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveNote(event)">
          <div class="form-group">
            <label class="form-label">Judul Catatan</label>
            <input type="text" id="m-note-title" placeholder="Contoh: Ide Proyek Skripsi AI" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-note-category" class="form-select">
                <option value="Kuliah">Kuliah</option>
                <option value="Ide & Proyek">Ide &amp; Proyek</option>
                <option value="Jurnal Harian">Jurnal Harian</option>
                <option value="Pribadi">Pribadi</option>
              </select>
            </div>
            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 18px;">
                <input type="checkbox" id="m-note-pinned" style="width: 18px; height: 18px; accent-color: #a855f7;">
                <span style="font-size: 13px; color: #fff;">Sematkan di Atas 📌</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Isi Catatan</label>
            <textarea id="m-note-content" class="form-textarea" rows="6" placeholder="Tuliskan pemikiran atau rangkuman Anda di sini..." required></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Catatan</button>
        </form>
      </div>
    `);
  }

  saveNote(e) {
    e.preventDefault();
    window.store.add('notes', {
      title: document.getElementById('m-note-title').value,
      category: document.getElementById('m-note-category').value,
      pinned: document.getElementById('m-note-pinned').checked,
      content: document.getElementById('m-note-content').value,
      updated_at: new Date().toISOString().slice(0, 10)
    });
    this.closeModal();
    this.showToast('Catatan disimpan!');
  }

  openEditNoteModal(id) {
    const n = window.store.get('notes', id);
    if (!n) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Catatan</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditNote(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Judul Catatan</label>
            <input type="text" id="m-note-title" value="${n.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-note-category" class="form-select">
                ${['Kuliah', 'Ide & Proyek', 'Jurnal Harian', 'Pribadi'].map(cat => `<option value="${cat}" ${n.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 18px;">
                <input type="checkbox" id="m-note-pinned" ${n.pinned ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #a855f7;">
                <span style="font-size: 13px; color: #fff;">Sematkan di Atas 📌</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Isi Catatan</label>
            <textarea id="m-note-content" class="form-textarea" rows="6" required>${n.content}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Catatan</button>
        </form>
      </div>
    `);
  }

  saveEditNote(e, id) {
    e.preventDefault();
    window.store.update('notes', id, {
      title: document.getElementById('m-note-title').value,
      category: document.getElementById('m-note-category').value,
      pinned: document.getElementById('m-note-pinned').checked,
      content: document.getElementById('m-note-content').value,
      updated_at: new Date().toISOString().slice(0, 10)
    });
    this.closeModal();
    this.showToast('Catatan berhasil diperbarui!');
  }

  deleteNote(id) {
    if (confirm('Hapus catatan ini?')) {
      window.store.delete('notes', id);
      this.showToast('Catatan dihapus.');
    }
  }

  // =========================================================================
  // 10. GOALS CRUD
  // =========================================================================
  openGoalModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Target Baru</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveGoal(event)">
          <div class="form-group">
            <label class="form-label">Judul Target</label>
            <input type="text" id="m-goal-title" placeholder="Contoh: Lulus Cumlaude / Skor TOEFL 600" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-goal-category" class="form-select">
                <option value="Jangka Pendek">Jangka Pendek (&lt; 6 Bulan)</option>
                <option value="Jangka Panjang">Jangka Panjang (1 - 3 Tahun)</option>
                <option value="Impian Masa Depan">Impian Masa Depan</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Tanggal</label>
              <input type="date" id="m-goal-date" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Motivasi &amp; Alasan Mencapai</label>
            <textarea id="m-goal-motivation" class="form-textarea" rows="2" placeholder="Mengapa target ini sangat penting untuk Anda?" required></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Tetapkan Target</button>
        </form>
      </div>
    `);
  }

  saveGoal(e) {
    e.preventDefault();
    window.store.add('goals', {
      title: document.getElementById('m-goal-title').value,
      category: document.getElementById('m-goal-category').value,
      target_date: document.getElementById('m-goal-date').value,
      motivation: document.getElementById('m-goal-motivation').value,
      progress: 0,
      status: 'in_progress'
    });
    this.closeModal();
    this.showToast('Target baru ditetapkan! Terus melangkah!');
  }

  openEditGoalModal(id) {
    const g = window.store.get('goals', id);
    if (!g) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Target</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditGoal(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Judul Target</label>
            <input type="text" id="m-goal-title" value="${g.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-goal-category" class="form-select">
                <option value="Jangka Pendek" ${g.category === 'Jangka Pendek' ? 'selected' : ''}>Jangka Pendek</option>
                <option value="Jangka Panjang" ${g.category === 'Jangka Panjang' ? 'selected' : ''}>Jangka Panjang</option>
                <option value="Impian Masa Depan" ${g.category === 'Impian Masa Depan' ? 'selected' : ''}>Impian Masa Depan</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Tanggal</label>
              <input type="date" id="m-goal-date" value="${g.target_date}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Persentase Progres (0 - 100%)</label>
            <input type="number" id="m-goal-progress" value="${g.progress}" min="0" max="100" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Motivasi</label>
            <textarea id="m-goal-motivation" class="form-textarea" rows="2" required>${g.motivation || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Target</button>
        </form>
      </div>
    `);
  }

  saveEditGoal(e, id) {
    e.preventDefault();
    window.store.update('goals', id, {
      title: document.getElementById('m-goal-title').value,
      category: document.getElementById('m-goal-category').value,
      target_date: document.getElementById('m-goal-date').value,
      progress: Number(document.getElementById('m-goal-progress').value),
      motivation: document.getElementById('m-goal-motivation').value
    });
    this.closeModal();
    this.showToast('Target berhasil diperbarui!');
  }

  increaseGoalProgress(id) {
    const goal = window.store.get('goals', id);
    if (goal) {
      const nextProgress = Math.min(100, goal.progress + 10);
      window.store.update('goals', id, { progress: nextProgress });
      this.showToast(`Progres meningkat menjadi ${nextProgress}%! 🚀`);
      if (nextProgress === 100 && window.soundEngine) window.soundEngine.playSuccessSound();
    }
  }

  deleteGoal(id) {
    if (confirm('Hapus target ini?')) {
      window.store.delete('goals', id);
      this.showToast('Target dihapus.');
    }
  }

  // =========================================================================
  // 11. SHOPPING CRUD
  // =========================================================================
  openShoppingModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Tambah Barang Belanja</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveShopping(event)">
          <div class="form-group">
            <label class="form-label">Nama Barang</label>
            <input type="text" id="m-shop-name" placeholder="Contoh: Kertas HVS A4 1 Rim" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-shop-category" class="form-select">
                <option value="Kuliah">Kuliah &amp; Belajar</option>
                <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                <option value="Makanan & Snack">Makanan / Snack</option>
                <option value="Skincare">Skincare &amp; Mandi</option>
                <option value="Elektronik">Elektronik &amp; Aksesoris</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah (Qty)</label>
              <input type="number" id="m-shop-qty" value="1" min="1" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Estimasi Harga Satuan (Rp)</label>
            <input type="number" id="m-shop-price" placeholder="Contoh: 55000" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Tambahkan ke Keranjang</button>
        </form>
      </div>
    `);
  }

  saveShopping(e) {
    e.preventDefault();
    window.store.add('shopping', {
      name: document.getElementById('m-shop-name').value,
      category: document.getElementById('m-shop-category').value,
      qty: Number(document.getElementById('m-shop-qty').value),
      estimated_price: Number(document.getElementById('m-shop-price').value),
      is_purchased: false
    });
    this.closeModal();
    this.showToast('Barang berhasil ditambahkan!');
  }

  openEditShoppingModal(id) {
    const it = window.store.get('shopping', id);
    if (!it) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Barang Belanja</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditShopping(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Nama Barang</label>
            <input type="text" id="m-shop-name" value="${it.name}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-shop-category" class="form-select">
                ${['Kuliah', 'Kebutuhan Pokok', 'Makanan & Snack', 'Skincare', 'Elektronik'].map(c => `<option value="${c}" ${it.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah (Qty)</label>
              <input type="number" id="m-shop-qty" value="${it.qty || 1}" min="1" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Estimasi Harga Satuan (Rp)</label>
            <input type="number" id="m-shop-price" value="${it.estimated_price}" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Barang</button>
        </form>
      </div>
    `);
  }

  saveEditShopping(e, id) {
    e.preventDefault();
    window.store.update('shopping', id, {
      name: document.getElementById('m-shop-name').value,
      category: document.getElementById('m-shop-category').value,
      qty: Number(document.getElementById('m-shop-qty').value),
      estimated_price: Number(document.getElementById('m-shop-price').value)
    });
    this.closeModal();
    this.showToast('Barang belanja berhasil diperbarui!');
  }

  toggleShoppingPurchased(id) {
    const item = window.store.get('shopping', id);
    if (item) {
      window.store.update('shopping', id, { is_purchased: !item.is_purchased });
      this.showToast(item.is_purchased ? 'Item dikembalikan ke daftar aktif.' : 'Barang ditandai selesai dibeli! 🛒');
    }
  }

  transferShoppingToFinance(id) {
    const item = window.store.get('shopping', id);
    if (item) {
      const totalAmount = item.estimated_price * (item.qty || 1);
      window.store.add('transactions', {
        type: 'expense',
        amount: totalAmount,
        category: item.category === 'Kuliah' ? 'Kuliah & Buku' : 'Belanja',
        description: `Beli barang: ${item.name} (${item.qty}x)`,
        date: new Date().toISOString().slice(0, 10),
        payment_method: 'QRIS'
      });
      window.store.update('shopping', id, { is_purchased: true });
      this.showToast(`Berhasil dicatat ke pengeluaran senilai ${formatRupiah(totalAmount)}!`);
    }
  }

  deleteShoppingItem(id) {
    window.store.delete('shopping', id);
    this.showToast('Item belanja dihapus.');
  }

  // =========================================================================
  // 12. DOCUMENTS CRUD
  // =========================================================================
  openDocumentModal() {
    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Simpan Metadata Dokumen</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveDocument(event)">
          <div class="form-group">
            <label class="form-label">Nama Dokumen</label>
            <input type="text" id="m-doc-title" placeholder="Contoh: Kartu BPJS Kesehatan" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-doc-category" class="form-select">
                <option value="Identitas">Identitas</option>
                <option value="Akademik">Akademik</option>
                <option value="Sertifikat">Sertifikat</option>
                <option value="Kontrak">Kontrak / Sewa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nomor Dokumen</label>
              <input type="text" id="m-doc-num" placeholder="00012345678" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Masa Berlaku / Kedaluwarsa</label>
            <input type="text" id="m-doc-expiry" placeholder="Seumur Hidup / 2028-12-31" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Simpan Metadata Dokumen</button>
        </form>
      </div>
    `);
  }

  saveDocument(e) {
    e.preventDefault();
    window.store.add('documents', {
      title: document.getElementById('m-doc-title').value,
      category: document.getElementById('m-doc-category').value,
      doc_number: document.getElementById('m-doc-num').value,
      expiry_date: document.getElementById('m-doc-expiry').value,
      file_name: `${document.getElementById('m-doc-title').value.replace(/\s+/g, '_')}.pdf`,
      file_size: '1.2 MB',
      notes: 'Metadata tersimpan terenkripsi di browser.'
    });
    this.closeModal();
    this.showToast('Dokumen tersimpan di brankas!');
  }

  openEditDocumentModal(id) {
    const d = window.store.get('documents', id);
    if (!d) return;

    this.openModal(`
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Edit Dokumen</h2>
          <button onclick="window.app.closeModal()" class="btn-icon" style="width: 28px; height: 28px;">${Icons.close('w-4 h-4')}</button>
        </div>
        <form onsubmit="window.app.saveEditDocument(event, '${id}')">
          <div class="form-group">
            <label class="form-label">Nama Dokumen</label>
            <input type="text" id="m-doc-title" value="${d.title}" class="form-input" required>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="m-doc-category" class="form-select">
                ${['Identitas', 'Akademik', 'Sertifikat', 'Kontrak', 'Lainnya'].map(c => `<option value="${c}" ${d.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nomor Dokumen</label>
              <input type="text" id="m-doc-num" value="${d.doc_number || ''}" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Masa Berlaku / Kedaluwarsa</label>
            <input type="text" id="m-doc-expiry" value="${d.expiry_date || ''}" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Dokumen</button>
        </form>
      </div>
    `);
  }

  saveEditDocument(e, id) {
    e.preventDefault();
    window.store.update('documents', id, {
      title: document.getElementById('m-doc-title').value,
      category: document.getElementById('m-doc-category').value,
      doc_number: document.getElementById('m-doc-num').value,
      expiry_date: document.getElementById('m-doc-expiry').value
    });
    this.closeModal();
    this.showToast('Dokumen berhasil diperbarui!');
  }

  deleteDocument(id) {
    if (confirm('Hapus dokumen ini dari brankas?')) {
      window.store.delete('documents', id);
      this.showToast('Dokumen dihapus.');
    }
  }

  downloadDocSimulation(fileName) {
    const dummyContent = `MY LIFE SECURE VAULT ARTIFACT\nNama Dokumen: ${fileName}\nTerverifikasi secara lokal di perangkat Anda.`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    this.showToast(`Mengunduh dokumen: ${fileName}`);
  }

  // =========================================================================
  // 13. POMODORO TIMER CONTROLLER
  // =========================================================================
  setPomoMode(mode) {
    this.pomoState.mode = mode;
    this.pomoState.isRunning = false;
    if (this.pomoState.intervalId) clearInterval(this.pomoState.intervalId);

    if (mode === 'focus') this.pomoState.timeLeft = 25 * 60;
    else if (mode === 'short') this.pomoState.timeLeft = 5 * 60;
    else if (mode === 'long') this.pomoState.timeLeft = 15 * 60;

    const startBtn = document.getElementById('pomo-start-btn');
    if (startBtn) startBtn.innerHTML = `${Icons.play('w-4 h-4')} Mulai`;

    const statusLabel = document.getElementById('pomo-status-label');
    if (statusLabel) {
      statusLabel.textContent = mode === 'focus' ? 'Sesi Belajar Aktif' : (mode === 'short' ? 'Istirahat Singkat' : 'Istirahat Panjang');
    }

    this.updatePomoDisplay();
  }

  startPomodoro() {
    const startBtn = document.getElementById('pomo-start-btn');
    if (this.pomoState.isRunning) {
      this.pomoState.isRunning = false;
      clearInterval(this.pomoState.intervalId);
      if (startBtn) startBtn.innerHTML = `${Icons.play('w-4 h-4')} Lanjutkan`;
    } else {
      this.pomoState.isRunning = true;
      if (startBtn) startBtn.innerHTML = `${Icons.pause('w-4 h-4')} Jeda`;
      this.pomoState.intervalId = setInterval(() => {
        if (this.pomoState.timeLeft > 0) {
          this.pomoState.timeLeft--;
          this.updatePomoDisplay();
        } else {
          clearInterval(this.pomoState.intervalId);
          this.pomoState.isRunning = false;
          if (window.soundEngine) window.soundEngine.playPomodoroBell();
          this.showToast('Sesi Pomodoro selesai! Waktunya istirahat sejenak. 🎉');
          
          // Log session
          const prod = window.store.get('productivity') || { today_sessions: 0, total_minutes: 0, history: [] };
          prod.today_sessions = (prod.today_sessions || 0) + 1;
          prod.total_minutes = (prod.total_minutes || 0) + (this.pomoState.mode === 'focus' ? 25 : 5);
          window.store.update('productivity', null, prod);

          this.setPomoMode('short');
        }
      }, 1000);
    }
  }

  resetPomodoro() {
    this.setPomoMode(this.pomoState.mode);
  }

  updatePomoDisplay() {
    const display = document.getElementById('pomo-countdown-display');
    if (!display) return;
    const mins = Math.floor(this.pomoState.timeLeft / 60);
    const secs = this.pomoState.timeLeft % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // =========================================================================
  // 15. PROFILE & SETTINGS
  // =========================================================================
  saveProfile(e) {
    e.preventDefault();
    window.store.update('profile', null, {
      name: document.getElementById('set-profile-name').value,
      nickname: document.getElementById('set-profile-nickname').value,
      campus: document.getElementById('set-profile-campus').value,
      bio: document.getElementById('set-profile-bio').value
    });
    this.showToast('Profil pemilik akun berhasil diperbarui!');
  }

  saveSecurity(e) {
    e.preventDefault();
    window.store.update('settings', null, {
      pin_enabled: document.getElementById('set-pin-enabled').checked,
      master_pin: document.getElementById('set-master-pin').value
    });
    this.showToast('Pengaturan keamanan & PIN berhasil disimpan!');
  }

  saveSupabaseConfig() {
    const url = document.getElementById('set-supabase-url').value;
    const key = document.getElementById('set-supabase-key').value;
    window.store.update('settings', null, {
      supabase_url: url,
      supabase_key: key
    });
    this.showToast('Konfigurasi Supabase disimpan!');
  }

  downloadSupabaseSQL() {
    fetch('supabase/schema.sql')
      .then(res => res.text())
      .then(sql => {
        const blob = new Blob([sql], { type: 'text/sql' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'MY_LIFE_SUPABASE_SCHEMA.sql';
        a.click();
        this.showToast('Skema SQL Supabase berhasil diunduh!');
      })
      .catch(() => this.showToast('Gagal mengunduh file skema SQL.', 'error'));
  }

  exportTransactionsCSV() {
    const tx = window.store.getAll('transactions') || [];
    let csv = 'Tanggal,Jenis,Nominal,Kategori,Deskripsi,Metode\n';
    tx.forEach(t => {
      csv += `"${t.date}","${t.type}","${t.amount}","${t.category}","${(t.description || '').replace(/"/g, '""')}","${t.payment_method || 'Tunai'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `MY_LIFE_TRANSAKSI_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.showToast('Riwayat transaksi berhasil diekspor ke CSV!');
  }

  filterTransactions() {
    const searchVal = (document.getElementById('tx-search-input')?.value || '').toLowerCase();
    const typeVal = document.getElementById('tx-filter-type')?.value || 'all';
    const rows = document.querySelectorAll('#tx-table-body tr');

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const matchesSearch = text.includes(searchVal);
      const isIncome = text.includes('pemasukan');
      const isExpense = text.includes('pengeluaran');

      let matchesType = true;
      if (typeVal === 'income') matchesType = isIncome;
      if (typeVal === 'expense') matchesType = isExpense;

      row.style.display = (matchesSearch && matchesType) ? '' : 'none';
    });
  }

  triggerImportJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (window.store.importJSON(event.target.result)) {
            this.showToast('Cadangan data berhasil dipulihkan!');
            this.render();
          } else {
            this.showToast('File JSON tidak valid atau rusak.', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  confirmResetAllData() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menghapus semua data dan membersihkan sistem? Data akan kembali ke kondisi awal bersih.')) {
      window.store.resetAllData();
      this.showToast('Sistem dibersihkan ke kondisi awal bersih.');
      this.render();
    }
  }
}

window.app = new App();
document.addEventListener('DOMContentLoaded', () => window.app.init());
