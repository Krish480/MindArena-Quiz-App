// progress.js
document.addEventListener("DOMContentLoaded", async () => {
  let data = JSON.parse(localStorage.getItem("userProgress"));

  // Agar localStorage empty hai to default data fetch kar
  if (!data) {
    try {
      const res = await fetch("data/defaultProgress.json");
      data = await res.json();
      localStorage.setItem("userProgress", JSON.stringify(data));
    } catch (err) {
      console.error("Default progress file missing:", err);
      data = {
        xp: 0,
        level: 1,
        weekly_activity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
        categories: [],
        achievements: []
      };
    }
  }

  renderProgress(data);
});

// Function: Update Progress UI
function renderProgress(data) {
  // 🧩 XP Update
  const xpValue = document.getElementById("xpValue");
  const xpBar = document.getElementById("xpBar");
  const levelText = document.getElementById("levelText");

  if (xpValue && xpBar && levelText) {
    xpValue.textContent = data.xp;
    const progressPercent = Math.min((data.xp % 2000) / 20, 100);
    xpBar.style.width = "0%";

    // smooth animation for XP bar
    setTimeout(() => {
      xpBar.style.width = `${progressPercent}%`;
    }, 200);

    levelText.textContent = `Level ${data.level} — Keep going!`;
  }

  // 📊 Weekly Activity Chart
  const weekContainer = document.getElementById("weeklyActivity");
  if (weekContainer) {
    weekContainer.innerHTML = "";
    for (const [day, percent] of Object.entries(data.weekly_activity)) {
      const bar = document.createElement("div");
      bar.className = "flex flex-col items-center";
      bar.innerHTML = `
        <div class="w-6 sm:w-8 h-20 sm:h-24 bg-cyan-500/30 rounded-lg relative overflow-hidden">
          <div class="absolute bottom-0 bg-cyan-400 w-full rounded-lg transition-all duration-700 ease-out" 
               style="height: ${percent}%;"></div>
        </div>
        <span class="text-xs sm:text-sm text-gray-400 mt-1">${day}</span>
      `;
      weekContainer.appendChild(bar);
    }
  }

  // 📚 Category Performance
  const categoryContainer = document.getElementById("categoryPerformance");
  if (categoryContainer) {
    categoryContainer.innerHTML = "";
    data.categories.forEach(cat => {
      const div = document.createElement("div");
      div.className = "bg-gray-900/60 border border-cyan-400/20 rounded-2xl p-5 hover:bg-cyan-400/10 transition";
      div.innerHTML = `
        <h3 class="font-semibold text-cyan-400 mb-2">${cat.name}</h3>
        <div class="h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
          <div class="h-2 bg-cyan-400 rounded-full transition-all duration-700 ease-out" 
               style="width: ${cat.accuracy}%"></div>
        </div>
        <p class="text-sm text-gray-400">${cat.accuracy}% Accuracy</p>
      `;
      categoryContainer.appendChild(div);
    });
  }

  // 🏅 Achievements
  const achievementList = document.getElementById("achievementList");
  if (achievementList) {
    achievementList.innerHTML = "";
    if (data.achievements.length > 0) {
      data.achievements.forEach(a => {
        const badge = document.createElement("div");
        badge.className =
          "px-5 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 font-medium";
        badge.textContent = a;
        achievementList.appendChild(badge);
      });
    } else {
      achievementList.innerHTML = `<p class="text-gray-400 text-sm">No achievements unlocked yet. Keep playing!</p>`;
    }
  }
}


// Fade effect on scroll
        const fadeSections = document.querySelectorAll('.fade-section');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animate-fadeIn');
            });
        }, { threshold: 0.1 });

        fadeSections.forEach(section => observer.observe(section));
   