import { BadRequestException } from '@nestjs/common'

import { Prisma } from '../../generated/prisma/client'

export type PrismaErrorMap = Record<string, string>

export function CatchPrisma(errorMap: PrismaErrorMap) {
  return function <T extends (...args: any[]) => Promise<unknown>>(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value

    if (!originalMethod) {
      return descriptor
    }

    descriptor.value = async function (
      this: unknown,
      ...args: Parameters<T>
    ): Promise<unknown> {
      try {
        return await originalMethod.apply(this, args)
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (errorMap[error.code]) {
            throw new BadRequestException({ error: errorMap[error.code] })
          }
        }
        throw error
      }
    } as T

    return descriptor
  }
}
