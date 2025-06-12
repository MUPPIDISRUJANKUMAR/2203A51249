import express from "express";
import bodyParser from "body-parser";

import numbersRoute from "./routes/numbers.js";

const app = express();
const PORT = 9876;

app.use(bodyParser.json());

app.use("/", numbersRoute);

app.get("/", (req, res) => res.send("Hello from HomePage."));

app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
