import React from 'react';
import { AgencyCrmSection } from '../components/AgencyCrmSection';
import { BusinessAccountsSection } from '../components/BusinessAccountsSection';
import { OurTeamSection } from '../components/OurTeamSection';
import { FinalCtaSection } from '../components/FinalCtaSection';

export default function BusinessPage() {
  return (
    <>
      {/* Agency workspace first; the capability rows (API, webhooks…) follow as detail */}
      <AgencyCrmSection />
      <BusinessAccountsSection />
      <OurTeamSection />
      <FinalCtaSection />
    </>
  );
}
