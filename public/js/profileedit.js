// Upload picture functionality
function setProfilePicture(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const profilePicture = document.getElementById('profile-picture');
          profilePicture.src = e.target.result;
          
          // Trigger form validation after image is loaded
          checkForm();
      };
      reader.readAsDataURL(file);
  }
}
document.getElementById('file-input').addEventListener('change', setProfilePicture);

// Form validation
const userNameInput = document.getElementById('user-name');
const websiteInput = document.getElementById('website');
const bioInput = document.getElementById('bio');
const fileInput = document.getElementById('file-input');
const submitBtn = document.querySelector('.submit-btn');

// Character counter for bio
function updateBioCounter() {
  const charCount = bioInput.value.length;
  const counter = document.querySelector('.form-group:nth-of-type(2) .note');
  counter.textContent = `${charCount} / 150`;
  
  // Limit to 150 characters
  if (charCount > 150) {
      bioInput.value = bioInput.value.substring(0, 150);
      counter.textContent = "150 / 150 (max reached)";
      counter.style.color = "#ff6b6b";
  } else {
      counter.style.color = "#aaa";
  }
  
  checkForm();
}

// Check if form has changes
function checkForm() {
  const hasChanges = 
      userNameInput.value.trim() !== '' ||
      websiteInput.value.trim() !== '' ||
      bioInput.value.trim() !== '' ||
      fileInput.files.length > 0;

  if (hasChanges) {
      submitBtn.classList.add('active');
      submitBtn.disabled = false;
  } else {
      submitBtn.classList.remove('active');
      submitBtn.disabled = true;
  }
}

// Add event listeners
userNameInput.addEventListener('input', checkForm);
websiteInput.addEventListener('input', checkForm);
bioInput.addEventListener('input', updateBioCounter);
fileInput.addEventListener('change', checkForm);

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', function() {
  checkForm();
  updateBioCounter();
  
  // Add form submission handler
  const form = document.querySelector('form');
  form.addEventListener('submit', function(e) {
      if (submitBtn.disabled) {
          e.preventDefault();
          alert('Please make at least one change before submitting.');
      }
  });
});