const openlogin = document.getElementById('open_login')
const loginform = document.getElementById('login_form')
const buttonclose = document.getElementById('button_close')
const usernamelogin = document.getElementById('username_login')
const password_login = document.getElementById('password_login')
const forgot_pass = document.getElementById('forget_password')
const close_pass = document.querySelectorAll('.close_pass')
const open_pass = document.querySelectorAll('.open_pass')

let isLogin = false

const new_password = document.getElementById('password_register')
close_pass[0].addEventListener('click', () => {
  close_pass[0].classList.add('off')
  open_pass[0].classList.add('on')
  new_password.type = 'text'
})

open_pass[0].addEventListener('click', () => {
  close_pass[0].classList.remove('off')
  open_pass[0].classList.remove('on')
  new_password.type = 'password'
})

const confirm_pass = document.getElementById('comfirm_password_register')
close_pass[1].addEventListener('click', () => {
  close_pass[1].classList.add('off')
  open_pass[1].classList.add('on')
  confirm_pass.type = 'text'
})

open_pass[1].addEventListener('click', () => {
  close_pass[1].classList.remove('off')
  open_pass[1].classList.remove('on')
  confirm_pass.type = 'password'
})

close_pass[2].addEventListener('click', () => {
  close_pass[2].classList.add('off')
  open_pass[2].classList.add('on')
  password_login.type = 'text'
})

open_pass[2].addEventListener('click', () => {
  close_pass[2].classList.remove('off')
  open_pass[2].classList.remove('on')
  password_login.type = 'password'
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
      icon: 'error',
      text: 'Vui lòng nhập email của bạn trước khi yêu cầu nhập mã xác nhận email',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Địa chỉ email không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
          icon: 'error',
          text: 'Không thể kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Lỗi dữ liệu đầu vào') {
        for (const key in data.errors) {
          if (data.errors[key].msg == 'Email đã được gửi, vui lòng kiểm tra hộp thư của bạn') {
            btn.innerText = 'Gửi lại?'
            btn.setAttribute('onclick', 'reSendEmail(this)')
            Swal.fire({
              title: 'Oops...',
              icon: 'error',
              text: data.errors[key].msg,
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
            })
            return
          }

          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
        }
        return
      }

      if (data.message === 'Gửi mã xác minh email thất bại') {
        Swal.fire({
          title: 'Oops...',
          icon: 'error',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Mã xác minh email đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn') {
        btn.innerText = 'Gửi lại?'
        btn.setAttribute('onclick', 'reSendEmail(this)')
        Swal.fire({
          title: 'Thành công!',
          icon: 'success',
          text: data.message
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          icon: 'error',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
      icon: 'error',
      text: 'Vui lòng nhập địa chỉ eamil trước khi yêu cầu gửi lại mã xác nhận email',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Địa chỉ email không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
          icon: 'error',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Lỗi dữ liệu đầu vào') {
        for (const key in data.errors) {
          if (data.errors[key].msg == 'Mã xác minh email chưa được gửi') {
            btn.innerText = 'Gửi mã?'
            btn.setAttribute('onclick', 'sendEmailVerify(this)')
            Swal.fire({
              title: 'Oops...',
              icon: 'error',
              text: data.errors[key].msg,
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
            })
            return
          }

          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
        }
        return
      }

      if (data.message === 'Gửi lại mã xác minh email thất bại') {
        Swal.fire({
          title: 'Oops...',
          icon: 'error',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Mã xác minh email đã được gửi lại thành công! Vui lòng kiểm tra hộp thư của bạn') {
        Swal.fire({
          title: 'Thành công!',
          icon: 'success',
          text: data.message
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          icon: 'error',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
  const comform_password = document.getElementById('comfirm_password_register').value
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
      icon: 'error',
      text: 'Không được bỏ trống các thông tin',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Địa chỉ email không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!isValidPhoneNumber(phone.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Số điện thoại không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!isStrongPassword(password.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Mật khẩu phải dài ít nhất 8 ký tự, chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (password.trim() !== comform_password.trim()) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Mật khẩu và mật khẩu đăng nhập không khớp',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
          icon: 'error',
          text: 'Lỗi khi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Lỗi dữ liệu đầu vào') {
        for (const key in data.errors) {
          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
        }
        return
      }

      if (data.message === 'Đăng ký thành công! Vui lòng đăng nhập lại') {
        Swal.fire({
          title: 'Thành công!',
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
          icon: 'error',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
      icon: 'error',
      text: 'Không được để trống các trường dử liệu',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!validateEmail(username.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Địa chỉ email không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
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
          icon: 'error',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Lỗi dữ liệu đầu vào') {
        for (const key in data.errors) {
          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
        }
        return
      }

      if (data.message === 'Vui lòng thay đổi mật khẩu tạm thời trước khi đăng nhập') {
        Swal.fire({
          title: 'Oops...',
          icon: 'error',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Đăng nhập thành công!') {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)
        localStorage.setItem('islogin', true)
        Swal.fire({
          title: 'Thành công!',
          icon: 'success',
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
          icon: 'error',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }
    })
}

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})
