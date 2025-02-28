$(document).ready(function(){
  $('#myModal').modal('show');
});

const loading = document.querySelector('.loader')
window.onload = function() {
  loading.style.display = 'none'
}

let user = null
let access_token = localStorage.getItem('access_token')
let refresh_token = localStorage.getItem('refresh_token')

fetch('https://provinces.open-api.vn/api/?depth=1')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    const list_province_go = document.getElementById('provinces_go')
    const list_province_arrive = document.getElementById('provinces_arrive')
    data.forEach((province) => {
      const name = province.name.replace(/Tỉnh /g, '').replace(/Thành phố /g, 'TP ')
      const option_value = `<option value="${name}">`
      list_province_go.innerHTML += option_value
      list_province_arrive.innerHTML += option_value
    })
  })
  .catch((error) => {
    console.error('Lỗi:', error)
  })

fetch('/api/notification-global/get-notification')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    document.getElementById('modal-title').textContent = data.title
    document.getElementById('modal-img').src = data.images[0].url
    document.getElementById('modal-content').textContent = data.description
    document.getElementById('modal-author').textContent = data.display_name
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
            const So_du = document.createElement('div')
            So_du.classList.add('So_du')
            recharge.classList.add('link')
            recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Nạp tiền</a>'
            recharge.id = 'recharge_money'
            booking_history.classList.add('link')
            booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Lịch sử đặt vé</a>'
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

            document.getElementById('profile').addEventListener('click', () => {
              window.location.href = '/profile'
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
          }
          resolve()
        }
      })
  })
}

function convertToISO8601UTC(dateString) {
  const date = new Date(dateString)
  date.setUTCHours(17)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  const isoString = date.toISOString().replace(/\.\d+Z$/, '.0000000Z')
  return isoString
}

let vehicleSelection = 0

getUserInfo().then(() => {
  const Xe_Khach = document.querySelector('.booking_nav button:nth-child(1)')
  const Tau_Hoa = document.querySelector('.booking_nav button:nth-child(2)')
  const SearchBtn = document.getElementById('search_bus')

  Xe_Khach.addEventListener('click', () => {
    vehicleSelection = 0
    Xe_Khach.style.backgroundColor = '#3d5cb8'
    Xe_Khach.style.color = 'white'
    Tau_Hoa.style.backgroundColor = '#f1f5f9'
    Tau_Hoa.style.color = '#64748b'
  })

  Tau_Hoa.addEventListener('click', () => {
    vehicleSelection = 1
    Tau_Hoa.style.backgroundColor = '#3d5cb8'
    Tau_Hoa.style.color = 'white'
    Xe_Khach.style.backgroundColor = '#f1f5f9'
    Xe_Khach.style.color = '#64748b'
  })

  SearchBtn.addEventListener('click', () => {
    const start_point = document.getElementById('provinces_go_selected').value
    const end_point = document.getElementById('provinces_arrive_selected').value
    const date = document.getElementById('date-go').value

    if (
      start_point == null ||
      start_point == undefined ||
      start_point == '' ||
      end_point == null ||
      end_point == undefined ||
      end_point == '' ||
      date == null ||
      date == undefined ||
      date == ''
    ) {
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        text: 'Vui lòng nhập đầy đủ thông tin',
        footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
      })
      return
    }

    if (start_point === end_point) {
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        text: 'Điểm đi và điểm đến không được trùng nhau',
        footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
      })
      return
    }

    const encodedStartPoint = encodeURIComponent(start_point)
    const encodedEndPoint = encodeURIComponent(end_point)
    const encodedDepartureTime = encodeURIComponent(convertToISO8601UTC(date))
    const encodedVehicleSelection = encodeURIComponent(vehicleSelection)

    window.location.href = `/ticket-info/?vehicle_type=${encodedVehicleSelection}&start_point=${encodedStartPoint}&end_point=${encodedEndPoint}&departure_time=${encodedDepartureTime}`
  })

  document.getElementById('nav_logo').addEventListener('click', () => {
    window.location.href = '/'
  })

  document.getElementById('img_trangchu').addEventListener('click', () => {
    window.location.href = '/'
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
})

document.getElementById('Contact_us').addEventListener('click', () => {
  Swal.fire({
    title: 'Liên hệ chúng tôi',
    icon: 'info',
    html: `<div>
            <ul class="ul_contact">
              <li>Số điện thoại: 0908651852</li>
              <li>Email: namndtb00921@fpt.edu.vn</li>
            </ul>
           </div>`
  })
})

const typed = new Typed('#text', {
  strings: [
    document.getElementById('text').textContent,
    'An tâm tuyệt đối, hành trình trọn vẹn.',
    'Nhanh chóng, đúng giờ, không lo trễ hẹn.'
  ],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true
})
