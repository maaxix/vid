// ProductList.tsx
import { Outlet } from 'react-router-dom';

export default function ProductList() {
  return (
    <div>
      <h4 className="mb-2 title-primary">Product List Page</h4>
      <Outlet /> {/* This is where nested children like ProductDetail will render */}
    </div>
  );
}
