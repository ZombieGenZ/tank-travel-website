const openlogin = document.getElementById('open_login')
const loginform = document.getElementById('login_form')
const buttonclose = document.getElementById('button_close')
const usernamelogin = document.getElementById('username_login')
const password_login = document.getElementById('password_login')
const forgot_pass = document.getElementById('forget_password')

forgot_pass.addEventListener('click', () => {
  window.location.href = 'forgot_pass';
})

openlogin.addEventListener('click', () => {
  loginform.classList.add('open_form')
})

buttonclose.addEventListener('click', () => {
  loginform.classList.remove('open_form')
})



function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function login() {
  const username = document.getElementById('username_login').value.trim()
  const password = document.getElementById('password_login').value.trim()

  if (username === '' || password === '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Do not leave username or password blank!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(username)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Do not leave username or password blank!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  const body = {
    email: username,
    password
  }

  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data == null || data == undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Input data error') {
        for (const key in data.errors) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
        }
        return
      }

      if (data.message === 'Please change your temporary password before logging in') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please change your temporary password before logging in',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Login successful!') {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)

        Swal.fire({
          title: 'Good job!',
          text: data.message,
          icon: 'success'
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.backdrop) {
            window.location.href = '/'
          } else {
            window.location.href = '/'
          }
        })
        return
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
}
