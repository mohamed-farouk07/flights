// src/services/LoginService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Logs in a user with email and password.
 * @param {Object} credentials - User credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<Object>} - Returns user data with tokens.
 */
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw error;
    }
};
