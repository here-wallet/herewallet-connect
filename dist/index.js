"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.defaultConfig = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const NEAR = __importStar(require("near-api-js"));
const selector_1 = require("./selector");
exports.defaultConfig = {
    near: NEAR,
    onlyHere: true,
    mainnet: {
        hereWallet: "https://web.herewallet.app",
        hereContract: "storage.herewallet.near",
    },
    testnet: {
        hereWallet: "https://web.testnet.herewallet.app",
        hereContract: "storage.herewallet.testnet",
    },
};
const runHereWallet = (_config = {}) => {
    const config = Object.assign(Object.assign(Object.assign({}, exports.defaultConfig), _config), { testnet: Object.assign(Object.assign({}, exports.defaultConfig.testnet), _config.testnet), mainnet: Object.assign(Object.assign({}, exports.defaultConfig.mainnet), _config.mainnet) });
    const { near, onlyHere } = config;
    const pathing = {
        fnGetAccountBalance: near.Account.prototype.getAccountBalance,
        fnRequestSignIn: near.WalletConnection.prototype.requestSignIn,
        fnRequestSignTransactions: near.WalletConnection.prototype.requestSignTransactions,
    };
    near.Account.prototype.getAccountBalance = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pathing.fnGetAccountBalance.call(this);
            const options = config[this.connection.networkId];
            if (options != null) {
                const params = { account_id: this.accountId };
                const hereCoins = yield this.viewFunction(options.hereContract, "ft_balance_of", params).catch(() => "0");
                let total = new bn_js_1.default(hereCoins).add(new bn_js_1.default(result.available));
                result.available = total.toString();
            }
            return result;
        });
    };
    near.WalletConnection.prototype.requestSignIn = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const realBaseUrl = this._walletBaseUrl;
            const options = config[this._networkId];
            if (options != null) {
                const select = onlyHere ? "here" : yield (0, selector_1.selector)().catch(() => null);
                if (select == null)
                    return;
                if (select === "here") {
                    this._walletBaseUrl = options.hereWallet;
                }
            }
            try {
                yield pathing.fnRequestSignIn.call(this, ...args);
            }
            catch (e) {
                throw e;
            }
            finally {
                this._walletBaseUrl = realBaseUrl;
            }
        });
    };
    near.WalletConnection.prototype.requestSignTransactions = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const realBaseUrl = this._walletBaseUrl;
            const options = config[this._networkId];
            if (options != null) {
                const select = onlyHere ? "here" : yield (0, selector_1.selector)().catch(() => null);
                if (select == null)
                    return;
                if (select === "here") {
                    this._walletBaseUrl = options.hereWallet;
                }
            }
            try {
                // @ts-ignore multi function signatures
                yield pathing.fnRequestSignTransactions.call(this, ...args);
            }
            catch (e) {
                throw e;
            }
            finally {
                this._walletBaseUrl = realBaseUrl;
            }
        });
    };
    return () => {
        near.Account.prototype.getAccountBalance = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield pathing.fnGetAccountBalance.call(this);
            });
        };
        near.WalletConnection.prototype.requestSignIn = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield pathing.fnRequestSignIn.call(this, ...args);
            });
        };
        near.WalletConnection.prototype.requestSignTransactions = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore multi function signatures
                return yield pathing.fnRequestSignTransactions.call(this, ...args);
            });
        };
    };
};
exports.default = runHereWallet;
