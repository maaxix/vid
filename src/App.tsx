import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './Routes';

import Layout from './components/ui/layout/Layout';
//import Navigation from './components/Navigation';
import LoadingSpinner from './components/ui/LoadingSpinner';

const App = () => {
  return (
    <Router>
      <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element} 
            >
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
      </Layout>
    </Router>
  );
};

/*
const App = () => {
  return (
    <Router>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element} 
            >
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};
*/
export default App;
