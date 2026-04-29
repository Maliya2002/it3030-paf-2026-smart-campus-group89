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
    responseType: "blob"
  });
};

export const updateResource = (id, data) => {
  return apiClient.put(`${API}/${id}`, data);
};

export const deleteResource = (id) => {
  return apiClient.delete(`${API}/${id}`);
};

export const toggleStatus = (id) => {
  return apiClient.patch(`${API}/${id}/status`);
};
