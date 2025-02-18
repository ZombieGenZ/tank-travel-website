export interface CreateBankOrderRequestBody {
  refresh_token: string
  amount: number
}

export interface CheckoutBankOrderRequestBody {
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: number | null
  referenceCode: string
  description: string
}
