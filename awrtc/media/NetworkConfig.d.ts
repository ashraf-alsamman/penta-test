export declare class NetworkConfig {
    private mIceServers;
    get IceServers(): RTCIceServer[];
    set IceServers(value: RTCIceServer[]);
    private mSignalingUrl;
    get SignalingUrl(): string;
    set SignalingUrl(value: string);
    private mIsConference;
    get IsConference(): boolean;
    set IsConference(value: boolean);
}
