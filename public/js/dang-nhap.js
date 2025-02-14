const openlogin = document.getElementById('open_login')
const loginform = document.getElementById('login_form')
const buttonclose = document.getElementById('button_close')
const usernamelogin = document.getElementById('username_login')
const password_login = document.getElementById('password_login')

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
  const username = document.getElementById('username_login').value
  const password = document.getElementById('password_login').value

  // check gì đó

  if (username === '' || password === '') {
    // xử lý gì đó
    return
  }

  if (validateEmail(username)) {
    // xử lý gì đó
    return
  }

  const body = {
    username,
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
      console.log(data)
    })
}
