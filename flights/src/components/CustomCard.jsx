import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomCard = ({ flight, onEdit, onDelete, onPreview }) => {
  return (
    <Card style={{ maxWidth: 345, marginBottom: 16 }}>
      <CardContent>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {flight.img ? (
            <IconButton
              onClick={() => onPreview(flight.id)}
              style={{ marginRight: 8 }}
            >
              <ImageIcon />
            </IconButton>
          ) : (
            <Typography>No Image</Typography>
          )}
          <Box textAlign="center">
            <Typography variant="h6">{flight.code}</Typography>
            <Typography variant="body2" color="textSecondary">
              Capacity: {flight.capacity}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Departure Date: {flight.departureDate}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Box display="flex" justifyContent="center" padding={1}>
        <IconButton
          onClick={() => onEdit(flight)}
          color="primary"
          style={{ marginRight: 8 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(flight.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CustomCard;
