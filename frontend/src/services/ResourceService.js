<<<<<<< HEAD
import apiClient from './apiClient';

const API = '/api/resources';

export const getResources = (type, location, status, minCapacity) => {
  return apiClient.get(API, {
    params: { type, location, status, minCapacity }
  });
};

export const getResourceById = (id) => {
  return apiClient.get(`${API}/${id}`);
};

export const createResource = (data) => {
  return apiClient.post(API, data);
};

export const downloadPDF = () => {
  return apiClient.get(`${API}/pdf`, {
=======
import axios from "axios";

// ✅ Base API URL (make sure backend runs on 8080)
const API = "http://localhost:8080/api/resources";

// 🔹 GET all resources (with optional filters)
export const getResources = (type, location, status) => {
  return axios.get("http://localhost:8080/api/resources", {
    params: { type, location, status }
  });
};

// 🔹 GET single resource
export const getResourceById = (id) => {
  return axios.get(`${API}/${id}`);
};

// 🔹 CREATE resource
export const createResource = (data) => {
  return axios.post(API, data);
};

//PDF
export const downloadPDF = () => {
  return axios.get("http://localhost:8080/api/resources/pdf", {
>>>>>>> origin/Facilities-SASMITHA-P-M-V
    responseType: "blob"
  });
};

<<<<<<< HEAD
export const updateResource = (id, data) => {
  return apiClient.put(`${API}/${id}`, data);
};

export const deleteResource = (id) => {
  return apiClient.delete(`${API}/${id}`);
};

export const toggleStatus = (id) => {
  return apiClient.patch(`${API}/${id}/status`);
};
=======
// 🔹 UPDATE resource
export const updateResource = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// 🔹 DELETE resource
export const deleteResource = (id) => {
  return axios.delete(`${API}/${id}`);
};

// 🔹 TOGGLE status (ACTIVE / OUT_OF_SERVICE)
export const toggleStatus = (id) => {
  return axios.patch(`${API}/${id}/status`);
};
>>>>>>> origin/Facilities-SASMITHA-P-M-V
