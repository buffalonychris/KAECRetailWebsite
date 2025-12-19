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
import AgreementReview from './pages/AgreementReview';
import AgreementPrint from './pages/AgreementPrint';
import ESign from './pages/ESign';
import Payment from './pages/Payment';
import PaymentProcessing from './pages/PaymentProcessing';
import Schedule from './pages/Schedule';
import UAT from './pages/UAT';
import LaunchUAT from './pages/LaunchUAT';
import Resume from './pages/Resume';
import Certificate from './pages/Certificate';
import Verify from './pages/Verify';
import ResumeVerify from './pages/ResumeVerify';
import HealthHomes from './pages/HealthHomes';
import HealthHomesOutcomes from './pages/HealthHomesOutcomes';
import HealthHomesFunding from './pages/HealthHomesFunding';
import HealthHomesPackages from './pages/HealthHomesPackages';
import HealthHomesPilot from './pages/HealthHomesPilot';
import HealthHomesOperations from './pages/HealthHomesOperations';
import HealthHomesIntake from './pages/HealthHomesIntake';
import HealthHomesPacket from './pages/HealthHomesPacket';
import SeniorLanding from './pages/SeniorLanding';
import FamilyLanding from './pages/FamilyLanding';
import AgencyLanding from './pages/AgencyLanding';
import HaloPushbutton from './pages/HaloPushbutton';
import HaloPackage from './pages/HaloPackage';

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
        <Route path="/agreementReview" element={<AgreementReview />} />
        <Route path="/agreementPrint" element={<AgreementPrint />} />
        <Route path="/esign" element={<ESign />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/resume-verify" element={<ResumeVerify />} />
        <Route path="/uat" element={<UAT />} />
        <Route path="/launchUat" element={<LaunchUAT />} />
        <Route path="/sicar" element={<Certificate />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/health-homes" element={<HealthHomes />} />
        <Route path="/health-homes/outcomes" element={<HealthHomesOutcomes />} />
        <Route path="/health-homes/funding" element={<HealthHomesFunding />} />
        <Route path="/health-homes/packages" element={<HealthHomesPackages />} />
        <Route path="/health-homes/pilot" element={<HealthHomesPilot />} />
        <Route path="/health-homes/operations" element={<HealthHomesOperations />} />
        <Route path="/health-homes/intake" element={<HealthHomesIntake />} />
        <Route path="/health-homes/packet" element={<HealthHomesPacket />} />
        <Route path="/lp/senior" element={<SeniorLanding />} />
        <Route path="/lp/family" element={<FamilyLanding />} />
        <Route path="/lp/agency" element={<AgencyLanding />} />
        <Route path="/halo-pushbutton" element={<HaloPushbutton />} />
        <Route path="/halo-package" element={<HaloPackage />} />
      </Routes>
    </Layout>
  );
};

export default App;
