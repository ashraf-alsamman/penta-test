import { MediaConfig } from "media/MediaConfig";
export declare class DeviceInfo {
    deviceId: string;
    defaultLabel: string;
    label: string;
    isLabelGuessed: boolean;
}
export interface DeviceApiOnChanged {
    (): void;
}
export declare class DeviceApi {
    private static sLastUpdate;
    static get LastUpdate(): number;
    static get HasInfo(): boolean;
    private static sIsPending;
    static get IsPending(): boolean;
    private static sLastError;
    private static get LastError();
    private static sDeviceInfo;
    private static sVideoDeviceCounter;
    private static sAccessStream;
    private static sUpdateEvents;
    static AddOnChangedHandler(evt: DeviceApiOnChanged): void;
    static RemOnChangedHandler(evt: DeviceApiOnChanged): void;
    private static TriggerChangedEvent;
    private static InternalOnEnum;
    static get Devices(): {
        [id: string]: DeviceInfo;
    };
    static GetVideoDevices(): string[];
    static Reset(): void;
    private static InternalOnErrorCatch;
    private static InternalOnErrorString;
    private static InternalOnStream;
    static ENUM_FAILED: string;
    /**Updates the device list based on the current
     * access. Gives the devices numbers if the name isn't known.
     */
    static Update(): void;
    static UpdateAsync(): Promise<void>;
    /**Checks if the API is available in the browser.
     * false - browser doesn't support this API
     * true - browser supports the API (might still refuse to give
     * us access later on)
     */
    static IsApiAvailable(): boolean;
    /**Asks the user for access first to get the full
     * device names.
     */
    static RequestUpdate(): void;
    static GetDeviceId(label: string): string;
    static IsUserMediaAvailable(): boolean;
    static ToConstraints(config: MediaConfig): MediaStreamConstraints;
    static getBrowserUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
    static getAssetUserMedia(config: MediaConfig): Promise<MediaStream>;
}
