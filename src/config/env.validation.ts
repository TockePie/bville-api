import { Logger } from '@nestjs/common'
import z from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.url(),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(3306),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  SUPPLIER_URL: z.url(),
  ROZETKA_API_KEY: z.string()
})

export type EnvConfig = z.infer<typeof envSchema>

const logger = new Logger('ValidateEnv')

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    logger.error('Invalid environment variables:', result.error.format())
    throw new Error('Environment validation failed')
  }

  return result.data
}
