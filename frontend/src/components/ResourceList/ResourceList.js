import React, { useEffect, useState } from "react";
import { getResources } from "../../services/ResourceService";
import "../styles/resource.css";

function ResourceList() {

  const [resources, setResources] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getResources(type, location)
      .then(res => setResources(res.data))
      .catch(() => alert("Failed to load resources"));
  };

  return (
    <div className="container">

      <h2 className="title">All Resources</h2>

      <div className="search-box">
        <input placeholder="Search by type/location..."
          onChange={(e) => setType(e.target.value)} />
      </div>

      <button className="btn" onClick={fetchData}>
        Search
      </button>

      <div className="card">
        {resources.length === 0 ? (
          <p>No resources found</p>
        ) : (
          resources.map(r => (
            <div key={r.id} className="item">
              <h4>{r.name}</h4>
              <p>{r.type} | {r.location}</p>
              <span className={r.status === "ACTIVE" ? "active" : "inactive"}>
                {r.status}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default ResourceList;