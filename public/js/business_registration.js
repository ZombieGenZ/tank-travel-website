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
      text: 'Do not leave data fields blank.',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!isValidPhoneNumber(phoneNumber.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Your phone number is not exist. Please right the correct phone number',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
    })
    return
  }

  if (!validateEmail(email.trim())) {
    Swal.fire({
      title: 'Oops...',
      text: 'Your email is not exist. Please right the correct email',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
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

      if (data.message === 'Business registration successful!') {
        Swal.fire({
          title: 'Good job!',
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
          text: data.message,
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
      }
    })
})
