// dùng import arr từ bên process 
const web3Provider = new Web3(window.ethereum);
const urlRPC = "https://data-seed-prebsc-1-s1.bnbchain.org:8545"; // BSC testnet (link server)
const web3 = new Web3(urlRPC);
var currentAccount = null;
import { arrReward } from './process.js';
console.log(arrReward);
const reward_Address = "0xe8025ffcc016a223e6634b394fa974153431ae5d";
const reward_ABI = [{ "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "bytes32", "name": "hashedMessage", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }, { "internalType": "uint256", "name": "rewardToken", "type": "uint256" }], "name": "claim_Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "wallet", "type": "address" }], "name": "mapReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "reward_User", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token_IC", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
const reward_Contract = new web3Provider.eth.Contract(reward_ABI, reward_Address);
const owner = "0xb727366F6ddfdb307E48b6a2c79601a26040516d";

$("#btnConnectMM").click(function () {
    connect_Metamask().then((data) => {
        currentAccount = data[0].toLowerCase();
        $("#wallet").html(currentAccount);
    });
});

$("#btnConnectMM").click(function () {
    connect_Metamask().then((data) => {
        currentAccount = data[0].toLowerCase();
        $("#wallet").html(currentAccount);
    });
});

async function connect_Metamask() {
    if (typeof window.ethereum == undefined) {
        alert("Please install metamark");
    } else {
        const accounts = ethereum.request({ method: 'eth_requestAccounts' });
        return accounts;
    }
}

$("#btnClaim").click(function () {
    if (currentAccount == null) {
        alert("Please connect to MetaMask!");
    } else {
        const privatekey = Buffer.from("4e21f1359eac9ff41d377b988e82fc4ee731cd9372859b95655e3b745b29c114", 'hex');
        for (var order = 0; order < arrReward.length; order++) {
            if (arrReward[order][1][0] == currentAccount) {
                console.log(arrReward);
                var signature = web3.eth.accounts.sign(arrReward[order][0][0], privatekey);
                var v = parseInt(Number(signature.v))
                reward_Contract.methods.claim_Token(arrReward[order][0][0], v, signature.r, signature.s, arrReward[order][0][1]).send({
                    from: currentAccount
                })
            }
        }

    }
});