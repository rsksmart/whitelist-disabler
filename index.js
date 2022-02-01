let web3 = require('web3');
let bridge = require('@rsksmart/rsk-precompiled-abis').bridge;
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;

const whitelistAuthorizer = {
    address: '0x87d2a0f33744929da08b65fd62b627ea52b25f8e',
    privateKey: '3890187a3071327cee08467ba1b44ed4c13adb2da0d5ffcc0563c371fa88259c' 
};

const disablr = async (web3Host) => {
    try {
        console.log('Starting whitelist Disabler');

        const web3Client = new web3(web3Host);
        const bridgeInstance = bridge.build(web3Client);
    
        const disableCall = bridgeInstance.methods.setLockWhitelistDisableBlockDelay(1);
        const callResult = await disableCall.call({ from: whitelistAuthorizer.address });
    
        console.log(`Calling disable whitelist returns ${callResult}`);
        if (callResult == -1) {
            console.log('Whitelist already disabled');
            console.log('Finished succesfully');
            return;
        }
    
        console.log('Going to disable whitelist');
        
        const estimatedGas = web3Client.utils.toBN(await disableCall.estimateGas());
        const gasPrice = web3Client.utils.toBN(await web3Client.eth.getGasPrice());

        const privateKey = Buffer.from(whitelistAuthorizer.privateKey, 'hex');
        const nonce = web3Client.utils.toHex(await web3Client.eth.getTransactionCount(whitelistAuthorizer.address, 'pending'));

        const networkId = await web3Client.eth.net.getId();

        // const unsignedTx = {
        //     nonce: nonce,
        //     gasPrice: gasPrice,
        //     gasLimit: estimatedGas,
        //     to: bridge.address,
        //     value: '0x00',
        //     data: disableCall.encodeABI(),
        //     r: 0,
        //     s: 0,
        //     v: chainId,
        // };

        // const signedTx = await web3Client.eth.accounts.signTransaction(unsignedTx, whitelistAuthorizer.privateKey);

        const rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: estimatedGas,
            to: bridge.address,
            value: '0x00',
            data: disableCall.encodeABI(),
            r: 0,
            s: 0,
            v: networkId
        }
    
        const common = Common.forCustomChain(
            3, 
            {
            name: 'regtest',
            networkId: networkId,
            chainId: 33,
            },
            'chainstart',
        );
        const tx = new Tx(rawTx, { common });
        tx.sign(privateKey);
    
        const serializedTx = web3Client.utils.toHex(tx.serialize().toString('hex'));
    
        await web3Client.eth.sendSignedTransaction(serializedTx);
        
        console.log('Finished succesfully');
    } catch (e) {
        console.error(e);
    }
};

disablr(process.argv[2]);
