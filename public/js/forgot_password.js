const button = document.getElementById('btn')

button.addEventListener('click', () => {
  const email = document.getElementById('email_changepass').value.trim()
  if (!validateEmail(email)) {
    Swal.fire({
      title: 'Oops...',
      text: 'Vui lòng điền đầy đủ các thông tin',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  }

  const body = {
    email
  }

  fetch('/api/users/send-email-forgot-password', {
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
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message === 'Lỗi dữ liệu đầu vào') {
        for (const key in data.errors) {
          Swal.fire({
            title: 'Oops...',
            text: data.errors[key].msg,
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
        }
        return
      }

      if (data.message == 'Email yêu cầu đặt lại mật khẩu đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn') {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }
    })
})

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})
