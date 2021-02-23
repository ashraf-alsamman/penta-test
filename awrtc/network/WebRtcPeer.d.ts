import { IBasicNetwork, ConnectionId, NetworkEvent } from "./index";
import { Output } from "./Helper";
export declare class SignalingConfig {
    private mNetwork;
    constructor(network: IBasicNetwork);
    GetNetwork(): IBasicNetwork;
}
export declare class SignalingInfo {
    private mSignalingConnected;
    IsSignalingConnected(): boolean;
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    private mIsIncoming;
    IsIncoming(): boolean;
    private mCreationTime;
    GetCreationTimeMs(): number;
    constructor(id: ConnectionId, isIncoming: boolean, timeStamp: number);
    SignalingDisconnected(): void;
}
export declare enum WebRtcPeerState {
    Invalid = 0,
    Created = 1,
    Signaling = 2,
    SignalingFailed = 3,
    Connected = 4,
    Closing = 5,
    Closed = 6
}
export declare enum WebRtcInternalState {
    None = 0,
    Signaling = 1,
    SignalingFailed = 2,
    Connected = 3,
    Closed = 4
}
export declare abstract class AWebRtcPeer {
    private mState;
    GetState(): WebRtcPeerState;
    private mRtcInternalState;
    protected mPeer: RTCPeerConnection;
    private mIncomingSignalingQueue;
    private mOutgoingSignalingQueue;
    private mDidSendRandomNumber;
    private mRandomNumerSent;
    protected mOfferOptions: RTCOfferOptions;
    private mReadyForIce;
    private mBufferedIceCandidates;
    constructor(rtcConfig: RTCConfiguration);
    protected abstract OnSetup(): void;
    protected abstract OnStartSignaling(): void;
    protected abstract OnCleanup(): void;
    private SetupPeer;
    protected DisposeInternal(): void;
    Dispose(): void;
    private Cleanup;
    Update(): void;
    private UpdateState;
    private BufferIceCandidate;
    /**Called after setRemoteDescription succeeded.
     * After this call we accept ice candidates and add all buffered ice candidates we received
     * until then.
     *
     * This is a workaround for problems between Safari & Firefox. Safari sometimes sends ice candidates before
     * it sends an answer causing an error in firefox.
     */
    private StartIce;
    private AddIceCandidate;
    HandleIncomingSignaling(): void;
    AddSignalingMessage(msg: string): void;
    DequeueSignalingMessage(/*out*/ msg: Output<string>): boolean;
    private EnqueueOutgoing;
    StartSignaling(): void;
    NegotiateSignaling(): void;
    private CreateOffer;
    private CreateAnswer;
    private RecAnswer;
    private RtcSetSignalingStarted;
    protected RtcSetSignalingFailed(): void;
    protected RtcSetConnected(): void;
    protected RtcSetClosed(): void;
    private OnIceCandidate;
    private OnIceConnectionStateChange;
    private OnConnectionStateChange;
    private OnIceGatheringStateChange;
    private OnRenegotiationNeeded;
    private OnSignalingChange;
}
export declare class WebRtcDataPeer extends AWebRtcPeer {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    private mInfo;
    get SignalingInfo(): SignalingInfo;
    SetSignalingInfo(info: SignalingInfo): void;
    private mEvents;
    private static sLabelReliable;
    private static sLabelUnreliable;
    private mReliableDataChannelReady;
    private mUnreliableDataChannelReady;
    private mReliableDataChannel;
    private mUnreliableDataChannel;
    constructor(id: ConnectionId, rtcConfig: RTCConfiguration);
    protected OnSetup(): void;
    protected OnStartSignaling(): void;
    protected OnCleanup(): void;
    private RegisterObserverReliable;
    private RegisterObserverUnreliable;
    SendData(data: Uint8Array, /* offset : number, length : number,*/ reliable: boolean): boolean;
    GetBufferedAmount(reliable: boolean): number;
    DequeueEvent(/*out*/ ev: Output<NetworkEvent>): boolean;
    private Enqueue;
    OnDataChannel(data_channel: RTCDataChannel): void;
    private RtcOnMessageReceived;
    private ReliableDataChannel_OnMessage;
    private ReliableDataChannel_OnOpen;
    private ReliableDataChannel_OnClose;
    private ReliableDataChannel_OnError;
    private UnreliableDataChannel_OnMessage;
    private UnreliableDataChannel_OnOpen;
    private UnreliableDataChannel_OnClose;
    private UnreliableDataChannel_OnError;
    private IsRtcConnected;
}
