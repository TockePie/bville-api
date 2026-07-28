import { z } from 'zod'

export const JwtPayloadSchema = z.object({
  sub: z.uuid(),
  login: z.string()
})

export type JwtPayload = z.infer<typeof JwtPayloadSchema>
