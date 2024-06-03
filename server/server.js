const express = require("express");
const cors = require("cors");
const filesRouter = require("./routers/filesRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/files", filesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
