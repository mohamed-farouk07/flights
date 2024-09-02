import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { createFlight } from "../services/CreateFlight";

const FlightModal = ({ open, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // State to store the preview URL

  const onSubmit = async (data) => {
    setError(null); // Reset any previous errors

    // Validate the image file before submission
    if (data.img && data.img.length > 0) {
      const file = data.img[0];

      // Example: Limit file size to 2MB
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB");
        return;
      }

      // Example: Validate file type
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        setError(
          "Invalid file type. Only JPG, PNG, and GIF files are allowed."
        );
        return;
      }
    }

    try {
      const flightData = new FormData();
      flightData.append("code", data.code);
      flightData.append("capacity", data.capacity);
      flightData.append(
        "departureDate",
        new Date(data.departureDate).toISOString().split("T")[0]
      );

      let withPhoto = false;
      if (data.img && data.img.length > 0) {
        const photoFile = data.img[0];
        flightData.append("photo", photoFile);
        withPhoto = true;
      }

      await createFlight(flightData, withPhoto);
      reset(); // Reset form after successful submission
      onClose(); // Close the modal

      // Refresh the page
      window.location.reload();
    } catch (error) {
      setError(error.message); // Set the error message to display
    }
  };

  // Function to handle photo selection and preview
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Create a preview URL
      setPhotoPreview(url); // Update the state with the preview URL
    } else {
      setPhotoPreview(null); // Reset preview if no file is selected
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      PaperProps={{
        style: {
          width: "80vw", // Full width of the viewport
          height: "80vh", // Full height of the viewport
          maxWidth: "none", // Remove max-width to ensure full width
          maxHeight: "none", // Remove max-height to ensure full height
        },
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>Add Flight Details</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" marginBottom={2}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Code"
            {...register("code", { required: true })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            type="number"
            {...register("capacity", { required: true, maxLength: 200 })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Departure Date"
            type="datetime-local"
            {...register("departureDate", { required: true })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Photo"
            type="file"
            {...register("img")}
            fullWidth
            margin="normal"
            inputProps={{ accept: "image/*" }} // Only accept image files
            onChange={handlePhotoChange} // Handle file selection
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Display image preview if a photo is selected */}
          {photoPreview && (
            <div style={{ marginTop: "16px" }}>
              <Typography variant="body1">Photo Preview:</Typography>
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  marginTop: "8px",
                }}
              />
            </div>
          )}

          <DialogActions>
            <Button variant="contained" onClick={onClose} color="error">
              Close
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FlightModal;
