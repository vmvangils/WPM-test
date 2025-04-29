import React from 'react';
import UserStats from './UserStats';
import './History.css';

const History: React.FC = () => {
    return (
        <div className="history-container">
            <UserStats />
        </div>
    );
};

export default History; 