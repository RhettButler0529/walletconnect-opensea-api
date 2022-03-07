import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button} from 'antd';
import {useWallet} from '../hooks/useWallet';
import {useWalletModal} from '../hooks/useWalletModal';
import WalletModal from './WalletModal/WalletModal';
import {useWeb3React} from '@web3-react/core';
import NoImage from '../assets/images/noimage.png';

const ConnectButton = styled(Button)`
  width: 250px;
  display: block;
  margin: 20px auto;
  margin-top: 30vh;
  background-color: #6f1d1b;
`;

const Home = () => {
    const {active, account} = useWallet();
    const {activate} = useWeb3React();
    const {toggleOpen} = useWalletModal();
    const [visible, setVisible] = useState(false);
    const [collections, setCollections] = useState([]);
    const miniString = (account) => {
        let upString = account.substring(0, 5);
        let downString = account.substr(account.length - 4);
        return upString + "......" + downString
    }

    const showDisconnect = (e) => {
        setVisible(true);
    }

    const disconnectWallet = (e) => {
        setVisible(false);
        activate(null);

    }

    useEffect(() => {
        console.log("active ===>", active, account);
        if (active) {
            const options = {method: 'GET', headers: {Accept: 'application/json'}};

            fetch(`https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=${account}`, options)
            // fetch(`https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=10`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    if (response.length != 0) {
                        setCollections(response.collections);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [active]);

    return (
        <>
            <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
                <div className="app">
                    <div className="wallet-btn-section">
                        {active ? (
                            <>
                                <button className="wallet-btn" onClick={showDisconnect}>{miniString(account)}</button>
                                {
                                    visible ? (<div className="disconnect-section"
                                                    onClick={disconnectWallet}>disconnect</div>) : ("")
                                }

                            </>

                        ) : (<button onClick={toggleOpen} className="wallet-btn">Connect Wallet</button>)}
                    </div>
                    <WalletModal/>
                    <div>
                        <div style={{
                            transition: 'opacity 400ms ease 0s, transform 400ms ease 0s',
                            transform: 'none',
                            opacity: '1'
                        }} className="overview">
                            <div className="common-container">
                                <div className="mb-4 mb-lg-5 container">
                                    <div className="row">
                                        <div className="px-4 mt-md-4 container">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="mb-4 row">
                                                        <div className="mb-4 col-lg-12 col-12">
                                                            <h2 className="common-title mb-3"
                                                                style={{textAlign: 'center'}}>The assets list</h2>
                                                        </div>
                                                    </div>
                                                    {
                                                        collections.length == 0 ?
                                                            <p>No collections</p> :
                                                            <div className="row mb-3">
                                                                {
                                                                    collections.map(collection => <div className="col-lg-3 col-md-3 col-3 p-3">
                                                                        <img className="img-fluid"
                                                                             src={collection.image_url == null ? NoImage : collection.image_url}/>
                                                                        <p>{collection.name}</p>
                                                                    </div>)
                                                                }

                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                            <hr className="gray-line mb-5 mt-5"></hr>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </body>

        </>
    );

}

export default Home;
