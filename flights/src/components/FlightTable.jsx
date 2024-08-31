import React, { useEffect, useState } from "react";
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
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFlights } from "../services/flightService";
import ImageIcon from "@mui/icons-material/Image";
import NoImageIcon from "@mui/icons-material/Block";

const FlightsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [totalFlights, setTotalFlights] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = parseInt(queryParams.get("page"), 10);
    const sizeParam = parseInt(queryParams.get("size"), 10);

    const defaultPage = !isNaN(pageParam) && pageParam > 0 && pageParam <= 100 ? pageParam - 1 : 0;
    const defaultSize = !isNaN(sizeParam) && sizeParam > 0 && sizeParam <= 100 ? sizeParam : 10;

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

  if (loading) {
    return <Typography>Loading flights...</Typography>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Departure Date</TableCell>
              <TableCell>Image Preview</TableCell> {/* Add Image Preview Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.code}</TableCell>
                  <TableCell>{flight.capacity}</TableCell>
                  <TableCell>{new Date(flight.departureDate).toLocaleString()}</TableCell>
                  <TableCell>
                    {flight.img ? (
                      <IconButton onClick={() => window.open(flight.img, '_blank')}>
                        <ImageIcon />
                      </IconButton>
                    ) : (
                      <IconButton disabled>
                        <NoImageIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No flights available.</TableCell>
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
    </Paper>
  );
};

export default FlightsTable;
