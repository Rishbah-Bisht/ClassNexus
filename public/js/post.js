
 
const Allposts = document.querySelectorAll('.post');
// like Counts
Allposts.forEach(post => {
    const likeBtn = post.querySelector('.likeBtn');
    likeBtn.addEventListener('click', (event) => {
        let totalLikeCount = post.querySelector('.post-actions p');
        let likeCount = parseInt(totalLikeCount.textContent);

        if (likeBtn.classList.contains('likeBtn')) {
            likeBtn.classList.add('clicked');
            likeBtn.classList.remove('likeBtn');
            totalLikeCount.textContent = likeCount + 1;

        } else {
            likeBtn.classList.remove('clicked');
            likeBtn.classList.add('likeBtn');
            totalLikeCount.textContent = likeCount - 1;
        }

    });
});



// comments section
Allposts.forEach(post=>{
    const comntBtn=post.querySelector('.noComnt');
    comntBtn.addEventListener('click',(e)=>{

        const comntDisplayNone=post.querySelector('.comntDisplayNone');
        console.log(comntDisplayNone)
        if (comntBtn.classList.contains('noComnt')) {
            comntDisplayNone.style.display='block';
            comntBtn.classList.add('comntDisplay');
            comntBtn.classList.remove('noComnt');
            

        } else {
            comntDisplayNone.style.display='none';
            comntBtn.classList.remove('comntDisplay');
            comntBtn.classList.add('noComnt');
            
        }
    })
}) 