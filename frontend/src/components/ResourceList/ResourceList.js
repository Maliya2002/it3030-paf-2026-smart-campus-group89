import React, { useEffect, useState } from "react";
import { getResources, deleteResource } from "../../services/ResourceService";
import { Link } from "react-router-dom";
import "../styles/resource.css";

function ResourceList() {

  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    getResources(type, location)
      .then(res => setData(res.data))
      .catch(() => alert("Error loading"));
  };

  const remove = (id) => {
    deleteResource(id).then(load);
  };

  return (
    <div className="container">

      <h2 className="title">Resources</h2>

      <div className="search-box">
        <input placeholder="Type"
          onChange={(e)=>setType(e.target.value)} />

        <input placeholder="Location"
          onChange={(e)=>setLocation(e.target.value)} />

        <button className="btn" onClick={load}>Search</button>
      </div>

      <Link to="/create-resource">
        <button className="btn add">+ Add Resource</button>
      </Link>

      <div className="grid">
        {data.map(r => (
          <div className="card" key={r.id}>
            <h3>{r.name}</h3>
            <p>{r.type} | {r.location}</p>
            <p>Capacity: {r.capacity}</p>

            <div className="actions">
              <Link to={`/edit-resource/${r.id}`}>
                <button className="edit">Edit</button>
              </Link>

              <button className="delete" onClick={()=>remove(r.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ResourceList;