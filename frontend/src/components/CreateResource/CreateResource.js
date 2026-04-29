import React, { useState } from "react";
import { createResource } from "../../services/ResourceService";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import "../styles/resource.css";

function CreateResource() {
  const navigate = useNavigate();
  const resourceTypes = [
    { value: "CLASSROOM", label: "Classroom" },
    { value: "LAB", label: "Lab" },
    { value: "MEETING_ROOM", label: "Meeting Room" },
    { value: "AUDITORIUM", label: "Auditorium" },
    { value: "SPORTS_FACILITY", label: "Sports Facility" },
    { value: "LIBRARY_ROOM", label: "Library Room" },
    { value: "EVENT_SPACE", label: "Event Space" },
    { value: "OTHER", label: "Other" }
  ];

  const [data, setData] = useState({
    name: "",
    type: "ROOM",
=======

function CreateResource() {

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
>>>>>>> origin/Facilities-SASMITHA-P-M-V
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
<<<<<<< HEAD
    } else if (!["ROOM", "LAB", "EQUIPMENT"].includes(data.type.trim().toUpperCase())) {
      err.type = "Type must be ROOM, LAB, or EQUIPMENT";
=======
>>>>>>> origin/Facilities-SASMITHA-P-M-V
    }

    if (!data.location.trim()) {
      err.location = "Location is required";
    }

    if (!data.capacity) {
      err.capacity = "Capacity is required";
<<<<<<< HEAD
    } else if (Number(data.capacity) <= 0) {
=======
    } else if (data.capacity <= 0) {
>>>>>>> origin/Facilities-SASMITHA-P-M-V
      err.capacity = "Capacity must be greater than 0";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

<<<<<<< HEAD
    createResource({
      ...data,
      name: data.name.trim(),
      type: data.type.trim().toUpperCase(),
      location: data.location.trim(),
      capacity: Number(data.capacity)
    })
=======
    createResource(data)
>>>>>>> origin/Facilities-SASMITHA-P-M-V
      .then(() => {
        alert("Resource Created!");
        navigate("/resources");
      })
<<<<<<< HEAD
      .catch((err) => {
<<<<<<< HEAD
        const status = err?.response?.status;
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          'Unknown error';

        alert(`Error creating resource${status ? ` (HTTP ${status})` : ''}: ${message}`);
=======
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Error creating resource";
        alert(backendMessage);
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
      });
  };

  return (
    <div className="resource-page">
      <form onSubmit={submit} className="resource-form-card">
        <div className="resource-form-header">
          <h2>Create Resource</h2>
          <p>Add a campus space or facility so it can be booked and tracked.</p>
        </div>

        <div className="resource-form-grid">
          <label className="resource-field">
            <span>Resource Name *</span>
            <input
              placeholder="e.g., Lab A1 / Main Auditorium"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>

<<<<<<< HEAD
          <label className="resource-field">
            <span>Resource Type *</span>
            <select
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="">-- Select Type --</option>
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="error">{errors.type}</p>}
          </label>
=======
      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      >
        <option value="ROOM">Room</option>
        <option value="LAB">Lab</option>
        <option value="EQUIPMENT">Equipment</option>
      </select>
      {errors.type && <p className="error">{errors.type}</p>}
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b

          <label className="resource-field">
            <span>Location *</span>
            <input
              placeholder="e.g., Building B / Floor 2"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
            />
            {errors.location && <p className="error">{errors.location}</p>}
          </label>

          <label className="resource-field">
            <span>Capacity *</span>
            <input
              type="number"
              min="1"
              placeholder="e.g., 30"
              value={data.capacity}
              onChange={(e) => setData({ ...data, capacity: e.target.value })}
            />
            {errors.capacity && <p className="error">{errors.capacity}</p>}
          </label>
        </div>

        <div className="resource-form-actions">
          <button type="button" className="btn ghost" onClick={() => navigate("/resources")}>
            Cancel
          </button>
          <button className="btn primary">Create Resource</button>
        </div>
      </form>
    </div>
  );
}

export default CreateResource;
=======
      .catch(() => alert("Error creating resource"));
  };

  return (
    <form onSubmit={submit} className="card form">

      <h2>Create Resource</h2>

      {/* NAME */}
      <input
        placeholder="Name"
        onChange={(e)=>setData({...data,name:e.target.value})}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      {/* TYPE */}
      <input
        placeholder="Type (Room / Lab / Equipment)"
        onChange={(e)=>setData({...data,type:e.target.value})}
      />
      {errors.type && <p className="error">{errors.type}</p>}

      {/* LOCATION */}
      <input
        placeholder="Location"
        onChange={(e)=>setData({...data,location:e.target.value})}
      />
      {errors.location && <p className="error">{errors.location}</p>}

      {/* CAPACITY */}
      <input
        type="number"
        placeholder="Capacity"
        onChange={(e)=>setData({...data,capacity:e.target.value})}
      />
      {errors.capacity && <p className="error">{errors.capacity}</p>}

      <button className="btn">Create</button>
    </form>
  );
}

export default CreateResource;
>>>>>>> origin/Facilities-SASMITHA-P-M-V
