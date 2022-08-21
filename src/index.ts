import BN from "bn.js";
import { Account, WalletAccount } from "near-api-js";
import { selector } from './selector'

const options = {
  hereWallet: "https://web.herewallet.app",
  fnGetAccountBalance: Account.prototype.getAccountBalance,
  fnRequestSignIn: WalletAccount.prototype.requestSignIn,
  fnRequestSignTransactions: WalletAccount.prototype.requestSignTransactions,
};

export const initializePathing = () => {
  Account.prototype.getAccountBalance = async function () {
    const params = { account_id: this.accountId };
    const result = await options.fnGetAccountBalance.call(this);
    const hereCoins = await this.viewFunction("storage.herewallet.near", "ft_balance_of", params).catch(() => "0");

    let total = new BN(hereCoins).add(new BN(result.available));
    result.available = total.toString();
    return result;
  };

  WalletAccount.prototype.requestSignIn = async function (...args) {
    const realBaseUrl = this._walletBaseUrl;

    if (this._networkId === "mainnet") {
      const select = await selector().catch(() => null);
      if (select == null) return;
      if (select === "here") {
        this._walletBaseUrl = options.hereWallet;
      }
    }

    try {
      await options.fnRequestSignIn.call(this, ...args);
    } catch (e) {
      throw e;
    } finally {
      this._walletBaseUrl = realBaseUrl;
    }
  };

  WalletAccount.prototype.requestSignTransactions = async function (...args) {
    const realBaseUrl = this._walletBaseUrl;

    if (this._networkId === "mainnet") {
      const select = await selector().catch(() => null);
      if (select == null) return;
      if (select === "here") {
        this._walletBaseUrl = options.hereWallet;
      }
    }

    try {
      // @ts-ignore multi function signatures
      await options.fnRequestSignTransactions.call(this, ...args);
    } catch (e) {
      throw e;
    } finally {
      this._walletBaseUrl = realBaseUrl;
    }
  };
};

export const disposePathing = () => {
  Account.prototype.getAccountBalance = async function () {
    return await options.fnGetAccountBalance.call(this);
  };

  WalletAccount.prototype.requestSignIn = async function (...args) {
    return await options.fnRequestSignIn.call(this, ...args);
  };

  WalletAccount.prototype.requestSignTransactions = async function (...args) {
    // @ts-ignore multi function signatures
    return await options.fnRequestSignTransactions.call(this, ...args);
  };
};

initializePathing();
