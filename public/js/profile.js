const loading = document.querySelector('.loader')
window.onload = function () {
  loading.style.display = 'none'
}

let user = null
const access_token = localStorage.getItem('access_token')
const refresh_token = localStorage.getItem('refresh_token')

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
                                      <span><i class="ri-user-2-fill"></i>${user.display_name}</span>
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
          }
          resolve()
        }
      })
  })
}

window.addEventListener('load', () => {
  getUserInfo().then(() => {
    document.getElementById('img_infor_1').src = user.avatar.url
    document.getElementById('displayname').value = user.display_name
    document.getElementById('email_user').value = user.email
    document.getElementById('phone_user').value = user.phone

    document.getElementById('imageInput').addEventListener('change', (e) => {
      let file = e.target.files[0]
      if (file) {
        let reader = new FileReader()
        reader.onload = (event) => {
          let img = document.getElementById('img_infor_1')
          img.src = event.target.result;
        }
        reader.readAsDataURL(file)

        const formData = new FormData()
        formData.append('refresh_token', refresh_token)
        formData.append('new_avatar', file)

        fetch('/api/users/change-avatar', {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data) // Ở ĐÂY
      })
      }
    })

    const save_btn = document.getElementById('btn_save_infor')
    save_btn.addEventListener('click', () => {
      let img = document.getElementById('img_infor_1')
      const body = {
        refresh_token: refresh_token,
        new_avatar: img.src
      }
      fetch('/api/users/change-avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(body)
      }).then((response) => {
        return response.json()
      }).then((data) => {
        console.log(data)
        if(data.errorInfo.message == "request entity too large") {
          Swal.fire({
            title: 'Thay đổi ảnh thất bại',
            icon: 'error',
            text: 'Ảnh đại diện có dung lượng quá lớn'
          })
          return
        }

        if(data.message == "Bạn phải tải lên ảnh đại diện") {
          Swal.fire({
            title: 'Thay đổi ảnh thất bại',
            icon: 'error',
            text: 'Bạn phải chọn ảnh đại diện'
          })
          return
        }

        Swal.fire({
          title: 'Thành công',
          icon: 'success',
          text: 'Thay đổi ảnh đại diện thành công!'
        })
      })
    })

    document.getElementById('logout').addEventListener('click', () => {
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
              icon: 'error',
              text: 'Error connecting to server',
              footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
            })
            return
          }
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


