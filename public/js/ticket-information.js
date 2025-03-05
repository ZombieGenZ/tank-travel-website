const loading = document.querySelector('.loaders')
window.onload = function() {
  loading.style.display = 'none'
}

let user = null
const access_token = localStorage.getItem('access_token')
const refresh_token = localStorage.getItem('refresh_token')

function formatDate(dateString) {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

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

const session_time = new Date().toISOString()
let current = 0

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
            const notification = document.createElement('div')
            notification.classList.add('notification')
            notification.innerHTML = `<button class="button btn">
                                        <i class="ri-notification-2-fill bell"></i>
                                        <div class="arrow">›</div>
                                      </button>
                                      <div class="dropdown">
                                        <div class="dropdown-item">🔔 Bạn có một thông báo mới</div>
                                        <div class="dropdown-item">📩 Tin nhắn chưa đọc</div>
                                        <div class="dropdown-item">⚠️ Cập nhật bảo mật</div>
                                      </div>`
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
            personal_infor.appendChild(notification)
            personal_infor.appendChild(personal)
            ul.appendChild(recharge)
            ul.appendChild(booking_history)

            So_du.addEventListener('click', () => {
              window.location.href = '/recharge'
            })

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
                      icon: 'success',
                      title: 'Thành công',
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
                      text: 'Lỗi kết nối đến server',
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

window.addEventListener('load', () => {
  getUserInfo().then(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const vehicle_type = urlParams.get('vehicle_type')
    const start_point = urlParams.get('start_point')
    const end_point = urlParams.get('end_point')
    const departure_time = urlParams.get('departure_time')

    const decodedVehicleType = decodeURIComponent(vehicle_type)
    const decodedStartPoint = decodeURIComponent(start_point)
    const decodedEndPoint = decodeURIComponent(end_point)

    if (vehicle_type && start_point && end_point && departure_time) {
      const body = {
        session_time: session_time,
        vehicle_type: decodedVehicleType,
        start_point: decodedStartPoint,
        end_point: decodedEndPoint,
        departure_time,
        current: current
      }

      fetch('/api/bus-route/find-bus-route-list', {
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
          console.log(data)
          if (data == null || data == undefined) {
            Swal.fire({
              title: 'Oops...',
              icon: 'error',
              text: 'Lỗi kết nối đến máy chủ',
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
            })
            return
          }

          if (data.result.message == 'Lấy thông tin tuyến thất bại') {
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

          if (data.result.message == 'Không tìm thấy kết quả phù hợp') {
            document.getElementById('see_more').innerHTML = ''
            return
          }

          if (data.result.busRoute !== null && data.result.busRoute !== undefined) {
            const list = document.getElementById('list_ticket')
            const busRoute = data.result.busRoute

            for (let i = 0; i < busRoute.length; i++) {
              const route = busRoute[i]
              list.innerHTML += `
                  <li class="each_ticket">
                    <div class="information">
                        <h3>${route.start_point} - ${route.end_point}</h3>
                        <hr>
                        <div class="date_local">
                            <div class="detail_ticket start_point">
                                <h4>Điểm đi:</h4>
                                <p>${route.start_point}</p>
                            </div>
                            <div class="detail_ticket end_point">
                                <h4>Điểm đến:</h4>
                                <p>${route.end_point}</p>
                            </div>
                            <div class="detail_ticket date_begin">
                                <h4>Ngày - giờ đi:</h4>
                                <p>${formatDate(route.departure_time)}</p>
                            </div>
                            <div class="detail_ticket price">
                                <h4>Giá tiền:</h4>
                                <p>${route.price.toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                            <div class="detail_ticket">
                                <h4>Số vé hiện có:</h4>
                                <p>${route.quantity} vé</p>
                            </div>
                        </div>
                        <div class="morinfor_bookbutton">
                            <button class="btn moreinfor_ticket" data-index="${i}">Thông tin chi tiết</button>
                            <button class="btn book_ticket" data-index="${i}">Đặt ngay</button>    
                        </div>
                    </div>    
                </li>
              `
            }

            const each_ticket = document.querySelectorAll('.each_ticket')
            each_ticket.forEach((ticket, index) => {
              ticket.style.animation = `fade-in ${index * 0.1 + 0.8}s ease-in-out`
            })

            const moreinfor_ticket = document.querySelectorAll('.moreinfor_ticket')
            moreinfor_ticket.forEach((moreinfor) => {
              moreinfor.addEventListener('click', () => {
                const index = moreinfor.dataset.index
                Swal.fire({
                  title: 'Thông tin chi tiết vé xe',
                  html: `<div class="input__group slideshow-container">
                          <div class="slides">
                            <div class="slide"><img src="${busRoute[index].vehicle.preview[0].url}" alt="Slide 1"></div>
                          </div>
                          <button class="prev">❮</button>
                          <button class="next">❯</button>
                        </div>
                          <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].start_point}" readOnly>
                              <label for="name" class="form__label">Nơi đi:</label>
                          </div>
                          <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].end_point}" readOnly>
                              <label for="name" class="form__label">Nơi đến:</label>
                          </div>
                          <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${formatDate(busRoute[index].departure_time)}" readOnly>
                              <label for="name" class="form__label">Thời gian đi:</label>
                          </div>
                          <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].price.toLocaleString('vi-VN')}" readOnly>
                              <label for="name" class="form__label">Giá vé (VNĐ):</label>
                          </div>
                          <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].vehicle.vehicle_type == '0' ? 'Xe khách' : 'Tàu hỏa'}" readOnly>
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

            if (user == null) {
              const book_ticket = document.querySelectorAll('.book_ticket')
              book_ticket.forEach((book) => {
                book.addEventListener('click', () => {
                  Swal.fire({
                    title: 'Oops...',
                    icon: 'error',
                    text: `Vui lòng đăng nhập để có thể đặt vé`,
                    showConfirmButton: true,
                    showDenyButton: true,
                    denyButtonText: `Thoát`,
                    confirmButtonText: 'Đăng nhập',
                    footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.href = '/login'
                    }
                  })
                })
              })
            } else if (user != null) {
              const book_ticket = document.querySelectorAll('.book_ticket')
              book_ticket.forEach((book) => {
                book.addEventListener('click', () => {
                  const index = book.dataset.index
                  Swal.fire({
                    title: 'Thông tin đặt vé',
                    html: `
                        <div class="input__group">
                            <input type="input" class="form__field" id="fullname_booking" value="${user.display_name}" placeholder="Name" required="">
                            <label for="name" class="form__label">Họ và tên:</label>
                        </div>
                        <div class="input__group">
                            <input type="email" class="form__field" id="email_booking" value="${user.email}" placeholder="Name" required="">
                            <label for="name" class="form__label">Email:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" id="phone_booking" value="${user.phone}" placeholder="Name" required="">
                            <label for="name" class="form__label">Số điện thoại:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" id="ticket_booking" value="1" placeholder="Name" required="">
                            <label for="name" class="form__label">Số vé:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].start_point}" readOnly>
                            <label for="name" class="form__label">Nơi đi:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].end_point}" readOnly>
                            <label for="name" class="form__label">Nơi đến:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${formatDate(busRoute[index].departure_time)}" readOnly>
                            <label for="name" class="form__label">Thời gian đi:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].price.toLocaleString('vi-VN')}" readOnly>
                            <label for="name" class="form__label">Giá vé:</label>
                        </div>
                        <div class="input__group">
                              <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].vehicle.vehicle_type == '0' ? 'Xe khách' : 'Tàu hỏa'}" readOnly>
                              <label for="name" class="form__label">Phương tiện:</label>
                        </div>
                        <div class="input__group">
                              <input type="input" class="form__field total_price" placeholder="Name" value="" readOnly>
                              <label for="name" class="form__label">Tổng giá vé:</label>
                        </div>
                      `,
                    focusConfirm: false,
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Đặt vé',
                    preConfirm: async () => {
                      const fullname = document.getElementById('fullname_booking').value
                      const email = document.getElementById('email_booking').value
                      const phone = document.getElementById('phone_booking').value
                      const quantity = document.getElementById('ticket_booking').value

                      if (
                        fullname == null ||
                        fullname == undefined ||
                        fullname.trim() == '' ||
                        email == null ||
                        email == undefined ||
                        email.trim() == '' ||
                        phone == null ||
                        phone == undefined ||
                        phone.trim() == '' ||
                        quantity == null ||
                        quantity == undefined ||
                        quantity.trim() == ''
                      ) {
                        Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin')
                        return false
                      }

                      if (Number(quantity.trim()) < 1 || Number(quantity.trim()) > 999) {
                        Swal.showValidationMessage('Số lượng vé phải lớn hơn 0 và bé hơn 1000')
                        return false
                      }

                      if (!validateEmail(email.trim())) {
                        Swal.showValidationMessage('Email không hợp lệ')
                        return false
                      }

                      if (!isValidPhoneNumber(phone.trim())) {
                        Swal.showValidationMessage('Số điện thoại không hợp lệ')
                        return false
                      }

                      const orderBody = {
                        refresh_token: refresh_token,
                        bus_route_id: busRoute[index]._id,
                        name: fullname.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                        quantity: Number(quantity.trim())
                      }

                      try {
                        const response = await fetch('/api/order', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${access_token}`
                          },
                          body: JSON.stringify(orderBody)
                        })

                        if (!response.ok) {
                          const errorData = await response.json()
                          if (errorData.message === 'Lỗi dữ liệu đầu vào' && errorData.errors) {
                            let errorMessages = ''
                            for (const key in errorData.errors) {
                              errorMessages += errorData.errors[key].msg + '<br>'
                            }
                            Swal.showValidationMessage(errorMessages)
                          } else {
                            Swal.showValidationMessage(errorData.message || 'Lỗi từ máy chủ')
                          }
                          return false
                        }

                        const data = await response.json()

                        if (data == null || data == undefined) {
                          Swal.showValidationMessage('Lỗi kết nối đến máy chủ')
                          return false
                        }

                        if (
                          data.message == 'Bạn phải đăng nhập bỏ sử dụng chức năng này' ||
                          data.message == 'Refresh token không hợp lệ' ||
                          data.message == 'Bạn không có quyền thực hiện hành động này'
                        ) {
                          Swal.showValidationMessage(data.message)
                          return false
                        }

                        localStorage.setItem('refresh_token', data.authenticate.refresh_token)
                        localStorage.setItem('access_token', data.authenticate.access_token)

                        if (
                          data.message == 'Số lượng vé phải là một số nguyên' ||
                          data.message == 'Số dư của bạn không đủ bỏ hoàn thành giao dịch này'
                        ) {
                          Swal.showValidationMessage(data.message)
                          return false
                        }

                        if (data.message === 'Đặt vé thành công!') {
                          await Swal.fire({
                            title: 'Thành công!',
                            icon: 'success',
                            text: data.message
                          }).then(() => {
                            location.reload()
                          })
                          return true
                        } else {
                          Swal.showValidationMessage(data.message)
                          return false
                        }
                      } catch (error) {
                        Swal.showValidationMessage('Lỗi kết nối đến máy chủ')
                        return false
                      }
                    },
                    footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                  })
                  const ticket_booking = document.querySelector('.ticket_booking');
                  const total_price = document.querySelector('.total_price')
                  total_price.value = (ticket_booking.value * busRoute[index].price).toLocaleString('vi-VN')
                  ticket_booking.addEventListener('change', () => {
                    total_price.value = (ticket_booking.value * busRoute[index].price).toLocaleString('vi-VN')
                  })
                })
              })
            }

            current = data.result.current
            if (!data.result.continued) {
              document.getElementById('see_more').innerHTML = ''
            } else {
              document.getElementById('see_more').innerHTML = `<h3>See more <i class="ri-arrow-down-line"></i></h3>`
            }
          }
        })
        .then(() => {
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
      return
    }

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
        console.log(data)
        if (data == null || data == undefined) {
          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: 'Lỗi kết nối đến máy chủ',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
          })
          return
        }

        if (data.result.message == 'Lấy thông tin tuyến thất bại') {
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

        if (data.result.message == 'Không tìm thấy kết quả phù hợp') {
          document.getElementById('see_more').innerHTML = ''
          return
        }

        if (data.result.busRoute !== null && data.result.busRoute !== undefined) {
          const list = document.getElementById('list_ticket')
          const busRoute = data.result.busRoute

          for (let i = 0; i < busRoute.length; i++) {
            const route = busRoute[i]
            list.innerHTML += `
                <li class="each_ticket">
                  <div class="information">
                      <h3>${route.start_point} - ${route.end_point}</h3>
                      <hr>
                      <div class="date_local">
                          <div class="detail_ticket start_point">
                              <h4>Điểm đi:</h4>
                              <p>${route.start_point}</p>
                          </div>
                          <div class="detail_ticket end_point">
                              <h4>Điểm đến:</h4>
                              <p>${route.end_point}</p>
                          </div>
                          <div class="detail_ticket date_begin">
                              <h4>Ngày - giờ đi:</h4>
                              <p>${formatDate(route.departure_time)}</p>
                          </div>
                          <div class="detail_ticket price">
                              <h4>Giá tiền:</h4>
                              <p>${route.price.toLocaleString('vi-VN')} VNĐ</p>
                          </div>
                          <div class="detail_ticket">
                                <h4>Số vé hiện có:</h4>
                                <p>${route.quantity} vé</p>
                            </div>
                      </div>
                      <div class="morinfor_bookbutton">
                          <button class="btn moreinfor_ticket" data-index="${i}">Thông tin chi tiết</button>
                          <button class="btn book_ticket" data-index="${i}">Đặt ngay</button>    
                      </div>
                  </div>    
              </li>
            `
          }

          const each_ticket = document.querySelectorAll('.each_ticket')
          each_ticket.forEach((ticket, index) => {
            ticket.style.animation = `fade-in ${index * 0.1 + 0.8}s ease-in-out`
          })

          const moreinfor_ticket = document.querySelectorAll('.moreinfor_ticket')
          moreinfor_ticket.forEach((moreinfor) => {
            moreinfor.addEventListener('click', () => {
              const index = moreinfor.dataset.index
              Swal.fire({
                title: 'Thông tin chi tiết vé xe',
                html: `
                        <div class="input__group slideshow-container">
                          <div class="slides">
                            <div class="slide"><img src="${busRoute[index].vehicle.preview[0].url}" alt="Slide 1"></div>
                          </div>
                          <button class="prev">❮</button>
                          <button class="next">❯</button>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].start_point}" readOnly>
                            <label for="name" class="form__label">Nơi đi:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].end_point}" readOnly>
                            <label for="name" class="form__label">Nơi đến:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${formatDate(busRoute[index].departure_time)}" readOnly>
                            <label for="name" class="form__label">Thời gian đi:</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].price.toLocaleString('vi-VN')}" readOnly>
                            <label for="name" class="form__label">Giá vé (VNĐ):</label>
                        </div>
                        <div class="input__group">
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].vehicle.vehicle_type == '0' ? 'Xe khách' : 'Tàu hỏa'}" readOnly>
                            <label for="name" class="form__label">Phương tiện:</label>
                        </div>`,
                focusConfirm: false,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Thoát',
                footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>',
                didOpen: () => {
                  let index = 0;
                  const slides = document.querySelector(".slides");
                  const totalSlides = document.querySelectorAll(".slide").length;
                  const prevButton = document.querySelector(".prev");
                  const nextButton = document.querySelector(".next");
              
                  function showSlide(n) {
                    if (n >= totalSlides) index = 0;
                    if (n < 0) index = totalSlides - 1;
                    slides.style.transform = `translateX(-${index * 100}%)`;
                  }
              
                  nextButton.addEventListener("click", () => {
                    index++;
                    showSlide(index);
                  });
              
                  prevButton.addEventListener("click", () => {
                    index--;
                    showSlide(index);
                  });
              
                  setInterval(() => {
                    index++;
                    showSlide(index);
                  }, 3000);
                }
              })
            })
          })

          if (user == null) {
            const book_ticket = document.querySelectorAll('.book_ticket')
            book_ticket.forEach((book) => {
              book.addEventListener('click', () => {
                Swal.fire({
                  title: 'Oops...',
                  icon: 'error',
                  text: `Vui lòng đăng nhập để có thể đặt vé`,
                  showConfirmButton: true,
                  showDenyButton: true,
                  denyButtonText: `Thoát`,
                  confirmButtonText: 'Đăng nhập',
                  footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.href = '/login'
                  }
                })
              })
            })
          } else if (user != null) {
            const book_ticket = document.querySelectorAll('.book_ticket')
            book_ticket.forEach((book) => {
              book.addEventListener('click', () => {
                const index = book.dataset.index
                Swal.fire({
                  title: 'Thông tin đặt vé',
                  html: `
                      <div class="input__group">
                          <input type="input" class="form__field" id="fullname_booking" value="${user.display_name}" placeholder="Name" required="">
                          <label for="name" class="form__label">Họ và tên:</label>
                      </div>
                      <div class="input__group">
                          <input type="email" class="form__field" id="email_booking" value="${user.email}" placeholder="Name" required="">
                          <label for="name" class="form__label">Email:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" id="phone_booking" value="${user.phone}" placeholder="Name" required="">
                          <label for="name" class="form__label">Số điện thoại:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field ticket_booking" id="ticket_booking" value="1" placeholder="Name" required="">
                          <label for="name" class="form__label">Số vé:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].start_point}" readOnly>
                          <label for="name" class="form__label">Nơi đi:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].end_point}" readOnly>
                          <label for="name" class="form__label">Nơi đến:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" placeholder="Name" value="${formatDate(busRoute[index].departure_time)}" readOnly>
                          <label for="name" class="form__label">Thời gian đi:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].price.toLocaleString('vi-VN')}" readOnly>
                          <label for="name" class="form__label">Giá vé:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].vehicle.vehicle_type == '0' ? 'Xe khách' : 'Tàu hỏa'}" readOnly>
                          <label for="name" class="form__label">Phương tiện:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field total_price" placeholder="Name" value="" readOnly>
                          <label for="name" class="form__label">Tổng giá vé:</label>
                      </div>
                    `,
                  focusConfirm: false,
                  showCancelButton: true,
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Đặt vé',
                  preConfirm: async () => {
                    const fullname = document.getElementById('fullname_booking').value
                    const email = document.getElementById('email_booking').value
                    const phone = document.getElementById('phone_booking').value
                    const quantity = document.getElementById('ticket_booking').value

                    if (
                      fullname == null ||
                      fullname == undefined ||
                      fullname.trim() == '' ||
                      email == null ||
                      email == undefined ||
                      email.trim() == '' ||
                      phone == null ||
                      phone == undefined ||
                      phone.trim() == '' ||
                      quantity == null ||
                      quantity == undefined ||
                      quantity.trim() == ''
                    ) {
                      Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin')
                      return false
                    }

                    if (Number(quantity.trim()) < 1 || Number(quantity.trim()) > 999) {
                      Swal.showValidationMessage('Số lượng vé phải lớn hơn 0 và bé hơn 1000')
                      return false
                    }

                    if (!validateEmail(email.trim())) {
                      Swal.showValidationMessage('Email không hợp lệ')
                      return false
                    }

                    if (!isValidPhoneNumber(phone.trim())) {
                      Swal.showValidationMessage('Số điện thoại không hợp lệ')
                      return false
                    }

                    const orderBody = {
                      refresh_token: refresh_token,
                      bus_route_id: busRoute[index]._id,
                      name: fullname.trim(),
                      email: email.trim(),
                      phone: phone.trim(),
                      quantity: Number(quantity.trim())
                    }

                    try {
                      const response = await fetch('/api/order', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${access_token}`
                        },
                        body: JSON.stringify(orderBody)
                      })

                      if (!response.ok) {
                        const errorData = await response.json()
                        if (errorData.message === 'Lỗi dữ liệu đầu vào' && errorData.errors) {
                          let errorMessages = ''
                          for (const key in errorData.errors) {
                            errorMessages += errorData.errors[key].msg + '<br>'
                          }
                          Swal.showValidationMessage(errorMessages)
                        } else {
                          Swal.showValidationMessage(errorData.message || 'Lỗi từ máy chủ')
                        }
                        return false
                      }

                      const data = await response.json()

                      if (data == null || data == undefined) {
                        Swal.showValidationMessage('Lỗi kết nối đến máy chủ')
                        return false
                      }

                      if (
                        data.message == 'Bạn phải đăng nhập bỏ sử dụng chức năng này' ||
                        data.message == 'Refresh token không hợp lệ' ||
                        data.message == 'Bạn không có quyền thực hiện hành động này'
                      ) {
                        Swal.showValidationMessage(data.message)
                        return false
                      }

                      localStorage.setItem('refresh_token', data.authenticate.refresh_token)
                      localStorage.setItem('access_token', data.authenticate.access_token)

                      if (
                        data.message == 'Số lượng vé phải là một số nguyên' ||
                        data.message == 'Số dư của bạn không đủ bỏ hoàn thành giao dịch này'
                      ) {
                        Swal.showValidationMessage(data.message)
                        return false
                      }

                      if (data.message === 'Đặt vé thành công!') {
                        await Swal.fire({
                          title: 'Thành công!',
                          icon: 'success',
                          text: data.message
                        }).then(() => {
                          location.reload()
                        })
                        return true
                      } else {
                        Swal.showValidationMessage(data.message)
                        return false
                      }
                    } catch (error) {
                      Swal.showValidationMessage('Lỗi kết nối đến máy chủ')
                      return false
                    }
                  },
                  footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                })
                const ticket_booking = document.querySelector('.ticket_booking');
                const total_price = document.querySelector('.total_price')
                total_price.value = (ticket_booking.value * busRoute[index].price).toLocaleString('vi-VN')
                ticket_booking.addEventListener('change', () => {
                  total_price.value = (ticket_booking.value * busRoute[index].price).toLocaleString('vi-VN')
                })
              })
            })
          }

          current = data.result.current
          if (!data.result.continued) {
            document.getElementById('see_more').innerHTML = ''
          } else {
            document.getElementById('see_more').innerHTML = `<h3>See more <i class="ri-arrow-down-line"></i></h3>`
          }
        }
      })
      .then(() => {
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
  })
})
