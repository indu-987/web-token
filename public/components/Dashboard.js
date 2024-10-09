import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Dashboard() {
  const [cids, setCids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pinata API credentials
  const PINATA_API_KEY = 'a2a4677621b5a2ca4873';
  const PINATA_SECRET_API_KEY = '28b9d8e00bbd21142005278cf56b694dbb73ef89c8ed6a5156d5092202b5e3d3';

  useEffect(() => {
    const fetchCIDs = async () => {
      try {
        const response = await axios.get('https://api.pinata.cloud/data/pinList', {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        });
        // Filter CIDs that are images or NFTs (optional)
        const imageCids = response.data.rows.map((item) => item.IpfsHash);
        setCids(imageCids);
      } catch (err) {
        setError('Failed to fetch CIDs from Pinata');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCIDs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg mt-4">
      <h4 className="text-lg font-bold mb-4">NFT CIDs Dashboard</h4>
      {cids.length === 0 ? (
        <p className="text-gray-500">No CIDs available.</p>
      ) : (
        <ul>
          {cids.map((cid, index) => (
            <li key={index} className="mb-2">
              <a
                href={`https://ipfs.io/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                CID: {cid}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
