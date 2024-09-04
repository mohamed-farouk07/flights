import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetches the current logged-in user
 * @returns {Promise<Object>}
 */
export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
