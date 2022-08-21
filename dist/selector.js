"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selector = exports.Task = void 0;
const template = ({ prefix = "herewallet" }) => `
    <div class="${prefix}__overlay">
        <div class="${prefix}__modal">
            <p class="${prefix}__title">Pick wallet</p>
            <div class="${prefix}__picker">
                <button class="${prefix}__button ${prefix}__near">
                    <img src="https://web.herewallet.app/assets/near.svg" alt="here" />
                    NEAR Wallet (web)
                </button>
                <button class="${prefix}__button ${prefix}__here">
                    <img src="https://web.herewallet.app/assets/here.svg" alt="here" />
                    HERE Wallet (mobile)
                </button>
            </div>
            <a class="${prefix}__link" target=”_blank” rel=”noopener noreferrer” href="https://herewallet.app/howto">Learn more about wallets</a>
        </div>
    </div>
`;
class Task {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Task = Task;
const selector = () => {
    const task = new Task();
    const prefix = "herewallet";
    const container = document.createElement('div');
    container.innerHTML = template({ prefix });
    const $modal = container.getElementsByClassName(`${prefix}__modal`)[0];
    const $overlay = container.getElementsByClassName(`${prefix}__overlay`)[0];
    const $hereButton = container.getElementsByClassName(`${prefix}__here`)[0];
    const $nearButton = container.getElementsByClassName(`${prefix}__near`)[0];
    $overlay === null || $overlay === void 0 ? void 0 : $overlay.addEventListener('click', () => dispose());
    $modal === null || $modal === void 0 ? void 0 : $modal.addEventListener('click', (e) => e.stopPropagation());
    $hereButton === null || $hereButton === void 0 ? void 0 : $hereButton.addEventListener('click', () => task.resolve('here'));
    $nearButton === null || $nearButton === void 0 ? void 0 : $nearButton.addEventListener('click', () => task.resolve('near'));
    document.body.appendChild(container);
    const dispose = () => {
        document.body.removeChild(container);
        task.reject();
    };
    return task.promise;
};
exports.selector = selector;
