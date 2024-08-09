

export interface ClientConfig {

    /**
     * The base URL to be used by the Reveal SDK client.
     * 
     * This URL will be used as the base path for all API requests made by the client. 
     * If no value is provided, the SDK will default to `window.location.origin`.
     * Trailing slashes will be automatically removed.
     */
    baseUrl?: string;
}

const DEFAULT_BASE_URL = window.location.origin;

export class RevealSdkClient {
    static instance: RevealSdkClient = new RevealSdkClient({});

    private _baseUrl?: string;

    /**
     * Gets the base URL for the Reveal SDK client.
     * 
     * This property first checks for any legacy settings (e.g., `$.ig.RevealSdkSetting`)
     * from the global `window` object. If found, it returns the legacy value with any trailing 
     * slashes removed. If no legacy settings are found, it returns the `baseUrl` value 
     * or falls back to the default URL of `window.location.origin` if `baseUrl` is not set or is an empty string.
     * 
     * @returns {string} The base URL to be used by the Reveal SDK client.
     */
    public get baseUrl(): string {        
        const legacyUrl = (window as any).$?.ig?.IGAppBaseURL ?? (window as any).$?.ig?.IGAppBase;
        if (legacyUrl) {            
            return legacyUrl.replace(/\/+$/, '');
        }
        return this._baseUrl && this._baseUrl.trim() !== '' ? this._baseUrl : DEFAULT_BASE_URL;
    }

    /**
     * Sets the base URL for the Reveal SDK client.
     * 
     * This setter will remove any trailing slashes from the provided URL before storing it. 
     * If an empty string is provided, it will be treated as an invalid value and 
     * will not override the default URL which is the `window.location.origin`.
     * 
     * @param {string} value - The base URL to be set.
     */
    public set baseUrl(value: string) {
        this._baseUrl = value.replace(/\/+$/, '');
    }

    private constructor(config: ClientConfig) {
        if (config.baseUrl) this.baseUrl = config.baseUrl;
    }

    /**
     * Initializes the Reveal SDK client with the provided configuration.
     * 
     * @param {ClientConfig} config - The configuration object used to initialize the client. 
     *
     */
    static initialize(config: ClientConfig): void {
        this.instance = new RevealSdkClient(config);
    }

    /**
     * Get the current time zone of the user
     * @returns the current time zone of the user
     */
    getTimeZone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}