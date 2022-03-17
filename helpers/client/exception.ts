import axios, { AxiosError } from 'axios';

export const getErrorTextFromAxiosError = (error: unknown): string => {
  const hasErrorTextInResponse = axios.isAxiosError(error)
    && error.response
    && error.response.data
    && error.response.data.message;

  if (hasErrorTextInResponse) {
    return (error as AxiosError).response!.data!.message!;
  }

  const hasOtherErrorText = error instanceof Error && error.message;

  return hasOtherErrorText ? (error as Error).message : 'Something went wrong. Try again.';
}
