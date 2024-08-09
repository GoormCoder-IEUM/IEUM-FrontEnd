import React, { useState, useEffect } from 'react';
import PlaceIntroModal from "../modal/PlaceIntroModal";
import '../style/Citychoose.css';

function Citychoose() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/plans')
      .then(response => response.json())
      .then(data => setPlans(data))
      .catch(error => console.error('Error fetching travel plans:', error));
  }, []);

  const handlePlanClick = (plan) => {
    setModalContent({
      krName: plan.krName,
      enName: plan.enName,
      description: plan.description,
      id: plan.id,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlans = plans.filter(plan => {
    const krName = plan.krName || '';
    const enName = plan.enName || '';
    const country = plan.country || '';

    return (
      krName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h1>여행지 리스트</h1>
      <input 
        type="text" 
        placeholder="검색하세요..." 
        value={searchTerm}
        onChange={handleSearchChange}
        className="searchInput"
      />
      <div className="plans-list">
        {filteredPlans.map(plan => (
          <div 
            key={plan.id} 
            onClick={() => handlePlanClick(plan)} 
            className="card"
          >
            <img src={require('../img/images.jpg')} alt={plan.enName} className="image" />
            <div className="cardContent">
              <p className="newBadge">새로운 여행지</p>
              <h2 className="enName">{plan.enName}</h2>
              <p className="krName">{plan.country} {plan.krName}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PlaceIntroModal 
          isOpen={isModalOpen} 
          onClose={handleModalClose} 
          krName={modalContent.krName}
          enName={modalContent.enName}
          content={modalContent.description}
          destinationId={modalContent.id}
          modalRef={null}
        />
      )}
    </div>
  );
}

export default Citychoose;
