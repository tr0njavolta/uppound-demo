import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';

const PetList = ({ speciesFilter = null }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://localhost:3002';
  
// In PetList.js
useEffect(() => {
  const fetchPets = async () => {
    try {
      setLoading(true);
      console.log('Fetching pets...');
      
      const response = await fetch(`${API_URL}/api/pets`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched pets:', data);
      
      let filteredPets = data;
      if (speciesFilter) {
        // Special case for small pets category
        if (speciesFilter === 'Small') {
          filteredPets = data.filter(pet => 
            pet.species === 'Small' || pet.species === 'Ferret' || 
            ['Hamster', 'Guinea Pig', 'Rabbit', 'Ferret'].includes(pet.breed)
          );
        } else {
          filteredPets = data.filter(pet => pet.species === speciesFilter);
        }
      }
      
      setPets(filteredPets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please try again.');
      setLoading(false);
    }
  };
  
  fetchPets();
}, [speciesFilter]);  
  if (loading) return <p>Loading pets...</p>;
  if (error) return <p className="error-message">{error}</p>;
  
  return (
    <div className="pets-grid">
      {pets.length === 0 ? (
        <p>No pets found. Try a different filter.</p>
      ) : (
        pets.map(pet => <PetCard key={pet.id} pet={pet} />)
      )}
    </div>
  );
};

export default PetList;
