import React from 'react';

export const TabNavigation = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => onChangeTab(key)}
            className={`${
              activeTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};