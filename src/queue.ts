import Queue from 'bull';
import { downloadImage } from './imageService';

export const imageQueue = new Queue('image-download');

imageQueue.process(async (job) => {
  await downloadImage(job.data);
});

setInterval(() => imageQueue.clean(10000), 10000);
