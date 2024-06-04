exports.filesController = {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString("utf-8");
      console.log("File content received:", fileContent); // Log the file content

      // Process the file content (e.g., save to database)
      // ...

      res
        .status(200)
        .json({ message: "File uploaded successfully", content: fileContent });
    } catch (error) {
      console.error("Error processing file:", error); // Log the error
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};
