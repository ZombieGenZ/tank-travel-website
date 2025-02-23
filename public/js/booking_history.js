let user = null
let access_token = localStorage.getItem('access_token')
let refresh_token = localStorage.getItem('refresh_token')

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
            console.log(user)
            const buttonlogin = document.getElementById('btn_login')
            const ul = document.getElementById('ul_links')
            const personal = document.createElement('div')
            const booking_history = document.createElement('li')
            const recharge = document.createElement('li')
            const personal_infor = document.getElementById('personal_infor')
            const So_du = document.createElement('div')
            So_du.classList.add('So_du')
            recharge.classList.add('link')
            recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Recharge</a>'
            recharge.id = 'recharge_money'
            booking_history.classList.add('link')
            booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Booking history</a>'
            booking_history.id = 'booking_history'
            personal.classList.add('menu')
            personal.innerHTML = `<div class="item">
                                    <a href="#" class="link">
                                      <span><i class="ri-user-2-fill"></i> ${user.display_name}</span>
                                      <svg viewBox="0 0 360 360" xml:space="preserve">
                                        <g id="SVGRepo_iconCarrier">
                                          <path
                                            id="XMLID_225_"
                                            d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                                          ></path>
                                        </g>
                                      </svg>
                                    </a>
                                    <div class="submenu">
                                      <div class="submenu-item">
                                        <a href="#" id="profile" class="submenu-link"> Thông tin tài khoản </a>
                                      </div>
                                      <div class="submenu-item">
                                        <a href="#" id="logout" class="submenu-link"> Đăng xuất </a>
                                      </div>
                                      <div class="submenu-item">
                                        <a href="#" id="bill_information" class="submenu-link"> Hoá đơn tổng </a>
                                      </div>
                                    </div>
                                  </div>`
            So_du.innerText = `Số dư: ${user.balance.toLocaleString('vi-VN')} VNĐ`
            buttonlogin.style.display = 'none'
            buttonlogin.disabled = true
            personal_infor.appendChild(So_du)
            personal_infor.appendChild(personal)
            ul.appendChild(recharge)
            ul.appendChild(booking_history)

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

getUserInfo().then(() => {
  const detail_infor = document.querySelectorAll('.detail_infor')
  const each_ticket = document.querySelectorAll('.each_ticket')
  const viewhistory_container = document.querySelector('.viewhistory_container')
  viewhistory_container.style.animation = 'fade-in 1s ease-in-out'
  each_ticket.forEach(each_ticket => {
    each_ticket.style.animation = 'fade-in 1.5s ease-in-out'
  })
  detail_infor.forEach(detail_infor => {
    detail_infor.addEventListener('click', () => {
      Swal.fire({
        title: 'Lịch sử đặt vé',
        html: ` <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Ngày đặt:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Nơi đi:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Nơi đến:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Ngày đi:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Số vé đặt trước:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Thời gian đi:</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Giá / vé (VNĐ):</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Tổng tiền (VNĐ):</label>
                </div>
                <div class="input__group">
                    <input type="input" class="form__field" placeholder="Name" value="" readOnly>
                    <label for="name" class="form__label">Phương tiện:</label>
                </div>`,
        focusConfirm: false,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Thoát',
        footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
      })
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

  document.getElementById('logout').addEventListener('click', () => {
    const refresh_token = localStorage.getItem('refresh_token')
  
    const body = { refresh_token: refresh_token }
  
    fetch('/api/users/logout', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
           </div>`
  })
})