const { uploadFile } = require("../services/s3Service");
const axios = require("axios");

exports.filesController = {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const bucketName = process.env.AWS_BUCKET_NAME;

      try {
        const data = await uploadFile(bucketName, req.file);
        console.log("File uploaded to S3 successfully:", data);
        res.status(200).json({ message: "File uploaded successfully", data });
      } catch (err) {
        console.error("Error uploading file to S3:", err);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  async uploadBadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const bucketName = process.env.AWS_BAD_FILES_BUCKET_NAME;

      try {
        const data = await uploadFile(bucketName, req.file);
        console.log("File uploaded to bad files bucket successfully:", data);

        // // Send Slack notification
        try {
          await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text: `Bad file uploaded: ${data.Key}`,
          });
          console.log("Slack notification sent successfully");
        } catch (slackError) {
          console.error("Error sending Slack notification:", slackError);
        }

        res
          .status(200)
          .json({ message: "Bad file uploaded successfully", data });
      } catch (err) {
        console.error("Error uploading file to bad files bucket:", err);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
    } catch (error) {
      console.error("Error processing bad file:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};
