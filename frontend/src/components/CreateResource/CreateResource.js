import React, { useState } from "react";
import { createResource } from "../../services/ResourceService";

function CreateResource() {

  const [data, setData] = useState({
    name: "",
    type: "",
    location: "",
    capacity: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createResource(data)
      .then(() => alert("Created"))
      .catch(() => alert("Error"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name"
        onChange={(e)=>setData({...data,name:e.target.value})} />
      <input placeholder="Type"
        onChange={(e)=>setData({...data,type:e.target.value})} />
      <input placeholder="Location"
        onChange={(e)=>setData({...data,location:e.target.value})} />
      <input placeholder="Capacity"
        onChange={(e)=>setData({...data,capacity:e.target.value})} />

      <button>Create Resource</button>
    </form>
  );
}

export default CreateResource;