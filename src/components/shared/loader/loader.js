import React from 'react';
import { Link } from 'react-router-dom';

function Loader() {
  { txHash } = this.props
  return (
    <div className="Loader">
      <div className="Loader__Contents">
        <h1>Loading ...</h1>
        {txHash ? (
            <Link to={`https://rinkeby.etherscan.io/tx/${txHash}`}>
              <p>Check Metamask to see if there's a transaction to confirm.</p>
              <p>{repo.repo}</p>
            </Link>
        ) : (
          <p>Check Metamask to see if there's a transaction to confirm.</p>
        )}
        <p>If you've already confirmed the transaction, then it is likely processing.</p>
      </div>
    </div>
  );
}

export default Loader;
