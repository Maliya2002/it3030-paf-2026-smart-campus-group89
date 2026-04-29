import React, { useEffect, useState } from "react";
import { updateResource, getResourceById } from "../../services/ResourceService";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/resource.css";

function EditResource() {
  const { id } = useParams();
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
  const statusOptions = ["ACTIVE", "OUT_OF_SERVICE"];

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
      />

      <input
        type="number"
        value={data.capacity}
        onChange={(e) => setData({ ...data, capacity: e.target.value })}
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
