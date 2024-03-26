// const Web3 = require('web3');
const web3Provider = new Web3(window.ethereum);
const urlRPC = "https://data-seed-prebsc-1-s1.bnbchain.org:8545"; // BSC testnet (link server)
const web3 = new Web3(urlRPC);
var currentAccount = null;
export default arrReward = [];

const reward_Address = "0xe8025ffcc016a223e6634b394fa974153431ae5d";
const reward_ABI = [{ "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "bytes32", "name": "hashedMessage", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }, { "internalType": "uint256", "name": "rewardToken", "type": "uint256" }], "name": "claim_Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "wallet", "type": "address" }], "name": "mapReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "reward_User", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token_IC", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
const reward_Contract = new web3Provider.eth.Contract(reward_ABI, reward_Address);
const owner = "0xb727366F6ddfdb307E48b6a2c79601a26040516d";;
$(document).ready(function () {
    getAllClients()
});
$("#btnConnectMM").click(function () {
    connect_Metamask().then((data) => {
        currentAccount = data[0].toLowerCase();
        if (currentAccount.toLowerCase() != owner.toLowerCase()) {
            alert("You are not the owner you cannot access ");
        } else {
            $("#wallet").html(currentAccount);
        }
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
$("#btnReward").click(function () {
    if (currentAccount == null) {
        alert("Please connect to MetaMask!");
    } else {
        var _wallet = $("#txtWallet").val();
        var _token = parseInt($("#txtToken").val());
        var dataSign = "(wallet:_wallet,reward:_token)";
        var hashedMessage = web3.eth.accounts.hashMessage(dataSign);
        var _tmp = [hashedMessage, _wallet, _token];
        arrReward.push(_tmp);
        console.log(arrReward);
        reward_Contract.methods.mapReward(hashedMessage).send({
            from: currentAccount
        }).then((data) => {
            getAllClients();
        });
    }
});

function getAllClients() {

    $("#clientsList").html(`
    <tr>
        <td>Wallet</td>
        <td>IC</td>
        <td>Status</td>

    </tr>
    `);

    for (var order = 0; order < arrReward.length; order++) {
        reward_Contract.methods.getrewardUser(arrReward[order][0][0]).call().then((data) => {
            $("#clientsList").append(`
                <tr>
                    <td>` + arrReward[order][0] + `</td>
                    <td>` + arrReward[order][1] + `</td>
                    <td>` + data + `</td>

                </tr>

           `);
        });
    }
}