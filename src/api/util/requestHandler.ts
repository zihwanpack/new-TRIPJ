import { AxiosError } from 'axios';
import { z } from 'zod';
import { ApiError } from '../../errors/customErrors.ts';

interface RequestHandlerParams<T> {
  request: () => Promise<{ data: { result: T } }>;
  ErrorClass: new (message: string, status: number) => Error;
  schema: z.ZodType<T>;
}

export const requestHandler = async <T>({
  request,
  ErrorClass,
  schema,
}: RequestHandlerParams<T>): Promise<T> => {
  try {
    const { data } = await request();

    if (schema) {
      const parsed = schema.safeParse(data.result);

      if (!parsed.success) {
        throw new ErrorClass(`Schema validation failed: ${parsed.error.message}`, 500);
      }

      return parsed.data;
    }

    return data.result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof AxiosError) {
      throw new ErrorClass(
        error.response?.data?.message ?? error.message,
        error.response?.status ?? 500
      );
    }

    if (error instanceof ErrorClass) {
      throw error;
    }
    throw new ErrorClass('An unknown error occurred', 500);
  }
};
