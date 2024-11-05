import { Router, Request, Response} from 'express'
import { checkAuth, checkLoginAuth } from '../middleware/auth'

const pageRouter = Router()

// In-memory database
let users: User[] = [
  { username: 'admin', password: 'admin12345' },
]

// Home route
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index')
})

// Login route
pageRouter.get('/login', checkLoginAuth, (req: Request, res: Response) => {
  res.status(200).render('login')
})

// Process login route
pageRouter.post('/login', (req: Request<{}, {}, User>, res: Response) => {
  const { username, password } = req.body
  const found = users.find(user => user.username === username && user.password === password)
  if (found) {
    res.cookie('authToken', 'authenticated', {
      maxAge: 3 * 60 * 1000, // 3 minutes
      httpOnly: true,
      signed: true
    })
    res.cookie('user_info', JSON.stringify({ // Convert object to string
      username: found.username
    }), {
      maxAge: 3 * 60 * 1000,
      httpOnly: true
    })
    res.redirect('/profile')
  } else {
    res.redirect('/login')
  }
})

// Profile route
pageRouter.get('/profile', checkAuth, (req: Request, res: Response) => {
  const { username } = JSON.parse(req.cookies.user_info) // Convert string to object
  res.status(200).render('profile', { username })
})

// Logout Route
pageRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken')
  res.clearCookie('user_info')
  res.redirect('/login')
})

export default pageRouter
