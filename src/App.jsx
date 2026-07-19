import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
  }

  const reduce = useReducedMotion();
  // Key transitions by page; detail is keyed by startup so switching startups re-animates.
  const transitionKey = page === 'detail' ? `detail-${selectedStartup?.id}` : page;

  const variants = reduce
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={page} setPage={navigateTo} />

      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showProposal && selectedStartup && (
          <ProposalModal
            startup={selectedStartup}
            onClose={() => setShowProposal(false)}
            onSubmit={(data) => {
              handleSubmitProposal(data);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
