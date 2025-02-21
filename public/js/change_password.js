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

function changePassword() {
  const password = document.getElementById('new_password').value
  const confirmPassword = document.getElementById('confirm_new_password').value

  if (
    password == null ||
    password == undefined ||
    password.trim() == '' ||
    confirmPassword == null ||
    confirmPassword == undefined ||
    confirmPassword.trim() == ''
  ) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Không được để trống các trường dử liệu',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!isStrongPassword(password.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất 3 trong số các ký tự sau: chữ hoa, chữ thường, số và ký tự đặc biệt',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (password.trim() !== confirmPassword.trim()) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Mật khẩu và xác nhận mật khẩu không trùng khớp',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  const close_pass = document.querySelectorAll('.close_pass')
  const open_pass = document.querySelectorAll('.open_pass')
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
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const body = {
    token,
    new_password: password.trim(),
    comform_new_password: confirmPassword.trim()
  }

  fetch('/api/users/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data === null || data === undefined) {
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

      if (data.message == 'Thay đổi mật khẩu thành công! Vui lòng đăng nhập lại') {
        Swal.fire({
          title: 'Thành công!',
          icon: 'success',
          text: data.message
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.backdrop) {
            window.location.href = '/login'
          } else {
            window.location.href = '/login'
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
