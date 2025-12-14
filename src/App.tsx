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
import QuoteReview from './pages/QuoteReview';
import QuotePrint from './pages/QuotePrint';
import Agreement from './pages/Agreement';
import AgreementPrint from './pages/AgreementPrint';
import ESign from './pages/ESign';
import Payment from './pages/Payment';
import PaymentProcessing from './pages/PaymentProcessing';
import Schedule from './pages/Schedule';
import UAT from './pages/UAT';
import Resume from './pages/Resume';

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
        <Route path="/quoteReview" element={<QuoteReview />} />
        <Route path="/quotePrint" element={<QuotePrint />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/agreementPrint" element={<AgreementPrint />} />
        <Route path="/esign" element={<ESign />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/uat" element={<UAT />} />
      </Routes>
    </Layout>
  );
};

export default App;
