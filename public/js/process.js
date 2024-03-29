// const Web3 = require('web3');
const web3Provider = new Web3(window.ethereum);
const urlRPC = "https://data-seed-prebsc-1-s1.bnbchain.org:8545"; // BSC testnet (link server)
const web3 = new Web3(urlRPC);
let currentAccount = null;
let admin = null;
let arrReward = [];
const reward_Address = "0x97671d71fFAf3Abf3b6Ce9020F3dC87793baaC8A";
const reward_ABI = [{ "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "bytes32", "name": "hashedMessage", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }, { "internalType": "uint256", "name": "rewardToken", "type": "uint256" }], "name": "claim_Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "hashedMessage", "type": "bytes32" }], "name": "getRewardUser", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "hashedMessage", "type": "bytes32" }], "name": "mapReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "reward_User", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token_IC", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
const reward_Contract = new web3Provider.eth.Contract(reward_ABI, reward_Address);
const owner = "0xb727366F6ddfdb307E48b6a2c79601a26040516d";
const privatekey = "4e21f1359eac9ff41d377b988e82fc4ee731cd9372859b95655e3b745b29c114";
fetch('/get-data')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const { address, hashedmessage, uint256 } = item;
            const newUser = {
                address: address,
                hashedmessage: hashedmessage,
                uint256: uint256
            };
            arrReward.push(newUser);
            console.log(arrReward);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
// const { pool } = require("./pool");
$(document).ready(function () {
    getAllClients();
});
$("#btnConnectMMAdmin").click(function () {
    connect_Metamask().then((data) => {
        admin = data[0].toLowerCase();
        if (admin.toLowerCase() != owner.toLowerCase()) {
            alert("You are not the owner you cannot access ");
        } else {
            getAllClients();
            $("#wallet").html(admin);
        }
    });
});
$("#btnConnectMMUser").click(function () {
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

async function insertDataToPost(hashedMessage, wallet, token) {
    try {
        const query = {
            text: 'INSERT INTO list_reward(hashedmessage,address, uint256 ) VALUES($1, $2, $3)',
            values: [hashedMessage, wallet, token],
        };
        const response = await fetch('/submit-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });
        if (response.ok) {
            console.log('Data sent successfully');
            // Xử lý phản hồi từ máy chủ (nếu cần)
        } else {
            console.error('Failed to send data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

$("#btnReward").click(function () {
    if (admin == null) {
        alert("Please connect to MetaMask!");
    } else {
        let _wallet = $("#txtWallet").val();
        let _token = parseInt($("#txtToken").val());
        let dataSign = "{wallet:'" + _wallet + "',reward:" + _token + "}";
        let hashedMessage = web3.eth.accounts.hashMessage(dataSign);
        let _tmp = {
            address: _wallet,
            hashedmessage: hashedmessage,
            uint256: _token
        };
        arrReward.push(_tmp);
        console.log(arrReward);
        insertDataToPost(hashedMessage, _wallet, _token);
        reward_Contract.methods.mapReward(hashedMessage).send({
            from: admin
        }).then((data) => {
            getAllClients();
        });

    }
});

async function getAllClients() {

    $("#clientsList").html(`
    <tr>
        <td>Wallet</td>
        <td>IC</td>
        <td>Status</td>

    </tr>
    `);
    console.log(arrReward);
    for (let order = 0; order < arrReward.length; order++) {
        let status = await reward_Contract.methods.getRewardUser(arrReward[order].hashedmessage).call();
        if (!status) {
            status = 'Claim';
        } else {
            status = 'Claimed';
        }

        $("#clientsList").append(`
                <tr>
                    <td>` + arrReward[order].address + `</td>
                    <td>` + arrReward[order].uint256 + `</td>
                    <td>` + status + `</td>

                </tr>

           `);

        console.log("130");
    }
    console.log("133");
}

$("#btnClaim").click(function () {
    console.log(arrReward);

    if (currentAccount == null) {
        alert("Please connect to MetaMask!");
    } else {
        try {
            for (let order = 0; order < arrReward.length; order++) {
                let tmp = arrReward[order].address;
                if (tmp.toLowerCase() == currentAccount) {
                    console.log(arrReward);
                    let signature = web3.eth.accounts.sign(arrReward[order].hashedmessage, privatekey);
                    let v = parseInt(Number(signature.v))
                    reward_Contract.methods.claim_Token(arrReward[order].hashedmessage, v, signature.r, signature.s, arrReward[order].uint256).send({
                        from: currentAccount
                    }).on('error', function (error) {
                        alert('Error:', error); // In ra lỗi từ smart contract
                        if (error.message.includes('revert')) {
                            console.log('Transaction reverted, require statement failed.');
                        }
                    });
                }
            }
        } catch {
            alert("You are not eligible to receive the reward");
        }
    }
});