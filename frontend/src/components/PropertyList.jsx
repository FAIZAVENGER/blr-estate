import React, { useState } from 'react';

function PropertyList({ properties, onSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search properties..."
        value={searchText}
        onChange={handleSearch}
        className="w-full border p-2 mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.length === 0 && <p>No properties found.</p>}

        {properties.map((property) => (
          <div
            key={property._id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="font-bold text-lg">{property.title}</h3>
            <p>{property.location}</p>
            <p className="text-green-600 font-semibold">
              ₹ {property.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
