import { useState } from 'react';
import './index.css';

import Navbar from './components/Navbar';
import ProposalModal from './components/ProposalModal';

import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import StartupDetail from './pages/StartupDetail';
import InvestorDashboard from './pages/InvestorDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState(null);

  function handleSelectStartup(startup) {
    setSelectedStartup(startup);
    setPage('detail');
  }

  function handleBackToMarketplace() {
    setPage('marketplace');
    setSelectedStartup(null);
  }

  function handleSubmitProposal(proposalData) {
    setProposal(proposalData);
  }

  function navigateTo(newPage) {
    setPage(newPage);
    if (newPage !== 'detail') setSelectedStartup(null);
    setShowProposal(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={page} setPage={navigateTo} />

      {page === 'home' && <Landing setPage={navigateTo} />}

      {page === 'marketplace' && (
        <Marketplace onSelectStartup={handleSelectStartup} />
      )}

      {page === 'detail' && selectedStartup && (
        <StartupDetail
          startup={selectedStartup}
          onBack={handleBackToMarketplace}
          onPropose={() => setShowProposal(true)}
        />
      )}

      {page === 'investor' && (
        <InvestorDashboard proposal={proposal} />
      )}

      {page === 'government' && <GovernmentDashboard />}

      {showProposal && selectedStartup && (
        <ProposalModal
          startup={selectedStartup}
          onClose={() => setShowProposal(false)}
          onSubmit={(data) => {
            handleSubmitProposal(data);
          }}
        />
      )}
    </div>
  );
}
