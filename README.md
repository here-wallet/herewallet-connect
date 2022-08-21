# @herewallet/connect

```bash
npm i @here-wallet/connect --save
```

## Usage

```ts
import * as near from "near-api-js"
import "@here-wallet/connect" // magic is here
import "@here-wallet/connect/index.css" // Also you need import small css

// Just keep using the near api just like you did before!
const initialize = async () => {
    const near = await connect({ ... })
    const wallet = new WalletConnection(near, "app");

    wallet.requestSignIn({
      contractId: "usn",
      methodNames: ["ft_transfer"],
    });
}
```
