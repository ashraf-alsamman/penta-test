import { BrowserMediaStream } from "../media_browser/index";
export declare enum FramePixelFormat {
    Invalid = 0,
    Format32bppargb = 1
}
export declare class IFrameData {
    get Format(): FramePixelFormat;
    get Buffer(): Uint8Array;
    get Width(): number;
    get Height(): number;
    constructor();
    ToTexture(gl: WebGL2RenderingContext, texture: WebGLTexture): boolean;
}
export declare class RawFrame extends IFrameData {
    private mBuffer;
    get Buffer(): Uint8Array;
    private mWidth;
    get Width(): number;
    private mHeight;
    get Height(): number;
    constructor(buffer: Uint8Array, width: number, height: number);
}
/**
 * This class is suppose to increase the speed of the java script implementation.
 * Instead of creating RawFrames every Update call (because the real fps are unknown currently) it will
 * only create a lazy frame which will delay the creation of the RawFrame until the user actually tries
 * to access any data.
 * Thus if the game slows down or the user doesn't access any data the expensive copy is avoided.
 *
 * This comes with the downside of risking a change in Width / Height at the moment. In theory the video could
 * change the resolution causing the values of Width / Height to change over time before Buffer is accessed to create
 * a copy that will be save to use. This should be ok as long as the frame is used at the time it is received.
 */
export declare class LazyFrame extends IFrameData {
    private mFrameGenerator;
    get FrameGenerator(): BrowserMediaStream;
    private mRawFrame;
    get Buffer(): Uint8Array;
    /**Returns the expected width of the frame.
     * Watch out this might change inbetween frames!
     *
     */
    get Width(): number;
    /**Returns the expected height of the frame.
     * Watch out this might change inbetween frames!
     *
     */
    get Height(): number;
    constructor(frameGenerator: BrowserMediaStream);
    /**Intendet for use via the Unity plugin.
     * Will copy the image directly into a texture to avoid overhead of a CPU side copy.
     *
     * The given texture should have the correct size before calling this method.
     *
     * @param gl
     * @param texture
     */
    ToTexture(gl: WebGL2RenderingContext, texture: WebGLTexture): boolean;
    private GenerateFrame;
}
