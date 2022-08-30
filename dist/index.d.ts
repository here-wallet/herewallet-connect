import * as NEAR from "near-api-js";
export declare const defaultConfig: {
    near: typeof NEAR;
    onlyHere: boolean;
    mainnet: {
        hereWallet: string;
        hereContract: string;
    };
    testnet: {
        hereWallet: string;
        hereContract: string;
    };
};
declare const runHereWallet: (_config?: Partial<typeof defaultConfig>) => () => void;
export default runHereWallet;
