// Function to fetch user role
async function fetchUserRole(username, postId) {
    try {
        const response = await fetch(`/api/get-user-role?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        const badge = document.getElementById(`role-badge-${postId}`);
        if (data.role) {
            badge.textContent = data.role === 'student' ? 'Student' : 'Teacher';
            badge.className = `user-role-badge ${data.role}`;
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        document.getElementById(`role-badge-${postId}`).style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('posts-container');
  const posts = 
  
  posts.forEach(post => {
    fetchUserRole(post.username, post._id);
  });
});