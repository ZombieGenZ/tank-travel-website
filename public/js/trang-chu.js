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
          const personal = document.createElement('div')
          const personal_infor = document.getElementById('personal_infor')
          personal.id = 'personal'
          personal.innerHTML = '<i class="ri-user-3-line"></i>'
          buttonlogin.innerText = 'Logout'
          personal_infor.parentNode.appendChild(personal)
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

