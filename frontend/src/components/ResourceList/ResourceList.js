import React, { useEffect, useState } from "react";
import { getResources, deleteResource, downloadPDF } from "../../services/ResourceService";
import { Link } from "react-router-dom";
import "../styles/resource.css";

function ResourceList() {

  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    load();
  }, []);

  // 🔹 Load resources (with filters)
  const load = () => {
    getResources(type, location)
      .then(res => setData(res.data))
      .catch(() => alert("Error loading resources"));
  };

  // 🔹 Delete resource
  const remove = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteResource(id).then(load);
    }
  };

  // 🔹 Download PDF
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

      {/* 🔍 SEARCH SECTION */}
      <div className="search-box">

        <input
          placeholder="Type (ROOM / LAB / EQUIPMENT)"
          onChange={(e) => setType(e.target.value)}
        />

        <input
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="btn" onClick={load}>
          Search
        </button>

      </div>

      {/* 🔹 ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <Link to="/create-resource">
          <button className="btn add">+ Add Resource</button>
        </Link>

        <button className="btn" onClick={handleDownload}>
          Download PDF
        </button>

      </div>

      {/* 🔹 RESOURCE GRID */}
      <div className="grid">
        {data.length === 0 ? (
          <p style={{ color: "white" }}>No resources found</p>
        ) : (
          data.map(r => (
            <div className="card" key={r.id}>
              <h3>{r.name}</h3>
              <p><b>Type:</b> {r.type}</p>
              <p><b>Location:</b> {r.location}</p>
              <p><b>Capacity:</b> {r.capacity}</p>

              <div className="actions">
                <Link to={`/edit-resource/${r.id}`}>
                  <button className="edit">Edit</button>
                </Link>

                <button
                  className="delete"
                  onClick={() => remove(r.id)}
                >
                  Delete
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