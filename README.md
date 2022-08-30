# @herewallet/connect

```bash
npm i @here-wallet/connect --save
```

> Make sure your near-api-js is version ^1.0.0

## Usage

```ts
import * as near from "near-api-js"
import runHereWallet from "@here-wallet/connect" 
import "@here-wallet/connect/index.css" 

// Initialize here wallet bridge
runHereWallet({ near, onlyHere: true })

// Just keep using the near api just like you did before!
const initialize = async () => {
    const near = await connect({ ... })
    const wallet = new WalletConnection(near, "app");

    wallet.requestSignIn({
      contractId: "contract",
      methodNames: ["method"],
    });
}
```

## Options

* `near`<br/>
  By default Here use global near package

* `onlyHere`<br/>
  By default here show popup with choose between near wallet and here wallet, but with this flag all methods will be redirects to herewallet

## Dispose

You can enable and disable herewallet patching at any time, for example:

```ts
let dispose;
const enableHereWallet = () => {
  dispose = runHereWallet({ near, onlyHere: true })
}

const disableHereWallet = () => {
  if (dispose == null) return
  dispose()
}
```

## Patching
Herewallet bridge absolutely safe, code of this lib just wrap few prototypes methods of WalletConnection and Account:

```ts
// add balance of liquidity stake from here account
acount.getBalance()

// Resolve redirects to herewallet 
wallet.requestSignIn()
wallet.requestSignTransactions()
```

## Networks

At the moment here wallet only supports mainnet and testnet networks. If you specify some other network in the near-api initialization, `@here-wallet/connect` will be ignored and all signatures will go through your near-api settings. Our endpoints:

```ts
  mainnet: {
    hereWallet: "https://web.herewallet.app",
    hereContract: "storage.herewallet.near",
  },
  testnet: {
    hereWallet: "https://web.testnet.herewallet.app",
    hereContract: "storage.herewallet.testnet",
  }
```
