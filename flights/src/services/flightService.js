import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * @param {number} page
 * @param {number} size
 * @param {string} [code]
 * @returns {Promise<Object>}
 */
export const fetchFlights = async (page = 1, size = 10, code = '') => {
    try {
        const params = { page, size };
        if (code) {
            params.code = code;
        }
        const response = await axios.get(`${API_BASE_URL}/flights`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};

/**
 * @param {string} flightId
 * @returns {Promise<string|null>} - URL of the flight photo or null if no photo is available
 */
export const fetchFlightPhoto = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights/${id}/photo`, {
            responseType: 'blob' // Ensure the response type is a Blob for images
        });

        // Check if the response has content
        if (response.data.size > 0) {
            const photoURL = URL.createObjectURL(response.data);
            return photoURL;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching flight photo:", error);
        return null; // Return null if there's an error or no photo
    }
};

/**
 * @param {string} flightId
 * @returns {Promise<void>}
 */
export const deleteFlight = async (flightId) => {
    try {
        await axios.delete(`${API_BASE_URL}/flights/${flightId}`);
    } catch (error) {
        console.error("Error deleting flight:", error);
        throw error;
    }
};

/**
 * @param {string} flightId
 * @param {Object} flightData
 * @returns {Promise<Object>}
 */
export const updateFlight = async (flightId, flightData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/flights/${flightId}`, flightData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating flight:", error.response?.data || error.message);
        throw error;
    }
};
