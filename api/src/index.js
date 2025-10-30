import express from 'express';
import router from './routes/router.js';
import connectDb from "./config/db.js";
import { populateBuildings } from './controllers/buildingController.js';
import {clearActiveZSETCache} from "./config/cache.js";

const PORT = 80;

const app = express();
app.use(express.json());
app.use(router);

connectDb();
populateBuildings().then((res) => {
    console.log(res.message);
});
clearActiveZSETCache();

app.listen(PORT, async () => {
    console.log(`Server is running on port ` + PORT + ` ...`);
});
