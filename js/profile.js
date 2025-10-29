const uploadInput = document.getElementById('uploadPhoto');
const profileImage = document.getElementById('profileImage');
const deleteBtn = document.getElementById('deletePhoto');
const editBtn = document.getElementById('editProfileBtn');
const editModal = document.getElementById('editModal');
const cancelEdit = document.getElementById('cancelEdit');
const form = document.getElementById('editProfileForm');

const nameEl = document.getElementById('userName');
const emailEl = document.getElementById('userEmail').querySelector('span');
const bioEl = document.getElementById('userBio');

// --- Profile Image Upload ---
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.src = reader.result;
      localStorage.setItem('profileImage', reader.result);
    };
    reader.readAsDataURL(file);
    deleteBtn.classList.remove('hidden');
  }
});

const savedImage = localStorage.getItem('profileImage');
if (savedImage) {
  profileImage.src = savedImage;
  deleteBtn.classList.remove('hidden');
}

deleteBtn.addEventListener('click', () => {
  localStorage.removeItem('profileImage');
  profileImage.src = '/assets/avtar.png';
  deleteBtn.classList.add('hidden');
});

// --- Edit Profile ---
editBtn.addEventListener('click', () => {
  editModal.classList.remove('hidden');
  document.getElementById('editName').value = nameEl.textContent;
  document.getElementById('editEmail').value = emailEl.textContent;
  document.getElementById('editBio').value = bioEl.textContent;
});

cancelEdit.addEventListener('click', () => {
  editModal.classList.add('hidden');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newName = document.getElementById('editName').value;
  const newEmail = document.getElementById('editEmail').value;
  const newBio = document.getElementById('editBio').value;

  nameEl.textContent = newName;
  emailEl.textContent = newEmail;
  bioEl.textContent = newBio;

  localStorage.setItem('userName', newName);
  localStorage.setItem('userEmail', newEmail);
  localStorage.setItem('userBio', newBio);

  editModal.classList.add('hidden');
});

// --- Load User Info ---
const savedName = localStorage.getItem('userName');
const savedEmail = localStorage.getItem('userEmail');
const savedBio = localStorage.getItem('userBio');

if (savedName) nameEl.textContent = savedName;
if (savedEmail) emailEl.textContent = savedEmail;
if (savedBio) bioEl.textContent = savedBio;

// --- Auto Update Stats (XP, Level, Rank) ---
function updateUserStats() {
  const xpEl = document.querySelectorAll('.grid div:nth-child(1) p')[0];
  const achievementsEl = document.querySelectorAll('.grid div:nth-child(2) p')[0];
  const rankEl = document.querySelectorAll('.grid div:nth-child(3) p')[0];

  let data = JSON.parse(localStorage.getItem("userProgress"));
  let levelProgress = JSON.parse(localStorage.getItem("levelProgress"));

  // Default values
  let xp = 0;
  let totalAchievements = 0;
  let rank = "N/A";

  if (data) {
    xp = data.xp || 0;
    totalAchievements = data.achievements ? data.achievements.length : 0;
  }

  // XP based rank logic
  if (xp < 500) rank = "#10";
  else if (xp < 1000) rank = "#8";
  else if (xp < 2000) rank = "#5";
  else if (xp < 3000) rank = "#3";
  else rank = "#1 🏆";

  xpEl.textContent = xp;
  achievementsEl.textContent = totalAchievements;
  rankEl.textContent = rank;
}

// Update on load
updateUserStats();

// Update dynamically every 3 seconds (for real-time experience)
setInterval(updateUserStats, 3000);
