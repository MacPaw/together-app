import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv'

dotenv.config();

const host = process.env.HOST!;
const token = process.env.JOBS_API_TOKEN!;

export default function handleJob(name: string): void {
  axios.get(`${host}/api/jobs/${name}?token=${token}`)
    .then(() => console.log(`The job \`${name}\` has been successfully initiated. Please see the server's logs for additional output upon completion.`))
    .catch((error) => {
      const hasErrorTextInResponse = axios.isAxiosError(error)
        && error.response
        && error.response.data
        && error.response.data.message;

      if (hasErrorTextInResponse) {
        console.log((error as AxiosError).response!.data!.message!);

        return;
      }

      const hasOtherErrorText = error instanceof Error && error.message;

      console.log(hasOtherErrorText ? (error as Error).message : 'Something went wrong. Try again.');
    });
}
