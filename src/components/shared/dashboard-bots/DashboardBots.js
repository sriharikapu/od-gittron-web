import React, { Component } from 'react';

import { get } from '../../../util/requests';
import GittronWeb3Service from '../../../util/gittronWeb3';
// import BotList from '../bot-list/BotList';
import BotFilter from '../bot-filter/BotFilter';

import './DashboardBots.scss';

class DashboardBots extends Component {
  state = {
    bots: [],
    contract: null,
    tokens: [],
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.GittronWeb3Service = new GittronWeb3Service(this.props.web3);

    this.loadContract();
  };

  loadContract = async () => {
    const contract = await this.GittronWeb3Service.initContracts();
    const tokens = await this.tokensByOwner(this.props.address);

    console.log('tokens from contract');
    console.log(tokens);

    const res = await this.loadBots(tokens);

    console.log('res');
    console.log(res);

    const bots = res.filter((bot) => bot.data.tokenId).map((bot) => bot.data);

    console.log('bots');
    console.log(bots);

    if (this._isMounted) {
      this.setState({ contract, tokens, bots });
    }
  };

  tokensByOwner = async (address) => {
    return await this.GittronWeb3Service.tokensByOwner(address);
  };

  loadBots = async (tokens) => {
    const proms = [];

    console.log('tokens');
    console.log(tokens);

    tokens.map((token) => {
      return proms.push(get(`tokenid/${token}`));
    });

    return await Promise.all(proms);
  };

  render() {
    const { bots } = this.state;

    return (
      <div>
        <div className="DashboardBots">
          {/* <BotList bots={bots} /> */}
          {bots ? <BotFilter bots={bots} /> : null}
        </div>
      </div>
    );
  }
}

export default DashboardBots;
