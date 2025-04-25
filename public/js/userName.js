document.addEventListener('DOMContentLoaded', function () {
    const name = prompt("Enter your name:");
    if (name) {
      fetch('/save-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
    //   .then(res => res.text())
    //   .then(msg => console.log(msg))
      .catch(err => console.error(err));
    }

  });

