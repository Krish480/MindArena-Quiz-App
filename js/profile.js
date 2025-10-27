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

    // Upload
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

    // Load saved image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      profileImage.src = savedImage;
      deleteBtn.classList.remove('hidden');
    }

    // Delete photo
    deleteBtn.addEventListener('click', () => {
      localStorage.removeItem('profileImage');
      profileImage.src = '/assets/avtar.png';
      deleteBtn.classList.add('hidden');
    });

    // Edit modal open
    editBtn.addEventListener('click', () => {
      editModal.classList.remove('hidden');
      document.getElementById('editName').value = nameEl.textContent;
      document.getElementById('editEmail').value = emailEl.textContent;
      document.getElementById('editBio').value = bioEl.textContent;
    });

    // Cancel modal
    cancelEdit.addEventListener('click', () => {
      editModal.classList.add('hidden');
    });

    // Save data
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

    // Load user info
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedBio = localStorage.getItem('userBio');

    if (savedName) nameEl.textContent = savedName;
    if (savedEmail) emailEl.textContent = savedEmail;
    if (savedBio) bioEl.textContent = savedBio;