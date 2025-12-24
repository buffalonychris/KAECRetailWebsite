import React from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

const FAQ = ({ items }: FAQProps) => {
  return (
    <div className="rechalo-faq">
      {items.map((item) => (
        <div key={item.question} className="rechalo-faq-item">
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
