import express from "express";
import axios from "axios";

const router = express.Router();
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;

let numbersWindow = [];

function updateWindow(newNumbers) {
  for (const num of newNumbers) {
    if (!numbersWindow.includes(num)) {
      if (numbersWindow.length >= WINDOW_SIZE) {
        numbersWindow.shift();
      }
      numbersWindow.push(num);
    }
  }
}

async function fetchNumbers(id) {
  try {
    const url = `http://20.244.56.144/test/numbers/${id}`;
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data.numbers || [];
  } catch (err) {
    return [];
  }
}

router.post("/numbers/:id", async (req, res) => {
  const validIds = ["p", "f", "e", "r"];
  const id = req.params.id;

  if (!validIds.includes(id)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...numbersWindow];
  const newNumbers = await fetchNumbers(id);
  updateWindow(newNumbers);
  const windowCurrState = [...numbersWindow];

  const avg =
    numbersWindow.length > 0
      ? (
          numbersWindow.reduce((sum, num) => sum + num, 0) /
          numbersWindow.length
        ).toFixed(2)
      : 0;

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: newNumbers,
    avg: parseFloat(avg),
  });
});

export default router;
