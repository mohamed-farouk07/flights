import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this if your server is running on a different port

/**
 * Fetch flights from the server with pagination.
 * @param {number} page - The page number to fetch (default is 1).
 * @param {number} size - The number of items per page (default is 10).
 * @returns {Promise<Object>} - An object containing the total number of flights, count, and an array of flight resources.
 */
export const fetchFlights = async (page = 1, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights`, {
            params: { page, size },
        });
        return response.data; // Assuming response.data contains the { total, count, resources }
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};
