import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductDetail = () => {
  // Get the product ID from the URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Using a mock API - in a real app, replace with your actual API endpoint
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h4>Error</h4>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="back-button">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h4>Product Not Found</h4>
        <p>The requested product does not exist.</p>
        <Link to="/products" className="back-link">
          View all products
        </Link>
      </div>
    );
  }

  return (
    <div className="box">
      <h4 className="flex card-header">
        <span className="grow title-primary">Product Details</span>
        <div className="nav">  
          <button onClick={() => navigate(-1)} className="btn btn-round"><i className="icon icon-sun"></i></button>
          <button onClick={() => navigate(-1)} className="btn link back-buttonx"> ← Back</button>
        </div>
      </h4>
      
      <div className="card-body product-detail-grid">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
            }}
          />
        </div>
        
        <div className="product-info-container">
          <h4 className="product-title">{product.title}</h4>
          <p className="product-category">{product.category}</p>
          
          <div className="product-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.round(product.rating.rate))}
              {'☆'.repeat(5 - Math.round(product.rating.rate))}
            </span>
            <span className="rating-count">({product.rating.count} reviews)</span>
          </div>
          
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <p className="product-description">{product.description}</p>
          
          <button className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="card-body related-products-section">
        <h4 className='mb-2'>You may also like</h4>
        {/* In a real app, you would fetch related products here */}
        <div className="related-products-grid">
          <Link to={`/products/${(Number(id) + 1) % 20 + 1}`} className="related-product">
            <img src="https://via.placeholder.com/150" alt="Related product" />
            <p>Related Product</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;