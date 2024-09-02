import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this if your server is running on a different port

/**
 * Create a new flight.
 * @param {FormData} flightData - The data for the new flight.
 * @param {boolean} hasPhoto - Whether the flight data includes a photo.
 * @returns {Promise<Object>} - The newly created flight object or an error message.
 */
export const createFlight = async (flightData, hasPhoto) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}${hasPhoto ? '/flights/withPhoto' : '/flights'}`,
            flightData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
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
            } else if (status === 500) {
                // Handle server error
                throw new Error(`Server Error: ${data.message || 'An error occurred while processing the image.'}`);
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
