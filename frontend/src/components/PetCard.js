import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <div className="pet-image">
        <img 
            src={`${pet.image_url.replace(/^\/images\//, '')}`}
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
