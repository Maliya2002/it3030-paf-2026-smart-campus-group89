import React, { useEffect, useState } from "react";
<<<<<<< HEAD
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
=======
import { updateResource, getResources } from "../../services/ResourceService";
import { useParams, useNavigate } from "react-router-dom";

function EditResource() {

  const { id } = useParams();
  const navigate = useNavigate();
>>>>>>> origin/Facilities-SASMITHA-P-M-V

  const [data, setData] = useState({
    name: "",
    type: "",
    location: "",
<<<<<<< HEAD
    capacity: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    getResourceById(id).then(res => setData(res.data));
=======
    capacity: ""
  });

  useEffect(() => {
    getResources().then(res => {
      const found = res.data.find(r => r.id == id);
      if (found) setData(found);
    });
>>>>>>> origin/Facilities-SASMITHA-P-M-V
  }, [id]);

  const submit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    updateResource(id, { ...data, capacity: Number(data.capacity) })
      .then(() => {
        alert("Updated!");
        navigate("/resources");
      })
      .catch(() => alert("Update failed"));
=======
    updateResource(id, data).then(() => {
      alert("Updated!");
      navigate("/resources");
    });
>>>>>>> origin/Facilities-SASMITHA-P-M-V
  };

  return (
    <form onSubmit={submit} className="card form">
      <h2>Edit Resource</h2>

<<<<<<< HEAD
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
=======
      <input value={data.name}
        onChange={(e)=>setData({...data,name:e.target.value})} />

      <input value={data.type}
        onChange={(e)=>setData({...data,type:e.target.value})} />

      <input value={data.location}
        onChange={(e)=>setData({...data,location:e.target.value})} />

      <input value={data.capacity}
        onChange={(e)=>setData({...data,capacity:e.target.value})} />
>>>>>>> origin/Facilities-SASMITHA-P-M-V

      <button className="btn">Update</button>
    </form>
  );
}

<<<<<<< HEAD
export default EditResource;
=======
export default EditResource;
>>>>>>> origin/Facilities-SASMITHA-P-M-V
