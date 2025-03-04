import { User } from 'discord.js'
import { UserPermission } from '~/constants/enum'
import databaseService from '~/services/database.services'
import StatisticsService from '~/services/statistical.services'
import { sendMail } from '~/utils/mail'

export const statisticalReport = async () => {
  const currentMonth = new Date()
  const Users = await databaseService.users
    .find({
      permission: { $ne: UserPermission.CUSTOMER },
      temporary: false
    })
    .toArray()

  for (const user of Users) {
    const data = await StatisticsService.getMonthlyStatistics(user)

    const email_subject = `Báo Cáo Hàng Tháng - ${process.env.TRADEMARK_NAME}`
    const email_html = `
<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin: 0; padding: 0;">${process.env.TRADEMARK_NAME}</h1>
                <p style="font-size: 16px; color: #7f8c8d; margin-top: 5px;">Báo Cáo Doanh Thu Tháng ${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}</p>
                <div style="height: 3px; background: linear-gradient(to right, #3498db, #2ecc71); margin-top: 15px;"></div>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 20px;">Tổng Quan</h2>
                <p style="font-size: 15px; line-height: 1.5; color: #555;">Kính gửi quý doanh nghiệp,<br><br>
                Dưới đây là báo cáo tổng hợp về hoạt động kinh doanh của ${process.env.TRADEMARK_NAME} trong tháng ${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()} tính đến ngày ${String(currentMonth.getDate()).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}.</p>
            </div>

            <div style="display: flex; flex-wrap: wrap; margin-bottom: 30px; justify-content: space-between;">
                <div style="width: 32%; min-width: 180px; background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-sizing: border-box; border-left: 4px solid #2ecc71;">
                    <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #2c3e50;">Tổng Doanh Thu</h3>
                    <p style="font-size: 22px; font-weight: bold; margin: 0; color: #2c3e50;">${data.monthToDate.revenue.toLocaleString('vi-VN')}₫</p>
                    <div style="display: flex; align-items: center; margin-top: 8px;">
                        <span style="font-size: 14px; color: ${data.monthOverMonthChanges.revenueChange >= 0 ? '#2ecc71' : '#e74c3c'}; margin-right: 5px;">${data.monthOverMonthChanges.revenueChange >= 0 ? '↑' : '↓'} ${Math.abs(data.monthOverMonthChanges.revenueChange).toLocaleString('vi-VN')}%</span>
                        <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                    </div>
                    <p style="font-size: 13px; color: #7f8c8d; margin-top: 5px; margin-bottom: 0;">Tháng trước: ${data.previousMonth.revenue.toLocaleString('vi-VN')}₫</p>
                </div>
                
                <div style="width: 32%; min-width: 180px; background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-sizing: border-box; border-left: 4px solid ${data.monthOverMonthChanges.ticketsChange >= 0 ? '#2ecc71' : '#e74c3c'};">
                    <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #2c3e50;">Tổng Vé Bán Ra</h3>
                    <p style="font-size: 22px; font-weight: bold; margin: 0; color: #2c3e50;">${data.monthToDate.tickets.toLocaleString('vi-VN')}</p>
                    <div style="display: flex; align-items: center; margin-top: 8px;">
                        <span style="font-size: 14px; color: ${data.monthOverMonthChanges.ticketsChange >= 0 ? '#2ecc71' : '#e74c3c'}; margin-right: 5px;">${data.monthOverMonthChanges.ticketsChange >= 0 ? '↑' : '↓'} ${Math.abs(data.monthOverMonthChanges.ticketsChange).toLocaleString('vi-VN')}%</span>
                        <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                    </div>
                    <p style="font-size: 13px; color: #7f8c8d; margin-top: 5px; margin-bottom: 0;">Tháng trước: ${data.previousMonth.tickets.toLocaleString('vi-VN')}</p>
                </div>
                
                <div style="width: 32%; min-width: 180px; background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-sizing: border-box; border-left: 4px solid ${data.monthOverMonthChanges.dealsChange >= 0 ? '#2ecc71' : '#e74c3c'};">
                    <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #2c3e50;">Tổng Đơn Hàng</h3>
                    <p style="font-size: 22px; font-weight: bold; margin: 0; color: #2c3e50;">${data.monthToDate.deals.toLocaleString('vi-VN')}</p>
                    <div style="display: flex; align-items: center; margin-top: 8px;">
                        <span style="font-size: 14px; color: ${data.monthOverMonthChanges.dealsChange >= 0 ? '#2ecc71' : '#e74c3c'}; margin-right: 5px;">${data.monthOverMonthChanges.dealsChange >= 0 ? '↑' : '↓'} ${Math.abs(data.monthOverMonthChanges.dealsChange).toLocaleString('vi-VN')}%</span>
                        <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                    </div>
                    <p style="font-size: 13px; color: #7f8c8d; margin-top: 5px; margin-bottom: 0;">Tháng trước: ${data.previousMonth.deals.toLocaleString('vi-VN')}</p>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 20px;">Biểu Đồ So Sánh</h2>
                <div style="width: 100%; background-color: #f8f9fa; border-radius: 8px; padding: 15px; box-sizing: border-box; position: relative;">
                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; margin-right: 20px;">
                            <div style="width: 12px; height: 12px; background-color: #3498db; margin-right: 5px;"></div>
                            <span style="font-size: 13px; color: #7f8c8d;">Tháng 02/2025</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: #2ecc71; margin-right: 5px;"></div>
                            <span style="font-size: 13px; color: #7f8c8d;">Tháng 03/2025</span>
                        </div>
                    </div>
                    <div style="display: flex; height: 220px; align-items: flex-end; justify-content: space-around; padding-top: 20px;">
                        <div style="display: flex; flex-direction: column; align-items: center; width: 120px;">
                            <div style="display: flex; width: 100%; height: 200px; align-items: flex-end;">
                                <div style="height: ${
                                  data.monthToDate.revenue === 0 && data.previousMonth.revenue === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.previousMonth.revenue /
                                            Math.max(data.monthToDate.revenue, data.previousMonth.revenue)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: #3498db; margin-right: 5px;"></div>
                                <div style="height: ${
                                  data.monthToDate.revenue === 0 && data.previousMonth.revenue === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.monthToDate.revenue /
                                            Math.max(data.monthToDate.revenue, data.previousMonth.revenue)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: ${
                                  data.monthOverMonthChanges.revenueChange >= 0 ? '#2ecc71' : '#e74c3c'
                                };"></div>
                            </div>
                            <div style="margin-top: 5px; font-size: 12px; color: ${
                              data.monthOverMonthChanges.revenueChange >= 0 ? '#2ecc71' : '#e74c3c'
                            }; text-align: center;">${
                              data.monthOverMonthChanges.revenueChange >= 0 ? '+' : '-'
                            }${Math.abs(data.monthOverMonthChanges.revenueChange).toLocaleString('vi-VN')}%</div>
                            <p style="margin-top: 5px; font-size: 13px; color: #2c3e50;">Doanh Thu</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; width: 120px;">
                            <div style="display: flex; width: 100%; height: 200px; align-items: flex-end;">
                                <div style="height: ${
                                  data.monthToDate.tickets === 0 && data.previousMonth.tickets === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.previousMonth.tickets /
                                            Math.max(data.monthToDate.tickets, data.previousMonth.tickets)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: #3498db; margin-right: 5px;"></div>
                                <div style="height: ${
                                  data.monthToDate.tickets === 0 && data.previousMonth.tickets === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.monthToDate.tickets /
                                            Math.max(data.monthToDate.tickets, data.previousMonth.tickets)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: ${
                                  data.monthOverMonthChanges.ticketsChange >= 0 ? '#2ecc71' : '#e74c3c'
                                };"></div>
                            </div>
                            <div style="margin-top: 5px; font-size: 12px; color: ${
                              data.monthOverMonthChanges.ticketsChange >= 0 ? '#2ecc71' : '#e74c3c'
                            }; text-align: center;">${
                              data.monthOverMonthChanges.ticketsChange >= 0 ? '+' : '-'
                            }${Math.abs(data.monthOverMonthChanges.ticketsChange).toLocaleString('vi-VN')}%</div>
                            <p style="margin-top: 5px; font-size: 13px; color: #2c3e50;">Vé Bán Ra</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; width: 120px;">
                            <div style="display: flex; width: 100%; height: 200px; align-items: flex-end;">
                                <div style="height: ${
                                  data.monthToDate.deals === 0 && data.previousMonth.deals === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.previousMonth.deals /
                                            Math.max(data.monthToDate.deals, data.previousMonth.deals)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: #3498db; margin-right: 5px;"></div>
                                <div style="height: ${
                                  data.monthToDate.deals === 0 && data.previousMonth.deals === 0
                                    ? '0'
                                    : Math.max(
                                        Math.min(
                                          (data.monthToDate.deals /
                                            Math.max(data.monthToDate.deals, data.previousMonth.deals)) *
                                            100,
                                          100
                                        ),
                                        0
                                      )
                                }%; width: 40%; background-color: ${
                                  data.monthOverMonthChanges.dealsChange >= 0 ? '#2ecc71' : '#e74c3c'
                                };"></div>
                            </div>
                            <div style="margin-top: 5px; font-size: 12px; color: ${
                              data.monthOverMonthChanges.dealsChange >= 0 ? '#2ecc71' : '#e74c3c'
                            }; text-align: center;">${
                              data.monthOverMonthChanges.dealsChange >= 0 ? '+' : '-'
                            }${Math.abs(data.monthOverMonthChanges.dealsChange).toLocaleString('vi-VN')}%</div>
                            <p style="margin-top: 5px; font-size: 13px; color: #2c3e50;">Đơn Hàng</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
                <p>Báo cáo này được tạo tự động bởi hệ thống quản lý ${process.env.TRADEMARK_NAME}.</p>
                <p style="margin-bottom: 5px;">© ${currentMonth.getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    </div>
    `

    await sendMail(user.email, email_subject, email_html)
  }
}
