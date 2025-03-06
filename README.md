# Tank Travel - Hệ thống đặt vé xe khách trực tuyến 🚍

## Giới thiệu ℹ️
Tank Travel là một nền tảng đặt vé xe khách/tàu hỏa trực tuyến, cung cấp giải pháp thuận tiện cho hành khách và doanh nghiệp vận tải. Hệ thống hỗ trợ quản lý đặt vé, theo dõi doanh thu, thông báo realtime và nhiều tính năng hữu ích khác.

## Công nghệ sử dụng 🛠️
- **Frontend**: HTML, CSS, JavaScript, EJS 🌐
- **Backend**: Express.js + TypeScript ⚙️
- **Cơ sở dữ liệu**: MongoDB 🗄️
- **Xác thực**: JWT 🔑
- **Realtime**: Firebase, Socket.io ⏱️
- **Thông báo**: Discord bot 🤖, email (Nodemailer) 📧
- **Thanh toán**: Sepay 💳

## Các API chính 📡

| Chức năng               | Endpoint                                      | HTTP Method | Mô tả                           |
|-------------------------|-----------------------------------------------|-------------|---------------------------------|
| **Quản lý người dùng**  | `/api/users/send-email-verify`                | `POST`      | Gửi email xác thực tài khoản 📩 |
|                         | `/api/users/resend-email-verify`              | `PUT`       | Gửi lại email xác thực tài khoản 🔄 |
|                         | `/api/users/register`                         | `POST`      | Tạo tài khoản mới 🆕           |
|                         | `/api/users/login`                            | `POST`      | Đăng nhập 🔐                  |
|                         | `/api/users/logout`                           | `DELETE`    | Đăng xuất 🚪                  |
|                         | `/api/users/change-display-name`              | `PUT`       | Thay đổi tên hiển thị ✏️      |
|                         | `/api/users/send-email-forgot-password`       | `POST`      | Gửi email quên mật khẩu 📬    |
|                         | `/api/users/forgot-password`                  | `POST`      | Đặt lại mật khẩu 🔑           |
|                         | `/api/users/change-password`                  | `PUT`       | Thay đổi mật khẩu 🔒          |
|                         | `/api/users/send-email-verify-change-email`   | `POST`      | Gửi mã xác nhận thay đổi email 📧 |
|                         | `/api/users/resend-email-verify-change-email` | `PUT`       | Gửi lại mã xác nhận thay đổi email 🔄 |
|                         | `/api/users/change-email`                     | `PUT`       | Thay đổi email ✉️             |
|                         | `/api/users/change-phone`                     | `PUT`       | Thay đổi số điện thoại 📱     |
|                         | `/api/users/change-avatar`                    | `PUT`       | Thay đổi ảnh đại diện 🖼️     |
|                         | `/api/users/set-default-avatar`               | `PUT`       | Đặt ảnh đại diện mặc định 🖼️  |
|                         | `/api/users/change-password-temporary`        | `PUT`       | Đổi mật khẩu tạm thời (dành cho tài khoản doanh nghiệp) 🔐 |
|                         | `/api/users/get-user-infomation`              | `POST`      | Lấy thông tin người dùng ℹ️   |
|                         | `/api/users/login-manage`                     | `POST`      | Đăng nhập tài khoản quản lý 🔑 |
| **Quản lý phương tiện** | `/api/vehicle/get-vehicle-type`               | `POST`      | Lấy thông tin loại phương tiện 🚗 |
|                         | `/api/vehicle/get-seat-type`                  | `POST`      | Lấy thông tin loại chỗ ngồi 💺 |
|                         | `/api/vehicle/create`                         | `POST`      | Tạo phương tiện mới 🆕        |
|                         | `/api/vehicle/update`                         | `PUT`       | Cập nhật phương tiện ✏️      |
|                         | `/api/vehicle/delete`                         | `DELETE`    | Xóa phương tiện 🗑️           |
|                         | `/api/vehicle/get-vehicle`                    | `POST`      | Lấy thông tin phương tiện ℹ️  |
|                         | `/api/vehicle/get-vehicle-preview`            | `POST`      | Lấy thông tin phương tiện xem trước 👀 |
|                         | `/api/vehicle/find-vehicle`                   | `POST`      | Tìm kiếm phương tiện 🔍       |
|                         | `/api/vehicle/censor-vehicle`                 | `PUT`       | Kiểm duyệt phương tiện ✅     |
|                         | `/api/vehicle/get-vehicle-list`               | `POST`      | Lấy danh sách phương tiện 📋  |
|                         | `/api/vehicle/get-vehicle-registration`       | `POST`      | Lấy thông tin đăng ký phương tiện 📝 |
| **Quản lý tuyến**       | `/api/bus-route/create`                       | `POST`      | Tạo tuyến mới 🆕             |
|                         | `/api/bus-route/update`                       | `PUT`       | Sửa tuyến ✏️                 |
|                         | `/api/bus-route/delete`                       | `DELETE`    | Xóa tuyến 🗑️                |
|                         | `/api/bus-route/get-bus-route`                | `POST`      | Lấy danh sách tuyến 📋        |
|                         | `/api/bus-route/find-bus-route`               | `POST`      | Tìm kiếm tuyến 🔍            |
|                         | `/api/bus-route/get-bus-route-list`           | `POST`      | Lấy danh sách tuyến (không yêu cầu xác thực) 📋 |
|                         | `/api/bus-route/find-bus-route-list`          | `POST`      | Tìm kiếm tuyến (không yêu cầu xác thực) 🔍 |
| **Quản lý đơn hàng**    | `/api/order/`                                 | `POST`      | Đặt đơn hàng 🛒              |
|                         | `/api/order/get-order-list`                   | `POST`      | Lấy danh sách đơn hàng của khách hàng 📋 |
|                         | `/api/order/get-order-detail-list`            | `POST`      | Lấy chi tiết đơn hàng ℹ️     |
|                         | `/api/order/get-order`                        | `POST`      | Lấy danh sách đơn hàng của doanh nghiệp 📋 |
|                         | `/api/order/cancel-ticket`                    | `PUT`       | Hủy vé ❌                    |
| **Quản lý đánh giá**    | `/api/evaluate/create`                        | `POST`      | Tạo đánh giá ⭐              |
|                         | `/api/evaluate/update`                        | `PUT`       | Sửa đánh giá ✏️             |
|                         | `/api/evaluate/delete`                        | `DELETE`    | Xóa đánh giá 🗑️            |
|                         | `/api/evaluate/get-evaluate`                  | `POST`      | Lấy danh sách đánh giá 📋    |
|                         | `/api/evaluate/create-feedback`               | `POST`      | Tạo phản hồi đánh giá 💬     |
|                         | `/api/evaluate/update-feedback`               | `PUT`       | Sửa phản hồi đánh giá ✏️     |
|                         | `/api/evaluate/delete-feedback`               | `DELETE`    | Xóa phản hồi đánh giá 🗑️    |
|                         | `/api/evaluate/get-evaluate-list`             | `POST`      | Lấy danh sách đánh giá của phương tiện 📋 |
| **Đăng ký doanh nghiệp**| `/api/business-registration/register`         | `POST`      | Đăng ký doanh nghiệp 🏢      |
|                         | `/api/business-registration/censor`           | `PUT`       | Kiểm duyệt đăng ký ✅        |
|                         | `/api/business-registration/get-business-registration` | `POST` | Lấy thông tin doanh nghiệp đã đăng ký ℹ️ |
| **Quản lý thông báo hệ thống** | `/api/notification-global/set-notification` | `PUT` | Tạo thông báo hệ thống 📢    |
|                         | `/api/notification-global/remove-notification`| `DELETE` | Xóa thông báo hệ thống 🗑️   |
|                         | `/api/notification-global/get-notification`   | `GET`       | Lấy thông báo hệ thống ℹ️   |
| **Quản lý tài khoản**   | `/api/account-management/get-account`         | `POST`      | Lấy danh sách tài khoản 📋   |
|                         | `/api/account-management/find-account`        | `POST`      | Tìm kiếm tài khoản 🔍        |
|                         | `/api/account-management/ban-account`         | `PUT`       | Khóa tài khoản 🚫           |
|                         | `/api/account-management/unban-account`       | `PUT`       | Mở khóa tài khoản ✅         |
|                         | `/api/account-management/send-notification`   | `POST`      | Gửi thông báo 📩            |
| **Thống kê**            | `/api/statistical/get-revenue-statistics`     | `POST`      | Lấy thống kê doanh thu trong ngày 📊 |
|                         | `/api/statistical/find-revenue-statistics`    | `POST`      | Lấy thống kê doanh thu theo khoảng thời gian 📈 |
|                         | `/api/statistical/get-order-statistics`       | `POST`      | Lấy thống kê số vé đã đặt trong ngày 🎟️ |
|                         | `/api/statistical/find-order-statistics`      | `POST`      | Lấy thống kê số vé đã đặt theo khoảng thời gian 📈 |
|                         | `/api/statistical/get-deal-statistics`        | `POST`      | Lấy thống kê số đơn hàng trong ngày 🛒 |
|                         | `/api/statistical/find-deal-statistics`       | `POST`      | Lấy thống kê số đơn hàng theo khoảng thời gian 📈 |
|                         | `/api/statistical/chart/revenue`              | `POST`      | Lấy thông tin thống kê doanh thu dưới dạng biểu đồ 📉 |
|                         | `/api/statistical/top/revenue`                | `POST`      | Lấy danh sách top doanh thu trong 7 ngày gần nhất 🏆 |
|                         | `/api/statistical/compare/deals`              | `POST`      | Lấy tỉ lệ chênh lệch số lượng đơn hàng so với ngày hôm trước 📊 |
|                         | `/api/statistical/compare/revenue`            | `POST`      | Lấy tỉ lệ chênh lệch số doanh thu so với ngày hôm trước 📊 |
|                         | `/api/statistical/compare/ticket`             | `POST`      | Lấy tỉ lệ chênh lệch số lượng vé đã bán so với ngày hôm trước 📊 |
|                         | `/api/statistical/overview`                   | `POST`      | Lấy số đơn hàng, số vé đã bán và số doanh thu trong ngày 📋 |
| **Thanh toán**          | `/api/revenue/create-bank-order`              | `POST`      | Tạo đơn hàng thanh toán ngân hàng 💵 |
|                         | `/api/revenue/checkout-bank-order`            | `POST`      | Xử lý phản hồi thanh toán từ Sepay ✅ |
| **Quản lý thông báo cá nhân** | `/api/notification-private/get-notification` | `POST` | Lấy thông báo của người dùng 📩 |

## Liên hệ 📞
- **Website**: [tank-travel.io.vn](https://tank-travel.io.vn/) 🌐
- **Discord**: [Tank Travel Support](https://discord.gg/7SkzMkFWYN) 💬
- **Repository**: [Tank Travel Repository]([link-to-repository]) 📂

## Người thực hiện 👥

| Tên                        | Vai Trò                  |
|----------------------------|-------------------------|
| Nguyễn Đặng Thành Thái     | 👨‍💼 Quản Lý Dự Án         |
| Ngô Gia Bảo                | 🧪 Chuyên viên Testing   |
| Nguyễn Đình Nam            | 💻 Lập Trình Frontend    |
| Nguyễn Đức Anh             | 💻 Lập Trình Frontend    |
| Bùi Đăng Khoa              | 💻 Lập Trình Backend    |
