import { Logger } from '@nestjs/common'

import { envSchema } from './env.schema'

const logger = new Logger('ValidateEnv')

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    logger.error('Invalid environment variables:', result.error.format())
    throw new Error('Environment validation failed')
  }

  return result.data
}
