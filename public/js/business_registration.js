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

document.getElementById('btn').addEventListener('click', () => {
  const business_name = document.getElementById('business_name').value
  const phoneNumber = document.getElementById('business_phone').value
  const email = document.getElementById('business_email').value

  if (
    business_name == null ||
    business_name == undefined ||
    business_name.trim() == '' ||
    phoneNumber == null ||
    phoneNumber == undefined ||
    phoneNumber.trim() == '' ||
    email == null ||
    email == undefined ||
    email.trim() == ''
  ) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Không được để trống các trường dử liệu',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!isValidPhoneNumber(phoneNumber.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Số điện thoại không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Email không hợp lệ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  const body = {
    name: business_name.trim(),
    email: email.trim(),
    phone: phoneNumber.trim(),
    have_account: false
  }

  fetch('/api/business-registration/register', {
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

      if (data.message === 'Business registration successful!') {
        Swal.fire({
          title: 'Thành công',
          icon: 'success',
          text: data.message
        }).then((willRedirect) => {
          if (willRedirect) {
            window.location.href = '/'
          }
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
})

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})
