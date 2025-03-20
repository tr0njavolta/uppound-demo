import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PetDetailPage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:3002/api';
  
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/pets/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPet(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching pet details for ID ${id}:`, err);
        setError('Failed to load pet details.');
        setLoading(false);
      }
    };
    
    fetchPetDetails();
  }, [id, API_BASE_URL]);
  
  if (loading) return <div className="loading">Loading pet details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!pet) return <div>Pet not found</div>;
  
  // Construct a direct image URL based on pet name
  const petImageUrl = `http://localhost:3002/images/${pet.name.toLowerCase()}.jpg`;
  
  return (
    <div className="pet-detail-page">
      <Link to="/" className="back-link">← Back to all pets</Link>
      
      <div className="pet-detail-container">
        <div className="pet-detail-image">
          <img 
            src={petImageUrl}
            alt={pet.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo192.png'; // Use a reliable fallback image
            }}
          />
        </div>
        
        <div className="pet-detail-info">
          <h1>{pet.name}</h1>
          <p className="pet-type">{pet.breed} {pet.species}, {pet.age} years old</p>
          <p className="pet-description">{pet.description}</p>
          
          <div className="adoption-section">
            <h3>Oh, no! {pet.name} already has a forever home...</h3>
            <a 
              href="https://upbound.io" 
              className="adopt-button" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Adopt Upbound instead!
            </a>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
