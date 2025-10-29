// quize.js
let timer;
let timeElapsed = 0;
let quizData;

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "mathematics";
  const level = parseInt(params.get("level")) || 1;

  const response = await fetch(`/data/${category.toLowerCase()}.json`);
  const data = await response.json();
  quizData = data.levels.find((l) => l.level === level);

  document.getElementById("quizTitle").textContent =
    `${data.category} - Level ${level} (${quizData.difficulty})`;

  const container = document.getElementById("questionContainer");
  let current = 0;
  let score = 0;
  let answers = [];

  // TIMER
  function startTimer() {
    timer = setInterval(() => {
      timeElapsed++;
      const timerEl = document.getElementById("timeLeft");
      if (timerEl) timerEl.textContent = formatTime(timeElapsed);
    }, 1000);
  }
  function stopTimer() { clearInterval(timer); }

  // FORMAT TIME
  function formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  // RENDER QUESTION
  function renderQuestion() {
    const q = quizData.questions[current];
    container.innerHTML = `
      <div class="flex justify-between items-center text-sm sm:text-base text-gray-300 mb-2">
        <p>Question <span class="text-cyan-400 font-semibold">${current + 1}</span> of ${quizData.questions.length}</p>
        <p>⏱️ Time: <span id="timeLeft" class="text-cyan-400 font-semibold">${formatTime(timeElapsed)}</span></p>
      </div>
      <h2 class="text-xl font-semibold text-white mb-4">${q.question}</h2>
      <div class="grid gap-3">
        ${q.options.map(opt => `
          <button class="option px-4 py-2 rounded-lg border border-cyan-400/30 hover:bg-cyan-400/10 transition">${opt}</button>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selected = btn.textContent;
        answers[current] = { question: q.question, selected, correct: q.answer };

        if (selected === q.answer) {
          btn.classList.add("bg-green-500/50");
          playSound("correct");
          score++;
        } else {
          btn.classList.add("bg-red-500/50");
          playSound("wrong");
        }

        document.querySelectorAll(".option").forEach((b) => (b.disabled = true));

        if (current < quizData.questions.length - 1) {
          document.getElementById("nextBtn").classList.remove("hidden");
        } else {
          document.getElementById("submitBtn").classList.remove("hidden");
        }
      });
    });
  }

  renderQuestion();
  startTimer();

  // NEXT QUESTION
  document.getElementById("nextBtn").addEventListener("click", () => {
    current++;
    if (current < quizData.questions.length) {
      renderQuestion();
      document.getElementById("nextBtn").classList.add("hidden");
    }
  });

  // SHOW RESULT
  function showResult() {
    stopTimer();
    container.classList.add("hidden");
    document.getElementById("nextBtn").classList.add("hidden");
    document.getElementById("submitBtn").classList.add("hidden");
    document.getElementById("resultContainer").classList.remove("hidden");

    document.getElementById("scoreText").textContent =
      `You got ${score}/${quizData.questions.length} correct in ${formatTime(timeElapsed)}!`;

    localStorage.setItem("lastQuizResult", JSON.stringify({
      answers,
      score,
      total: quizData.questions.length,
      category,
      level,
      time: timeElapsed
    }));

    //  LEVEL UNLOCK + MESSAGE
    const passScore = Math.ceil(quizData.questions.length * 0.6);
    const key = `unlockedLevel_${category}`;
    let unlockedLevel = parseInt(localStorage.getItem(key) || "1");

    if (score >= passScore) {
      if (level === unlockedLevel && level < 10) {
        const nextLevel = level + 1;
        localStorage.setItem(key, nextLevel);
        showUnlockPopup(nextLevel);
        showToast(`✅ Level ${level} Completed! Level ${nextLevel} Unlocked 🎉`);
        playSound("success");
      } else {
        showToast(`🏆 Level ${level} Completed Again! Keep it up!`, false);
        playSound("levelup");
      }
    } else {
      showToast("❌ Try Again to Unlock Next Level!", true);
      playSound("fail");
    }

    // UPDATE USER PROGRESS
    let progress = JSON.parse(localStorage.getItem("userProgress")) || {
      xp: 0,
      level: 1,
      weekly_activity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
      categories: [],
      achievements: []
    };

    // Total Questions
    let total = quizData.questions.length;

    // XP calculation
    let gainedXP = Math.min(score * 100, 1000); // XP capped at 1000 per quiz
    progress.xp += gainedXP;

    // Level up system
    if (progress.xp >= progress.level * 2000) {
      progress.level++;
      playSound("levelup");
    }

    // Update weekly activity (based on current day)
    const today = new Date().toLocaleString("en-US", { weekday: "short" });
    if (progress.weekly_activity[today] !== undefined) {
      progress.weekly_activity[today] = Math.min(100, progress.weekly_activity[today] + 20);
    }

    // Update category accuracy
    let categoryEntry = progress.categories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase()
    );
    let accuracy = Math.round((score / total) * 100);

    if (categoryEntry) {
      categoryEntry.accuracy = Math.round((categoryEntry.accuracy + accuracy) / 2);
    } else {
      progress.categories.push({ name: category, accuracy });
    }

    //  Merge unlocked achievements
    let allAchievements = JSON.parse(localStorage.getItem("userAchievements")) || { earned: [] };
    let earnedNames = allAchievements.earned.map(a => a.name);
    progress.achievements = earnedNames;

    // Save to localStorage
    localStorage.setItem("userProgress", JSON.stringify(progress));


    // Update Achievement Progress System
    let achievementProgress = JSON.parse(localStorage.getItem("achievementProgress")) || {};

    // Define all tracked achievements with conditions
    const trackedAchievements = {
      "Knowledge Guru": {
        condition: score === quizData.questions.length, // 100% correct
        increment: 25, // 4 perfect quizzes = unlock
        unlockAt: 100,
        data: {
          name: "Knowledge Guru",
          desc: "Completed 5 perfect quizzes (all answers correct)!",
          icon: "fa-book",
          color: "text-cyan-400"
        }
      },
      "Speed Solver": {
        condition: timeElapsed < 60, // completed in under 60 seconds
        increment: 50, // 2 quick quizzes = unlock
        unlockAt: 100,
        data: {
          name: "Speed Solver",
          desc: "Completed quizzes under 60 seconds twice!",
          icon: "fa-bolt",
          color: "text-yellow-400"
        }
      },
      "Quiz Master": {
        condition: score >= quizData.questions.length * 0.8, // 80%+
        increment: 20, // 5 strong quizzes = unlock
        unlockAt: 100,
        data: {
          name: "Quiz Master",
          desc: "Scored 80%+ in 5 quizzes!",
          icon: "fa-brain",
          color: "text-pink-400"
        }
      },
      "Unstoppable": {
        condition: true, // Every quiz counts as progress (daily streak possible)
        increment: 15, // after 7 quizzes (≈100%)
        unlockAt: 100,
        data: {
          name: "Unstoppable",
          desc: "Maintain 7-day streak of quiz attempts!",
          icon: "fa-fire",
          color: "text-orange-500"
        }
      }
    };

    // Loop through all tracked achievements
    for (const [key, ach] of Object.entries(trackedAchievements)) {
      if (ach.condition) {
        achievementProgress[key] = Math.min(
          (achievementProgress[key] || 0) + ach.increment,
          ach.unlockAt
        );
      }

      // Auto-Unlock when progress reaches target
      if (achievementProgress[key] >= ach.unlockAt) {
        let userAchievements = JSON.parse(localStorage.getItem("userAchievements")) || { earned: [], locked: [] };
        if (!userAchievements.earned.some(a => a.name === ach.data.name)) {
          userAchievements.earned.push(ach.data);
          userAchievements.locked = userAchievements.locked.filter(a => a.name !== ach.data.name);
          localStorage.setItem("userAchievements", JSON.stringify(userAchievements));
          showAchievementToast(ach.data.name);
          playAchievementSound();
        }
      }
    }

    // Save updated progress
    localStorage.setItem("achievementProgress", JSON.stringify(achievementProgress));


    //  Check Achievements (for other conditions)
    checkAchievements(score, quizData.questions.length, timeElapsed, category);


    //  Check Achievements (after progress save)
    checkAchievements(score, quizData.questions.length, timeElapsed, category);
  }

  document.getElementById("submitBtn").addEventListener("click", showResult);

  //  VIEW ANSWERS
  document.getElementById("viewResultBtn").addEventListener("click", () => {
    const review = JSON.parse(localStorage.getItem("lastQuizResult"));
    const reviewDiv = document.getElementById("answerReview");
    reviewDiv.classList.remove("hidden");
    reviewDiv.innerHTML = `
      <h3 class="text-xl font-semibold text-cyan-400 mb-4">Answer Review</h3>
      ${review.answers.map((a, i) => `
        <div class="mb-4 p-4 border border-gray-700 rounded-lg">
          <p class="font-semibold text-white mb-1">Q${i + 1}: ${a.question}</p>
          <p>Your Answer: 
            <span class="${a.selected === a.correct ? "text-green-400" : "text-red-400"}">${a.selected}</span>
          </p>
          <p>Correct Answer: <span class="text-cyan-400">${a.correct}</span></p>
        </div>`).join("")}
      <div class="text-center mt-6">
        <button id="retakeBtn" class="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full transition">
          Retake Quiz 🔁
        </button>
      </div>
    `;
    document.getElementById("retakeBtn").addEventListener("click", () => {
      localStorage.removeItem("lastQuizResult");
      window.location.reload();
    });
  });
}

//  ACHIEVEMENT SYSTEM
function checkAchievements(score, total, timeElapsed, category) {
  let newAchievements = [];

  if (score === total) {
    newAchievements.push({
      name: "Legendary Mind",
      desc: "Scored 100% in a quiz!",
      icon: "fa-trophy",
      color: "text-yellow-400"
    });
  }

  if (timeElapsed < 60) {
    newAchievements.push({
      name: "Speed Solver",
      desc: "Completed a quiz in under 60 seconds!",
      icon: "fa-bolt",
      color: "text-green-400"
    });
  }

  if (score >= total * 0.8) {
    newAchievements.push({
      name: "Quiz Master",
      desc: "Scored 80%+ in a quiz!",
      icon: "fa-brain",
      color: "text-pink-400"
    });
  }

  let totalCompleted = JSON.parse(localStorage.getItem("totalQuizzesDone")) || 0;

  // counts only when user gets 100%
  if (score === total) {
    totalCompleted++;
    localStorage.setItem("totalQuizzesDone", totalCompleted)
  }

  if (totalCompleted >= 5) {
    newAchievements.push({
      name: "Knowledge Guru",
      desc: "Completed 5+ quizzes!",
      icon: "fa-book",
      color: "text-cyan-400"
    });
  }

  //  Merge into achievements.html data
  if (newAchievements.length > 0) {
    let allAchievements = JSON.parse(localStorage.getItem("userAchievements")) || { earned: [], locked: [] };

    newAchievements.forEach(a => {
      if (!allAchievements.earned.some(e => e.name === a.name)) {
        allAchievements.earned.push(a);
      }
    });

    localStorage.setItem("userAchievements", JSON.stringify(allAchievements));
    playAchievementSound();
    newAchievements.forEach(a => showAchievementToast(a.name));
  }

  // After achievements saved
  localStorage.setItem("userProgress", JSON.stringify({
    ...JSON.parse(localStorage.getItem("userProgress")),
    achievements: JSON.parse(localStorage.getItem("userAchievements")).earned.map(a => a.name)
  }));

}

//  TOAST for Achievement
function showAchievementToast(title) {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-6 right-6 bg-gradient-to-r from-cyan-500 to-teal-400 text-black px-5 py-3 rounded-2xl font-semibold shadow-lg z-[1000] animate-slide-in";
  toast.innerHTML = `🏅 ${title}!`;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-[-10px]", "transition-all", "duration-500");
    setTimeout(() => toast.remove(), 600);
  }, 3000);
}

function playAchievementSound() {
  const audio = new Audio("/assets/sounds/level-up.mp3");
  audio.volume = 0.6;
  audio.play();
}

// POPUP + CONFETTI
function showUnlockPopup(nextLevel) {
  const popup = document.getElementById("unlockPopup");
  const msg = document.getElementById("unlockMsg");
  msg.textContent = `Great job! Level ${nextLevel} is now unlocked!`;
  popup.classList.remove("hidden");
  startConfetti();
  playSound("levelup");
}

function closePopup() {
  stopConfetti();
  document.getElementById("unlockPopup").classList.add("hidden");
}

function startConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.classList.add("fixed", "inset-0", "overflow-hidden", "pointer-events-none", "z-50");
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const c = document.createElement("div");
    c.style.position = "absolute";
    c.style.width = "6px";
    c.style.height = "6px";
    c.style.background = `hsl(${Math.random() * 360},100%,70%)`;
    c.style.top = `${Math.random() * 100}%`;
    c.style.left = `${Math.random() * 100}%`;
    c.style.borderRadius = "50%";
    c.animate(
      [
        { transform: `translateY(0) rotate(0deg)` },
        { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)` },
      ],
      { duration: 4000 + Math.random() * 2000, iterations: Infinity }
    );
    confettiContainer.appendChild(c);
  }
}

function stopConfetti() {
  document.querySelectorAll(".fixed.inset-0.overflow-hidden").forEach(e => e.remove());
}

//  SOUND SYSTEM
function playSound(type) {
  const sounds = {
    correct: "/assets/sounds/correct.mp3",
    wrong: "/assets/sounds/wrong.mp3",
    success: "/assets/sounds/success.mp3",
    fail: "/assets/sounds/fail.mp3",
    levelup: "/assets/sounds/level-up.mp3"
  };
  const audio = new Audio(sounds[type]);
  audio.volume = 0.5;
  audio.play().catch(() => { });
}

//  TOAST (bottom)
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `
    fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold text-white shadow-lg z-50 
    ${isError ? "bg-red-500/90" : "bg-cyan-500/90"} 
    animate-slideUp
  `;
  document.body.appendChild(toast);
  playSound(isError ? "fail" : "success");
  setTimeout(() => toast.remove(), 3500);
}

//  ANIMATION STYLES
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  50% { opacity: 1; transform: translateY(0) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
`;
document.head.appendChild(style);

loadQuiz();
