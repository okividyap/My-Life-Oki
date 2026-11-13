/* ==========================================================================
   MY LIFE - Unified Offline-First Reactive Data Store (Versi Final 1.0)
   Data Bersih Tanpa Demo & Siap Produksi
   ========================================================================== */

const STORAGE_KEY = 'my_life_app_data_final_v2';

// Hapus secara otomatis semua cache & data demo lawas dari localStorage browser
try {
  ['my_life_app_data_v1', 'my_life_app_data', 'my_life_demo', 'my_life_app_data_final_v1'].forEach(key => {
    localStorage.removeItem(key);
  });
} catch (e) {
  console.warn('Gagal membersihkan cache lama:', e);
}

// Data awal murni bersih tanpa dummy / data demo
const cleanInitialData = {
  profile: {
    name: '',
    nickname: '',
    title: 'Pemilik Akun',
    campus: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: '',
    is_configured: false
  },
  settings: {
    timezone: 'Asia/Makassar', // WITA UTC+8
    theme: 'obsidian-cyber',
    master_pin: '123456',
    pin_enabled: false,
    alarm_sound: 'melodic',
    snooze_minutes: 10,
    push_notifications: false,
    supabase_url: '',
    supabase_key: '',
    last_synced: null
  },
  transactions: [],
  budget: {
    monthly_limit: 0,
    month: new Date().toISOString().slice(0, 7)
  },
  savings: [],
  courses: [],
  tasks: [],
  exams: [],
  calendar_events: [],
  reminders: [],
  meals: [],
  water: {
    target: 2500, // ml
    consumed: 0,
    history: []
  },
  habits: [],
  health: {
    current_weight: 0,
    target_weight: 0,
    height: 0,
    weight_logs: [],
    workouts: []
  },
  notes: [],
  goals: [],
  shopping: [],
  documents: [],
  productivity: {
    today_sessions: 0,
    total_minutes: 0,
    current_mode: 'focus',
    history: []
  }
};

class Store {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Pastikan tidak ada data sisa dari demo
        if (parsed && typeof parsed.profile === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal memuat local storage, menggunakan data awal bersih.', e);
    }
    this.save(cleanInitialData);
    return JSON.parse(JSON.stringify(cleanInitialData));
  }

  save(dataToSave = this.data) {
    try {
      this.data = dataToSave;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch (e) {
      console.error('Gagal menyimpan ke localStorage:', e);
    }
  }

  notify() {
    this.listeners.forEach(fn => {
      try { fn(this.data); } catch (e) { console.error('Listener error:', e); }
    });
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  // Generic CRUD
  getAll(collection) {
    return this.data[collection] || [];
  }

  get(collection, id) {
    const list = this.getAll(collection);
    return Array.isArray(list) ? list.find(item => item.id === id) : this.data[collection];
  }

  add(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      id: `${collection.substring(0, 3)}-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...item
    };
    this.data[collection].unshift(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    if (Array.isArray(this.data[collection])) {
      const idx = this.data[collection].findIndex(item => item.id === id);
      if (idx !== -1) {
        this.data[collection][idx] = { 
          ...this.data[collection][idx], 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        this.save();
        return this.data[collection][idx];
      }
    } else if (typeof this.data[collection] === 'object') {
      this.data[collection] = { ...this.data[collection], ...updates };
      this.save();
      return this.data[collection];
    }
    return null;
  }

  delete(collection, id) {
    if (Array.isArray(this.data[collection])) {
      this.data[collection] = this.data[collection].filter(item => item.id !== id);
      this.save();
      return true;
    }
    return false;
  }

  // Specific helpers
  getStats() {
    const tx = this.data.transactions || [];
    const income = tx.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const expense = tx.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const balance = income - expense;

    const tasks = this.data.tasks || [];
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;

    const habits = this.data.habits || [];
    const habitsCompleted = habits.filter(h => h.completed_today).length;
    const totalHabits = habits.length;

    return {
      balance,
      income,
      expense,
      pendingTasks,
      completedTasks,
      habitsCompleted,
      totalHabits,
      waterConsumed: this.data.water.consumed || 0,
      waterTarget: this.data.water.target || 2500
    };
  }

  addWater(amount) {
    this.data.water.consumed = Math.max(0, (this.data.water.consumed || 0) + amount);
    if (!this.data.water.history) this.data.water.history = [];
    if (amount > 0) {
      const timeStr = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' }).format(new Date()) + ' WITA';
      this.data.water.history.unshift({ id: `w-${Date.now()}`, time: timeStr, amount });
    }
    this.save();
  }

  resetWater() {
    this.data.water.consumed = 0;
    this.data.water.history = [];
    this.save();
  }

  // Muat Jadwal PRD Rekomendasi (Opsional bagi pengguna jika ingin memuat jadwal awal resmi)
  loadPrdStandardSchedules() {
    const prdPresets = [
      { id: 'rem-prd-1', title: 'Bangun Tidur & Ibadah Pagi', time: '06:00', repeat: 'daily', active: true, category: 'routine', sound: 'melodic' },
      { id: 'rem-prd-2', title: 'Sarapan Pagi Sehat', time: '07:00', repeat: 'daily', active: true, category: 'meals', sound: 'melodic' },
      { id: 'rem-prd-3', title: 'Camilan Pagi & Minum Air Putih', time: '09:00', repeat: 'daily', active: true, category: 'meals', sound: 'soft' },
      { id: 'rem-prd-4', title: 'Makan Siang & Istirahat Siang', time: '12:00', repeat: 'daily', active: true, category: 'meals', sound: 'melodic' },
      { id: 'rem-prd-5', title: 'Camilan Sore & Minum Air Putih', time: '15:00', repeat: 'daily', active: true, category: 'meals', sound: 'soft' },
      { id: 'rem-prd-6', title: 'Makan Malam Bergizi', time: '18:00', repeat: 'daily', active: true, category: 'meals', sound: 'melodic' },
      { id: 'rem-prd-7', title: 'Olahraga & Aktivitas Fisik', time: '19:00', repeat: 'workdays', active: true, category: 'health', sound: 'melodic' },
      { id: 'rem-prd-8', title: 'Belajar & Mengerjakan Tugas Kuliah', time: '20:00', repeat: 'workdays', active: true, category: 'academic', sound: 'soft' },
      { id: 'rem-prd-9', title: 'Persiapan Tidur & Matikan Gadget', time: '21:30', repeat: 'daily', active: true, category: 'routine', sound: 'soft' },
      { id: 'rem-prd-10', title: 'Waktu Tidur Teratur 7-8 Jam', time: '22:00', repeat: 'daily', active: true, category: 'routine', sound: 'melodic' }
    ];
    this.data.reminders = prdPresets;
    this.save();
  }

  // Backup & Restore
  exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `MY_LIFE_DATA_FINAL_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.profile) {
        this.data = parsed;
        this.save();
        return true;
      }
    } catch (e) {
      console.error('Format JSON tidak valid:', e);
    }
    return false;
  }

  // Bersihkan total semua data dan kembalikan ke awal
  resetAllData() {
    try {
      localStorage.clear();
    } catch(e){}
    this.data = JSON.parse(JSON.stringify(cleanInitialData));
    this.save();
  }
}

window.store = new Store();
