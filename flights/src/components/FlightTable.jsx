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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if the screen size is mobile

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
  const [searchCode, setSearchCode] = useState(""); // State for search code
  const [searchError, setSearchError] = useState(""); // State for search error

  useEffect(() => {
    // Parse URL search parameters
    const queryParams = new URLSearchParams(location.search);
    const pageParam = parseInt(queryParams.get("page"), 10);
    const sizeParam = parseInt(queryParams.get("size"), 10);
    const codeParam = queryParams.get("code") || ""; // Get code from query params

    const defaultPage =
      !isNaN(pageParam) && pageParam > 0 && pageParam <= 100
        ? pageParam - 1
        : 0;
    const defaultSize =
      !isNaN(sizeParam) && sizeParam > 0 && sizeParam <= 100 ? sizeParam : 10;

    setPage(defaultPage);
    setRowsPerPage(defaultSize);
    setSearchCode(codeParam); // Set search code from query params
  }, [location.search]);

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        // Fetch flights with search code
        const flightData = await fetchFlights(
          page + 1,
          rowsPerPage,
          searchCode
        );
        setFlights(flightData.resources);
        setTotalFlights(flightData.total);
        setSearchError(""); // Clear any previous search error
      } catch (error) {
        console.error("Failed to load flights:", error);
        setSearchError("Search to show flights(Abc). Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, [page, rowsPerPage, searchCode]);

  const updateURL = (page, size, code) => {
    navigate({
      search: `?page=${page + 1}&size=${size}&code=${code}`,
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateURL(newPage, rowsPerPage, searchCode);
  };

  const handleRowsPerPageChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    updateURL(0, newSize, searchCode);
  };

  const handleSearchChange = (event) => {
    const newCode = event.target.value;
    setSearchCode(newCode);
    updateURL(page, rowsPerPage, newCode);
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
      setSelectedImage(photoURL || ""); // Set photo URL or empty string
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
      <Box display="flex" flexDirection="column" padding="16px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Flight Information</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add Flight
          </Button>
        </Box>
        <TextField
          label="Search by Code"
          variant="outlined"
          fullWidth
          value={searchCode}
          onChange={handleSearchChange}
          margin="normal"
        />
        <FlightModal open={modalOpen} onClose={handleCloseModal} />
        <EditFlightModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          flight={flightToEdit}
          onSave={handleEditFlight}
        />
        {isMobile ? (
          // Card view for mobile
          <Paper>
            {/* ... other components */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center" // Centering the cards horizontally
              padding={2}
            >
              {flights.map((flight) => (
                <Card
                  key={flight.id}
                  style={{
                    maxWidth: 345,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent style={{ flex: 1 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      padding={1}
                    >
                      <Box textAlign="center" mb={2}>
                        {/* Centering text inside the box */}
                        <Typography variant="h6">{flight.code}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Capacity: {flight.capacity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Departure Date: {flight.departureDate}
                        </Typography>
                      </Box>
                      {/* Move image icon or "No Image" text to the bottom */}
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {flight.img ? (
                          <IconButton
                            onClick={() => handleOpenPreview(flight.id)}
                            style={{ marginRight: 8 }}
                          >
                            <ImageIcon />
                          </IconButton>
                        ) : (
                          <Typography>No Image</Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <Box
                    display="flex"
                    justifyContent="center" // Centering buttons horizontally
                    padding={1}
                    style={{ borderTop: "1px solid #e0e0e0" }} // Optional: border on top of the buttons section
                  >
                    <IconButton
                      onClick={() => handleOpenEditModal(flight)}
                      color="primary"
                      style={{ marginRight: 8 }} // Adding space between buttons
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(flight.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          </Paper>
        ) : (
          // Table view for larger screens
          <>
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
                  {flights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell>{flight.code}</TableCell>
                      <TableCell>{flight.capacity}</TableCell>
                      <TableCell>{flight.departureDate}</TableCell>
                      <TableCell>
                        {flight.img ? (
                          <IconButton
                            onClick={() => handleOpenPreview(flight.id)}
                          >
                            <ImageIcon />
                          </IconButton>
                        ) : (
                          <Typography>No Image</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenEditModal(flight)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(flight.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalFlights}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
        <Dialog
          open={previewOpen}
          onClose={handleClosePreview}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Flight Image</DialogTitle>
          <DialogContent>
            {selectedImage ? (
              <img src={selectedImage} alt="Flight" style={{ width: "100%" }} />
            ) : (
              <Typography>No image available</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreview}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this flight?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteFlight} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {searchError && <Typography color="error">{searchError}</Typography>}
      </Box>
    </Paper>
  );
};

export default FlightsTable;
