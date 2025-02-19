const openlogin = document.getElementById('open_login')
const loginform = document.getElementById('login_form')
const buttonclose = document.getElementById('button_close')
const usernamelogin = document.getElementById('username_login')
const password_login = document.getElementById('password_login')
const forgot_pass = document.getElementById('forget_password')
const see_pass = document.querySelectorAll('.see_pass')
// const pass_confirm = document.querySelectorAll('.')

see_pass.forEach((seepass) => {
  seepass.innerHTML = '<i class="ri-eye-off-line"></i>'
})

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})

forgot_pass.addEventListener('click', () => {
  window.location.href = 'forgot_pass'
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

function isValidPhoneNumber(phoneNumber) {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '')

  if (cleanedPhoneNumber.length !== 10) {
    return false
  }

  if (cleanedPhoneNumber[0] !== '0') {
    return false
  }

  if (/[^0-9]/.test(cleanedPhoneNumber)) {
    return false
  }

  return true
}

function isStrongPassword(password) {
  const minLength = 8
  if (password.length < minLength) {
    return false
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':",\\|,.<>\/?]/.test(password)

  const requiredTypes = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length
  if (requiredTypes < 3) {
    return false
  }

  return true
}

function sendEmailVerify(btn) {
  const email = document.getElementById('email_register').value

  if (email == null || email == undefined || email.trim() === '') {
    Swal.fire({
      title: 'Oops...',
      text: 'You need to fill in your email before requesting to send verification code',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Invalid email!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  const body = {
    email: email.trim()
  }

  fetch('/api/users/send-email-verify', {
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
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Input data error') {
        for (const key in data.errors) {
          if (data.errors[key].msg == 'Email has already been sent, please check your inbox') {
            btn.innerText = 'ReSend Code?'
            btn.setAttribute('onclick', 'reSendEmail(this)')
            Swal.fire({
              title: 'Oops...',
              text: data.errors[key].msg,
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
            })
            return
          }

          Swal.fire({
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
        }
        return
      }

      if (data.message === 'Failed to resend email verification code') {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Email verification code resent successfully! Please check your inbox') {
        btn.innerText = 'ReSend Code?'
        btn.setAttribute('onclick', 'reSendEmail(this)')
        Swal.fire({
          title: 'Good job!',
          text: data.message
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
}

function reSendEmail(btn) {
  const email = document.getElementById('email_register').value

  if (email == null || email == undefined || email.trim() === '') {
    Swal.fire({
      title: 'Oops...',
      text: 'You need to fill in your email before requesting to resend verification code',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Invalid email!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  const body = {
    email: email.trim()
  }

  fetch('/api/users/resend-email-verify', {
    method: 'PUT',
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
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Input data error') {
        for (const key in data.errors) {
          if (data.errors[key].msg == 'Email verification code has not been sent') {
            btn.innerText = 'Send Code?'
            btn.setAttribute('onclick', 'sendEmailVerify(this)')
            Swal.fire({
              title: 'Oops...',
              text: data.errors[key].msg,
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
            })
            return
          }

          Swal.fire({
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
        }
        return
      }

      if (data.message === 'Failed to send email verification code') {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Email verification code resent successfully! Please check your inbox') {
        btn.innerText = 'Send Code?'
        btn.setAttribute('onclick', 'sendEmailVerify(this)')
        Swal.fire({
          title: 'Good job!',
          text: data.message
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.backdrop) {
            location.reload()
          } else {
            location.reload()
          }
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
}

function register() {
  const username = document.getElementById('username_register').value
  const email = document.getElementById('email_register').value
  const phone = document.getElementById('phone_register').value
  const password = document.getElementById('password_register').value
  const comform_password = document.getElementById('comform_password_register').value
  const email_verify_code = document.getElementById('email_verify_code').value

  if (
    username.trim() === null ||
    username.trim() === undefined ||
    username.trim() === '' ||
    email.trim() === null ||
    email.trim() === undefined ||
    email.trim() === '' ||
    phone.trim() === null ||
    phone.trim() === undefined ||
    phone.trim() === '' ||
    password.trim() === null ||
    password.trim() === undefined ||
    password.trim() === '' ||
    comform_password.trim() === null ||
    comform_password.trim() === undefined ||
    comform_password.trim() === '' ||
    email_verify_code.trim() === null ||
    email_verify_code.trim() === undefined ||
    email_verify_code.trim() === ''
  ) {
    Swal.fire({
      title: 'Oops...',
      text: 'Do not leave username, email, phone, password, comform password or email verify code blank!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Invalid email!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!isValidPhoneNumber(phone.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Invalid phone number!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!isStrongPassword(password.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (password.trim() !== comform_password.trim()) {
    Swal.fire({
      title: 'Oops...',
      text: 'Password and comform password do not match!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  const body = {
    display_name: username.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password: password.trim(),
    confirm_password: comform_password.trim(),
    email_verify_code: email_verify_code.trim()
  }

  fetch('/api/users/register', {
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
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Input data error') {
        for (const key in data.errors) {
          Swal.fire({
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
        }
        return
      }

      if (data.message === 'Registration successful! Please log in again') {
        Swal.fire({
          title: 'Good job!',
          text: data.message
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.backdrop) {
            location.reload()
          } else {
            location.reload()
          }
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
}

function login() {
  const username = document.getElementById('username_login').value
  const password = document.getElementById('password_login').value

  if (username.trim() === '' || password.trim() === '') {
    Swal.fire({
      title: 'Oops...',
      text: 'Do not leave username or password blank!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(username.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Invalid email!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  const body = {
    email: username.trim(),
    password: password.trim()
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
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Input data error') {
        for (const key in data.errors) {
          Swal.fire({
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
        }
        return
      }

      if (data.message === 'Please change your temporary password before logging in') {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }

      if (data.message === 'Login successful!') {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)

        Swal.fire({
          title: 'Good job!',
          text: data.message
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
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
}

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})
