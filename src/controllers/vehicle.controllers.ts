import { Request, Response } from 'express'

export const createController = (req: Request, res: Response) => {
  const preview = req.preview
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  res.json({
    preview,
    authenticate
  })
}
