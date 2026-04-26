import React, { useState } from "react";
import { createResource } from "../../services/ResourceService";
import { useNavigate } from "react-router-dom";
import "../styles/resource.css";

function CreateResource() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "ROOM",
    location: "",
    capacity: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!data.name.trim()) {
      err.name = "Name is required";
    }

    if (!data.type.trim()) {
      err.type = "Type is required";
    } else if (!["ROOM", "LAB", "EQUIPMENT"].includes(data.type.trim().toUpperCase())) {
      err.type = "Type must be ROOM, LAB, or EQUIPMENT";
    }

    if (!data.location.trim()) {
      err.location = "Location is required";
    }

    if (!data.capacity) {
      err.capacity = "Capacity is required";
    } else if (Number(data.capacity) <= 0) {
      err.capacity = "Capacity must be greater than 0";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    createResource({
      ...data,
      name: data.name.trim(),
      type: data.type.trim().toUpperCase(),
      location: data.location.trim(),
      capacity: Number(data.capacity)
    })
      .then(() => {
        alert("Resource Created!");
        navigate("/resources");
      })
      .catch((err) => {
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Error creating resource";
        alert(backendMessage);
      });
  };

  return (
    <form onSubmit={submit} className="card form">
      <h2>Create Resource</h2>

      <input
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      >
        <option value="ROOM">Room</option>
        <option value="LAB">Lab</option>
        <option value="EQUIPMENT">Equipment</option>
      </select>
      {errors.type && <p className="error">{errors.type}</p>}

      <input
        placeholder="Location"
        value={data.location}
        onChange={(e) => setData({ ...data, location: e.target.value })}
      />
      {errors.location && <p className="error">{errors.location}</p>}

      <input
        type="number"
        placeholder="Capacity"
        value={data.capacity}
        onChange={(e) => setData({ ...data, capacity: e.target.value })}
      />
      {errors.capacity && <p className="error">{errors.capacity}</p>}

      <button className="btn">Create</button>
    </form>
  );
}

export default CreateResource;
