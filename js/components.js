/* ==========================================================================
   MY LIFE - Comprehensive Component Views (Versi Final 1.0)
   Semua Fitur Edit Aktif & Dukungan Tampilan Bersih Siap Produksi
   ========================================================================== */

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
};

const formatDateIndo = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(d);
};

const renderEmptyState = (title, message, actionText, actionFn, iconName = 'sparkles') => {
  return `
    <div class="glow-card" style="padding: 36px 20px; text-align: center; border-style: dashed; border-width: 1px; border-color: rgba(168, 85, 247, 0.4); margin: 10px 0;">
      <div style="width: 48px; height: 48px; margin: 0 auto 12px; border-radius: 14px; background: rgba(168, 85, 247, 0.15); display: flex; align-items: center; justify-content: center; color: #c084fc;">
        ${Icons[iconName] ? Icons[iconName]('w-6 h-6') : Icons.sparkles('w-6 h-6')}
      </div>
      <h4 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px;">${title}</h4>
      <p style="font-size: 12.5px; color: #94a3b8; max-width: 380px; margin: 0 auto 16px;">${message}</p>
      ${actionText ? `<button onclick="${actionFn}" class="btn-primary" style="padding: 8px 16px; font-size: 13px;">${Icons.plus('w-3.5 h-3.5')} ${actionText}</button>` : ''}
    </div>
  `;
};

const Components = {
  // =========================================================================
  // 1. DASHBOARD
  // =========================================================================
  renderDashboard() {
    const stats = window.store.getStats();
    const profile = window.store.get('profile') || {};
    const tasks = window.store.getAll('tasks').filter(t => t.status !== 'done').slice(0, 3);
    const reminders = window.store.getAll('reminders').filter(r => r.active).slice(0, 4);
    const habits = window.store.getAll('habits').slice(0, 4);
    const meals = window.store.getAll('meals');
    const goals = window.store.getAll('goals').slice(0, 3);

    const now = new Date();
    const hour = parseInt(new Intl.DateTimeFormat('id-ID', { hour: 'numeric', hour12: false, timeZone: 'Asia/Makassar' }).format(now));
    let greeting = 'Selamat Malam';
    if (hour >= 4 && hour < 11) greeting = 'Selamat Pagi';
    else if (hour >= 11 && hour < 15) greeting = 'Selamat Siang';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';

    return `
      <div class="page-container">
        <!-- Hero Banner -->
        <div class="glow-card" style="padding: 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 10px;">
              ${Icons.sparkles('w-3.5 h-3.5')} SISTEM KENDALI HIDUP PRIBADI &bull; VERSI FINAL
            </div>
            <h1 class="gradient-text" style="font-size: 28px; line-height: 1.2; margin-bottom: 6px;">
              ${greeting}, ${profile.nickname || profile.name || 'Pengguna'}!
            </h1>
            <p style="color: #94a3b8; font-size: 14px;">
              ${formatDateIndo(now)} &bull; Waktu Indonesia Tengah (WITA, UTC+8)
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.app.openTransactionModal('expense')" class="btn-primary">
              ${Icons.plus('w-4 h-4')} + Transaksi
            </button>
            <button onclick="window.app.openTaskModal()" class="btn-secondary">
              ${Icons.plus('w-4 h-4')} + Tugas Kuliah
            </button>
            <button onclick="window.app.openReminderModal()" class="btn-secondary">
              ${Icons.bell('w-4 h-4')} + Pengingat
            </button>
          </div>
        </div>

        <!-- 4 Key Stat Cards -->
        <div class="grid-cols-4" style="margin-bottom: 24px;">
          <div class="glow-card stat-card glow-card-interactive" onclick="window.app.navigate('finance')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="stat-label">Total Saldo Keuangan</span>
              <div class="stat-icon stat-icon-purple">${Icons.finance('w-5 h-5')}</div>
            </div>
            <div class="stat-value gradient-text-purple">${formatRupiah(stats.balance)}</div>
            <div style="display: flex; gap: 12px; font-size: 11px; color: #94a3b8;">
              <span style="color: #34d399;">▲ +${formatRupiah(stats.income)}</span>
              <span style="color: #f87171;">▼ -${formatRupiah(stats.expense)}</span>
            </div>
          </div>

          <div class="glow-card stat-card glow-card-interactive" onclick="window.app.navigate('academic')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="stat-label">Tugas Kuliah Aktif</span>
              <div class="stat-icon stat-icon-blue">${Icons.academic('w-5 h-5')}</div>
            </div>
            <div class="stat-value gradient-text-blue">${stats.pendingTasks} <span style="font-size: 14px; font-weight: 500; color: #94a3b8;">Tugas</span></div>
            <div style="font-size: 11.5px; color: #38bdf8;">
              ${stats.completedTasks} tugas selesai tersimpan
            </div>
          </div>

          <div class="glow-card stat-card glow-card-interactive" onclick="window.app.navigate('routines')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="stat-label">Konsistensi Rutinitas</span>
              <div class="stat-icon stat-icon-emerald">${Icons.flame('w-5 h-5')}</div>
            </div>
            <div class="stat-value" style="color: #34d399;">
              ${stats.totalHabits > 0 ? Math.round((stats.habitsCompleted / stats.totalHabits) * 100) : 0}%
            </div>
            <div style="font-size: 11.5px; color: #94a3b8;">
              ${stats.habitsCompleted} dari ${stats.totalHabits} rutinitas hari ini
            </div>
          </div>

          <div class="glow-card stat-card glow-card-interactive" onclick="window.app.navigate('meals')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="stat-label">Konsumsi Air Hari Ini</span>
              <div class="stat-icon stat-icon-amber">${Icons.droplet('w-5 h-5')}</div>
            </div>
            <div class="stat-value" style="color: #38bdf8;">
              ${stats.waterConsumed} <span style="font-size: 14px; color: #64748b;">/ ${stats.waterTarget} ml</span>
            </div>
            <div style="font-size: 11.5px; color: #38bdf8;">
              Klik untuk kelola &amp; tambah air
            </div>
          </div>
        </div>

        <!-- 2 Columns Layout -->
        <div class="grid-cols-3">
          <!-- Col 1 & 2: Urgent Tasks & Next Schedules -->
          <div style="grid-column: span 2; display: flex; flex-direction: column; gap: 24px;">
            <!-- Urgent Academic Tasks -->
            <div class="glow-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: #c084fc;">${Icons.academic('w-5 h-5')}</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Tugas Kuliah Terdekat</h3>
                </div>
                <button onclick="window.app.navigate('academic')" class="btn-secondary" style="padding: 6px 12px; font-size: 12px;">
                  Buka Kuliah
                </button>
              </div>

              ${tasks.length === 0 ? 
                renderEmptyState('Belum Ada Tugas Aktif', 'Semua tugas telah diselesaikan atau belum ada yang dicatat.', '+ Tambah Tugas', "window.app.openTaskModal()", 'academic') : 
                `<div style="display: flex; flex-direction: column; gap: 12px;">
                  ${tasks.map(t => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md); gap: 12px;">
                      <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                        <input type="checkbox" onchange="window.app.toggleTaskStatus('${t.id}')" style="width: 18px; height: 18px; accent-color: #a855f7; cursor: pointer;">
                        <div>
                          <div style="font-size: 13.5px; font-weight: 600; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${t.title}
                          </div>
                          <div style="font-size: 11px; color: #94a3b8;">
                            ${t.course_name || 'Umum'} &bull; Deadline: <span style="color: #fbbf24;">${t.deadline_date || '-'} (${t.deadline_time || ''} WITA)</span>
                          </div>
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="window.app.openEditTaskModal('${t.id}')" class="btn-icon" style="width: 30px; height: 30px;" title="Edit Tugas">
                          ${Icons.edit('w-3.5 h-3.5')}
                        </button>
                        <span class="glow-pill" style="font-size: 10.5px; border-color: ${t.priority === 'high' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}; color: ${t.priority === 'high' ? '#fda4af' : '#7dd3fc'};">
                          ${t.priority === 'high' ? 'Tinggi' : 'Sedang'}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>`
              }
            </div>

            <!-- Today's Meal Plan & Hydration Quick View -->
            <div class="glow-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: #38bdf8;">${Icons.meals('w-5 h-5')}</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Jadwal Makan Hari Ini</h3>
                </div>
                <button onclick="window.app.openMealModal()" class="btn-secondary" style="padding: 6px 12px; font-size: 12px;">
                  + Catat Menu
                </button>
              </div>

              ${meals.length === 0 ? 
                renderEmptyState('Belum Ada Menu Makan Tercatat', 'Mulai rencanakan sarapan, makan siang, atau makan malam Anda.', '+ Catat Menu', "window.app.openMealModal()", 'meals') :
                `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                  ${meals.map(m => `
                    <div style="padding: 14px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md);">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #c084fc; text-transform: uppercase;">${m.meal_time}</span>
                        <div style="display: flex; gap: 4px;">
                          <button onclick="window.app.openEditMealModal('${m.id}')" class="btn-icon" style="width: 24px; height: 24px;" title="Edit Menu">${Icons.edit('w-3 h-3')}</button>
                        </div>
                      </div>
                      <div style="font-size: 12.5px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">${m.title}</div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 10.5px; color: #64748b;">${m.calories || 0} kcal</span>
                        <span style="font-size: 10.5px; font-weight: 600; color: ${m.consumed ? '#34d399' : '#fbbf24'};">
                          ${m.consumed ? '✓ Sudah Makan' : '⏳ Belum'}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>`
              }
            </div>
          </div>

          <!-- Col 3: Reminders, Habits, and Goals -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Upcoming Reminders -->
            <div class="glow-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #c084fc;">${Icons.bell('w-4 h-4')}</span>
                  <h3 style="font-size: 15px; font-weight: 700; color: #fff;">Pengingat Aktif</h3>
                </div>
                <button onclick="window.app.openReminderModal()" class="btn-icon" style="width: 28px; height: 28px;" title="Tambah Pengingat">
                  ${Icons.plus('w-3.5 h-3.5')}
                </button>
              </div>

              ${reminders.length === 0 ?
                renderEmptyState('Belum Ada Pengingat', 'Pasang alarm untuk jadwal harian Anda.', '+ Pasang Pengingat', "window.app.openReminderModal()", 'reminders') :
                `<div style="display: flex; flex-direction: column; gap: 10px;">
                  ${reminders.map(r => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(14, 15, 26, 0.5); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.04);">
                      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                        <span style="font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; color: #38bdf8;">${r.time}</span>
                        <span style="font-size: 12.5px; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</span>
                      </div>
                      <button onclick="window.app.openEditReminderModal('${r.id}')" class="btn-icon" style="width: 26px; height: 26px;" title="Edit Alarm">
                        ${Icons.edit('w-3 h-3')}
                      </button>
                    </div>
                  `).join('')}
                </div>`
              }
            </div>

            <!-- Today's Routine Checklist -->
            <div class="glow-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #34d399;">${Icons.flame('w-4 h-4')}</span>
                  <h3 style="font-size: 15px; font-weight: 700; color: #fff;">Rutinitas Hari Ini</h3>
                </div>
                <button onclick="window.app.openHabitModal()" class="btn-icon" style="width: 28px; height: 28px;" title="Tambah Rutinitas">
                  ${Icons.plus('w-3.5 h-3.5')}
                </button>
              </div>

              ${habits.length === 0 ?
                renderEmptyState('Belum Ada Rutinitas', 'Bangun konsistensi dengan kebiasaan baik.', '+ Rutinitas', "window.app.openHabitModal()", 'routines') :
                `<div style="display: flex; flex-direction: column; gap: 10px;">
                  ${habits.map(h => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(14, 15, 26, 0.5); border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.04);">
                      <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; min-width: 0;">
                        <input type="checkbox" ${h.completed_today ? 'checked' : ''} onchange="window.app.toggleHabit('${h.id}')" style="width: 17px; height: 17px; accent-color: #10b981;">
                        <span style="font-size: 12.5px; color: ${h.completed_today ? '#94a3b8; text-decoration: line-through;' : '#e2e8f0;'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${h.title}</span>
                      </label>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 10px; color: #fbbf24; font-weight: 700;">🔥 ${h.streak || 0}h</span>
                        <button onclick="window.app.openEditHabitModal('${h.id}')" class="btn-icon" style="width: 24px; height: 24px;" title="Edit Rutinitas">${Icons.edit('w-3 h-3')}</button>
                      </div>
                    </div>
                  `).join('')}
                </div>`
              }
            </div>

            <!-- Target & Goals Preview -->
            <div class="glow-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #c084fc;">${Icons.goals('w-4 h-4')}</span>
                  <h3 style="font-size: 15px; font-weight: 700; color: #fff;">Target &amp; Impian</h3>
                </div>
                <button onclick="window.app.openGoalModal()" class="btn-icon" style="width: 28px; height: 28px;" title="Tambah Target">
                  ${Icons.plus('w-3.5 h-3.5')}
                </button>
              </div>

              ${goals.length === 0 ?
                renderEmptyState('Belum Ada Target', 'Tuliskan impian atau target pribadi Anda.', '+ Target Baru', "window.app.openGoalModal()", 'goals') :
                `<div style="display: flex; flex-direction: column; gap: 12px;">
                  ${goals.map(g => `
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 4px;">
                        <span style="font-weight: 600; color: #e2e8f0;">${g.title}</span>
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span style="color: #c084fc; font-weight: 700;">${g.progress}%</span>
                          <button onclick="window.app.openEditGoalModal('${g.id}')" class="btn-icon" style="width: 20px; height: 20px;" title="Edit Target">${Icons.edit('w-2.5 h-2.5')}</button>
                        </div>
                      </div>
                      <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden;">
                        <div style="width: ${g.progress}%; height: 100%; background: linear-gradient(90deg, #a855f7, #38bdf8); border-radius: 9999px;"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 2. KEUANGAN PRIBADI (FINANCE) - FULL CRUD WITH EDIT
  // =========================================================================
  renderFinance() {
    const tx = window.store.getAll('transactions') || [];
    const stats = window.store.getStats();
    const budget = window.store.get('budget') || { monthly_limit: 0 };
    const savings = window.store.getAll('savings') || [];
    const budgetPercent = budget.monthly_limit > 0 ? Math.min(100, Math.round((stats.expense / budget.monthly_limit) * 100)) : 0;

    return `
      <div class="page-container">
        <!-- Header & Action Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL KEUANGAN PRIBADI</div>
            <h1 class="gradient-text" style="font-size: 26px;">Manajemen Finansial &amp; Anggaran</h1>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.app.openBudgetModal()" class="btn-secondary">
              ${Icons.edit('w-4 h-4')} Atur Anggaran
            </button>
            <button onclick="window.app.exportTransactionsCSV()" class="btn-secondary">
              ${Icons.download('w-4 h-4')} Ekspor CSV
            </button>
            <button onclick="window.app.openTransactionModal('income')" class="btn-secondary" style="border-color: rgba(52, 211, 153, 0.4); color: #34d399;">
              ${Icons.arrowDownLeft('w-4 h-4')} + Pemasukan
            </button>
            <button onclick="window.app.openTransactionModal('expense')" class="btn-primary">
              ${Icons.arrowUpRight('w-4 h-4')} + Pengeluaran
            </button>
          </div>
        </div>

        <!-- 4 Stat Summary Cards -->
        <div class="grid-cols-4" style="margin-bottom: 24px;">
          <div class="glow-card stat-card">
            <span class="stat-label">Saldo Bersih Saat Ini</span>
            <div class="stat-value gradient-text-purple">${formatRupiah(stats.balance)}</div>
            <span style="font-size: 11px; color: #94a3b8;">Akumulasi pemasukan dikurangi pengeluaran</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Total Pemasukan</span>
            <div class="stat-value" style="color: #34d399;">+${formatRupiah(stats.income)}</div>
            <span style="font-size: 11px; color: #34d399;">Semua sumber dana masuk</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Total Pengeluaran</span>
            <div class="stat-value" style="color: #f87171;">-${formatRupiah(stats.expense)}</div>
            <span style="font-size: 11px; color: #f87171;">Biaya &amp; kebutuhan hidup</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Batas Anggaran Bulanan</span>
            <div class="stat-value" style="color: #38bdf8;">${formatRupiah(budget.monthly_limit)}</div>
            <span style="font-size: 11px; color: ${budgetPercent > 85 ? '#f87171' : '#38bdf8'};">
              ${budget.monthly_limit > 0 ? `Terpakai ${budgetPercent}% (${formatRupiah(budget.monthly_limit - stats.expense)} tersisa)` : 'Belum ditentukan'}
            </span>
          </div>
        </div>

        <!-- Budget Visual Meter -->
        <div class="glow-card" style="padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; font-weight: 700; color: #ffffff;">Status Anggaran Bulanan</span>
              <button onclick="window.app.openBudgetModal()" class="btn-icon" style="width: 24px; height: 24px;" title="Ubah Anggaran">${Icons.edit('w-3 h-3')}</button>
            </div>
            <span style="font-size: 13px; font-weight: 700; color: ${budgetPercent > 80 ? '#f87171' : '#38bdf8'};">${budgetPercent}% Digunakan</span>
          </div>
          <div style="width: 100%; height: 10px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
            <div style="width: ${budgetPercent}%; height: 100%; background: ${budgetPercent > 80 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #a855f7, #38bdf8)'}; border-radius: 9999px; transition: width 0.5s ease;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
            <span>Terpakai: ${formatRupiah(stats.expense)}</span>
            <span>Batas Maksimal: ${formatRupiah(budget.monthly_limit)}</span>
          </div>
        </div>

        <!-- Tabungan & Target Finansial -->
        <div class="glow-card" style="padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #c084fc;">${Icons.goals('w-5 h-5')}</span>
              <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Pos Tabungan &amp; Target Impian</h3>
            </div>
            <button onclick="window.app.openSavingsModal()" class="btn-secondary" style="font-size: 12px; padding: 6px 12px;">
              + Pos Tabungan
            </button>
          </div>

          ${savings.length === 0 ?
            renderEmptyState('Belum Ada Pos Tabungan', 'Buat pos target tabungan (contoh: Dana Darurat, Laptop, dll).', '+ Buat Pos Tabungan', "window.app.openSavingsModal()", 'finance') :
            `<div class="grid-cols-3">
              ${savings.map(s => {
                const pct = s.target_amount > 0 ? Math.min(100, Math.round((s.current_amount / s.target_amount) * 100)) : 0;
                return `
                  <div style="padding: 16px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">${s.icon || '💰'}</span>
                        <span style="font-weight: 700; font-size: 14px; color: #ffffff;">${s.name}</span>
                      </div>
                      <span class="glow-pill" style="font-size: 10px;">${pct}%</span>
                    </div>
                    <div style="font-size: 16px; font-weight: 800; color: #c084fc; margin-bottom: 4px;">
                      ${formatRupiah(s.current_amount)}
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">
                      Target: ${formatRupiah(s.target_amount)} &bull; Deadline: ${s.deadline || '-'}
                    </div>
                    <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; margin-bottom: 12px;">
                      <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #a855f7, #38bdf8);"></div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                      <button onclick="window.app.addSavingsDeposit('${s.id}')" class="btn-secondary" style="flex: 1; padding: 4px 8px; font-size: 11px;">
                        + Nabung
                      </button>
                      <button onclick="window.app.openEditSavingsModal('${s.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Tabungan">
                        ${Icons.edit('w-3.5 h-3.5')}
                      </button>
                      <button onclick="window.app.deleteSavings('${s.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                        ${Icons.trash('w-3.5 h-3.5')}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>`
          }
        </div>

        <!-- Tabel Riwayat Transaksi Lengkap (CRUD: Edit & Hapus) -->
        <div class="glow-card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Riwayat Transaksi Keuangan</h3>
            <div style="display: flex; gap: 10px;">
              <input type="text" id="tx-search-input" placeholder="Cari transaksi..." oninput="window.app.filterTransactions()" class="form-input" style="width: 200px; padding: 6px 12px; font-size: 12.5px;">
              <select id="tx-filter-type" onchange="window.app.filterTransactions()" class="form-select" style="width: 140px; padding: 6px 10px; font-size: 12px;">
                <option value="all">Semua Jenis</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
          </div>

          ${tx.length === 0 ?
            renderEmptyState('Belum Ada Transaksi Tercatat', 'Mulai mencatat pemasukan atau pengeluaran pertama Anda.', '+ Catat Transaksi', "window.app.openTransactionModal('expense')", 'finance') :
            `<div class="table-wrapper">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Deskripsi</th>
                    <th>Kategori</th>
                    <th>Metode</th>
                    <th>Jenis</th>
                    <th>Nominal</th>
                    <th style="text-align: right;">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tx-table-body">
                  ${tx.map(t => `
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 12px;">${t.date}</td>
                      <td style="font-weight: 600;">${t.description}</td>
                      <td><span class="glow-pill" style="font-size: 10px;">${t.category}</span></td>
                      <td style="color: #94a3b8; font-size: 12px;">${t.payment_method || 'Tunai'}</td>
                      <td>
                        <span style="font-weight: 700; font-size: 11px; color: ${t.type === 'income' ? '#34d399' : '#f87171'};">
                          ${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td style="font-family: var(--font-mono); font-weight: 700; color: ${t.type === 'income' ? '#34d399' : '#f87171'};">
                        ${t.type === 'income' ? '+' : '-'}${formatRupiah(t.amount)}
                      </td>
                      <td style="text-align: right;">
                        <div style="display: inline-flex; gap: 6px;">
                          <button onclick="window.app.openEditTransactionModal('${t.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Transaksi">
                            ${Icons.edit('w-3.5 h-3.5')}
                          </button>
                          <button onclick="window.app.deleteTransaction('${t.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                            ${Icons.trash('w-3.5 h-3.5')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`
          }
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 3. MANAJEMEN KULIAH (ACADEMIC) - FULL CRUD WITH EDIT
  // =========================================================================
  renderAcademic() {
    const courses = window.store.getAll('courses') || [];
    const tasks = window.store.getAll('tasks') || [];
    const exams = window.store.getAll('exams') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL MANAJEMEN KULIAH</div>
            <h1 class="gradient-text" style="font-size: 26px;">Tugas, Jadwal Kelas &amp; Ujian</h1>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.app.openExamModal()" class="btn-secondary">
              ${Icons.plus('w-4 h-4')} + Jadwal Ujian
            </button>
            <button onclick="window.app.openCourseModal()" class="btn-secondary">
              ${Icons.plus('w-4 h-4')} + Mata Kuliah
            </button>
            <button onclick="window.app.openTaskModal()" class="btn-primary">
              ${Icons.plus('w-4 h-4')} + Tugas Baru
            </button>
          </div>
        </div>

        <!-- 3 Tabs: Tugas Kuliah, Mata Kuliah & Jadwal, Jadwal Ujian -->
        <div class="tabs-nav">
          <button class="tab-btn active" onclick="window.app.switchAcademicTab('tasks', this)">Daftar Tugas &amp; Deadline (${tasks.length})</button>
          <button class="tab-btn" onclick="window.app.switchAcademicTab('courses', this)">Mata Kuliah &amp; Kelas (${courses.length})</button>
          <button class="tab-btn" onclick="window.app.switchAcademicTab('exams', this)">Jadwal Ujian UTS/UAS (${exams.length})</button>
        </div>

        <!-- Tab 1: Tasks Content -->
        <div id="academic-tab-tasks">
          ${tasks.length === 0 ?
            renderEmptyState('Belum Ada Tugas Kuliah', 'Catat tugas, deadline jam WITA, dan prioritas pengerjaan.', '+ Tambah Tugas', "window.app.openTaskModal()", 'academic') :
            `<div style="display: flex; flex-direction: column; gap: 14px;">
              ${tasks.map(t => {
                const isDone = t.status === 'done';
                return `
                  <div class="glow-card" style="padding: 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; opacity: ${isDone ? '0.7' : '1'};">
                    <div style="display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 260px;">
                      <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.app.toggleTaskStatus('${t.id}')" style="width: 20px; height: 20px; accent-color: #a855f7; margin-top: 3px; cursor: pointer;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                          <span style="font-weight: 700; font-size: 15px; color: #fff; text-decoration: ${isDone ? 'line-through' : 'none'};">
                            ${t.title}
                          </span>
                          <span class="glow-pill" style="font-size: 10px; border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
                            ${t.course_name || 'Mata Kuliah'}
                          </span>
                          <span class="glow-pill" style="font-size: 10px; border-color: ${t.priority === 'high' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}; color: ${t.priority === 'high' ? '#fda4af' : '#7dd3fc'};">
                            ${t.priority === 'high' ? 'Prioritas Tinggi' : (t.priority === 'low' ? 'Rendah' : 'Sedang')}
                          </span>
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">
                          Tenggat: <span style="color: #fbbf24; font-weight: 600;">${t.deadline_date} pukul ${t.deadline_time} WITA</span>
                        </div>
                        ${t.notes ? `<div style="font-size: 12px; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 6px; border-left: 2px solid #a855f7;">${t.notes}</div>` : ''}
                        ${t.link ? `<div style="margin-top: 6px;"><a href="${t.link}" target="_blank" style="color: #38bdf8; font-size: 11.5px; text-decoration: underline;">🔗 Tautan Tugas / Repositori</a></div>` : ''}
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 8px;">
                      <select onchange="window.app.changeTaskStatus('${t.id}', this.value)" class="form-select" style="width: 140px; padding: 6px 8px; font-size: 11px;">
                        <option value="todo" ${t.status === 'todo' ? 'selected' : ''}>Belum Selesai</option>
                        <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>Sedang Dikerjakan</option>
                        <option value="done" ${t.status === 'done' ? 'selected' : ''}>Selesai ✓</option>
                      </select>
                      <button onclick="window.app.openEditTaskModal('${t.id}')" class="btn-secondary" style="padding: 6px 10px;" title="Edit Tugas">
                        ${Icons.edit('w-3.5 h-3.5')}
                      </button>
                      <button onclick="window.app.deleteTask('${t.id}')" class="btn-danger" style="padding: 6px 10px;" title="Hapus">
                        ${Icons.trash('w-3.5 h-3.5')}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>`
          }
        </div>

        <!-- Tab 2: Courses Content -->
        <div id="academic-tab-courses" style="display: none;">
          ${courses.length === 0 ?
            renderEmptyState('Belum Ada Mata Kuliah', 'Daftarkan mata kuliah semester ini, dosen, SKS, dan jadwal ruang.', '+ Mata Kuliah', "window.app.openCourseModal()", 'academic') :
            `<div class="grid-cols-2">
              ${courses.map(c => `
                <div class="glow-card" style="padding: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span class="glow-pill" style="font-family: var(--font-mono); font-size: 11px;">${c.code} &bull; ${c.sks} SKS</span>
                    <div style="display: flex; gap: 6px;">
                      <button onclick="window.app.openEditCourseModal('${c.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Mata Kuliah">
                        ${Icons.edit('w-3 h-3')}
                      </button>
                      <button onclick="window.app.deleteCourse('${c.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                        ${Icons.trash('w-3 h-3')}
                      </button>
                    </div>
                  </div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">${c.name}</h3>
                  <div style="font-size: 12.5px; color: #94a3b8; margin-bottom: 4px;">Dosen: <strong style="color: #e2e8f0;">${c.lecturer || '-'}</strong></div>
                  <div style="font-size: 12px; color: #c084fc; margin-bottom: 2px;">🗓️ ${c.day || '-'}, ${c.time || '-'}</div>
                  <div style="font-size: 12px; color: #38bdf8;">📍 ${c.room || '-'}</div>
                </div>
              `).join('')}
            </div>`
          }
        </div>

        <!-- Tab 3: Exams Content -->
        <div id="academic-tab-exams" style="display: none;">
          ${exams.length === 0 ?
            renderEmptyState('Belum Ada Jadwal Ujian', 'Tambahkan jadwal UTS / UAS untuk memantau waktu belajar.', '+ Jadwal Ujian', "window.app.openExamModal()", 'calendar') :
            `<div class="grid-cols-2">
              ${exams.map(e => `
                <div class="glow-card" style="padding: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div class="glow-pill" style="border-color: rgba(244, 63, 94, 0.4); color: #fda4af;">${e.type}</div>
                    <div style="display: flex; gap: 6px;">
                      <button onclick="window.app.openEditExamModal('${e.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Ujian">
                        ${Icons.edit('w-3 h-3')}
                      </button>
                      <button onclick="window.app.deleteExam('${e.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                        ${Icons.trash('w-3 h-3')}
                      </button>
                    </div>
                  </div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">${e.course}</h3>
                  <div style="font-size: 13px; color: #fbbf24; font-weight: 600; margin-bottom: 4px;">🗓️ Tanggal: ${e.date} (${e.time})</div>
                  <div style="font-size: 12px; color: #94a3b8;">📍 Ruang: ${e.room || '-'}</div>
                  ${e.notes ? `<div style="font-size: 11.5px; color: #cbd5e1; margin-top: 6px;">${e.notes}</div>` : ''}
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 4. KALENDER (CALENDAR) - FULL CRUD WITH EDIT
  // =========================================================================
  renderCalendar() {
    const events = window.store.getAll('calendar_events') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL KALENDER &amp; AGENDA</div>
            <h1 class="gradient-text" style="font-size: 26px;">Kalender Terpadu (WITA)</h1>
          </div>
          <button onclick="window.app.openCalendarEventModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Agenda Baru
          </button>
        </div>

        <!-- Month Navigation Header -->
        <div class="glow-card" style="padding: 18px 24px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 18px; font-weight: 700; color: #fff;">Kalender Aktivitas</h2>
          <span class="glow-pill" style="font-family: var(--font-mono);">Zona Waktu: Asia/Makassar (WITA)</span>
        </div>

        <!-- Agenda List with Full Edit & Delete -->
        <div class="glow-card" style="padding: 24px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Daftar Acara &amp; Agenda Terjadwal</h3>
          
          ${events.length === 0 ?
            renderEmptyState('Belum Ada Agenda Terjadwal', 'Tambahkan acara, rapat, atau jadwal kegiatan Anda.', '+ Agenda Baru', "window.app.openCalendarEventModal()", 'calendar') :
            `<div style="display: flex; flex-direction: column; gap: 12px;">
              ${events.map(ev => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md); flex-wrap: wrap; gap: 10px;">
                  <div>
                    <div style="font-weight: 700; font-size: 14.5px; color: #fff; margin-bottom: 4px;">${ev.title}</div>
                    <div style="font-size: 12px; color: #94a3b8;">
                      🗓️ ${ev.start_date} ${ev.time ? `(${ev.time})` : ''} &bull; 📍 ${ev.location || 'Online / Fleksibel'}
                    </div>
                    ${ev.notes ? `<div style="font-size: 11.5px; color: #cbd5e1; margin-top: 4px;">${ev.notes}</div>` : ''}
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.openEditCalendarEventModal('${ev.id}')" class="btn-secondary" style="padding: 6px 10px;" title="Edit Agenda">
                      ${Icons.edit('w-3.5 h-3.5')}
                    </button>
                    <button onclick="window.app.deleteCalendarEvent('${ev.id}')" class="btn-danger" style="padding: 6px 10px;" title="Hapus">
                      ${Icons.trash('w-3.5 h-3.5')}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 5. ALARM & PENGINGAT (REMINDERS) - FULL CRUD WITH EDIT
  // =========================================================================
  renderReminders() {
    const reminders = window.store.getAll('reminders') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL ALARM &amp; PENGINGAT</div>
            <h1 class="gradient-text" style="font-size: 26px;">Jadwal Alarm Harian (Asia/Makassar WITA)</h1>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.soundEngine.playAlarmChime()" class="btn-secondary">
              ${Icons.bell('w-4 h-4')} Tes Nada Alarm
            </button>
            <button onclick="window.app.loadPrdPresetsConfirm()" class="btn-secondary" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
              ${Icons.sparkles('w-4 h-4')} Muat 10 Jadwal PRD
            </button>
            <button onclick="window.app.openReminderModal()" class="btn-primary">
              ${Icons.plus('w-4 h-4')} + Tambah Pengingat
            </button>
          </div>
        </div>

        <!-- Live Clock & Status Card -->
        <div class="glow-card" style="padding: 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(56, 189, 248, 0.08));">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #a855f7, #38bdf8); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 0 25px rgba(168, 85, 247, 0.4);">
              ⏰
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8;">Waktu Server &amp; Pengawas Alarm Aktif</div>
              <div id="live-wita-clock" style="font-family: var(--font-mono); font-size: 32px; font-weight: 800; color: #ffffff;">--:--:-- WITA</div>
            </div>
          </div>
          <div style="font-size: 13px; color: #94a3b8; max-width: 380px;">
            Pengawas sistem memeriksa pengingat setiap detik dan membunyikan nada alarm melodi serta notifikasi browser.
          </div>
        </div>

        <!-- Reminders List -->
        ${reminders.length === 0 ?
          renderEmptyState('Belum Ada Alarm / Pengingat', 'Pasang pengingat jadwal hidup teratur atau gunakan tombol "Muat 10 Jadwal PRD" di atas.', '+ Tambah Pengingat', "window.app.openReminderModal()", 'reminders') :
          `<div style="display: flex; flex-direction: column; gap: 14px;">
            ${reminders.map(r => `
              <div class="glow-card" style="padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 18px;">
                  <div style="font-family: var(--font-mono); font-size: 26px; font-weight: 800; color: ${r.active ? '#38bdf8' : '#64748b'}; min-width: 85px;">
                    ${r.time}
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: 15px; color: ${r.active ? '#ffffff' : '#94a3b8'};">
                      ${r.title}
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                      <span class="glow-pill" style="font-size: 10px;">${r.repeat === 'daily' ? 'Setiap Hari' : (r.repeat === 'workdays' ? 'Hari Kerja' : 'Sekali')}</span>
                      <span style="font-size: 11px; color: #94a3b8;">Kategori: ${r.category}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <span style="font-size: 12px; font-weight: 600; color: ${r.active ? '#34d399' : '#64748b'};">${r.active ? 'Aktif' : 'Mati'}</span>
                    <input type="checkbox" ${r.active ? 'checked' : ''} onchange="window.app.toggleReminder('${r.id}')" style="width: 20px; height: 20px; accent-color: #a855f7; cursor: pointer;">
                  </label>
                  <button onclick="window.app.openEditReminderModal('${r.id}')" class="btn-secondary" style="padding: 6px 10px;" title="Edit Alarm">
                    ${Icons.edit('w-3.5 h-3.5')}
                  </button>
                  <button onclick="window.app.deleteReminder('${r.id}')" class="btn-danger" style="padding: 6px 10px;" title="Hapus">
                    ${Icons.trash('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 6. JADWAL MAKAN & MINUM (MEALS & HYDRATION) - FULL CRUD WITH EDIT
  // =========================================================================
  renderMeals() {
    const meals = window.store.getAll('meals') || [];
    const water = window.store.get('water') || { target: 2500, consumed: 0, history: [] };
    const waterPercent = water.target > 0 ? Math.min(100, Math.round((water.consumed / water.target) * 100)) : 0;

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL POLA MAKAN &amp; MINUM</div>
            <h1 class="gradient-text" style="font-size: 26px;">Jadwal Makan &amp; Pelacak Hidrasi Air</h1>
          </div>
          <button onclick="window.app.openMealModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Catat Menu Makan
          </button>
        </div>

        <!-- Water Tracker Card with Interactive Container -->
        <div class="glow-card" style="padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #38bdf8;">${Icons.droplet('w-6 h-6')}</span>
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Target Hidrasi Air Harian</h3>
                <p style="font-size: 12px; color: #94a3b8;">Menjaga stamina, fokus belajar, dan metabolisme tubuh.</p>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.store.addWater(250)" class="btn-primary" style="padding: 8px 14px; font-size: 12.5px;">+250 ml (Gelas)</button>
              <button onclick="window.store.addWater(500)" class="btn-primary" style="padding: 8px 14px; font-size: 12.5px;">+500 ml (Botol)</button>
              <button onclick="window.store.resetWater()" class="btn-secondary" style="padding: 8px 14px; font-size: 12.5px;">Reset</button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 240px;">
              <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-bottom: 8px;">
                <span style="color: #38bdf8;">${water.consumed} ml tercapai</span>
                <span style="color: #94a3b8;">Target: ${water.target} ml (${waterPercent}%)</span>
              </div>
              <div style="width: 100%; height: 16px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; position: relative;">
                <div style="width: ${waterPercent}%; height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 9999px; transition: width 0.4s ease;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scheduled Meals Grid -->
        <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">Menu Makanan Hari Ini</h3>
        
        ${meals.length === 0 ?
          renderEmptyState('Belum Ada Menu Makan', 'Catat sarapan, makan siang, atau makan malam Anda hari ini.', '+ Catat Menu', "window.app.openMealModal()", 'meals') :
          `<div class="grid-cols-2" style="margin-bottom: 24px;">
            ${meals.map(m => `
              <div class="glow-card" style="padding: 22px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <span class="glow-pill" style="font-size: 11px; margin-bottom: 6px;">${m.meal_time} ${m.scheduled_time ? `&bull; ${m.scheduled_time}` : ''}</span>
                    <h4 style="font-size: 16px; font-weight: 700; color: #fff;">${m.title}</h4>
                  </div>
                  <span style="font-weight: 700; font-size: 12px; color: #38bdf8;">${m.calories || 0} kcal</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" ${m.consumed ? 'checked' : ''} onchange="window.app.toggleMealConsumed('${m.id}')" style="width: 18px; height: 18px; accent-color: #10b981;">
                    <span style="font-size: 12.5px; font-weight: 600; color: ${m.consumed ? '#34d399' : '#fbbf24'};">
                      ${m.consumed ? 'Sudah Dikonsumsi ✓' : 'Belum Makan'}
                    </span>
                  </label>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.openEditMealModal('${m.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Menu">
                      ${Icons.edit('w-3.5 h-3.5')}
                    </button>
                    <button onclick="window.app.deleteMeal('${m.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                      ${Icons.trash('w-3.5 h-3.5')}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 7. RUTINITAS HARIAN & HABIT TRACKER - FULL CRUD WITH EDIT
  // =========================================================================
  renderRoutines() {
    const habits = window.store.getAll('habits') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL RUTINITAS &amp; KEBIASAAN</div>
            <h1 class="gradient-text" style="font-size: 26px;">Pelacak Kebiasaan Harian (Habit Tracker)</h1>
          </div>
          <button onclick="window.app.openHabitModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Rutinitas Baru
          </button>
        </div>

        ${habits.length === 0 ?
          renderEmptyState('Belum Ada Rutinitas', 'Mulai bangun kebiasaan baik dengan menambahkan rutinitas harian Anda.', '+ Buat Rutinitas', "window.app.openHabitModal()", 'routines') :
          `<div style="display: flex; flex-direction: column; gap: 14px;">
            ${habits.map(h => `
              <div class="glow-card" style="padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px; min-width: 240px;">
                  <input type="checkbox" ${h.completed_today ? 'checked' : ''} onchange="window.app.toggleHabit('${h.id}')" style="width: 22px; height: 22px; accent-color: #10b981; cursor: pointer;">
                  <div>
                    <h3 style="font-size: 15px; font-weight: 700; color: #fff; text-decoration: ${h.completed_today ? 'line-through' : 'none'};">
                      ${h.title}
                    </h3>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                      <span style="font-size: 12px; color: #fbbf24; font-weight: 700;">🔥 Streak: ${h.streak || 0} Hari Beruntun</span>
                      <span style="font-size: 11px; color: #94a3b8;">&bull; Target: ${(h.target_days || []).join(', ') || 'Setiap Hari'}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button onclick="window.app.openEditHabitModal('${h.id}')" class="btn-secondary" style="padding: 6px 10px;" title="Edit Rutinitas">
                    ${Icons.edit('w-3.5 h-3.5')}
                  </button>
                  <button onclick="window.app.deleteHabit('${h.id}')" class="btn-danger" style="padding: 6px 10px;" title="Hapus">
                    ${Icons.trash('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 8. KESEHATAN & OLAHRAGA (HEALTH) - FULL CRUD WITH EDIT
  // =========================================================================
  renderHealth() {
    const health = window.store.get('health') || { current_weight: 0, target_weight: 0, height: 0, workouts: [] };
    const bmi = (health.height > 0 && health.current_weight > 0) ? (health.current_weight / Math.pow(health.height / 100, 2)).toFixed(1) : '-';

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL KESEHATAN &amp; OLAHRAGA</div>
            <h1 class="gradient-text" style="font-size: 26px;">Catatan Fisik &amp; Aktivitas Olahraga</h1>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.app.openEditHealthStatsModal()" class="btn-secondary">
              ${Icons.edit('w-4 h-4')} Atur Berat &amp; Tinggi
            </button>
            <button onclick="window.app.openWorkoutModal()" class="btn-primary">
              ${Icons.plus('w-4 h-4')} + Catat Olahraga
            </button>
          </div>
        </div>

        <div class="grid-cols-3" style="margin-bottom: 24px;">
          <div class="glow-card stat-card">
            <span class="stat-label">Berat Badan Terkini</span>
            <div class="stat-value gradient-text-purple">${health.current_weight || 0} <span style="font-size: 16px; color: #94a3b8;">kg</span></div>
            <span style="font-size: 11px; color: #34d399;">Target Ideal: ${health.target_weight || 0} kg</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Indeks Massa Tubuh (BMI)</span>
            <div class="stat-value" style="color: #38bdf8;">${bmi}</div>
            <span style="font-size: 11px; color: #38bdf8;">Tinggi Badan: ${health.height || 0} cm</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Total Sesi Workout</span>
            <div class="stat-value" style="color: #fbbf24;">${(health.workouts || []).length} <span style="font-size: 14px; color: #94a3b8;">Sesi</span></div>
            <span style="font-size: 11px; color: #fbbf24;">Riwayat olahraga tercatat</span>
          </div>
        </div>

        <!-- Riwayat Olahraga with Edit & Delete -->
        <div class="glow-card" style="padding: 24px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Riwayat Aktivitas Workout</h3>
          
          ${(health.workouts || []).length === 0 ?
            renderEmptyState('Belum Ada Riwayat Olahraga', 'Catat sesi gym, jogging, renang, atau workout mandiri Anda.', '+ Catat Olahraga', "window.app.openWorkoutModal()", 'health') :
            `<div style="display: flex; flex-direction: column; gap: 12px;">
              ${health.workouts.map(wo => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md); flex-wrap: wrap; gap: 10px;">
                  <div>
                    <div style="font-weight: 700; font-size: 14.5px; color: #fff;">${wo.type}</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                      🗓️ ${wo.date} &bull; ⏱️ Durasi: <strong style="color: #38bdf8;">${wo.duration} Menit</strong> &bull; 🔥 Kalori: <strong style="color: #f87171;">${wo.calories || 0} kcal</strong>
                    </div>
                    ${wo.notes ? `<div style="font-size: 11.5px; color: #cbd5e1; margin-top: 4px;">${wo.notes}</div>` : ''}
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.openEditWorkoutModal('${wo.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Workout">
                      ${Icons.edit('w-3.5 h-3.5')}
                    </button>
                    <button onclick="window.app.deleteWorkout('${wo.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                      ${Icons.trash('w-3.5 h-3.5')}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 9. CATATAN PRIBADI (NOTES) - FULL CRUD WITH EDIT
  // =========================================================================
  renderNotes() {
    const notes = window.store.getAll('notes') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL CATATAN PRIBADI</div>
            <h1 class="gradient-text" style="font-size: 26px;">Jurnal Harian, Ide &amp; Catatan Kuliah</h1>
          </div>
          <button onclick="window.app.openNoteModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Catatan Baru
          </button>
        </div>

        ${notes.length === 0 ?
          renderEmptyState('Belum Ada Catatan', 'Mulai simpan ide penting, catatan kuliah, atau jurnal refleksi harian.', '+ Catatan Baru', "window.app.openNoteModal()", 'notes') :
          `<div class="grid-cols-2">
            ${notes.map(n => `
              <div class="glow-card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span class="glow-pill" style="font-size: 10px;">${n.category}</span>
                    ${n.pinned ? '<span style="font-size: 14px;">📌</span>' : ''}
                  </div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">${n.title}</h3>
                  <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; margin-bottom: 16px;">
                    ${n.content}
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: #64748b;">
                  <span>Diperbarui: ${n.updated_at || '-'}</span>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.openEditNoteModal('${n.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Catatan">
                      ${Icons.edit('w-3 h-3')}
                    </button>
                    <button onclick="window.app.deleteNote('${n.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                      ${Icons.trash('w-3 h-3')}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 10. TARGET & IMPIAN (GOALS) - FULL CRUD WITH EDIT
  // =========================================================================
  renderGoals() {
    const goals = window.store.getAll('goals') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL TARGET &amp; IMPIAN</div>
            <h1 class="gradient-text" style="font-size: 26px;">Pencapaian, Milestone &amp; Dream Board</h1>
          </div>
          <button onclick="window.app.openGoalModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Target Baru
          </button>
        </div>

        ${goals.length === 0 ?
          renderEmptyState('Belum Ada Target', 'Tuliskan impian jangka pendek, jangka panjang, atau target kelulusan Anda.', '+ Tetapkan Target', "window.app.openGoalModal()", 'goals') :
          `<div class="grid-cols-2">
            ${goals.map(g => `
              <div class="glow-card" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <span class="glow-pill" style="font-size: 10.5px;">${g.category}</span>
                  <span style="font-size: 14px; font-weight: 800; color: #c084fc;">${g.progress}%</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">${g.title}</h3>
                <p style="font-size: 12.5px; color: #94a3b8; margin-bottom: 14px;">"${g.motivation || 'Menuju versi diri terbaik.'}"</p>
                
                <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; margin-bottom: 14px;">
                  <div style="width: ${g.progress}%; height: 100%; background: linear-gradient(90deg, #a855f7, #38bdf8); border-radius: 9999px;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; color: #fbbf24;">Target: ${g.target_date || '-'}</span>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.increaseGoalProgress('${g.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Tambah +10%">
                      +10%
                    </button>
                    <button onclick="window.app.openEditGoalModal('${g.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Target">
                      ${Icons.edit('w-3 h-3')}
                    </button>
                    <button onclick="window.app.deleteGoal('${g.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                      ${Icons.trash('w-3 h-3')}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 11. DAFTAR BELANJA (SHOPPING) - FULL CRUD WITH EDIT
  // =========================================================================
  renderShopping() {
    const items = window.store.getAll('shopping') || [];
    const totalEst = items.reduce((acc, it) => acc + (it.estimated_price * (it.qty || 1)), 0);

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL DAFTAR BELANJA</div>
            <h1 class="gradient-text" style="font-size: 26px;">Kebutuhan &amp; Estimasi Belanja</h1>
          </div>
          <button onclick="window.app.openShoppingModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Barang Belanja
          </button>
        </div>

        <div class="glow-card" style="padding: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Total Estimasi Belanja</span>
            <div class="stat-value gradient-text-purple" style="font-size: 24px;">${formatRupiah(totalEst)}</div>
          </div>
          <span style="font-size: 12px; color: #38bdf8;">Item yang sudah dibeli dapat dipindahkan langsung ke catatan pengeluaran keuangan!</span>
        </div>

        <div class="glow-card" style="padding: 24px;">
          ${items.length === 0 ?
            renderEmptyState('Daftar Belanja Masih Kosong', 'Tambahkan barang kebutuhan kuliah, belanja bulanan, atau perlengkapan pribadi.', '+ Barang Belanja', "window.app.openShoppingModal()", 'shopping') :
            `<div style="display: flex; flex-direction: column; gap: 12px;">
              ${items.map(it => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(14, 15, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius-md); flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" ${it.is_purchased ? 'checked' : ''} onchange="window.app.toggleShoppingPurchased('${it.id}')" style="width: 18px; height: 18px; accent-color: #a855f7; cursor: pointer;">
                    <div>
                      <div style="font-weight: 600; font-size: 14px; color: #fff; text-decoration: ${it.is_purchased ? 'line-through' : 'none'};">
                        ${it.name} (${it.qty}x)
                      </div>
                      <div style="font-size: 11px; color: #94a3b8;">
                        Kategori: ${it.category} &bull; Estimasi: <span style="color: #c084fc;">${formatRupiah(it.estimated_price * (it.qty || 1))}</span>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 8px;">
                    <button onclick="window.app.transferShoppingToFinance('${it.id}')" class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" title="Catat Langsung ke Pengeluaran">
                      Ke Finansial
                    </button>
                    <button onclick="window.app.openEditShoppingModal('${it.id}')" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Edit Barang">
                      ${Icons.edit('w-3.5 h-3.5')}
                    </button>
                    <button onclick="window.app.deleteShoppingItem('${it.id}')" class="btn-danger" style="padding: 4px 8px; font-size: 11px;" title="Hapus">
                      ${Icons.trash('w-3.5 h-3.5')}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 12. DOKUMEN PRIBADI (DOCUMENTS) - FULL CRUD WITH EDIT
  // =========================================================================
  renderDocuments() {
    const docs = window.store.getAll('documents') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL DOKUMEN PRIBADI</div>
            <h1 class="gradient-text" style="font-size: 26px;">Brankas Metadata &amp; Arsip Dokumen</h1>
          </div>
          <button onclick="window.app.openDocumentModal()" class="btn-primary">
            ${Icons.plus('w-4 h-4')} + Simpan Dokumen
          </button>
        </div>

        ${docs.length === 0 ?
          renderEmptyState('Brankas Dokumen Masih Kosong', 'Amankan metadata dokumen resmi (KTM, KTP, SIM, Sertifikat, dll).', '+ Simpan Dokumen', "window.app.openDocumentModal()", 'documents') :
          `<div class="grid-cols-2">
            ${docs.map(d => `
              <div class="glow-card" style="padding: 22px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <span class="glow-pill" style="font-size: 10.5px;">${d.category}</span>
                  <span style="font-size: 11px; color: #94a3b8;">${d.file_size || '1.0 MB'}</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">${d.title}</h3>
                <div style="font-size: 12.5px; color: #94a3b8; font-family: var(--font-mono); margin-bottom: 4px;">
                  No: <strong style="color: #38bdf8;">${d.doc_number || '-'}</strong>
                </div>
                <div style="font-size: 11.5px; color: #fbbf24; margin-bottom: 10px;">Masa Berlaku: ${d.expiry_date || 'Permanen'}</div>
                ${d.notes ? `<div style="font-size: 12px; color: #cbd5e1; margin-bottom: 14px;">${d.notes}</div>` : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                  <button onclick="window.app.downloadDocSimulation('${d.file_name || d.title}')" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">
                    ${Icons.download('w-3.5 h-3.5')} Unduh
                  </button>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.app.openEditDocumentModal('${d.id}')" class="btn-secondary" style="font-size: 11px; padding: 4px 8px;" title="Edit Dokumen">
                      ${Icons.edit('w-3 h-3')}
                    </button>
                    <button onclick="window.app.deleteDocument('${d.id}')" class="btn-danger" style="font-size: 11px; padding: 4px 8px;" title="Hapus">
                      ${Icons.trash('w-3 h-3')}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  },

  // =========================================================================
  // 13. PRODUKTIVITAS (POMODORO & FOCUS)
  // =========================================================================
  renderProductivity() {
    const prod = window.store.get('productivity') || { today_sessions: 0, total_minutes: 0, history: [] };

    return `
      <div class="page-container">
        <div style="margin-bottom: 24px;">
          <div class="glow-pill" style="margin-bottom: 6px;">MODUL PRODUKTIVITAS</div>
          <h1 class="gradient-text" style="font-size: 26px;">Pomodoro Focus Timer &amp; Ambiens Suara</h1>
        </div>

        <div class="grid-cols-3">
          <!-- Circular Timer Widget -->
          <div class="glow-card" style="grid-column: span 2; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
              <button id="pomo-mode-focus" onclick="window.app.setPomoMode('focus')" class="btn-primary" style="padding: 6px 14px; font-size: 12px;">Fokus (25m)</button>
              <button id="pomo-mode-short" onclick="window.app.setPomoMode('short')" class="btn-secondary" style="padding: 6px 14px; font-size: 12px;">Istirahat Pendek (5m)</button>
              <button id="pomo-mode-long" onclick="window.app.setPomoMode('long')" class="btn-secondary" style="padding: 6px 14px; font-size: 12px;">Istirahat Panjang (15m)</button>
            </div>

            <!-- Big Glowing Countdown Display -->
            <div style="position: relative; width: 220px; height: 220px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(10, 11, 20, 0.9) 70%); border: 3px solid transparent; border-image: linear-gradient(135deg, #c084fc, #38bdf8) 1; box-shadow: 0 0 35px rgba(168, 85, 247, 0.35); margin-bottom: 28px;">
              <div id="pomo-countdown-display" style="font-family: var(--font-mono); font-size: 48px; font-weight: 800; color: #ffffff;">25:00</div>
              <span id="pomo-status-label" style="font-size: 12px; color: #38bdf8; font-weight: 600; text-transform: uppercase;">Siap Memulai</span>
            </div>

            <!-- Controls -->
            <div style="display: flex; gap: 12px;">
              <button id="pomo-start-btn" onclick="window.app.startPomodoro()" class="btn-primary" style="padding: 12px 28px; font-size: 15px;">
                ${Icons.play('w-4 h-4')} Mulai
              </button>
              <button onclick="window.app.resetPomodoro()" class="btn-secondary" style="padding: 12px 20px;">
                ${Icons.rotateCcw('w-4 h-4')} Reset
              </button>
            </div>
          </div>

          <!-- Ambient Audio & Session Stats -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="glow-card" style="padding: 24px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 12px;">Suara Ambiens Fokus</h3>
              <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Sintesis audio peredam bising bawaan browser.</p>
              
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="window.soundEngine.startAmbient('rain', 0.25)" class="btn-secondary" style="justify-content: flex-start;">
                  🌧️ Hujan Lembut (Rain Ambience)
                </button>
                <button onclick="window.soundEngine.startAmbient('white', 0.15)" class="btn-secondary" style="justify-content: flex-start;">
                  🌊 Pink Noise Peredam Gangguan
                </button>
                <button onclick="window.soundEngine.stopAmbient()" class="btn-danger" style="text-align: center;">
                  Matikan Suara Ambiens
                </button>
              </div>
            </div>

            <div class="glow-card" style="padding: 24px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 12px;">Sesi Hari Ini</h3>
              <div style="font-size: 28px; font-weight: 800; color: #c084fc; margin-bottom: 4px;">
                ${prod.total_minutes || 0} Menit
              </div>
              <p style="font-size: 12px; color: #94a3b8;">${prod.today_sessions || 0} kali sesi fokus pomodoro telah diselesaikan hari ini.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 14. LAPORAN & ANALITIK (REPORTS)
  // =========================================================================
  renderReports() {
    const stats = window.store.getStats();
    const tasks = window.store.getAll('tasks') || [];
    const habits = window.store.getAll('habits') || [];

    return `
      <div class="page-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="glow-pill" style="margin-bottom: 6px;">MODUL LAPORAN &amp; ANALITIK</div>
            <h1 class="gradient-text" style="font-size: 26px;">Ringkasan &amp; Rekapitulasi Data</h1>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="window.print()" class="btn-secondary">
              Cetak / PDF
            </button>
            <button onclick="window.store.exportJSON()" class="btn-primary">
              ${Icons.download('w-4 h-4')} Ekspor Cadangan Lengkap (.json)
            </button>
          </div>
        </div>

        <div class="grid-cols-3" style="margin-bottom: 24px;">
          <div class="glow-card stat-card">
            <span class="stat-label">Rasio Keuangan Bersih</span>
            <div class="stat-value" style="color: #34d399;">${formatRupiah(stats.balance)}</div>
            <span style="font-size: 11px; color: #94a3b8;">Pemasukan ${formatRupiah(stats.income)} vs Pengeluaran ${formatRupiah(stats.expense)}</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Tingkat Kelulusan Tugas</span>
            <div class="stat-value" style="color: #38bdf8;">
              ${tasks.length > 0 ? Math.round((stats.completedTasks / tasks.length) * 100) : 0}%
            </div>
            <span style="font-size: 11px; color: #38bdf8;">${stats.completedTasks} dari ${tasks.length} tugas selesai tepat waktu</span>
          </div>

          <div class="glow-card stat-card">
            <span class="stat-label">Konsistensi Rutinitas</span>
            <div class="stat-value" style="color: #c084fc;">
              ${habits.length > 0 ? Math.round((stats.habitsCompleted / habits.length) * 100) : 0}%
            </div>
            <span style="font-size: 11px; color: #c084fc;">${stats.habitsCompleted} dari ${habits.length} kebiasaan aktif terlaksana</span>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 15. PENGATURAN & SISTEM (SETTINGS)
  // =========================================================================
  renderSettings() {
    const profile = window.store.get('profile') || {};
    const settings = window.store.get('settings') || {};
    const notifPermission = 'Notification' in window ? Notification.permission : 'not_supported';

    return `
      <div class="page-container">
        <div style="margin-bottom: 24px;">
          <div class="glow-pill" style="margin-bottom: 6px;">MODUL PENGATURAN &amp; KEAMANAN</div>
          <h1 class="gradient-text" style="font-size: 26px;">Preferensi, Profil &amp; Sinkronisasi Supabase</h1>
        </div>

        <div class="grid-cols-2">
          <!-- Profile Settings -->
          <div class="glow-card" style="padding: 24px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Profil Pemilik Akun</h3>
            <form onsubmit="window.app.saveProfile(event)">
              <div class="form-group">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" id="set-profile-name" class="form-input" value="${profile.name || ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Nama Panggilan</label>
                <input type="text" id="set-profile-nickname" class="form-input" value="${profile.nickname || ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Perguruan Tinggi / Kampus / Pekerjaan</label>
                <input type="text" id="set-profile-campus" class="form-input" value="${profile.campus || ''}" placeholder="Contoh: Universitas Hasanuddin">
              </div>
              <div class="form-group">
                <label class="form-label">Bio / Visi Hidup</label>
                <textarea id="set-profile-bio" class="form-textarea" rows="2">${profile.bio || ''}</textarea>
              </div>
              <button type="submit" class="btn-primary" style="width: 100%;">Simpan Perubahan Profil</button>
            </form>
          </div>

          <!-- Security & PIN Lock -->
          <div class="glow-card" style="padding: 24px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Keamanan &amp; Kunci Master PIN</h3>
            <form onsubmit="window.app.saveSecurity(event)">
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="set-pin-enabled" ${settings.pin_enabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #a855f7;">
                  <span style="font-size: 13.5px; font-weight: 600; color: #e2e8f0;">Aktifkan Layar Kunci Master PIN</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label">Master PIN (6 Digit)</label>
                <input type="password" id="set-master-pin" class="form-input" maxlength="6" value="${settings.master_pin || '123456'}">
                <span style="font-size: 11px; color: #94a3b8;">Default Master PIN: <strong>123456</strong></span>
              </div>
              <button type="submit" class="btn-primary" style="width: 100%;">Perbarui Kunci Keamanan</button>
            </form>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
              <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">Izin Notifikasi Browser (Web Push)</h4>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12.5px; color: #94a3b8;">Status Izin: <strong style="color: ${notifPermission === 'granted' ? '#34d399' : '#fbbf24'};">${notifPermission}</strong></span>
                <button onclick="window.alarmWatcher.requestPermission()" class="btn-secondary" style="font-size: 11.5px; padding: 6px 12px;">
                  Aktifkan Izin
                </button>
              </div>
            </div>
          </div>

          <!-- Supabase Cloud Sync -->
          <div class="glow-card" style="padding: 24px; grid-column: span 2;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Integrasi Database Supabase PostgreSQL</h3>
                <p style="font-size: 12px; color: #94a3b8;">Sinkronisasikan data pribadi Anda ke cloud secara aman menggunakan Row Level Security (RLS).</p>
              </div>
              <button onclick="window.app.downloadSupabaseSQL()" class="btn-secondary" style="font-size: 12px;">
                ${Icons.download('w-3.5 h-3.5')} Unduh Skema SQL Supabase
              </button>
            </div>

            <div class="grid-cols-2" style="margin-bottom: 12px;">
              <div class="form-group">
                <label class="form-label">Supabase Project URL</label>
                <input type="text" id="set-supabase-url" class="form-input" placeholder="https://your-project.supabase.co" value="${settings.supabase_url || (window.MY_LIFE_CONFIG && window.MY_LIFE_CONFIG.SUPABASE_URL) || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Supabase Anon Public Key</label>
                <input type="text" id="set-supabase-key" class="form-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..." value="${settings.supabase_key || (window.MY_LIFE_CONFIG && window.MY_LIFE_CONFIG.SUPABASE_ANON_KEY) || ''}">
              </div>
            </div>
            <p style="font-size: 12px; color: #a855f7; margin-bottom: 16px; display: flex; align-items: center; gap: 6px;">
              ${Icons.sparkles('w-3.5 h-3.5')}
              <span>Tips: Kredensial ini juga dapat diisi langsung di file <strong>config.js</strong> di root folder proyek VS Code.</span>
            </p>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button onclick="window.app.saveSupabaseConfig()" class="btn-primary">
                Simpan &amp; Uji Koneksi Cloud
              </button>
            </div>
          </div>

          <!-- Cadangan & Reset -->
          <div class="glow-card" style="padding: 24px; grid-column: span 2; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h3 style="font-size: 15px; font-weight: 700; color: #fff;">Manajemen Cadangan &amp; Pemulihan Data</h3>
              <p style="font-size: 12px; color: #94a3b8;">Data Anda tersimpan di penyimpanan offline browser ini.</p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button onclick="window.store.exportJSON()" class="btn-secondary">
                ${Icons.download('w-4 h-4')} Unduh Cadangan JSON
              </button>
              <button onclick="window.app.triggerImportJSON()" class="btn-secondary">
                ${Icons.upload('w-4 h-4')} Pulihkan dari File
              </button>
              <button onclick="window.app.confirmResetAllData()" class="btn-danger">
                Hapus &amp; Reset Semua Data
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.Components = Components;
