const server_url = 'https://tank-travel.io.vn'

let user = null
const access_token = localStorage.getItem('access_token')
const refresh_token = localStorage.getItem('refresh_token')

const button_data = document.querySelectorAll('.btn_toview')
const money_view = document.getElementById('money_view')
button_data.forEach((button) => {
  button.addEventListener('click', () => {
    const data_view = button.textContent
    money_view.value = data_view
  })
})

document.getElementById('Contact_us').addEventListener('click', () => {
  Swal.fire({
    title: "Liên hệ chúng tôi",
    icon: 'info',
    html: `<div>
            <ul class="ul_contact">
              <li>Số điện thoại: 0908651852</li>
              <li>Email: namndtb00921@fpt.edu.vn</li>
            </ul>
           </div>`,
  });
})

const recharge_grid = document.getElementById('recharge_container')
const recharge_choose = document.getElementById('recharge_choose')
const recharge_payment = document.querySelectorAll('.recharge_payment')
const recharge_button = document.getElementById('recharge_button')
const amount1 = document.getElementById('money_view')
const loader = document.getElementById('loader')
let socket
recharge_grid.style.animation = 'fade-Y 1s ease-in-out'
recharge_button.addEventListener('click', () => {
  const amount = document.getElementById('money_view').value
  const button_data = document.querySelectorAll('.btn_toview')
  if (amount.value === '') {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Vui lòng điền số tiền cần nạp',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  } else if (Number(amount) < 1000) {
    Swal.fire({
      title: 'Oops...',
      icon: 'error',
      text: 'Số tiền cần nạp phải lớn hơn hoặc bằng 1.000 VNĐ',
      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
    })
    return
  } else {
    recharge_choose.style.animation = 'fade-in .5s ease-in-out'
    recharge_button.style.backgroundColor = 'gray'
    recharge_grid.style.animation = 'width-out .5s ease-in-out'
    recharge_grid.style.width = '70%'
    recharge_grid.style.gridTemplateColumns = '1fr 1fr 1fr'
    recharge_payment.forEach((dis) => {
      dis.style.display = 'flex'
      dis.style.animation = 'fade-in .5s ease-in-out'
    })
    amount1.readOnly = true
    button_data.forEach(button_disabled => {
      button_disabled.disabled = true
    })
    recharge_button.disabled = true
  }
  const price_information = document.getElementById('price_information')
  price_information.innerText = `Price: ${Number(amount.value).toLocaleString('vi-VN')} VNĐ`

  const access_token = document.getElementById('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  const body = {
    refresh_token: refresh_token,
    amount: Number(amount)
  }

  fetch('/api/revenue/create-bank-order', {
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
      if (data === null || data === undefined) {
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

      if (data.result !== null) {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)

        const refresh_token = localStorage.getItem('refresh_token')

        socket = io(server_url, {
          withCredentials: true,
          transports: ['websocket']
        })
        socket.on('update-order-status', (res) => {
          const wallet = Number(document.getElementById('wallet_money').value)

          document.getElementById('wallet_money').value = wallet + res.amount

          loader.classList.remove('loader')
          loader.classList.add('Success')
          const Success = document.createElement('h2')
          Success.innerText = 'Thành công'
          loader.appendChild(Success)

          Swal.fire({
            title: 'Thành công',
            icon: 'success',
            text: 'Nạp tiền thành công!'
          })
        })

        socket.emit('connect-payment-realtime', refresh_token, data.result.order_id)

        document.getElementById('bank-qr').src = data.result.payment_qr_url
        document.getElementById('bank-owner').innerHTML = `Account owner: ${data.result.account_name}`
        document.getElementById('bank-number').innerHTML = `Account number: ${data.result.account_no}`
        document.getElementById('bank-content').innerHTML = `Money transfer content: ${data.result.order_id}`
        document.getElementById('price_information').innerHTML = `Price: ${Number(amount).toLocaleString()}đ`
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Lỗi kết nối đến máy chủ',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        }).then(() => {
          loader.classList.remove('loader')
          loader.classList.add('Failed')
          const Failed = document.createElement('h2')
          Success.innerText = 'Thất bại'
          loader.appendChild(Failed)
        })
        return
      }
    })
})

function getUserInfo() {
  return new Promise((resolve) => {
    if (!refresh_token) {
      resolve(null)
      return
    }

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
            So_du.innerText = `Số dư: ${user.balance.toLocaleString('vi-VN')} VNĐ`
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
          resolve()
        }
      })
  })
}

window.addEventListener('load', () => {
  getUserInfo().then(() => {
    const my_wallet = document.getElementById('wallet_money')
    my_wallet.value = user.balance
  })
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
          icon: 'error',
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
          icon: 'error',
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }
    })
})

document.getElementById('nav_logo').addEventListener('click', () => {
  window.location.href = '/'
})

document.getElementById('img_trangchu').addEventListener('click', () => {
  window.location.href = '/'
})

document.getElementById('bill_information').addEventListener('click', () => {
  window.location.href = '/bill_information'
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
