'use strict'; // self-defence

// Functions from figure
const hfc = require('fabric-client');
let channel;
const enrolUser = function (client, options) {
    return hfc.newDefaultKeyValueStore({ path: options.wallet_path })
        .then(wallet => {
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        });
};

const ca = require('fabric-ca-client');
const User = require('fabric-client/lib/User.js');

const enrolUserCA = function (client, opt) {
    // Create the ca client
    const caClient = new ca(opt.ca_url, null, '');

    return hfc.newDefaultKeyValueStore({ path: opt.wallet_path })
        .then(wallet => {
            client.setStateStore(wallet);
            return caClient.enroll({
                enrollmentID: "admin",
                enrollmentSecret: "adminpw"
            });
        })
        .then(enrollment => {
            const admin = new User("admin");
            admin.setCryptoSuite(client.getCryptoSuite());
            return admin.setEnrollment(enrollment.key, enrollment.certificate, opt.msp)
                .then(() => client.setUserContext(admin))
                .then(() => admin);
        });
};

const initNetwork = function (client, options, target) {
    let channel;
    try {
        channel = client.newChannel(options.channel_id);
        const peer = client.newPeer(options.peer_url);
        target.push(peer);
        channel.addPeer(peer);
        channel.addOrderer(client.newOrderer(options.orderer_url));
    } catch (e) { // channel already exists
        channel = client.getChannel(options.channel_id);
    }
    return channel;
};

const transactionProposal = function (client, channel, request) {
    request.txId = client.newTransactionID();
    return channel.sendTransactionProposal(request);
};

const responseInspect = function (results) {
    const proposalResponses = results[0];
    const proposal = results[1];
    const header = results[2];

    if (proposalResponses && proposalResponses.length > 0 &&
        proposalResponses[0].response &&
        proposalResponses[0].response.status === 200) {
        return true;
    }
    return false;
};

const sendOrderer = function (channel, request) {
    return channel.sendTransaction(request);
};

const target = [];
const client = new hfc();

// Function invokes createPC on pcxchg
function invoke(opt, param) {
    return enrolUserCA(client, opt)
        .then(user => {
            if (typeof user === "undefined" || !user.isEnrolled())
                throw "User not enrolled";

            channel = initNetwork(client, opt, target);
            const request = {
                targets: target,
                chaincodeId: opt.chaincode_id,
                fcn: 'createPC',
                args: param,
                chainId: opt.channel_id,
                txId: null
            };
            return transactionProposal(client, channel, request);
        })
        .then(results => {
            if (responseInspect(results)) {
                const request = {
                    proposalResponses: results[0],
                    proposal: results[1],
                    header: results[2]
                };
                return sendOrderer(channel, request);
            } else {
                throw "Response is bad";
            }
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

// Options
var options = {
    Asus: {
        wallet_path: './certs/asus',
        user_id: 'AsusAdmin',
        channel_id: 'asus',
        chaincode_id: 'pcxchg',
        peer_url: 'grpc://localhost:7051',
        orderer_url: 'grpc://localhost:7050',
        event_url: 'grpc://localhost:7053',
        ca_url: 'http://localhost:8054',
        msp: `AsusMSP`
    },
    Hp: {
        wallet_path: './certs/hp',
        user_id: 'HpAdmin',
        channel_id: 'hp',
        chaincode_id: 'pcxchg',
        peer_url: 'grpc://localhost:9051',
        orderer_url: 'grpc://localhost:7050',
        event_url: 'grpc://localhost:9053',
        ca_url: 'http://localhost:9054',
        msp: `HPMSP`
    },
    Dell: {
        wallet_path: './certs/dell',
        user_id: 'DellAdmin',
        channel_id: 'dell',
        chaincode_id: 'pcxchg',
        peer_url: 'grpc://localhost:10051',
        orderer_url: 'grpc://localhost:7050',
        event_url: 'grpc://localhost:10053',
        ca_url: 'http://localhost:10054',
        msp: `DellMSP`
    }
};


// Server
const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

app.engine('html', require('ejs').renderFile);

const server = http.createServer(app).listen(4000, function () { });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set('views', __dirname);

app.post('/invoke', function (req, res, next) {
    const args = req.body.args;
    invoke(options[args[0]], args.slice(1))
        .then(() => res.send("Chaincode invoked"))
        .catch(err => {
            res.status(500);
            res.send(err.toString());
        });
});

app.get('/', function (req, res) {
    res.render('UI.html');
});