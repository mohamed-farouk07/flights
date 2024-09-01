import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const FlightModal = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      code: "",
      capacity: "",
      departureDate: "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset(); // Reset form fields after submission
    onClose(); // Close the modal after submission
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      disableEscapeKeyDown
      BackdropProps={{ style: { pointerEvents: "none" } }}
      PaperProps={{
        style: {
          width: "80vw", // Full width of the viewport
          height: "80vh", // Full height of the viewport
          maxWidth: "none", // Remove max-width to ensure full width
          maxHeight: "none", // Remove max-height to ensure full height
        },
      }}
    >
      <DialogTitle>Add Flight Details</DialogTitle>
      <DialogContent>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Code" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Capacity" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="departureDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Departure Date"
              type="datetime-local"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} color="error">
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleFormSubmit)}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightModal;
