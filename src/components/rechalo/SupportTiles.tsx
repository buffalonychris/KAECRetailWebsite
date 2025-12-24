import React from 'react';

type SupportTile = {
  title: string;
  description: string;
};

type SupportTilesProps = {
  items: SupportTile[];
};

const SupportTiles = ({ items }: SupportTilesProps) => {
  return (
    <div className="rechalo-support-tiles">
      {items.map((item) => (
        <div key={item.title} className="rechalo-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SupportTiles;
