import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Refreshes the authentication token.
 * @param {Object} data - Contains the refresh token.
 * @param {string} data.refreshToken - The refresh token.
 * @returns {Promise<Object>} - Returns new tokens.
 */
export const refreshToken = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        throw error;
    }
};
