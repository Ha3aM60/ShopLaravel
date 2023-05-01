import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';




function CategoryCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    

    axios.post('http://127.0.0.1:8000/api/category', formData)
      .then(resp => {
        console.log(formData, resp);
        navigate(-1);
      })
      .catch(bad => {
        console.log("Bad request", bad);
      })
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Назва категорії:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Опис категорії:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="image">URL фотографії:</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Додати категорію</button>
    </form>
  );
}

export default CategoryCreatePage;