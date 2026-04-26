import React, { useEffect, useState } from "react";
import { getResources, deleteResource, downloadPDF } from "../../services/ResourceService";
import { Link } from "react-router-dom";
import "../styles/resource.css";
import { Pencil, Trash2, FileDown } from "lucide-react";

function ResourceList() {

  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    load();
  }, [type, location, status]);

  const load = () => {
    getResources(type, location, status)
      .then(res => setData(res.data))
      .catch(() => alert("Error loading resources"));
  };

  const remove = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteResource(id)
        .then(() => {
          alert("Deleted successfully!");
          load();
        })
        .catch(() => alert("Delete failed"));
    }
  };

  const resetFilters = () => {
    setType("");
    setLocation("");
    setStatus("");
  };

  const handleDownload = () => {
    downloadPDF()
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "resources.pdf");

        document.body.appendChild(link);
        link.click();
      })
      .catch(() => alert("Failed to download PDF"));
  };

  return (
    <div className="container">
      <h2 className="title">Resources</h2>

      <div className="search-box">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="ROOM">Room</option>
          <option value="LAB">Lab</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of service</option>
        </select>

        <button className="btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="top-actions">
        <Link to="/create-resource">
          <button className="btn add">+ Add Resource</button>
        </Link>

        <button className="btn pdf-btn" onClick={handleDownload}>
          <FileDown size={18} /> Download PDF
        </button>
      </div>

      <div className="grid">
        {data.length === 0 ? (
          <p className="no-data">No resources found</p>
        ) : (
          data.map(r => (
            <div className="card" key={r.id}>
              <h3>{r.name}</h3>
              <p><b>Type:</b> {r.type}</p>
              <p><b>Location:</b> {r.location}</p>
              <p><b>Capacity:</b> {r.capacity}</p>
              <span className={`status ${r.status === "ACTIVE" ? "active" : "inactive"}`}>
                {r.status}
              </span>
              <div className="actions">
                <Link to={`/edit-resource/${r.id}`}>
                  <button className="edit">
                    <Pencil size={16} /> Edit
                  </button>
                </Link>
                <button className="delete" onClick={() => remove(r.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResourceList;
