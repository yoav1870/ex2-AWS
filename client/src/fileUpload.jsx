import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Typography, Alert, Box } from "@mui/material";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const types = [
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a text (.txt) or Word (.docx) file");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: types.join(","),
  });

  const changeHandler = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a text (.txt) or Word (.docx) file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(null);

    if (!file) {
      setUploadError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      setUploadSuccess("File uploaded successfully.");
      setFile(null); // Clear the file input after successful upload
    } catch (error) {
      setUploadError("Error uploading file.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #cccccc",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          width: "300px",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1">
          Drag 'n' drop a text (.txt) or Word (.docx) file here, or click to
          select one
        </Typography>
      </Box>
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload File
        <input type="file" hidden onChange={changeHandler} />
      </Button>
      <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
        Submit
      </Button>
      <div className="output">
        {error && <Alert severity="error">{error}</Alert>}
        {uploadError && <Alert severity="error">{uploadError}</Alert>}
        {uploadSuccess && <Alert severity="success">{uploadSuccess}</Alert>}
        {file && <Typography variant="body1">{file.name}</Typography>}
      </div>
    </Box>
  );
};

export default FileUpload;
