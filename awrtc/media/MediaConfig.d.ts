export declare class MediaConfig {
    private mAudio;
    get Audio(): boolean;
    set Audio(value: boolean);
    private mVideo;
    get Video(): boolean;
    set Video(value: boolean);
    private mVideoDeviceName;
    get VideoDeviceName(): string;
    set VideoDeviceName(value: string);
    private mMinWidth;
    get MinWidth(): number;
    set MinWidth(value: number);
    private mMinHeight;
    get MinHeight(): number;
    set MinHeight(value: number);
    private mMaxWidth;
    get MaxWidth(): number;
    set MaxWidth(value: number);
    private mMaxHeight;
    get MaxHeight(): number;
    set MaxHeight(value: number);
    private mIdealWidth;
    get IdealWidth(): number;
    set IdealWidth(value: number);
    private mIdealHeight;
    get IdealHeight(): number;
    set IdealHeight(value: number);
    private mMinFps;
    get MinFps(): number;
    set MinFps(value: number);
    private mMaxFps;
    get MaxFps(): number;
    set MaxFps(value: number);
    private mIdealFps;
    get IdealFps(): number;
    set IdealFps(value: number);
    private mFrameUpdates;
    /** false - frame updates aren't generated. Useful for browser mode
     *  true  - library will deliver frames as ByteArray
    */
    get FrameUpdates(): boolean;
    set FrameUpdates(value: boolean);
}
