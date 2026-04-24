import React, { useEffect, useState } from "react";
import { updateResource, getResources } from "../../services/ResourceService";
import { useParams, useNavigate } from "react-router-dom";

function EditResource() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
    location: "",
    capacity: ""
  });

  useEffect(() => {
    getResources().then(res => {
      const found = res.data.find(r => r.id == id);
      if (found) setData(found);
    });
  }, [id]);

  const submit = (e) => {
    e.preventDefault();
    updateResource(id, data).then(() => {
      alert("Updated!");
      navigate("/resources");
    });
  };

  return (
    <form onSubmit={submit} className="card form">
      <h2>Edit Resource</h2>

      <input value={data.name}
        onChange={(e)=>setData({...data,name:e.target.value})} />

      <input value={data.type}
        onChange={(e)=>setData({...data,type:e.target.value})} />

      <input value={data.location}
        onChange={(e)=>setData({...data,location:e.target.value})} />

      <input value={data.capacity}
        onChange={(e)=>setData({...data,capacity:e.target.value})} />

      <button className="btn">Update</button>
    </form>
  );
}

export default EditResource;