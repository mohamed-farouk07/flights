import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { updateFlight } from "../services/FlightService";

const EditFlightForm = ({ open, onClose, flight, onSave }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (flight) {
      setValue("code", flight.code);
      setValue("capacity", flight.capacity);
      setValue("departureDate", flight.departureDate);
    }
  }, [flight, setValue]);

  const onSubmit = async (data) => {
    if (flight) {
      try {
        // Prepare the flight data without a photo
        const flightData = {
          code: data.code,
          capacity: parseInt(data.capacity, 10),
          departureDate: data.departureDate,
        };

        const updatedFlight = await updateFlight(flight.id, flightData); // Update the flight with the form data
        onSave(updatedFlight); // Call the onSave callback with the updated flight
        onClose(); // Close the modal
        window.location.reload(); // Refresh the page to update the table
      } catch (error) {
        console.error("Failed to update flight:", error.response?.data || error.message);
        // Optionally, you can display the error message in the UI
        alert("Failed to update flight. Please try again.");
        onClose(); // Close the modal
        window.location.reload(); // Refresh the page to handle the error state
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Flight</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Code"
            fullWidth
            margin="normal"
            {...register("code", { required: "Code is required" })}
            error={!!errors.code}
            helperText={errors.code?.message}
          />
          <TextField
            label="Capacity"
            fullWidth
            margin="normal"
            type="number"
            {...register("capacity", { required: "Capacity is required" })}
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />
          <TextField
            label="Departure Date"
            fullWidth
            margin="normal"
            type="date"
            {...register("departureDate", {
              required: "Departure Date is required",
            })}
            error={!!errors.departureDate}
            helperText={errors.departureDate?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlightForm;
