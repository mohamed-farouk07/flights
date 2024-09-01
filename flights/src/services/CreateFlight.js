import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this if your server is running on a different port

/**
 * Create a new flight.
 * @param {Object} flightData - The data for the new flight.
 * @returns {Promise<Object>} - The newly created flight object or an error message.
 */
export const createFlight = async (flightData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/flights`, flightData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 201) {
            return response.data; // Return the created flight object
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
                // Handle bad request error
                throw new Error(`Bad Request: ${data.message || 'Invalid data provided.'}`);
            } else if (status === 401) {
                // Handle unauthorized error
                throw new Error(`Unauthorized: ${data.message || 'Authentication required.'}`);
            } else {
                // Handle other possible errors
                throw new Error(`Error: ${data.message || 'An unknown error occurred.'}`);
            }
        } else {
            // Handle network or other errors
            throw new Error('An unknown error occurred.');
        }
    }
};
