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
            So_du.innerText = `Số dư: ${user.balance} VNĐ`
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
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
          return
        }

        if (data.result.message == 'Lấy thông tin tuyến thất bại') {
          Swal.fire({
            title: 'Oops...',
            icon: 'error',
            text: 'Lỗi kết nối đến máy chủ',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
          })
          return
        }

        if (data.message === 'Lỗi dữ liệu đầu vào') {
          for (const key in data.errors) {
            Swal.fire({
              title: 'Oops...',
              icon: 'error',
              text: data.errors[key].msg,
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
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
            const route = busRoute[i];
            list.innerHTML += `
                <li class="each_ticket">
                  <div class="information">
                      <h3>${route.start_point} to ${route.end_point}</h3>
                      <hr>
                      <div class="date_local">
                          <div class="detail_ticket start_point">
                              <h4>Departure:</h4>
                              <p>${route.start_point}</p>
                          </div>
                          <div class="detail_ticket end_point">
                              <h4>Destination:</h4>
                              <p>${route.end_point}</p>
                          </div>
                          <div class="detail_ticket date_begin">
                              <h4>Date-time:</h4>
                              <p>${formatDate(route.departure_time)}</p>
                          </div>
                          <div class="detail_ticket price">
                              <h4>Phương tiện:</h4>
                              <p>${route.vehicle.vehicle_type == "0" ? "Xe khách" : "Tàu hỏa"}</p>
                          </div>
                          <div class="detail_ticket price">
                              <h4>Giá tiền:</h4>
                              <p>${route.price.toLocaleString('vi-VN')} VNĐ</p>
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

          const moreinfor_ticket = document.querySelectorAll('.moreinfor_ticket')
            moreinfor_ticket.forEach((moreinfor) => {
              moreinfor.addEventListener('click', () => {
                const index = moreinfor.dataset.index;
                console.log(busRoute[index]);
                  Swal.fire({
                    title: 'Thông tin chi tiết vé xe',
                    html: `<div class="input__group">
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
                            <input type="input" class="form__field" placeholder="Name" value="${busRoute[index].vehicle.vehicle_type == "0" ? "Xe khách" : "Tàu hỏa"}" readOnly>
                            <label for="name" class="form__label">Phương tiện:</label>
                        </div>`,
                    focusConfirm: false,
                    showConfirmButton: false,
                    showCancelButton: true,
                    icon: 'info',
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
                    if(result.isConfirmed) {
                      window.location.href = '/login'
                    }
                  })
                })
              })
            } else if (user != null) {
              const book_ticket = document.querySelectorAll('.book_ticket')
              book_ticket.forEach((book) => {
                book.addEventListener('click',() => {
                  const index = book.dataset.index;
                  console.log(busRoute[index])
                  Swal.fire({
                    icon: 'info',
                    title: 'Thông tin đặt vé',
                    html: `
                      <div class="input__group">
                          <input type="input" class="form__field" id="fullname_booking" placeholder="Name" required="">
                          <label for="name" class="form__label">Họ và tên:</label>
                      </div>
                      <div class="input__group">
                          <input type="email" class="form__field" id="email_booking" placeholder="Name" required="">
                          <label for="name" class="form__label">Email:</label>
                      </div>
                      <div class="input__group">
                          <input type="input" class="form__field" id="phone_booking" placeholder="Name" required="">
                          <label for="name" class="form__label">Số điện thoại:</label>
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
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Đặt vé',
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
  })
})

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
          text: 'Error connecting to server',
          footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
        })
        return
      }
    })
})
