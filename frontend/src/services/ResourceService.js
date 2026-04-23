import axios from "axios";

const API = "http://localhost:8080/api/resources";

export const getResources = (type, location) =>
  axios.get(API, { params: { type, location } });

export const createResource = (data) =>
  axios.post(API, data);

export const deleteResource = (id) =>
  axios.delete(`${API}/${id}`);

export const toggleStatus = (id) =>
  axios.patch(`${API}/${id}/status`);