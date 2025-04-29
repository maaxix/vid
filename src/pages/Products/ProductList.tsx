import React from 'react';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ];

  return (
    <div className="box">
      <h4 className="card-header title-primary">Products</h4>
      <div className="card-body">
        <ul className="flex-col gap-2">
          {products.map(product => (
            <li key={product.id} className="vitem">
              <Link className='vlink' to={`/products/${product.id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;