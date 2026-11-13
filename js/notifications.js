/* ==========================================================================
   MY LIFE - Alarm Watcher & Web Push/Notification Service
   Timezone: Asia/Makassar (WITA, UTC+8)
   ========================================================================== */

class AlarmWatcher {
  constructor() {
    this.triggeredToday = new Set();
    this.timerId = null;
    this.lastCheckedMinute = null;
  }

  start() {
    if (this.timerId) clearInterval(this.timerId);
    this.check();
    this.timerId = setInterval(() => this.check(), 2500);
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
  }

  getCurrentWITATime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return formatter.format(now).replace('.', ':');
  }

  check() {
    const currentWITA = this.getCurrentWITATime();
    if (this.lastCheckedMinute === currentWITA) return; // avoid duplicate check within same minute

    const reminders = window.store.getAll('reminders') || [];
    reminders.forEach(rem => {
      if (!rem.active) return;

      const triggerKey = `${rem.id}_${currentWITA}`;
      if (rem.time === currentWITA && !this.triggeredToday.has(triggerKey)) {
        this.triggeredToday.add(triggerKey);
        this.fireAlarm(rem);
      }
    });

    this.lastCheckedMinute = currentWITA;
  }

  fireAlarm(reminder) {
    console.log('[ALARM TRIGGERED]', reminder.title, 'at', reminder.time);

    // 1. Play sound
    if (window.soundEngine) {
      window.soundEngine.playAlarmChime();
    }

    // 2. Trigger native browser notification if granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ MY LIFE: ${reminder.title}`, {
          body: `Waktu WITA: ${reminder.time} | Jadwal hidup teratur Anda`,
          icon: 'assets/icons/icon-192.png',
          badge: 'assets/icons/icon-192.png',
          vibrate: [200, 100, 200, 100, 300]
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }

    // 3. Show in-app interactive alarm popup
    this.showInAppAlarmModal(reminder);
  }

  showInAppAlarmModal(reminder) {
    const existing = document.getElementById('in-app-alarm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'in-app-alarm-modal';
    modal.className = 'modal-overlay';
    modal.style.zIndex = '999';

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 440px; text-align: center; border-image: linear-gradient(135deg, #c084fc, #38bdf8) 1; box-shadow: 0 0 50px rgba(168, 85, 247, 0.5);">
        <div style="width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #a855f7, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); animation: pulse 1.5s infinite;">
          ⏰
        </div>
        <div class="glow-pill" style="margin-bottom: 12px;">WAKTU WITA: ${reminder.time}</div>
        <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">${reminder.title}</h2>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 24px;">Pengingat aktif dari sistem MY LIFE Anda.</p>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="alarm-dismiss-btn" class="btn-primary" style="flex: 1; padding: 12px;">
            ${Icons.check('w-4 h-4')} Selesai &amp; Matikan
          </button>
          <button id="alarm-snooze-btn" class="btn-secondary" style="flex: 1; padding: 12px;">
            ${Icons.clock('w-4 h-4')} Tunda 10 Mnt
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('alarm-dismiss-btn').onclick = () => {
      modal.remove();
      if (window.soundEngine) window.soundEngine.playSuccessSound();
      window.app.showToast('Pengingat diselesaikan!');
    };

    document.getElementById('alarm-snooze-btn').onclick = () => {
      modal.remove();
      window.app.showToast('Pengingat ditunda 10 menit.');
    };
  }

  requestPermission() {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung Web Notifications.');
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        window.app.showToast('Izin Notifikasi Web berhasil diaktifkan! 🎉');
        new Notification('MY LIFE Aktif', {
          body: 'Notifikasi push & pengingat jadwal Anda siap diterima di perangkat ini.',
          icon: 'assets/icons/icon-192.png'
        });
      } else {
        window.app.showToast('Izin notifikasi ditolak oleh browser.', 'error');
      }
      if (window.app.currentView === 'settings') {
        window.app.render();
      }
    });
  }
}

window.alarmWatcher = new AlarmWatcher();
