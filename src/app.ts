import express from 'express';
import { imageController } from './imageController';

const app = express();

app.use(express.json());
app.use('/api/images', imageController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
