
const API_BASE_URL = 'http://localhost:8000'

// Check whether the backend is running
export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`)
  }

  return response.json()
}

// Reusable function for executing API requests
export async function executeApiRequest(endpoint, options = {}) {
  const startTime = performance.now()

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    const executionTime = Math.round(performance.now() - startTime)

    const contentType = response.headers.get('content-type')
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    return {
      success: response.ok,
      status: response.status,
      executionTime,
      data,
    }
  } catch (error) {
    return {
      success: false,
      status: 'Network Error',
      executionTime: Math.round(performance.now() - startTime),
      data: {
        error: error.message,
        message: 'Could not connect to the backend.',
      },
    }
  }
}

export { API_BASE_URL }
