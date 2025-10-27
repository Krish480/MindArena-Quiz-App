const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");
    const mobileSearchBtn = document.getElementById("mobileSearchBtn");
    const mobileSearchBar = document.getElementById("mobileSearchBar");

    userMenuBtn.addEventListener("click", () => userDropdown.classList.toggle("hidden"));
    document.addEventListener("click", (e) => {
      if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) userDropdown.classList.add("hidden");
    });

    mobileSearchBtn.addEventListener("click", () => {
      mobileSearchBar.classList.toggle("hidden");
      mobileSearchBar.classList.toggle("animate-[slideDown_0.3s_ease_forwards]");
    });