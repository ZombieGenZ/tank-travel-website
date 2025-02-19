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
          const dropdown_personal = document.getElementById('dropdown_personal')
          recharge.classList.add('link')
          recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Recharge</a>'
          recharge.id = 'recharge_money'
          booking_history.classList.add('link')
          booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Booking history</a>'
          booking_history.id = 'booking_history'
          personal.id = 'personal'
          personal.innerHTML = '<i class="ri-user-3-line"></i>'
          buttonlogin.style.display = 'none'
          buttonlogin.disabled = true
          personal_infor.appendChild(personal)
          ul.appendChild(recharge)
          ul.appendChild(booking_history)

          personal.addEventListener('click', () => {
            dropdown_personal.classList.toggle('active')
          })

          recharge.addEventListener('click', () => {
            window.location.href = '/recharge'
          })

          booking_history.addEventListener('click', () => {
            window.location.href = '/booking_history'
          })
        }
      }
    })
}

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})

document.getElementById('img_trangchu').addEventListener('click', () => {
  window.location.href = '/'
})

document.getElementById('profile').addEventListener('click', () => {
  window.location.href = '/profile'
})

document.getElementById('btn_login').addEventListener('click', () => {
  window.location.href = '/login'
})

document.getElementById('ticket-information').addEventListener('click', () => {
  window.location.href = '/ticket-info'
})

document.getElementById('signup_business').addEventListener('click', () => {
  window.location.href = '/business_signup'
})

function formatDate(dateString) {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

const session_time = new Date().toISOString()
let current = 0

window.addEventListener('load', () => {
  const body = {
    session_time: session_time,
    current: current
  }

  fetch('/api/bus-route/get-bus-route-list', {
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

      if (data.result.message == 'Failed to get bus route information') {
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

      if (data.result.message == 'No matching results found') {
        document.getElementById('see_more').innerHTML = ''
        return
      }

      if (data.result.busRoute !== null && data.result.busRoute !== undefined) {
        const list = document.getElementById('list_ticket')
        const busRoute = data.result.busRoute

        for (const key in busRoute) {
          list.innerHTML += `
              <li class="each_ticket">
                <div class="information">
                    <h3>${busRoute[key].start_point} to ${busRoute[key].end_point}</h3>
                    <div class="date_local">
                        <div class="detail_ticket start_point">
                            <h4>Departure:</h4>
                            <p>${busRoute[key].start_point}</p>
                        </div>
                        <div class="detail_ticket end_point">
                            <h4>Destination:</h4>
                            <p>${busRoute[key].end_point}</p>
                        </div>
                        <div class="detail_ticket date_begin">
                            <h4>Date:</h4>
                            <p>${formatDate(busRoute[key].departure_time)}</p>
                        </div>
                        <div class="detail_ticket price">
                            <h4>Price:</h4>
                            <p>${busRoute[key].price.toLocaleString('vi-VN')} VND</p>
                        </div>
                    </div>
                    <div class="morinfor_bookbutton">
                        <button class="btn">More information</button>
                        <button class="btn">Book</button>    
                    </div>
                </div>    
            </li>
          `
        }

        current = data.result.current
        if (!data.result.continued) {
          document.getElementById('see_more').innerHTML = ''
        } else {
          document.getElementById('see_more').innerHTML = `<h3>See more <i class="ri-arrow-down-line"></i></h3>`
        }
      }
    })
})
