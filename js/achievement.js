// ✅ achievements.js (Final Version + Progress Bars)
document.addEventListener("DOMContentLoaded", async () => {
  // 🧩 Load default achievements from JSON
  let defaultData;
  try {
    const res = await fetch("/data/achievementsData.json");
    defaultData = await res.json();
  } catch (err) {
    console.error("Error loading achievementsData.json:", err);
    return;
  }

  // 🏆 Get existing achievements (if any)
  let userData = JSON.parse(localStorage.getItem("userAchievements")) || defaultData;

  // 🆕 Merge new achievements from recent quiz
  const recentAch = JSON.parse(localStorage.getItem("newAchievements")) || [];
  if (recentAch.length > 0) {
    recentAch.forEach(newA => {
      const alreadyEarned = userData.earned.some(a => a.name === newA.name);
      if (!alreadyEarned) {
        const lockedIndex = userData.locked.findIndex(a => a.name === newA.name);
        if (lockedIndex !== -1) userData.locked.splice(lockedIndex, 1);
        userData.earned.push(newA);
      }
    });
    localStorage.setItem("userAchievements", JSON.stringify(userData));
    localStorage.removeItem("newAchievements");
  }

  // 🧠 Sync with userProgress (XP & Achievements)
  let progress = JSON.parse(localStorage.getItem("userProgress")) || {
    xp: 0,
    level: 1,
    weekly_activity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
    categories: [],
    achievements: []
  };
  progress.achievements = userData.earned.map(a => a.name);
  localStorage.setItem("userProgress", JSON.stringify(progress));

  // 🔒 Auto-update locked list based on default file
  const allAchievementNames = defaultData.earned.concat(defaultData.locked).map(a => a.name);
  const earnedNames = userData.earned.map(a => a.name);
  userData.locked = allAchievementNames
    .filter(name => !earnedNames.includes(name))
    .map(name => {
      const match = defaultData.locked.find(a => a.name === name) || defaultData.earned.find(a => a.name === name);
      return match || { name, desc: "Hidden Achievement", icon: "fa-lock", color: "text-gray-500" };
    });

  // 🧮 Render achievements in UI
  renderAchievements(userData);
});


// 🎯 Helper: Get current progress (0–100)
function getAchievementProgress(name) {
  const progressData = JSON.parse(localStorage.getItem("achievementProgress")) || {};
  return progressData[name] || 0;
}


//  🎨 Render Achievements on Page
function renderAchievements(data) {
  const earnedContainer = document.getElementById("earnedAchievements");
  const lockedContainer = document.getElementById("lockedAchievements");
  const earnedCount = document.getElementById("earnedCount");
  const milestoneBar = document.getElementById("milestoneBar");
  const milestoneText = document.getElementById("milestoneText");

  earnedContainer.innerHTML = "";
  lockedContainer.innerHTML = "";

  // 🏅 Earned Achievements
  if (data.earned.length > 0) {
    data.earned.forEach(a => {
      const div = document.createElement("div");
      div.className =
        "bg-gradient-to-br from-cyan-900/30 to-gray-900/50 border border-cyan-400/30 rounded-2xl p-4 hover:scale-105 transition shadow-lg";
      div.innerHTML = `
        <i class="fa-solid ${a.icon} text-3xl ${a.color} mb-3"></i>
        <h3 class="text-cyan-400 font-semibold">${a.name}</h3>
        <p class="text-xs text-gray-400 mt-1">${a.desc}</p>
      `;
      earnedContainer.appendChild(div);
    });
  } else {
    earnedContainer.innerHTML = `<p class="text-gray-400 text-sm col-span-full">No achievements yet. Start your journey!</p>`;
  }

  // 🔒 Locked Achievements (with progress bar)
  if (data.locked.length > 0) {
    data.locked.forEach(a => {
      const progress = getAchievementProgress(a.name);
      const div = document.createElement("div");
      div.className =
        "bg-gray-900/40 border border-gray-700 rounded-2xl p-4 opacity-70 hover:scale-105 transition";
      div.innerHTML = `
        <i class="fa-solid ${a.icon} text-3xl text-gray-500 mb-3"></i>
        <h3 class="font-semibold text-gray-400">${a.name}</h3>
        <p class="text-xs text-gray-600 mt-2 mb-3">${a.desc}</p>

        <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-cyan-400/20">
          <div class="h-full bg-cyan-400 rounded-full transition-all duration-700 ease-out" style="width:${progress}%;"></div>
        </div>
        <p class="text-[10px] text-gray-500 mt-1 text-right">${progress}%</p>
      `;
      lockedContainer.appendChild(div);
    });
  } else {
    lockedContainer.innerHTML = `<p class="text-gray-400 text-sm col-span-full">No locked achievements left. You're a legend! 🏆</p>`;
  }

  // 🧭 Milestone Progress
  earnedCount.textContent = data.earned.length;
  const total = data.earned.length + data.locked.length;
  const percent = Math.round((data.earned.length / total) * 100);
  milestoneBar.style.width = `${percent}%`;
  milestoneText.textContent = `${percent}% completed to next milestone`;
}
