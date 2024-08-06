import React, { useState } from 'react';
import './modal.css'; // Ensure you have some basic CSS for the modal
import axios from 'axios';

export default function TaskModal({ task, closeModal, onSave }) {
  const [formData, setFormData] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    try {
      axios.put('http://localhost:4000/api/task/update', formData, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Task:</label>
            <input
              type="text"
              name="task"
              value={formData.task}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Priority:</label>
            <input
              type="text"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>User:</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
