import { ConnectionId } from "../network/index";
import { IFrameData } from "./RawFrame";
export interface CallEventHandler {
    (sender: any, args: CallEventArgs): void;
}
export declare enum CallEventType {
    Invalid = 0,
    WaitForIncomingCall = 1,
    CallAccepted = 2,
    CallEnded = 3,
    /**
     * Backwards compatibility. Use MediaUpdate
     */
    FrameUpdate = 4,
    Message = 5,
    ConnectionFailed = 6,
    ListeningFailed = 7,
    ConfigurationComplete = 8,
    ConfigurationFailed = 9,
    DataMessage = 10,
    /**
     *
     */
    MediaUpdate = 20
}
export declare class CallEventArgs {
    private mType;
    get Type(): CallEventType;
    constructor(type: CallEventType);
}
export declare class CallAcceptedEventArgs extends CallEventArgs {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    constructor(connectionId: ConnectionId);
}
export declare class CallEndedEventArgs extends CallEventArgs {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    constructor(connectionId: ConnectionId);
}
export declare enum CallErrorType {
    Unknown = 0
}
export declare class ErrorEventArgs extends CallEventArgs {
    private mErrorMessage;
    get ErrorMessage(): string;
    private mErrorType;
    get ErrorType(): CallErrorType;
    constructor(eventType: CallEventType, type?: CallErrorType, errorMessage?: string);
}
export declare class WaitForIncomingCallEventArgs extends CallEventArgs {
    private mAddress;
    get Address(): string;
    constructor(address: string);
}
export declare class MessageEventArgs extends CallEventArgs {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    private mContent;
    get Content(): string;
    private mReliable;
    get Reliable(): boolean;
    constructor(id: ConnectionId, message: string, reliable: boolean);
}
export declare class DataMessageEventArgs extends CallEventArgs {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    private mContent;
    get Content(): Uint8Array;
    private mReliable;
    get Reliable(): boolean;
    constructor(id: ConnectionId, message: Uint8Array, reliable: boolean);
}
/**
 * Replaces the FrameUpdateEventArgs. Instead of
 * giving access to video frames only this gives access to
 * video html tag once it is created.
 * TODO: Add audio + video tracks + flag that indicates added, updated or removed
 * after renegotiation is added.
 */
export declare class MediaUpdatedEventArgs extends CallEventArgs {
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    get IsRemote(): boolean;
    private mVideoElement;
    get VideoElement(): HTMLVideoElement;
    constructor(conId: ConnectionId, videoElement: HTMLVideoElement);
}
export declare class FrameUpdateEventArgs extends CallEventArgs {
    private mFrame;
    get Frame(): IFrameData;
    private mConnectionId;
    get ConnectionId(): ConnectionId;
    get IsRemote(): boolean;
    constructor(conId: ConnectionId, frame: IFrameData);
}
