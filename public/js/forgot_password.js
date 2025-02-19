const button = document.getElementById('btn')

button.addEventListener('click', () => {
  const email = document.getElementById('email_changepass').value.trim()
  if (!validateEmail(email)) {
    Swal.fire({
      title: 'Oops...',
      text: 'Email address cannot be left blank!',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
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

      if (data.message == 'Email sent successfully! Please check your inbox') {
        Swal.fire({
          title: 'Oops...',
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
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
})

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
