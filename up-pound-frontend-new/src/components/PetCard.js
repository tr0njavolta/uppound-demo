import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  // For debugging
  useEffect(() => {
    console.log("Pet data:", pet);
    console.log("Image URL:", pet.image_url);
    console.log("Full image path:", `http://localhost:3002${pet.image_url}`);
  }, [pet]);

  return (
    <div className="pet-card">
      <div className="pet-image">
        {/* Add an explicit image name instead of using pet.image_url */}
        <img 
          src={`http://localhost:3002/images/${pet.name.toLowerCase()}.jpg`}
          alt={pet.name} 
          onError={(e) => {
            console.error(`Failed to load: ${e.target.src}`);
            e.target.onerror = null;
            e.target.src = '/logo192.png';
          }}
        />
      </div>
      <div className="pet-info">
        <h3 className="pet-name">{pet.name}</h3>
        <p className="pet-breed">{pet.breed} • {pet.age} years</p>
        <Link to={`/pets/${pet.id}`} className="view-profile">View Profile</Link>
      </div>
    </div>
  );
};

export default PetCard;
