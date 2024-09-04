import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ImagePreviewDialog = ({ open, onClose, selectedImage }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Flight Image</DialogTitle>
      <DialogContent>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Flight"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <DialogContentText>No image available</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImagePreviewDialog;
