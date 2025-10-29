//  SETTINGS.JS
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("themeToggle");
  const soundToggle = document.getElementById("soundToggle");
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const languageSelect = document.getElementById("languageSelect");
  const resetDataBtn = document.getElementById("resetDataBtn");
  const resetModal = document.getElementById("resetModal");
  const cancelReset = document.getElementById("cancelReset");
  const confirmReset = document.getElementById("confirmReset");

  // Load Saved Settings
  const settings = JSON.parse(localStorage.getItem("userSettings")) || {
    theme: "dark",
    sound: true,
    fontSize: "text-base",
    language: "en",
  };

  // 🌓 Apply Saved Theme
  applyTheme(settings.theme);
  themeToggle.textContent = settings.theme === "dark" ? "🌙 Dark" : "☀️ Light";

  // 🔊 Apply Sound
  soundToggle.textContent = settings.sound ? "🔊 On" : "🔇 Off";

  // 🔠 Apply Font Size
  document.body.classList.add(settings.fontSize);
  fontSizeSelect.value = settings.fontSize;

  // 🌐 Apply Language
  languageSelect.value = settings.language;

  // -------------------------------
  // 🎨 THEME TOGGLE
  themeToggle.addEventListener("click", () => {
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    applyTheme(settings.theme);
    themeToggle.textContent = settings.theme === "dark" ? "🌙 Dark" : "☀️ Light";
    saveSettings();
  });

  function applyTheme(mode) {
    if (mode === "light") {
      document.body.classList.add("bg-white", "text-black");
      document.body.classList.remove("bg-gray-900", "text-white");
    } else {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-black");
    }
  }

  // 🔊 SOUND TOGGLE
  soundToggle.addEventListener("click", () => {
    settings.sound = !settings.sound;
    soundToggle.textContent = settings.sound ? "🔊 On" : "🔇 Off";
    saveSettings();
  });

  // 🔠 FONT SIZE SELECT
  fontSizeSelect.addEventListener("change", (e) => {
    document.body.classList.remove("text-sm", "text-base", "text-lg");
    document.body.classList.add(e.target.value);
    settings.fontSize = e.target.value;
    saveSettings();
  });

  // 🌐 LANGUAGE SELECT
  languageSelect.addEventListener("change", (e) => {
    settings.language = e.target.value;
    saveSettings();
  });

  // ♻️ RESET MODAL
  resetDataBtn.addEventListener("click", () => resetModal.classList.remove("hidden"));
  cancelReset.addEventListener("click", () => resetModal.classList.add("hidden"));

  confirmReset.addEventListener("click", () => {
    localStorage.clear();
    resetModal.classList.add("hidden");
    alert("All data has been reset!");
    window.location.reload();
  });

  // 💾 SAVE SETTINGS
  function saveSettings() {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }
});
