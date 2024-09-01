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

  const onSubmit = async (data) => {
    setError(null); // Reset any previous errors

    try {
      // Ensure the departure date is properly formatted as an ISO string
      const flightData = {
        code: data.code,
        capacity: parseInt(data.capacity, 10), // Ensure capacity is a number
        departureDate: new Date(data.departureDate).toISOString().split("T")[0], // Convert to YYYY-MM-DD format
      };

      await createFlight(flightData);
      reset(); // Reset form after successful submission
      onClose(); // Close the modal

      // Refresh the page
      window.location.reload();
    } catch (error) {
      setError(error.message); // Set the error message to display
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
            {...register("capacity", { required: true })}
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
