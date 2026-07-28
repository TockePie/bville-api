import { Request } from 'express'

import { UserPayload } from './user'

export interface RequestWithCookies extends Request {
  cookies: Record<string, string>
  user?: UserPayload
}
