export interface MulterFile extends Express.Multer.File {
  buffer: Buffer
}
