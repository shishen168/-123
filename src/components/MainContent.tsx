import React from 'react';
import { useLocation } from 'react-router-dom';
import SMSForm from './sms/SMSForm';
import SMSHistory from './sms/SMSHistory';
import ContactsList from './contacts/ContactsList';
import FollowUpList from './followup/FollowUpList';
import RechargeContent from './recharge/RechargeContent';
import BillingDetails from './billing/BillingDetails';
import CountryCodeSettings from './settings/CountryCodeSettings';
import APIInfo from './sms/APIInfo';
import LoadingSpinner from './common/LoadingSpinner';

interface MainContentProps {
  activeTab: string;
  onShowRecharge: () => void;
}

function MainContent({ activeTab, onShowRecharge }: MainContentProps) {
  const location = useLocation();
  const { recipient, recipientName } = location.state || {};

  const renderContent = () => {
    switch (activeTab) {
      case 'sms':
        return (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <SMSForm 
                  initialRecipient={recipient} 
                  initialRecipientName={recipientName} 
                />
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <APIInfo />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-lg shadow-lg h-full">
                <SMSHistory isEmbedded={true} />
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="bg-white rounded-lg shadow-lg">
            <ContactsList />
          </div>
        );

      case 'followup':
        return (
          <div className="bg-white rounded-lg shadow-lg">
            <FollowUpList />
          </div>
        );

      case 'recharge':
        return (
          <div className="bg-white rounded-lg shadow-lg">
            <RechargeContent onShowRecharge={onShowRecharge} />
          </div>
        );

      case 'billing':
        return (
          <div className="bg-white rounded-lg shadow-lg">
            <BillingDetails />
          </div>
        );

      case 'countryCode':
        return (
          <div className="bg-white rounded-lg shadow-lg">
            <CountryCodeSettings />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderContent()}
    </div>
  );
}

export default MainContent;