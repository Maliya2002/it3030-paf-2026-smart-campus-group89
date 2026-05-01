import axios from "axios";

const API = "http://localhost:8080/api/resources";

export const getResources = (type, location, status) => {
  return axios.get(API, {
    params: { type, location, status }
  });
};

export const getResourceById = (id) => {
  return axios.get(`${API}/${id}`);
};

export const createResource = (data) => {
  return axios.post(API, data);
};

export const downloadPDF = () => {
  return axios.get(`${API}/pdf`, {
    responseType: "blob"
  });
};

export const updateResource = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

export const deleteResource = (id) => {
  return axios.delete(`${API}/${id}`);
};

export const toggleStatus = (id) => {
  return axios.patch(`${API}/${id}/status`);
};
