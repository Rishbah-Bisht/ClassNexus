const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');
const browseBtn = uploadArea.querySelector('.browse-btn');
const submitBtn = document.querySelector('.submit-btn');

// Initial button state
disableSubmit();

// Handle click on upload area
uploadArea.addEventListener('click', () => fileInput.click());

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        showPreview(file);
        enableSubmit();
    } else {
        disableSubmit();
    }
});

// Handle drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-hover)';
    uploadArea.style.backgroundColor = '#333';
});

uploadArea.addEventListener('dragleave', () => resetDropzoneStyle());

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    resetDropzoneStyle();
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    }
});

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        imagePreview.src = event.target.result;
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
    fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function resetDropzoneStyle() {
    uploadArea.style.borderColor = 'var(--border)';
    uploadArea.style.backgroundColor = 'var(--dropzone-bg)';
}

function disableSubmit() {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";
}

function enableSubmit() {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
}
