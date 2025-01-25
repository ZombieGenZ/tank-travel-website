import { Request, Response, NextFunction } from 'express'

export const authenticationController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  const access_token = req.access_token

  if (!access_token) {
    res.json({
      user
    })
    return
  }

  res.json({
    user,
    access_token
  })
}
