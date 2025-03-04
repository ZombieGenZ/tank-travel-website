const loading = document.querySelector('.loader');
window.onload = function() {
  loading.style.display = 'none';
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

let user = null;
let access_token = localStorage.getItem('access_token');
let refresh_token = localStorage.getItem('refresh_token');

function getUserInfo() {
  return new Promise((resolve) => {
    if (!refresh_token) {
      resolve(null);
      return;
    }

    const body = {
      refresh_token: refresh_token
    };

    fetch('/api/users/get-user-infomation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null && data !== undefined) {
          if (data.user !== null && data.user !== undefined) {
            user = data.user;
            localStorage.setItem('access_token', data.authenticate.access_token);
            localStorage.setItem('refresh_token', data.authenticate.refresh_token);
          }
          if (user != null) {
            const buttonlogin = document.getElementById('btn_login');
            const ul = document.getElementById('ul_links');
            const personal = document.createElement('div');
            const booking_history = document.createElement('li');
            const recharge = document.createElement('li');
            const personal_infor = document.getElementById('personal_infor');
            const So_du = document.createElement('div');
            So_du.classList.add('So_du');
            recharge.classList.add('link');
            recharge.innerHTML = '<a href="#"><i class="ri-money-dollar-circle-line"></i> Nạp tiền</a>';
            recharge.id = 'recharge_money';
            booking_history.classList.add('link');
            booking_history.innerHTML = '<a href="#"><i class="ri-history-line"></i> Lịch sử đặt vé</a>';
            booking_history.id = 'booking_history';
            personal.classList.add('menu');
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
                                  </div>`;
            So_du.innerText = `Số dư: ${user.balance.toLocaleString('vi-VN')} VNĐ`;
            buttonlogin.style.display = 'none';
            buttonlogin.disabled = true;
            personal_infor.appendChild(So_du);
            personal_infor.appendChild(personal);
            ul.appendChild(recharge);
            ul.appendChild(booking_history);

            So_du.addEventListener('click', () => {
              window.location.href = '/recharge';
            });

            recharge.addEventListener('click', () => {
              window.location.href = '/recharge';
            });

            booking_history.addEventListener('click', () => {
              window.location.href = '/booking_history';
            });

            document.getElementById('profile').addEventListener('click', () => {
              window.location.href = '/profile';
            });

            document.getElementById('logout').addEventListener('click', () => {
              const refresh_token = localStorage.getItem('refresh_token');
              const body = { refresh_token: refresh_token };
              fetch('/api/users/logout', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data === null || data === undefined) {
                    Swal.fire({
                      title: 'Oops...',
                      icon: 'error',
                      text: 'Lỗi kết nối đến máy chủ',
                      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                    });
                    return;
                  }
                  if (data.message == 'Đăng xuất thành công!') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    Swal.fire({
                      title: 'Thành công',
                      icon: 'success',
                      text: data.message
                    }).then((result) => {
                      window.location.href = '/';
                    });
                    return;
                  } else {
                    Swal.fire({
                      title: 'Oops...',
                      icon: 'error',
                      text: 'Error connecting to server',
                      footer: '<a href="https://discord.gg/7SkzMkFWYN">Cần hổ trợ? Liên hệ chúng tôi</a>'
                    });
                    return;
                  }
                });
            });
          }
          resolve();
        }
      });
  });
}

getUserInfo().then(() => {
  const each_ticket = document.querySelectorAll('.each_ticket');
  const viewhistory_container = document.querySelector('.viewhistory_container');
  viewhistory_container.style.animation = 'fade-in 1s ease-in-out';
  each_ticket.forEach(each_ticket => {
    each_ticket.style.animation = 'fade-in 1.5s ease-in-out';
  });

  document.getElementById('nav_logo').addEventListener('click', () => {
    window.location.href = '/';
  });
  document.getElementById('img_trangchu').addEventListener('click', () => {
    window.location.href = '/';
  });
  document.getElementById('btn_login').addEventListener('click', () => {
    window.location.href = '/login';
  });
  document.getElementById('ticket-information').addEventListener('click', () => {
    window.location.href = '/ticket-info';
  });
  document.getElementById('signup_business').addEventListener('click', () => {
    window.location.href = '/business_signup';
  });

  let number = 0;
  const date = new Date();
  const body1 = {
    refresh_token: refresh_token,
    session_time: date,
    current: number
  };
  let iduser = [];

  fetch('/api/order/get-order-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify(body1)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const container_hienthi = document.getElementById('accordionExample');
      if (data != null) {
        const dodai = data.result.bill.length;
        const number = {
          Num: [
            "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
            "Twenty-One", "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five",
            "Twenty-Six", "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
            "Thirty-One", "Thirty-Two", "Thirty-Three", "Thirty-Four", "Thirty-Five",
            "Thirty-Six", "Thirty-Seven", "Thirty-Eight", "Thirty-Nine", "Forty",
            "Forty-One", "Forty-Two", "Forty-Three", "Forty-Four", "Forty-Five",
            "Forty-Six", "Forty-Seven", "Forty-Eight", "Forty-Nine", "Fifty",
            "Fifty-One", "Fifty-Two", "Fifty-Three", "Fifty-Four", "Fifty-Five",
            "Fifty-Six", "Fifty-Seven", "Fifty-Eight", "Fifty-Nine", "Sixty",
            "Sixty-One", "Sixty-Two", "Sixty-Three", "Sixty-Four", "Sixty-Five",
            "Sixty-Six", "Sixty-Seven", "Sixty-Eight", "Sixty-Nine", "Seventy",
            "Seventy-One", "Seventy-Two", "Seventy-Three", "Seventy-Four", "Seventy-Five",
            "Seventy-Six", "Seventy-Seven", "Seventy-Eight", "Seventy-Nine", "Eighty",
            "Eighty-One", "Eighty-Two", "Eighty-Three", "Eighty-Four", "Eighty-Five",
            "Eighty-Six", "Eighty-Seven", "Eighty-Eight", "Eighty-Nine", "Ninety",
            "Ninety-One", "Ninety-Two", "Ninety-Three", "Ninety-Four", "Ninety-Five",
            "Ninety-Six", "Ninety-Seven", "Ninety-Nine", "One Hundred"
          ]
        };

        for (let i = 0; i < dodai; i++) {
          const index = data.result.bill[i];
          const number1 = number.Num[i];
          iduser.push(index._id);
          container_hienthi.innerHTML += `<div class="accordion-item">
                                        <h4 class="accordion-header">
                                          <div class="each_ticket">
                                              <div class="information">
                                                  <h3>${index.bus_route.start_point} - ${index.bus_route.end_point}</h3>
                                                  <div class="date_local">
                                                      <div class="detail_ticket start_point">
                                                          <h4>Điểm đi:</h4>
                                                          <p>${index.bus_route.start_point}</p>
                                                      </div>
                                                      <div class="detail_ticket end_point">
                                                          <h4>Điểm đến:</h4>
                                                          <p>${index.bus_route.end_point}</p>
                                                      </div>
                                                      <div class="detail_ticket date_begin">
                                                          <h4>Ngày - giờ đi:</h4>
                                                          <p>${formatDate(index.bus_route.arrival_time)}</p>
                                                      </div>
                                                      <div class="detail_ticket price">
                                                          <h4>Số lượng vé:</h4>
                                                          <p>${index.quantity} vé</p>
                                                      </div>
                                                      <div class="detail_ticket price">
                                                          <h4>Tổng tiền:</h4>
                                                          <p>${index.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                                      </div>
                                                  </div>
                                                  <div class="morinfor_bookbutton">
                                                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${number1}" aria-expanded="false" aria-controls="collapse${number1}">
                                                          Chi tiết tuyến xe đã đặt
                                                      </button>
                                                  </div>                    
                                              </div>
                                          </div>
                                        </h4>
                                        <div id="collapse${number1}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                          <div class="accordion-body">Nhấn để xem chi tiết</div>
                                        </div>
                                      </div>`;
        }

        // Thêm sự kiện cho accordion-button
        document.querySelectorAll('.accordion-button').forEach((button, index) => {
          button.addEventListener('click', () => {
            const accordionBody = button.closest('.accordion-item').querySelector('.accordion-body');
            const orderId = iduser[index];
            const isCollapsed = !button.classList.contains('collapsed');

            // Chỉ load chi tiết khi accordion được mở và chưa load trước đó
            if (isCollapsed && accordionBody.innerHTML === 'Nhấn để xem chi tiết') {
              const body2 = {
                refresh_token: refresh_token,
                order_id: orderId,
                current: 0
              };

              fetch('/api/order/get-order-detail-list', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access_token}`
                },
                body: JSON.stringify(body2)
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  if (data && data.result && data.result.bill) {
                    const orderDetails = data.result.bill;
                    let table = `<table>
                                  <thead>
                                    <tr>
                                      <th scope="col">Số thứ tự vé</th>
                                      <th scope="col">Trạng thái</th>
                                      <th scope="col">Giá vé</th>
                                      <th scope="col">Huỷ vé</th>
                                    </tr>
                                  </thead>
                                  <tbody>`;
                    orderDetails.forEach((ticket, idx) => {
                      table += `<tr>
                                  <th scope="row">${idx + 1}</th>
                                  <td><span class="status_ticket">${ticket.status == 0 ? 'Thành công' : 'Thất bại'}</span></td>
                                  <td>${ticket.price.toLocaleString('vi-VN')} VNĐ</td>
                                  <td><button class="btn btn_cancel_ticket" onclick="cancel_ticket('${ticket._id}')" data-index="${idx}"><i class="ri-close-circle-fill"></i> Huỷ vé</button></td>
                                </tr>`;
                    });
                    table += `</tbody></table>`;
                    accordionBody.innerHTML = table;
                  } else {
                    accordionBody.innerHTML = 'Không có chi tiết đơn hàng.';
                  }
                })
                .catch((error) => {
                  console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                  accordionBody.innerHTML = 'Có lỗi xảy ra khi tải chi tiết.';
                });
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    });
});

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
  });
});

function cancel_ticket(id) {
  console.log(id)
}
