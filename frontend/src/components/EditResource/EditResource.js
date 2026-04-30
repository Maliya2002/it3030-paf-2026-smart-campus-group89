import React, { useEffect, useState } from "react";
import { updateResource, getResourceById } from "../../services/ResourceService";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/resource.css";

const resourceTypes = [
  { value: "ROOM", label: "Room" },
  { value: "LAB", label: "Lab" },
  { value: "EQUIPMENT", label: "Equipment" }
];

const statusOptions = ["ACTIVE", "OUT_OF_SERVICE"];

function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
    location: "",
    capacity: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    getResourceById(id).then(res => setData(res.data));
  }, [id]);

  const submit = (e) => {
    e.preventDefault();
    updateResource(id, { ...data, capacity: Number(data.capacity) })
      .then(() => {
        alert("Updated!");
        navigate("/resources");
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <form onSubmit={submit} className="card form">
      <h2>Edit Resource</h2>

      <input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Resource Name"
      />

      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      >
        {resourceTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <input
        value={data.location}
        onChange={(e) => setData({ ...data, location: e.target.value })}
        placeholder="Location"
      />

      <input
        type="number"
        value={data.capacity}
        onChange={(e) => setData({ ...data, capacity: e.target.value })}
        placeholder="Capacity"
      />

      <select
        value={data.status || "ACTIVE"}
        onChange={(e) => setData({ ...data, status: e.target.value })}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button className="btn">Update</button>
    </form>
  );
}

export default EditResource;



