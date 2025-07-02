import React from 'react';
import { useParams } from 'react-router-dom';

function BoutiqueDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1>Boutique {id}</h1>
      <p>Cars available for this boutique will be displayed here.</p>
    </div>
  );
}

export default BoutiqueDetails;