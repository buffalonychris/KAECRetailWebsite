import React from 'react';

type CardItem = {
  title: string;
  description: string;
};

type CardGridProps = {
  items: CardItem[];
};

const CardGrid = ({ items }: CardGridProps) => {
  return (
    <div className="rechalo-card-grid">
      {items.map((item) => (
        <div key={item.title} className="rechalo-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
