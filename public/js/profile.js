// Function to handle content switching between posts and tweets
function setupProfileTabs() {
    // Get all necessary elements
    const postsBtn = document.getElementById('posts-btn');
    const tweetsBtn = document.getElementById('tweets-btn');
    const postsContent = document.getElementById('posts-content');
    const tweetsContent = document.getElementById('tweets-content');
    
    // Function to switch tabs
    function switchTab(activeTab) {
      // Remove active class from both buttons and content
      postsBtn.classList.remove('active');
      tweetsBtn.classList.remove('active');
      postsContent.classList.remove('active');
      tweetsContent.classList.remove('active');
      
      // Add active class to selected tab
      if (activeTab === 'posts') {
        postsBtn.classList.add('active');
        postsContent.classList.add('active');
      } else {
        tweetsBtn.classList.add('active');
        tweetsContent.classList.add('active');
      }
    }
    
    // Add event listeners
    postsBtn.addEventListener('click', () => switchTab('posts'));
    tweetsBtn.addEventListener('click', () => switchTab('tweets'));
    
    // Initialize with posts active
    switchTab('posts');
  }
  
  // Call the function when the DOM is loaded
  document.addEventListener('DOMContentLoaded', setupProfileTabs);