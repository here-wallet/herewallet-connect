"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disposePathing = exports.initializePathing = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const near_api_js_1 = require("near-api-js");
const selector_1 = require("./selector");
const options = {
    hereWallet: "https://web.herewallet.app",
    fnGetAccountBalance: near_api_js_1.Account.prototype.getAccountBalance,
    fnRequestSignIn: near_api_js_1.WalletAccount.prototype.requestSignIn,
    fnRequestSignTransactions: near_api_js_1.WalletAccount.prototype.requestSignTransactions,
};
const initializePathing = () => {
    near_api_js_1.Account.prototype.getAccountBalance = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { account_id: this.accountId };
            const result = yield options.fnGetAccountBalance.call(this);
            const hereCoins = yield this.viewFunction("storage.herewallet.near", "ft_balance_of", params).catch(() => "0");
            let total = new bn_js_1.default(hereCoins).add(new bn_js_1.default(result.available));
            result.available = total.toString();
            return result;
        });
    };
    near_api_js_1.WalletAccount.prototype.requestSignIn = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const realBaseUrl = this._walletBaseUrl;
            if (this._networkId === "mainnet") {
                const select = yield (0, selector_1.selector)().catch(() => null);
                if (select == null)
                    return;
                if (select === "here") {
                    this._walletBaseUrl = options.hereWallet;
                }
            }
            try {
                yield options.fnRequestSignIn.call(this, ...args);
            }
            catch (e) {
                throw e;
            }
            finally {
                this._walletBaseUrl = realBaseUrl;
            }
        });
    };
    near_api_js_1.WalletAccount.prototype.requestSignTransactions = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const realBaseUrl = this._walletBaseUrl;
            if (this._networkId === "mainnet") {
                const select = yield (0, selector_1.selector)().catch(() => null);
                if (select == null)
                    return;
                if (select === "here") {
                    this._walletBaseUrl = options.hereWallet;
                }
            }
            try {
                // @ts-ignore multi function signatures
                yield options.fnRequestSignTransactions.call(this, ...args);
            }
            catch (e) {
                throw e;
            }
            finally {
                this._walletBaseUrl = realBaseUrl;
            }
        });
    };
};
exports.initializePathing = initializePathing;
const disposePathing = () => {
    near_api_js_1.Account.prototype.getAccountBalance = function () {
        return __awaiter(this, void 0, void 0, function* () {
            return yield options.fnGetAccountBalance.call(this);
        });
    };
    near_api_js_1.WalletAccount.prototype.requestSignIn = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield options.fnRequestSignIn.call(this, ...args);
        });
    };
    near_api_js_1.WalletAccount.prototype.requestSignTransactions = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore multi function signatures
            return yield options.fnRequestSignTransactions.call(this, ...args);
        });
    };
};
exports.disposePathing = disposePathing;
(0, exports.initializePathing)();
