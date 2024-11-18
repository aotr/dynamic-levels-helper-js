/**
 * A generic client-side API caller for /api/vs-api endpoint.
 *
 * @param {string} action - The action to perform.
 * @param {Object} param - The parameters for the action.
 * @param {Object} [option={}] - Optional configurations.
 * @returns {Promise<Object>} - The API response.
 */
export const vsApiClient = async (action, param = {}, option = {}) => {
  try {
    const response = await fetch('/api/vs-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        param,
        option,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('Error calling API', error);
    throw error;
  }
};
