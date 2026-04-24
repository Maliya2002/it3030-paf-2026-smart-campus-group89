import React, { useState } from "react";
import { createResource } from "../../services/ResourceService";
import { useNavigate } from "react-router-dom";

function CreateResource() {

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
    location: "",
    capacity: ""
  });

  const submit = (e) => {
    e.preventDefault();

    createResource(data)
      .then(() => {
        alert("Created!");
        navigate("/resources");
      });
  };

  return (
    <form onSubmit={submit} className="card form">
      <h2>Create Resource</h2>

      <input placeholder="Name"
        onChange={(e)=>setData({...data,name:e.target.value})} />

      <input placeholder="Type"
        onChange={(e)=>setData({...data,type:e.target.value})} />

      <input placeholder="Location"
        onChange={(e)=>setData({...data,location:e.target.value})} />

      <input placeholder="Capacity"
        onChange={(e)=>setData({...data,capacity:e.target.value})} />

      <button className="btn">Create</button>
    </form>
  );
}

export default CreateResource;