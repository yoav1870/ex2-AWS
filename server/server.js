const express = require("express");
const cors = require("cors");
const filesRouter = require("./routers/filesRouter");
const { NotFoundUrlError } = require("./errors/fileErrors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/files", filesRouter);
app.use((req, res, next) => {
  next(new NotFoundUrlError());
});

app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .send(error.message || "Internal Server Error");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
