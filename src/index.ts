import BN from "bn.js";
import * as NEAR from "near-api-js";
import { selector } from "./selector";

export const defaultConfig = {
  near: NEAR,
  onlyHere: true,
  mainnet: {
    hereWallet: "https://web.herewallet.app",
    hereContract: "storage.herewallet.near",
  },
  testnet: {
    hereWallet: "https://web.testnet.herewallet.app",
    hereContract: "storage.testnet.near",
  },
};

const runHereWallet = (_config: Partial<typeof defaultConfig> = {}) => {
  const config: typeof defaultConfig = {
    ...defaultConfig,
    ..._config,
    testnet: { ...defaultConfig.testnet, ..._config.testnet },
    mainnet: { ...defaultConfig.mainnet, ..._config.mainnet },
  };

  const { near, onlyHere } = config;
  const pathing = {
    fnGetAccountBalance: near.Account.prototype.getAccountBalance,
    fnRequestSignIn: near.WalletConnection.prototype.requestSignIn,
    fnRequestSignTransactions: near.WalletConnection.prototype.requestSignTransactions,
  };

  near.Account.prototype.getAccountBalance = async function () {
    const result = await pathing.fnGetAccountBalance.call(this);

    const options = config[this.connection.networkId];
    if (options != null) {
      const params = { account_id: this.accountId };
      const hereCoins = await this.viewFunction(options.hereContract, "ft_balance_of", params).catch(() => "0");
      let total = new BN(hereCoins).add(new BN(result.available));
      result.available = total.toString();
    }

    return result;
  };

  near.WalletConnection.prototype.requestSignIn = async function (...args) {
    const realBaseUrl = this._walletBaseUrl;
    const options = config[this._networkId];

    if (options != null) {
      const select = onlyHere ? "here" : await selector().catch(() => null);
      if (select == null) return;
      if (select === "here") {
        this._walletBaseUrl = options.hereWallet;
      }
    }

    try {
      await pathing.fnRequestSignIn.call(this, ...args);
    } catch (e) {
      throw e;
    } finally {
      this._walletBaseUrl = realBaseUrl;
    }
  };

  near.WalletConnection.prototype.requestSignTransactions = async function (...args) {
    const realBaseUrl = this._walletBaseUrl;
    const options = config[this._networkId];

    if (options != null) {
      const select = onlyHere ? "here" : await selector().catch(() => null);
      if (select == null) return;
      if (select === "here") {
        this._walletBaseUrl = options.hereWallet;
      }
    }

    try {
      // @ts-ignore multi function signatures
      await pathing.fnRequestSignTransactions.call(this, ...args);
    } catch (e) {
      throw e;
    } finally {
      this._walletBaseUrl = realBaseUrl;
    }
  };

  return () => {
    near.Account.prototype.getAccountBalance = async function () {
      return await pathing.fnGetAccountBalance.call(this);
    };

    near.WalletConnection.prototype.requestSignIn = async function (...args) {
      return await pathing.fnRequestSignIn.call(this, ...args);
    };

    near.WalletConnection.prototype.requestSignTransactions = async function (...args) {
      // @ts-ignore multi function signatures
      return await pathing.fnRequestSignTransactions.call(this, ...args);
    };
  };
};

export default runHereWallet;
