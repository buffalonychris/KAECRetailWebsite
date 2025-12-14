import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Comparison from './pages/Comparison';
import Funding from './pages/Funding';
import Reliability from './pages/Reliability';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Recommendation from './pages/Recommendation';
import Quote from './pages/Quote';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/reliability" element={<Reliability />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/recommend" element={<Recommendation />} />
        <Route path="/quote" element={<Quote />} />
      </Routes>
    </Layout>
  );
};

export default App;
