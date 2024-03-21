require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    allowUnlimitedContractSize: true,
    networks: {
        hardhat: {
            chainId: 1337,
        },
        // mumbai: {
        //     url: process.env.RPC_URL,
        //     accounts: [process.env.PRIVATE_KEY],
        // }
    },
};
