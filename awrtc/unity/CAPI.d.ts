/**This file contains the mapping between the awrtc_browser library and
 * Unitys WebGL support. Not needed for regular use.
 */
import { NetworkEvent, ConnectionId } from "../network/index";
export declare function CAPI_InitAsync(initmode: any): void;
export declare function CAPI_PollInitState(): number;
/**
 *
 * @param loglevel
 * None = 0,
 * Errors = 1,
 * Warnings = 2,
 * Verbose = 3
 */
export declare function CAPI_SLog_SetLogLevel(loglevel: number): void;
export declare function CAPI_WebRtcNetwork_IsAvailable(): boolean;
export declare function CAPI_WebRtcNetwork_IsBrowserSupported(): boolean;
export declare function CAPI_WebRtcNetwork_Create(lConfiguration: string): number;
export declare function CAPI_WebRtcNetwork_Release(lIndex: number): void;
export declare function CAPI_WebRtcNetwork_Connect(lIndex: number, lRoom: string): ConnectionId;
export declare function CAPI_WebRtcNetwork_StartServer(lIndex: number, lRoom: string): void;
export declare function CAPI_WebRtcNetwork_StopServer(lIndex: number): void;
export declare function CAPI_WebRtcNetwork_Disconnect(lIndex: number, lConnectionId: number): void;
export declare function CAPI_WebRtcNetwork_Shutdown(lIndex: number): void;
export declare function CAPI_WebRtcNetwork_Update(lIndex: number): void;
export declare function CAPI_WebRtcNetwork_Flush(lIndex: number): void;
export declare function CAPI_WebRtcNetwork_SendData(lIndex: number, lConnectionId: number, lUint8ArrayData: Uint8Array, lReliable: boolean): void;
export declare function CAPI_WebRtcNetwork_SendDataEm(lIndex: number, lConnectionId: number, lUint8ArrayData: Uint8Array, lUint8ArrayDataOffset: number, lUint8ArrayDataLength: number, lReliable: boolean): boolean;
export declare function CAPI_WebRtcNetwork_GetBufferedAmount(lIndex: number, lConnectionId: number, lReliable: boolean): number;
export declare function CAPI_WebRtcNetwork_Dequeue(lIndex: number): NetworkEvent;
export declare function CAPI_WebRtcNetwork_Peek(lIndex: number): NetworkEvent;
/**Allows to peek into the next event to figure out its length and allocate
 * the memory needed to store it before calling
 *      CAPI_WebRtcNetwork_DequeueEm
 *
 * @param {type} lIndex
 * @returns {Number}
 */
export declare function CAPI_WebRtcNetwork_PeekEventDataLength(lIndex: any): any;
export declare function CAPI_WebRtcNetwork_CheckEventLength(lNetEvent: NetworkEvent): any;
export declare function CAPI_WebRtcNetwork_EventDataToUint8Array(data: any, dataUint8Array: Uint8Array, dataOffset: number, dataLength: number): number;
export declare function CAPI_WebRtcNetwork_DequeueEm(lIndex: number, lTypeIntArray: Int32Array, lTypeIntIndex: number, lConidIntArray: Int32Array, lConidIndex: number, lDataUint8Array: Uint8Array, lDataOffset: number, lDataLength: number, lDataLenIntArray: Int32Array, lDataLenIntIndex: number): boolean;
export declare function CAPI_WebRtcNetwork_PeekEm(lIndex: number, lTypeIntArray: Int32Array, lTypeIntIndex: number, lConidIntArray: Int32Array, lConidIndex: number, lDataUint8Array: Uint8Array, lDataOffset: number, lDataLength: number, lDataLenIntArray: Int32Array, lDataLenIntIndex: number): boolean;
export declare function CAPI_MediaNetwork_IsAvailable(): boolean;
export declare function CAPI_MediaNetwork_HasUserMedia(): boolean;
export declare function CAPI_MediaNetwork_Create(lJsonConfiguration: any): number;
export declare function CAPI_MediaNetwork_Configure(lIndex: number, audio: boolean, video: boolean, minWidth: number, minHeight: number, maxWidth: number, maxHeight: number, idealWidth: number, idealHeight: number, minFps: number, maxFps: number, idealFps: number, deviceName?: string): void;
export declare function CAPI_MediaNetwork_GetConfigurationState(lIndex: number): number;
export declare function CAPI_MediaNetwork_GetConfigurationError(lIndex: number): string;
export declare function CAPI_MediaNetwork_ResetConfiguration(lIndex: number): void;
export declare function CAPI_MediaNetwork_TryGetFrame(lIndex: number, lConnectionId: number, lWidthInt32Array: Int32Array, lWidthIntArrayIndex: number, lHeightInt32Array: Int32Array, lHeightIntArrayIndex: number, lBufferUint8Array: Uint8Array, lBufferUint8ArrayOffset: number, lBufferUint8ArrayLength: number): boolean;
export declare function CAPI_MediaNetwork_TryGetFrame_ToTexture(lIndex: number, lConnectionId: number, lWidth: number, lHeight: number, gl: WebGL2RenderingContext, texture: WebGLTexture): boolean;
export declare function CAPI_MediaNetwork_TryGetFrame_Resolution(lIndex: number, lConnectionId: number, lWidthInt32Array: Int32Array, lWidthIntArrayIndex: number, lHeightInt32Array: Int32Array, lHeightIntArrayIndex: number): boolean;
export declare function CAPI_MediaNetwork_TryGetFrameDataLength(lIndex: number, connectionId: number): number;
export declare function CAPI_MediaNetwork_SetVolume(lIndex: number, volume: number, connectionId: number): void;
export declare function CAPI_MediaNetwork_HasAudioTrack(lIndex: number, connectionId: number): boolean;
export declare function CAPI_MediaNetwork_HasVideoTrack(lIndex: number, connectionId: number): boolean;
export declare function CAPI_MediaNetwork_SetMute(lIndex: number, value: boolean): void;
export declare function CAPI_MediaNetwork_IsMute(lIndex: number): boolean;
export declare function CAPI_DeviceApi_Update(): void;
export declare function CAPI_DeviceApi_RequestUpdate(): void;
export declare function CAPI_DeviceApi_LastUpdate(): number;
export declare function CAPI_Media_GetVideoDevices_Length(): number;
export declare function CAPI_Media_GetVideoDevices(index: number): string;
export declare function CAPI_VideoInput_AddCanvasDevice(query: string, name: string, width: number, height: number, fps: number): boolean;
export declare function CAPI_VideoInput_AddDevice(name: string, width: number, height: number, fps: number): void;
export declare function CAPI_VideoInput_RemoveDevice(name: string): void;
export declare function CAPI_VideoInput_UpdateFrame(name: string, lBufferUint8Array: Uint8Array, lBufferUint8ArrayOffset: number, lBufferUint8ArrayLength: number, width: number, height: number, rotation: number, firstRowIsBottom: boolean): boolean;
export declare function GetUnityCanvas(): HTMLCanvasElement;
export declare function GetUnityContext(): WebGL2RenderingContext;
