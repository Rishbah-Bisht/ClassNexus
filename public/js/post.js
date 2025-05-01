const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');
const browseBtn = uploadArea.querySelector('.browse-btn');

// Handle click on upload area
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the upload area click
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Display preview
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        // Display file info
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
    }
});

// Handle drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-hover)';
    uploadArea.style.backgroundColor = '#333';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border)';
    uploadArea.style.backgroundColor = 'var(--dropzone-bg)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border)';
    uploadArea.style.backgroundColor = 'var(--dropzone-bg)';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const changeEvent = new Event('change');
        fileInput.dispatchEvent(changeEvent);
    }
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}