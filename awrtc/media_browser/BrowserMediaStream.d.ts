import { IFrameData, RawFrame } from "../media/RawFrame";
/**Internal use only.
 * Bundles all functionality related to MediaStream, Tracks and video processing.
 * It creates two HTML elements: Video and Canvas to interact with the video stream
 * and convert the visible frame data to Uint8Array for compatibility with the
 * unity plugin and all other platforms.
 *
 */
export declare class BrowserMediaStream {
    static DEBUG_SHOW_ELEMENTS: boolean;
    static MUTE_IF_AUTOPLAT_BLOCKED: boolean;
    static sNextInstanceId: number;
    static VERBOSE: boolean;
    private mStream;
    get Stream(): MediaStream;
    private mBufferedFrame;
    private mInstanceId;
    private mVideoElement;
    get VideoElement(): HTMLVideoElement;
    private mCanvasElement;
    private mIsActive;
    static DEFAULT_FRAMERATE: number;
    private mMsPerFrame;
    private mFrameEventMethod;
    private mDefaultVolume;
    private mLastFrameTime;
    private mNextFrameTime;
    /** Number of the last frame (not yet supported in all browsers)
     * if it remains at <= 0 then we just generate frames based on
     * the timer above
     */
    private mLastFrameNumber;
    private mHasVideo;
    InternalStreamAdded: (stream: BrowserMediaStream) => void;
    private static sBlockedStreams;
    static onautoplayblocked: () => void;
    static ResolveAutoplay(): void;
    ResolveAutoplay(): void;
    constructor(stream: MediaStream);
    private CheckFrameRate;
    private TriggerAutoplayBlockled;
    private TryPlay;
    private SetupElements;
    /** Returns the current frame number.
     *  Treat a return value of 0 or smaller as unknown.
     * (Browsers might have the property but
     * always return 0)
     */
    private GetFrameNumber;
    TryGetFrame(): IFrameData;
    SetMute(mute: boolean): void;
    PeekFrame(): IFrameData;
    /** Ensures we have the latest frame ready
     * for the next PeekFrame / TryGetFrame calls
     */
    private EnsureLatestFrame;
    /** checks if the html tag has a newer frame available
     * (or if 1/30th of a second passed since last frame if
     * this info isn't available)
     */
    private HasNewerFrame;
    Update(): void;
    DestroyCanvas(): void;
    Dispose(): void;
    CreateFrame(): RawFrame;
    private GenerateFrame;
    private SetupVideoElement;
    private SetupCanvas;
    SetVolume(volume: number): void;
    HasAudioTrack(): boolean;
    HasVideoTrack(): boolean;
}
