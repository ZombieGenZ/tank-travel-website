export interface BankRevenue {
  bank_name: string
  account_no: string
  description: string
  amount: number
}

export interface CardRevenue {
  card_type: string
  serial: string
  code: number
  amount: number
}
