import { Request, Response } from 'express'

export const createController = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[]

  res.json({
    files
  })
}
