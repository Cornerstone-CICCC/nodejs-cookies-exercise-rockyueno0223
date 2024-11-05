import { Request, Response, NextFunction } from 'express'

// Check authToken cookie for Login page
export const checkLoginAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authToken } = req.signedCookies
  if (authToken === 'authenticated') {
    res.redirect('/profile')
  } else {
    next()
  }
}

// Check authentication for Profile
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authToken } = req.signedCookies
  if (authToken === 'authenticated') {
    next()
  } else {
    res.redirect('/login')
  }
}
