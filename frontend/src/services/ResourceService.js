import axios from "axios";

// ✅ Base API URL (make sure backend runs on 8080)
const API = "http://localhost:8080/api/resources";

// 🔹 GET all resources (with optional filters)
export const getResources = (type = "", location = "") => {
  return axios.get(API, {
    params: { type, location }
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