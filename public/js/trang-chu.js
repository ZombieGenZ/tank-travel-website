let user = null
let access_token = localStorage.getItem('access_token')
let refresh_token = localStorage.getItem('refresh_token')

if (
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
          access_token = data.authenticate.access_token
          refresh_token = data.authenticate.refresh_token
        }

        if (user != null) {
          const buttonlogin = document.getElementById('btn_login')
          const ul = document.getElementById('ul_links')
          const personal = document.createElement('div')
          const booking_history = document.createElement('li')
          const recharge = document.createElement('li')
          const personal_infor = document.getElementById('personal_infor')
          const dropdown_personal = document.getElementById('dropdown_personal')
          const So_du = document.createElement('div')
          So_du.classList.add('So_du')
          recharge.classList.add('link')
          recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Recharge</a>'
          recharge.id = 'recharge_money'
          booking_history.classList.add('link')
          booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Booking history</a>'
          booking_history.id = 'booking_history'
          personal.id = 'personal'
          personal.innerHTML = '<i class="ri-user-3-line"></i>'
          So_du.innerText = `Số dư: ${0} VNĐ`
          buttonlogin.style.display = 'none'
          buttonlogin.disabled = true
          personal_infor.appendChild(So_du)
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

document.getElementById('a_logout').addEventListener('click', () => {
  const refresh_token = localStorage.getItem('refresh_token')

  const body = { refresh_token: refresh_token }

  fetch('/api/users/logout', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((response) => {
      return response.json()
  }).then((data) => {
      if (data === null || data === undefined) {
        Swal.fire({
          title: 'Oops...',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }

      if (data.message == 'Đăng xuất thành công!') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        Swal.fire({
          title: 'Thành công',
          icon: 'success',
          text: data.message
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.backdrop) {
            window.location.href = '/'
          } else {
            window.location.href = '/'
          }
        })
        return
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }
    })
})

const typed = new Typed('#text', {
  strings: [
    document.getElementById('text').textContent, 'A trip to healing. ' , 'A memorable trip. '
  ],
  typeSpeed: 100,
  backSpeed: 100,
  loop: true
});

