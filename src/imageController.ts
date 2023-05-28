import { Router, Request, Response } from "express";
import { addImageToQueue, getImageDetails, getImageList } from "./imageService";
import { redis } from "./imageService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const imageUrl = req.body.url;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  const result = await addImageToQueue(imageUrl);
  res.status(200).json(result);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const imageDetails = await getImageDetails(id);

  if (!imageDetails) {
    return res.status(404).json({ message: "Image not found" });
  }

  res.status(200).json(imageDetails);
});

router.get("/", async (_req: Request, res: Response) => {
  const imageList = await getImageList();

  if (!imageList) {
    return res
      .status(404)
      .json({ message: "Images not found or no images to be displayed" });
  }

  res.status(200).json(imageList);
});

router.get("/download/:id", async (req, res) => {
  const id = req.params.id;

  const imageData = await redis.get(id);
  if (!imageData) {
    res.status(404).json({ message: "Image data not found" });
    return;
  }

  let fileType = "";
  switch (imageData.slice(0, 3)) {
    case "/9j":
      fileType = "image/jpeg";
      break;
    case "iVB":
      fileType = "image/png";
      break;
    default:
      fileType = "";
  }

  const buffer = Buffer.from(imageData, "base64");

  res.setHeader("Content-Type", fileType);
  res.send(buffer);
});

export { router as imageController };
