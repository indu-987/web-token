// src/components/SendCoin.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEther } from '../redux/coinSlice';

export function SendCoin() {
  const dispatch = useDispatch();
  const { transactionHash, errorMessage, sending } = useSelector((state) => state.coin);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const sendEtherHandler = () => {
    if (!recipientAddress || !amount) {
      alert('Please enter both recipient address and amount.');
      return;
    }
    dispatch(sendEther(recipientAddress, amount));
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h4 className="text-lg font-bold mb-4">Send Ether</h4>

      <input
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <input
        type="text"
        placeholder="Amount (in ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <button
        onClick={sendEtherHandler}
        disabled={sending}
        className={`w-full py-2 mb-4 text-white ${sending ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md transition duration-200`}
      >
        {sending ? 'Sending...' : 'Send Ether'}
      </button>

      {transactionHash && (
        <div className="text-green-600">
          <p>Transaction Successful!</p>
          <p>
            Transaction Hash: 
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-400 mt-2">
          <p>Error: {errorMessage}</p>
        </div>
      )}
    </div>
  );
}
