import { VideoInput } from "./VideoInput";
import { MediaConfig } from "media/MediaConfig";
export declare class Media {
    private static sSharedInstance;
    /**
     * Singleton used for now as the browser version is missing a proper factory yet.
     * Might be removed later.
     */
    static get SharedInstance(): Media;
    static ResetSharedInstance(): void;
    private videoInput;
    get VideoInput(): VideoInput;
    constructor();
    GetVideoDevices(): string[];
    static IsNameSet(videoDeviceName: string): boolean;
    getUserMedia(config: MediaConfig): Promise<MediaStream>;
}
