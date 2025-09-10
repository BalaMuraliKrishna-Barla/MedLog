// The base URL of your backend API
const BASE_URL = "http://localhost:5000/api";

/**
 * A utility function to handle the response from the fetch API.
 * It parses the JSON and throws an error if the response is not ok.
 */
const handleResponse = async (response) => {
  // If the response is OK and there's no content, return success
  if (response.ok && response.status === 204) {
    return { success: true };
  }

  const data = await response.json();

  if (!response.ok) {
    // Use the message from the backend error response, or a default one
    const error = new Error(data.message || "An unknown error occurred.");
    error.data = data; // Attach the full error data
    throw error;
  }

  return data;
};

/**
 * A core function for making authenticated API requests.
 * It automatically adds the Authorization header if a token exists.
 */
const apiRequest = async (url, method, body = null, isPublic = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // For non-public routes, get the token and add it to the header
  if (!isPublic) {
    const token = localStorage.getItem("userToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // If the route is protected and there's no token, we can't proceed.
      // This is a safeguard. The UI should prevent this from happening.
      return Promise.reject(new Error("No token found for a protected route."));
    }
  }

  const config = {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${BASE_URL}${url}`, config);
  return handleResponse(response);
};

/* ===============================================================
                      AUTHENTICATION API
   =============================================================== */

export const loginUser = (credentials) => {
  return apiRequest("/users/login", "POST", credentials, true); // Public route
};

export const registerUser = (userData) => {
  return apiRequest("/users", "POST", userData, true); // Public route
};

export const getMe = () => {
  return apiRequest("/users/me", "GET"); // Protected route by default
};

export const updateProfile = (data) => {
  return apiRequest("/profile/me", "PUT", data);
};

// ... existing getMe function

/* ===============================================================
                        HEALTH RECORDS API
   =============================================================== */

// Generic function to get records for a user (self or shared)
const getRecords = (recordType, userId) => apiRequest(`/${recordType}/user/${userId}`, 'GET');
// Generic function to add a record for the logged-in user
const addRecord = (recordType, data) => apiRequest(`/${recordType}`, 'POST', data);
// Generic function to update a specific record
const updateRecord = (recordType, id, data) => apiRequest(`/${recordType}/${id}`, 'PUT', data);
// Generic function to delete a specific record
const deleteRecord = (recordType, id) => apiRequest(`/${recordType}/${id}`, 'DELETE');

// Allergy Functions
export const getAllergies = (userId) => getRecords('allergies', userId);
export const addAllergy = (data) => addRecord('allergies', data);
export const updateAllergy = (id, data) => updateRecord('allergies', id, data);
export const deleteAllergy = (id) => deleteRecord('allergies', id);

// Medication Functions
export const getMedications = (userId) => getRecords('medications', userId);
export const addMedication = (data) => addRecord('medications', data);
export const updateMedication = (id, data) => updateRecord('medications', id, data);
export const deleteMedication = (id) => deleteRecord('medications', id);

// Vaccination Functions
export const getVaccinations = (userId) => getRecords('vaccinations', userId);
export const addVaccination = (data) => addRecord('vaccinations', data);
export const updateVaccination = (id, data) => updateRecord('vaccinations', id, data);
export const deleteVaccination = (id) => deleteRecord('vaccinations', id);

// Vital Functions
export const getVitals = (userId) => getRecords('vitals', userId);
export const addVital = (data) => addRecord('vitals', data);
export const updateVital = (id, data) => updateRecord('vitals', id, data);
export const deleteVital = (id) => deleteRecord('vitals', id);

// Medical Event Functions
export const getMedicalEvents = (userId) => getRecords('medicalevents', userId);
export const addMedicalEvent = (data) => addRecord('medicalevents', data);
export const updateMedicalEvent = (id, data) => updateRecord('medicalevents', id, data);
export const deleteMedicalEvent = (id) => deleteRecord('medicalevents', id);

// ... after the deleteMedicalEvent function

/* ===============================================================
                        APPOINTMENTS API
   =============================================================== */
export const getAppointments = (userId) => getRecords('appointments', userId);
export const addAppointment = (data) => addRecord('appointments', data);
export const updateAppointment = (id, data) => updateRecord('appointments', id, data);
export const deleteAppointment = (id) => deleteRecord('appointments', id);

/* ===============================================================
                        DATA EXPORT API
   =============================================================== */
// Note: These need to handle non-JSON responses (files)
export const exportPdf = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/export/pdf`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('PDF Export failed');
    return response.blob(); // Return the file as a blob
};

export const exportJson = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/export/json`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('JSON Export failed');
    return response.json(); // This one is still JSON
};

/* ===============================================================
                        ACCESS CONTROL API
   =============================================================== */
export const grantAccess = (granteeEmail) => apiRequest('/access/grant', 'POST', { granteeEmail });
export const getGrantedList = () => apiRequest('/access/granted', 'GET');
export const revokeAccess = (grantId) => apiRequest(`/access/revoke/${grantId}`, 'DELETE');
export const getPendingGrants = () => apiRequest('/access/pending', 'GET');
export const acceptGrant = (grantId) => apiRequest(`/access/accept/${grantId}`, 'POST');
export const getPatientList = () => apiRequest('/access/patients', 'GET');



/* ===============================================================
                      CUSTOM SECTIONS API
   =============================================================== */
export const getCustomSections = (userId) => getRecords('customsections', userId);
export const addCustomSection = (data) => apiRequest('/customsections', 'POST', data);
export const deleteCustomSection = (sectionId) => apiRequest(`/customsections/${sectionId}`, 'DELETE');
export const addItemToSection = (sectionId, itemData) => apiRequest(`/customsections/${sectionId}/items`, 'POST', itemData);
export const deleteItemFromSection = (sectionId, itemId) => apiRequest(`/customsections/${sectionId}/items/${itemId}`, 'DELETE');
