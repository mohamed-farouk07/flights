import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Object>}
 */
export const fetchFlights = async (page = 1, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights`, {
            params: { page, size },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};
