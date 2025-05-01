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

   // Function to add a new button and corresponding content
   function addNewButton(buttonId, buttonText, contentText) {
    // Create the new button
    const newButton = document.createElement('button');
    newButton.id = buttonId + '-btn';
    newButton.className = 'nav-btn';
    newButton.textContent = buttonText;
    
    // Create the corresponding content div
    const newContentDiv = document.createElement('div');
    newContentDiv.id = buttonId + '-content';
    newContentDiv.className = 'content-div';
    newContentDiv.textContent = contentText;
    
    // Add them to the DOM
    document.querySelector('.profile-nav').appendChild(newButton);
    document.querySelector('.profile-container').appendChild(newContentDiv);
    
    // Add click handler to the new button
    newButton.addEventListener('click', function() {
      // Remove active class from all buttons and content divs
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.content-div').forEach(div => div.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      document.getElementById(buttonId + '-content').classList.add('active');
    });
  }
  

  // Example usage:
  // Add a new "Photos" button with corresponding content
  addNewButton('photos', 'Posts', 'Photos content goes here');
  
  // Add click handlers to existing buttons
  document.getElementById('posts-btn').addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-div').forEach(div => div.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('posts-content').classList.add('active');
  });
  
  document.getElementById('tweets-btn').addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-div').forEach(div => div.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tweets-content').classList.add('active');
  });