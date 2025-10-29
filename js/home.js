const userMenuBtn = document.getElementById("userMenuBtn");
const userDropdown = document.getElementById("userDropdown");
const logoutBtn = document.getElementById("logoutBtn");
const mobileSearchBtn = document.getElementById("mobileSearchBtn");
const mobileSearchBar = document.getElementById("mobileSearchBar");
const dropdownName = document.getElementById("dropdownUserName");
const dropdownEmail = document.getElementById("dropdownUserEmail");
const loggedInOptions = document.getElementById("loggedInOptions");
const guestOptions = document.getElementById("guestOptions");

// Toggle dropdown
userMenuBtn.addEventListener("click", () => userDropdown.classList.toggle("hidden"));
document.addEventListener("click", (e) => {
  if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.add("hidden");
  }
});

// Mobile search
mobileSearchBtn.addEventListener("click", () => mobileSearchBar.classList.toggle("hidden"));
document.addEventListener("click", (e) => {
  if (!mobileSearchBtn.contains(e.target) && !mobileSearchBar.contains(e.target)) {
    mobileSearchBar.classList.add("hidden")
  }
})



// Update dropdown info
function updateDropdownUser() {
  const savedName = localStorage.getItem("userName");
  const savedEmail = localStorage.getItem("userEmail");

  if (savedName && savedEmail) {
    // Logged-in view
    dropdownName.textContent = savedName;
    dropdownEmail.textContent = savedEmail;
    loggedInOptions.classList.remove("hidden");
    guestOptions.classList.add("hidden");
  } else {
    // Logged-out / guest view
    dropdownName.textContent = "Guest User";
    dropdownEmail.textContent = "guest@example.com";
    loggedInOptions.classList.add("hidden");
    guestOptions.classList.remove("hidden");
  }
}

// Logout handler
logoutBtn.addEventListener("click", () => {
  // Clear user session
  localStorage.clear();

  // Optional: show logout toast
  showToast("👋 Logged out successfully!");

  // Redirect to MindArena start page
  setTimeout(() => {
    window.location.href = "index.html"; // ← ye teri start page file ka naam hai
  }, 1200);
});


// Auto-update every few seconds (in case of profile changes)
setInterval(updateDropdownUser, 3000);

// Run immediately on load
updateDropdownUser();

// Toast function
function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.className = `
    fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 
    bg-cyan-500/90 text-black font-semibold rounded-full shadow-lg z-50 animate-bounce
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

//  Start quiz (direct access)
function startQuiz(category) {
  // Click sound effect
  const click = new Audio("/assets/sounds/click.mp3");
  click.volume = 0.5;
  click.play();

  if (category === "random") {
    // Randomly pick any category
    const categories = ["math", "science", "history"];
    category = categories[Math.floor(Math.random() * categories.length)];
  }

  // Small delay so sound can play properly
  setTimeout(() => {
    window.location.href = `level.html?category=${category}`;
  }, 400);
}


//  Go to Level Map Page
function openLevel(category) {
  const click = new Audio("/assets/sounds/click.mp3");
  click.volume = 0.5
  click.play();

  // Small delay so sound can play properly
  setTimeout(() => {
    window.location.href = `level.html?category=${category}`;
  }, 400);;
}

// ⚡ Daily Challenge System
function startDailyChallenge() {
  const click = new Audio("/sounds/click.mp3");
  click.volume = 0.5;
  click.play();

  // Check if already played today
  const lastPlayed = localStorage.getItem("lastDailyDate");
  const today = new Date().toDateString();

  if (lastPlayed === today) {
    showToast("✅ You’ve already completed today’s challenge!");
    return;
  }

  // Pick random category & level
  const categories = ["math", "science", "history"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomLevel = Math.floor(Math.random() * 5) + 1; // Level 1–5 random

  // Save date to prevent reattempt
  localStorage.setItem("lastDailyDate", today);

  // Optional streak counter
  let streak = parseInt(localStorage.getItem("dailyStreak") || "0");
  streak++;
  localStorage.setItem("dailyStreak", streak);

  showToast(`🔥 Day ${streak} challenge started!`, false);

  // Delay for sound & transition
  setTimeout(() => {
    window.location.href = `quiz.html?category=${randomCategory}&level=${randomLevel}`;
  }, 500);
}


// Detect current page in mobile version
const currentPage = window.location.pathname.split("/").pop();

// Match active tab
const navLinks = {
  "home.html": "nav-home",
  "profile.html": "nav-profile",
  "progress.html": "nav-progress",
  "achievements.html": "nav-achievements"
};

// Get corresponding ID
const activeId = navLinks[currentPage];
if (activeId) {
  const activeLink = document.getElementById(activeId);
  activeLink.classList.remove("text-gray-400");
  activeLink.classList.add("text-cyan-400");

  // Add glowing effect to icon
  const icon = activeLink.querySelector("i");
  if (icon) icon.classList.add("drop-shadow-[0_0_10px_#06B6D4]");
}


// Detect current page in destop version
const desktopcurrentPage = window.location.pathname.split("/").pop();

// Match nav IDs with page names
const desktopNavMap = {
  "home.html": "nav-home-desktop",
  "profile.html": "nav-profile-desktop",
  "progress.html": "nav-progress-desktop",
  "achievements.html": "nav-achievements-desktop",
  "achievment.html": "nav-achievements-desktop" // in case spelling mismatch
};

// Highlight active tab
const activeDesktopId = desktopNavMap[currentPage];
if (activeDesktopId) {
  const activeLink = document.getElementById(activeDesktopId);
  if (activeLink) {
    activeLink.classList.remove("text-gray-400");
    activeLink.classList.add("text-cyan-400");
    const icon = activeLink.querySelector("i");
    if (icon) icon.classList.add("drop-shadow-[0_0_10px_#06B6D4]");
  }
}