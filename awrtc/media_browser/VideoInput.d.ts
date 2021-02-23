/**TS version of the C++ / C# side Native VideoInput API
 *
 *
 * In addition it also supports adding a HTMLCanvasElement as a video device. This can be
 * a lot faster in the browser than the C / C++ style UpdateFrame methods that use raw byte arrays
 * or pointers to deliver an image.
 *
 * Note there are currently three distinct ways how this is used:
 * 1.   Using AddCanvasDevice without scaling (wdith = 0, height =0 or the same as the canvas)
 *      In this mode the MediaStream will be returned from the canvas. Drawing calls from the canvas
 *      turn into video frames of the video without any manual UpdateFrame calls
 *
 * 2.   Using AddCanvasDevice with scaling by setting a width / height different from the canvas.
 *      In this mode the user draws to the canvas and every time UpdateFrame is called a scaled frame
 *      is created that will turn into video frames. Lower UpdateFrame calls will reduce the framerate
 *      even if the original canvas us used a higher framerate.
 *      This mode should result in lower data usage.
 *
 * 3.   Using AddDevice and UpdateFrame to deliver raw byte array frames. This is a compatibility mode
 *      that works similar to the C / C++ and C# API. An internal canvas is created and updated based on
 *      the data the user delivers. This mode makes sense if you generate custom data that doesn't have
 *      a canvas as its source.
 *      This mode can be quite slow and inefficient.
 *
 * TODO:
 *  -   Using AddDevice with one resolution & UpdateFrame with another might not support scaling yet but
 *      activating the 2nd canvas for scaling might
 *      reduce the performance even more. Check if there is a better solution and if scaling is even needed.
 *      It could easily be added by calling initScaling but it must be known if scaling is required before
 *      the device is selected by the user. Given that scaling can reduce the performance doing so by default
 *      might cause problems for some users.
 *
 *  -   UpdateFrame rotation and firstRowIsBottom aren't supported yet. Looks like they aren't needed for
 *      WebGL anyway. Looks like frames here always start with the top line and rotation is automatically
 *      handled by the browser.
 *
 */
export declare class VideoInput {
    private canvasDevices;
    constructor();
    /**Adds a canvas to use as video source for streaming.
     *
     * Make sure canvas.getContext is at least called once before calling this method.
     *
     * @param canvas
     * @param deviceName
     * @param width
     * @param height
     * @param fps
     */
    AddCanvasDevice(canvas: HTMLCanvasElement, deviceName: string, width: number, height: number, fps: number): void;
    /**For internal use.
     * Allows to check if the device already exists.
     *
     * @param dev
     */
    HasDevice(dev: string): boolean;
    /**For internal use.
     * Lists all registered devices.
     *
     */
    GetDeviceNames(): Array<string>;
    /**For internal use.
     * Returns a MediaStream for the given device.
     *
     * @param dev
     */
    GetStream(dev: string): MediaStream | null;
    /**C# API: public void AddDevice(string name, int width, int height, int fps);
     *
     * Adds a device that will be accessible via the given name. Width / Height determines
     * the size of the canvas that is used to stream the video.
     *
     *
     * @param name unique name for the canvas
     * @param width width of the canvase used for the stream
     * @param height height of the canvase used for the stream
     * @param fps Expected FPS used by the stream. 0 or undefined to let the browser decide (likely based on actual draw calls)
     */
    AddDevice(name: string, width: number, height: number, fps?: number): void;
    private RemCanvasDevice;
    RemoveDevice(name: string): void;
    UpdateFrame(name: string): boolean;
    UpdateFrame(name: string, dataPtr: Uint8ClampedArray, width: number, height: number, type: VideoInputType): boolean;
    UpdateFrame(name: string, dataPtr: Uint8ClampedArray, width: number, height: number, type: VideoInputType, rotation: number, firstRowIsBottom: boolean): boolean;
}
/** Only one format supported by browsers so far.
 *  Maybe more can be added in the future.
 */
export declare enum VideoInputType {
    ARGB = 0
}
