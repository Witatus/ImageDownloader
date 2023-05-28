import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { imageQueue } from "./queue";
import Redis from "ioredis";

export const redis = new Redis();

export interface ImageDetails {
  id: string;
  sourceUrl: string;
  storageUrl: string;
  requestedAt: Date;
  downloadedAt: Date | null;
}

export async function addImageToQueue(imageUrl: string): Promise<string> {
  const id = uuidv4();
  await imageQueue.add({ id, imageUrl });

  const imageDetails: ImageDetails = {
    id,
    sourceUrl: imageUrl,
    storageUrl: "",
    requestedAt: new Date(),
    downloadedAt: null,
  };

  await redis.set(`image:${id}`, JSON.stringify(imageDetails));

  const baseURL = process.env.BASE_URL || "http://localhost:3000";
  return `${baseURL}/api/images/${id}`;
}

export async function getImageDetails(
  id: string
): Promise<ImageDetails | null> {
  const imageData = await redis.get(`image:${id}`);
  return imageData ? JSON.parse(imageData) : null;
}

export async function getImageList(): Promise<ImageDetails[] | null> {
  const imageKeys = await redis.keys("image:*");

  if (imageKeys.length === 0) {
    return null;
  }

  const imagesData = await redis.mget(...imageKeys);
  return imagesData.map((data) => JSON.parse(data || ""));
}

export async function downloadImage(data: {
  id: string;
  imageUrl: string;
}): Promise<void> {
  const response = await axios.get(data.imageUrl, {
    responseType: "arraybuffer",
  });
  const buffer64 = Buffer.from(response.data, "binary").toString("base64");

  const imageDetails = await getImageDetails(data.id);

  const baseURL = process.env.BASE_URL || "http://localhost:3000";

  if (imageDetails) {
    imageDetails.storageUrl =
      baseURL + `/api/images/download/image-data:${imageDetails.id}`;
    imageDetails.downloadedAt = new Date();
    await redis.set(`image:${data.id}`, JSON.stringify(imageDetails));
    await redis.set(`image-data:${imageDetails.id}`, buffer64);
  }
}
