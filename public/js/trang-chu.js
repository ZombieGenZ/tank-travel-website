let user = null
const access_token = localStorage.getItem('access_token')
const refresh_token = localStorage.getItem('refresh_token')

if (
  access_token !== null &&
  access_token !== undefined &&
  access_token !== '' &&
  refresh_token !== null &&
  refresh_token !== undefined &&
  refresh_token !== ''
) {
  const body = {
    refresh_token: refresh_token
  }

  fetch('/api/users/get-user-infomation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify(body)
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data !== null && data !== undefined) {
        if (data.user !== null && data.user !== undefined) {
          user = data.user
          localStorage.setItem('access_token', data.authenticate.access_token)
          localStorage.setItem('refresh_token', data.authenticate.refresh_token)
        }

        if (user != null) {
          const buttonlogin = document.getElementById('btn_login')
          const ul = document.getElementById('ul_links')
          const personal = document.createElement('div')
          const booking_history = document.createElement('li')
          const recharge = document.createElement('li')
          const personal_infor = document.getElementById('personal_infor')
          recharge.classList.add('link')
          recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Recharge</a>'
          booking_history.classList.add('link')
          booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Booking history</a>'
          personal.id = 'personal'
          personal.innerHTML = '<i class="ri-user-3-line"></i>'
          buttonlogin.style.display = 'none'
          buttonlogin.disabled = true
          personal_infor.appendChild(personal)
          ul.appendChild(recharge)
          ul.appendChild(booking_history)
        }
      }
    })
}

document.getElementById('btn_login').addEventListener('click', () => {
  window.location.href = '/login'
})

document.getElementById('ticket-information').addEventListener('click', () => {
  window.location.href = '/ticket-info'
})

document.getElementById('signup_business').addEventListener('click', () => {
  window.location.href = '/business_signup'
})

