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
      try {
        return schema.parse(data.result);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error('Zod error:', zodError);
          const errorMessages = zodError.issues.map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
            return `${path}: ${issue.message}`;
          });
          throw new ErrorClass(`Schema validation failed: ${errorMessages.join(', ')}`, 500);
        }
        throw zodError;
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
