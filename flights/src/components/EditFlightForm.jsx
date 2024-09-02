import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Input,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { updateFlight } from "../services/FlightService"; // Ensure this is the correct path

const EditFlightForm = ({ open, onClose, flight, onSave }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (flight) {
      setValue("code", flight.code);
      setValue("capacity", flight.capacity);
      setValue("departureDate", flight.departureDate);
      // Reset the file input when flight changes
      setFile(null);
    }
  }, [flight, setValue]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (flight) {
      try {
        // Prepare form data
        const formData = new FormData();
        formData.append("code", data.code);
        formData.append("capacity", data.capacity);
        formData.append("departureDate", data.departureDate);
        if (file) {
          formData.append("photo", file); // Append the photo file if provided
        }

        // Log FormData for debugging
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        const updatedFlight = await updateFlight(flight.id, formData); // Update the flight with the form data
        onSave(updatedFlight); // Call the onSave callback with the updated flight
      } catch (error) {
        console.error("Failed to update flight:", error);
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
            type="datetime-local"
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
