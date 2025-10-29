// Settings.js
    const themeToggle = document.getElementById('themeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const resetDataBtn = document.getElementById('resetDataBtn');
    const resetModal = document.getElementById('resetModal');
    const cancelReset = document.getElementById('cancelReset');
    const confirmReset = document.getElementById('confirmReset');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('bg-white');
      document.body.classList.toggle('text-black');
      const isDark = themeToggle.textContent === 'Dark';
      themeToggle.textContent = isDark ? 'Light' : 'Dark';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('bg-white', 'text-black');
      themeToggle.textContent = 'Light';
    }

    // Sound Toggle
    soundToggle.addEventListener('click', () => {
      const isOn = soundToggle.textContent === 'On';
      soundToggle.textContent = isOn ? 'Off' : 'On';
      localStorage.setItem('sound', isOn ? 'off' : 'on');
    });

    // Font Size
    fontSizeSelect.addEventListener('change', (e) => {
      document.body.classList.remove('text-sm', 'text-base', 'text-lg');
      document.body.classList.add(e.target.value);
      localStorage.setItem('fontSize', e.target.value);
    });

    // Load saved font size
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
      document.body.classList.add(savedSize);
      fontSizeSelect.value = savedSize;
    }

    // Reset Modal
    resetDataBtn.addEventListener('click', () => resetModal.classList.remove('hidden'));
    cancelReset.addEventListener('click', () => resetModal.classList.add('hidden'));
    confirmReset.addEventListener('click', () => {
      localStorage.clear();
      resetModal.classList.add('hidden');
      alert('All data has been reset!');
    });
