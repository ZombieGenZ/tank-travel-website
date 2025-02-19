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
      text: 'Password and confirm password cannot be left blank',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!isStrongPassword(password.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Password must be at least 8 characters long and contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and special characters',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (password.trim() !== confirmPassword.trim()) {
    Swal.fire({
      title: 'Oops...',
      text: 'Password and confirm password do not match',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

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

      if (data.message == 'Password changed successfully! Please log in again') {
        Swal.fire({
          title: 'Good job!',
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
