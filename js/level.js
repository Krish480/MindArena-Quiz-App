// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "math";

const titles = {
  math: "Mathematics Journey 🧮",
  science: "Science Quest 🔬",
  history: "History Voyage 📜",
  gk: "General Knowledge 🧠",
  computer: "Computer Awareness 🖥️",
  banking: "Banking Awareness 🏦"

};

// DOM references
const categoryTitle = document.getElementById("categoryTitle");
const container = document.getElementById("levelsContainer");
const unlockSound = document.getElementById("unlockSound");
const clickSound = document.getElementById("clickSound");
categoryTitle.textContent = titles[category] || "Knowledge Path 🌟";

// Levels data
const levels = [
  { level: 1, difficulty: "Easy", xp: 100 },
  { level: 2, difficulty: "Easy", xp: 150 },
  { level: 3, difficulty: "Medium", xp: 200 },
  { level: 4, difficulty: "Medium", xp: 250 },
  { level: 5, difficulty: "Medium", xp: 300 },
  { level: 6, difficulty: "Hard", xp: 350 },
  { level: 7, difficulty: "Hard", xp: 400 },
  { level: 8, difficulty: "Advanced", xp: 450 },
  { level: 9, difficulty: "Advanced", xp: 500 },
  { level: 10, difficulty: "Expert", xp: 600 },
];

// Unique storage key for each category
const storageKey = `unlockedLevel_${category}`;
let unlockedLevel = parseInt(localStorage.getItem(storageKey) || "1");

// Render levels
levels.forEach((lvl, i) => {
  const isUnlocked = lvl.level <= unlockedLevel;

  const div = document.createElement("div");
  div.className = `
    w-[180px] sm:w-[200px] p-4 sm:p-5 border-2 rounded-2xl shadow-lg 
    transition-all duration-300 backdrop-blur-md relative
    ${isUnlocked
      ? "border-cyan-400 bg-cyan-400/10 hover:scale-105 hover:shadow-cyan-400/40 cursor-pointer"
      : "border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed"}
    ${i % 2 === 0 ? "self-start text-left" : "self-end text-right"}
  `;

  div.innerHTML = `
    <div class="flex items-center justify-center gap-3 mb-3">
      <i class="fa-solid ${isUnlocked ? "fa-lock-open text-cyan-400" : "fa-lock text-gray-500"} text-xl"></i>
      <h3 class="text-xl font-bold ${isUnlocked ? "text-cyan-400" : "text-gray-400"}">
        Level ${lvl.level}
      </h3>
    </div>
    <p class="text-sm text-gray-300"><i class="fa-solid fa-brain text-cyan-400"></i> ${lvl.difficulty}</p>
    <p class="text-sm text-yellow-400 mt-1"><i class="fa-solid fa-bolt"></i> ${lvl.xp} XP</p>
    ${i < levels.length - 1 ? '<div class="connector absolute left-1/2 -bottom-6 w-1 h-10 bg-cyan-400/40"></div>' : ""}
  `;

  // Click event only for unlocked levels
  if (isUnlocked) {
    div.addEventListener("click", () => {
      clickSound.play();
      window.location.href = `quiz.html?category=${category}&level=${lvl.level}`;
    });
  }

  container.appendChild(div);
});

// Floating particles
for (let i = 0; i < 15; i++) {
  const p = document.createElement("div");
  p.className = "particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70";
  p.style.left = `${Math.random() * 100}%`;
  p.style.top = `${Math.random() * 100}%`;
  p.style.animationDelay = `${Math.random() * 3}s`;
  document.getElementById("particles").appendChild(p);
}

// Unlock next level after quiz completion
const lastResult = JSON.parse(localStorage.getItem("lastQuizResult"));
if (lastResult && lastResult.category === category && lastResult.score >= 3) {
  const newLevel = lastResult.level + 1;
  if (newLevel > unlockedLevel && newLevel <= 10) {
    localStorage.setItem(storageKey, newLevel);
    unlockSound.play();

    // Prevent multiple unlocks after refresh
    localStorage.removeItem("lastQuizResult");
  }
}
