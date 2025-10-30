// js/achievements.js (fixed)
// Wait for DOM
document.addEventListener("DOMContentLoaded", async () => {
  // Load default achievements file
  let defaultData = { earned: [], locked: [] };
  try {
    const res = await fetch("/data/achievementsData.json");
    if (res.ok) defaultData = await res.json();
  } catch (err) {
    console.warn("Could not load achievementsData.json:", err);
  }

  // Load stored achievements and progress
  let storedAchievements = JSON.parse(localStorage.getItem("userAchievements")) || { earned: [], locked: [] };
  let progressData = JSON.parse(localStorage.getItem("userProgress")) || {};
  const progressAchievementsNames = (progressData.achievements || []).slice();

  // Convert progress achievement names to objects (if not already present)
  const progressAchievements = progressAchievementsNames.map(name => ({
    name,
    desc: "Unlocked achievement!",
    icon: "fa-trophy",
    color: "text-cyan-400"
  }));

  // Merge progressAchievements into storedAchievements.earned without duplicating
  progressAchievements.forEach(pa => {
    if (!storedAchievements.earned.some(e => e.name === pa.name)) {
      storedAchievements.earned.push(pa);
    }
  });

  // Ensure locked list comes from defaultData minus earned
  const allFromDefault = (defaultData.earned || []).concat(defaultData.locked || []);
  const allNames = allFromDefault.map(a => a.name);
  const earnedNames = storedAchievements.earned.map(a => a.name);
  const lockedCandidates = allNames.filter(n => !earnedNames.includes(n));
  storedAchievements.locked = lockedCandidates.map(name => {
    return (defaultData.locked || []).find(a => a.name === name)
      || (defaultData.earned || []).find(a => a.name === name)
      || { name, desc: "Hidden Achievement", icon: "fa-lock", color: "text-gray-500" };
  });

  // Save merged result back (so other pages get consistent data)
  localStorage.setItem("userAchievements", JSON.stringify(storedAchievements));

  // Render UI
  renderAchievements(storedAchievements);
});


/* ---------- helper functions ---------- */

function getAchievementProgress(name) {
  const progressData = JSON.parse(localStorage.getItem("achievementProgress")) || {};
  return progressData[name] || 0;
}

function renderAchievements(data) {
  const earnedContainer = document.getElementById("earnedAchievements");
  const lockedContainer = document.getElementById("lockedAchievements");
  const earnedCount = document.getElementById("earnedCount");
  const milestoneBar = document.getElementById("milestoneBar");
  const milestoneText = document.getElementById("milestoneText");

  if (!earnedContainer || !lockedContainer || !earnedCount || !milestoneBar || !milestoneText) {
    console.warn("Achievements DOM elements missing — check IDs in achievements.html");
    return;
  }

  earnedContainer.innerHTML = "";
  lockedContainer.innerHTML = "";

  // Earned
  if (data.earned && data.earned.length > 0) {
    data.earned.forEach(a => {
      const div = document.createElement("div");
      div.className = "bg-gradient-to-br from-cyan-900/30 to-gray-900/50 border border-cyan-400/30 rounded-2xl p-4 hover:scale-105 transition shadow-lg";
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

  // Locked (with progress)
  if (data.locked && data.locked.length > 0) {
    data.locked.forEach(a => {
      const progress = getAchievementProgress(a.name);
      const div = document.createElement("div");
      div.className = "bg-gray-900/40 border border-gray-700 rounded-2xl p-4 opacity-70 hover:scale-105 transition";
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

  // Milestone
  const total = (data.earned?.length || 0) + (data.locked?.length || 0);
  const percent = total === 0 ? 0 : Math.round(((data.earned?.length || 0) / total) * 100);
  earnedCount.textContent = data.earned?.length || 0;
  milestoneBar.style.width = `${percent}%`;
  milestoneText.textContent = `${percent}% completed to next milestone`;
}
