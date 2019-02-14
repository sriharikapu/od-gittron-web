import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import GittronWeb3Service from '../../../util/gittronWeb3';
import { post } from '../../../util/requests';
import Web3Service from '../../../util/web3Service';

class BuidlButton extends Component {
  state = {
    contract: null,
    workerTokenId: null,
    tokenId: null,
    buidlAvail: null,
    ownerOf: false,
  };
  async componentDidMount() {
    this._isMounted = true;
    this.GittronWeb3Service = new GittronWeb3Service(this.props.web3);
    this.web3Service = new Web3Service(this.props.web3);

    this.loadContract();
  }

  loadContract = async () => {
    const contract = await this.GittronWeb3Service.initContracts();

    if (this._isMounted) {
      const buidlAvail = await this.totalRareAvailible(this.props.bot.tokenId);
      const ownerOfToken = await this.ownerOf(this.props.bot.tokenId);
      this.setState({ contract, buidlAvail, ownerOfToken });
    }
  };

  totalRareAvailible = async (tokenId) => {
    return await this.GittronWeb3Service.totalRareAvailible(tokenId);
  };

  ownerOf = async (tokenId) => {
    return await this.GittronWeb3Service.ownerOf(tokenId);
  };

  handleSubmit = async (bot) => {
    const newBot = {
      masterTokenId: bot.tokenId,
      tokenType: 'worker',
      address: this.props.account,
    };
    const res = await post('tokens/workersupporter', newBot);

    this.setState({ workerTokenId: res.data.tokenId });

    const botRes = await this.GittronWeb3Service.launchWorkerBot(
      newBot.masterTokenId,
      res.data.tokenId,
      `${process.env.REACT_APP_API_HOST}uri/${res.data.tokenId}`,
      this.props.account, //receiver,
      this.props.account,
      res.data.ghid,
    );

    if (!botRes.error) {
      this.props.history.push(`/bots/${this.state.workerTokenId}`);
    }
  };

  render() {
    const { bot, account } = this.props;
    const { buidlAvail, ownerOfToken } = this.state;

    return (
      <div>
        <p>Free buidlbots availible: {buidlAvail}</p>

        {buidlAvail > 0 && ownerOfToken === account ? (
          <button onClick={() => this.handleSubmit(bot)}>Gift BuidlBot</button>
        ) : (
          <p>Get more free BuidlerBots at next metamorph level</p>
        )}
        {ownerOfToken !== account ? (
          <p>you are not the owner of this bot</p>
        ) : null}
      </div>
    );
  }
}

export default withRouter(BuidlButton);