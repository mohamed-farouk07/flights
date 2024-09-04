import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Registers a new user.
 * @param {Object} userData - The data for the new user
 * @param {string} userData.name - The name of the user
 * @param {string} userData.email - The email of the user
 * @param {string} userData.password - The password of the user
 * @returns {Promise<Object>} - The registered user with tokens
 */
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response?.data || error.message);
        throw error;
    }
};
