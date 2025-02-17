const button = document.getElementById('btn')

button.addEventListener('click', () => {
    const username = document.getElementById('username_changepass').value.trim()
    if(!validateEmail(username)) {
        Swal.fire({
            title: 'Oops...',
            text: 'Do not leave username or password blank!',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
    } else {
        Swal.fire({
            title: 'Send email success',
            text: 'Please check your inbox to change your email',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        }).then((willRedirect) => {
            if (willRedirect) {
              window.location.href = "/change_pass";
            }})
    }
})

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
