import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Button,
  Box,
  IconButton,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchFlights,
  fetchFlightPhoto,
  deleteFlight,
  updateFlight,
} from "../services/FlightService";
import FlightModal from "./FlightForm";
import EditFlightModal from "./EditFlightForm";

const FlightsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [totalFlights, setTotalFlights] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [flightToEdit, setFlightToEdit] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = parseInt(queryParams.get("page"), 10);
    const sizeParam = parseInt(queryParams.get("size"), 10);

    const defaultPage =
      !isNaN(pageParam) && pageParam > 0 && pageParam <= 100
        ? pageParam - 1
        : 0;
    const defaultSize =
      !isNaN(sizeParam) && sizeParam > 0 && sizeParam <= 100 ? sizeParam : 10;

    setPage(defaultPage);
    setRowsPerPage(defaultSize);

    if (defaultPage !== pageParam - 1 || defaultSize !== sizeParam) {
      navigate({ search: `?page=${defaultPage + 1}&size=${defaultSize}` });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        const flightData = await fetchFlights(page + 1, rowsPerPage);
        setFlights(flightData.resources);
        setTotalFlights(flightData.total);
      } catch (error) {
        console.error("Failed to load flights:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, [page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateURL(newPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    updateURL(0, newSize);
  };

  const updateURL = (page, size) => {
    navigate({
      search: `?page=${page + 1}&size=${size}`,
    });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenPreview = async (flightId) => {
    try {
      const photoURL = await fetchFlightPhoto(flightId);
      if (photoURL) {
        setSelectedImage(photoURL);
      } else {
        setSelectedImage(""); // No photo available
      }
      setPreviewOpen(true);
    } catch (error) {
      console.error("Failed to fetch flight photo:", error);
      setSelectedImage(""); // No photo available
      setPreviewOpen(true); // Still open the modal
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage("");
  };

  const handleOpenDeleteDialog = (flightId) => {
    setFlightToDelete(flightId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFlightToDelete(null);
  };

  const handleDeleteFlight = async () => {
    if (flightToDelete) {
      try {
        await deleteFlight(flightToDelete);
        setFlights(flights.filter((flight) => flight.id !== flightToDelete));
        setTotalFlights(totalFlights - 1);
      } catch (error) {
        console.error("Failed to delete flight:", error);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  const handleOpenEditModal = (flight) => {
    setFlightToEdit(flight);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setFlightToEdit(null);
  };

  const handleEditFlight = async (updatedFlight) => {
    try {
      const response = await updateFlight(updatedFlight.id, updatedFlight);
      setFlights(
        flights.map((flight) => (flight.id === response.id ? response : flight))
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update flight:", error);
    }
  };

  if (loading) {
    return <Typography>Loading flights...</Typography>;
  }

  return (
    <Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="16px"
      >
        <Typography variant="h4">Flight Information</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Flight
        </Button>
      </Box>
      <FlightModal open={modalOpen} onClose={handleCloseModal} />
      <EditFlightModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        flight={flightToEdit}
        onSave={handleEditFlight}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Departure Date</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.code}</TableCell>
                  <TableCell>{flight.capacity}</TableCell>
                  <TableCell>
                    {new Date(flight.departureDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {flight.id ? (
                      <IconButton onClick={() => handleOpenPreview(flight.id)}>
                        <ImageIcon />
                      </IconButton>
                    ) : (
                      "No photo"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditModal(flight)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(flight.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No flights available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalFlights}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={handleClosePreview}>
        <Box
          position="fixed"
          left="20%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="80%" // Adjust the width as needed
          maxWidth="800px" // Max width for larger screens
          maxHeight="80vh" // Limit the height of the modal
          overflow="auto" // Enable scroll if content exceeds max height
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Flight Preview"
              style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <Typography>No image available</Typography>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flight?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFlight} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FlightsTable;
