"use client"

import { Link } from 'react-router-dom';

import { useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const pathname = useLocation().pathname;
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;

    // Customize labels for dynamic routes
    let label = segment.replace(/-/g, ' '); // Replace hyphens with spaces
    if (segment.match(/^\[.*\]$/)) {
      label = 'Dynamic'; // Example for dynamic segments like [slug]
    }

    return (
      <span key={href}>
        {!isLast ? (
          <Link to={href} className="text-blue-500 hover:underline">
            {label}
          </Link>
        ) : (
          <span id="page_label" className="text-gray-500">{label}</span>
        )}
        {!isLast && <span className="mx-2">/</span>}
      </span>
    );
  });

  return (
    <nav className="box p-4 flex text-sm mb-4">
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      {breadcrumbs.length > 0 && <span className="mx-2">/</span>}
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumbs;