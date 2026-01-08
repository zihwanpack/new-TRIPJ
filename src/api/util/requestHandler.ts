import { AxiosError } from 'axios';
import { z } from 'zod';

interface RequestHandlerParams<T> {
  request: () => Promise<{ data: { result: T } }>;
  ErrorClass: new (message: string, status: number) => Error;
  schema?: z.ZodSchema<T>;
}

export const requestHandler = async <T>({
  request,
  ErrorClass,
  schema,
}: RequestHandlerParams<T>): Promise<T> => {
  try {
    const { data } = await request();
    if (schema) {
      const { success, error } = schema.safeParse(data.result);
      if (!success) {
        throw new ErrorClass(`Schema validation failed: ${error.message}`, 500);
      }
    }
    return data.result;
  } catch (error) {
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
