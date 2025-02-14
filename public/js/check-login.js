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
          localStorage.setItem('access_token', data.authenticate.access_token)
          localStorage.setItem('refresh_token', data.authenticate.refresh_token)

          window.location.href = '/'
        }
      }
    })
}
