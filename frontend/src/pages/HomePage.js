import React, { useState } from 'react';
import PetList from '../components/PetList';

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  
  const handleFilterClick = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <>
      <h1 className="page-title">Find Your Perfect Pet</h1>
      
      <section className="filter-section">
        <div className="filter-pills">
          <div 
            className={`filter-pill dogs ${activeFilter === 'Dog' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Dog')}
          >
            Dogs
          </div>
          <div 
            className={`filter-pill cats ${activeFilter === 'Cat' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Cat')}
          >
            Cats
          </div>
          <div 
            className={`filter-pill small ${activeFilter === 'Small' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Small')}
          >
            Small Pets
          </div>
        </div>
      </section>
      
      <section>
        <PetList speciesFilter={activeFilter} />
      </section>
    </>
  );
};

export default HomePage;
