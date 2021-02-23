/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/test/test_entry.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js":
/*!******************************************************************!*\
  !*** ./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(/*! sdp */ "./node_modules/sdp/sdp.js");

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

module.exports = function(window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this._localDescription = null;
    this._remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function() {
      return this._remoteDescription;
    }
  });

  // set up event handlers on prototype
  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
  };

  // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };


  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  };

  // start gathering from an RTCIceGatherer.
  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        // also the usernameFragment. TODO: update SDP to take both variants.
        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            SDPUtils.parseCandidate(serializedCandidate));

        event.candidate.candidate = serializedCandidate;
        event.candidate.toJSON = function() {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      }

      // update local description.
      var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc._localDescription.sdp =
          SDPUtils.getDescription(pc._localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateIceConnectionState();
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = SDPUtils.isRejected(mediaSection) &&
          SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
          protocol === 'UDP/DTLS/SCTP'))) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] &&
          pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') {
              // no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.
        var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

        var hasRtx = commonCapabilities.codecs.filter(function(c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;
        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  };

  // Update the ice connection state.
  RTCPeerConnection.prototype._updateIceConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport &&
          !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');
      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    var mediaSectionsInOffer = SDPUtils.getMediaSections(
        pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
            sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp += 'm=application 0 ' + transceiver.protocol +
                ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
              'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
              'a=rtpmap:120 VP8/90000\r\n';
        }
        sdp += 'c=IN IP4 0.0.0.0\r\n' +
            'a=inactive\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function(selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.rtpSender &&
            transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver &&
            transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });
      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }
      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    return Promise.all(promises).then(function(allStats) {
      var results = new Map();
      allStats.forEach(function(stats) {
        stats.forEach(function(stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  };

  // fix low-level stat names and return Map instead of object.
  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
    'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function(ortcObjectName) {
    var obj = window[ortcObjectName];
    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;
      obj.prototype.getStats = function() {
        return nativeGetstats.apply(this)
        .then(function(nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function(id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  });

  // legacy callback shims. Should be moved to adapter.js some days.
  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  return RTCPeerConnection;
};


/***/ }),

/***/ "./node_modules/sdp/sdp.js":
/*!*********************************!*\
  !*** ./node_modules/sdp/sdp.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4], // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
        ? '/' + headerExtension.direction
        : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

SDPUtils.parseSsrcGroup = function(line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function(ssrc) {
      return parseInt(ssrc, 10);
    })
  };
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};

// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
SDPUtils.parseCryptoLine = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3),
  };
};

SDPUtils.writeCryptoLine = function(parameters) {
  return 'a=crypto:' + parameters.tag + ' ' +
    parameters.cryptoSuite + ' ' +
    (typeof parameters.keyParams === 'object'
      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
      : parameters.keyParams) +
    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
    '\r\n';
};

// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
SDPUtils.parseCryptoKeyParams = function(keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }
  var parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
  };
};

SDPUtils.writeCryptoKeyParams = function(keyParams) {
  return keyParams.keyMethod + ':'
    + keyParams.keySalt +
    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
    (keyParams.mkiValue && keyParams.mkiLength
      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
      : '');
};

// Extracts all SDES paramters.
SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
};

// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-ufrag:')[0];
  var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-pwd:')[0];
  if (!(ufrag && pwd)) {
    return null;
  }
  return {
    usernameFragment: ufrag.substr(12),
    password: pwd.substr(10),
  };
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
        mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
        mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function(extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(parts) {
      return parts.attribute === 'cname';
    });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
    .map(function(line) {
      var parts = line.substr(17).split(' ');
      return parts.map(function(part) {
        return parseInt(part, 10);
      });
    });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(obj) {
      return obj.attribute === 'cname';
    })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(msidParts) {
      return msidParts.attribute === 'msid';
    });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
SDPUtils.parseSctpDescription = function(mediaSection) {
  var mline = SDPUtils.parseMLine(mediaSection);
  var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  var maxMessageSize;
  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }
  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }
  var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize: maxMessageSize
    };
  }
  var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
  if (sctpMapLines.length > 0) {
    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0]
      .substr(10)
      .split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize: maxMessageSize
    };
  }
};

// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
SDPUtils.writeSctpDescription = function(media, sctp) {
  var output = [];
  if (media.protocol !== 'DTLS/SCTP') {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctp-port:' + sctp.port + '\r\n'
    ];
  } else {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
    ];
  }
  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }
  return output.join('');
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  var user = sessUser || 'thisisadapterortc';
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=' + user + ' ' + sessionId + ' ' + version +
        ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
    transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
    transceiver.dtlsTransport.getLocalParameters(),
    type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
};

// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }
  var lines = SDPUtils.splitLines(blob);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    }
    // TODO: check the modifier a bit more.
  }
  return true;
};

// Expose public methods.
if (true) {
  module.exports = SDPUtils;
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/adapter_core.js":
/*!************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/adapter_core.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _adapter_factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adapter_factory.js */ "./node_modules/webrtc-adapter/src/js/adapter_factory.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





const adapter =
  Object(_adapter_factory_js__WEBPACK_IMPORTED_MODULE_0__["adapterFactory"])({window: typeof window === 'undefined' ? undefined : window});
/* harmony default export */ __webpack_exports__["default"] = (adapter);


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/adapter_factory.js":
/*!***************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/adapter_factory.js ***!
  \***************************************************************/
/*! exports provided: adapterFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "adapterFactory", function() { return adapterFactory; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chrome/chrome_shim */ "./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js");
/* harmony import */ var _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edge/edge_shim */ "./node_modules/webrtc-adapter/src/js/edge/edge_shim.js");
/* harmony import */ var _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./firefox/firefox_shim */ "./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js");
/* harmony import */ var _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./safari/safari_shim */ "./node_modules/webrtc-adapter/src/js/safari/safari_shim.js");
/* harmony import */ var _common_shim__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common_shim */ "./node_modules/webrtc-adapter/src/js/common_shim.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


  // Browser shims.






// Shimming starts here.
function adapterFactory({window} = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimEdge: true,
  shimSafari: true,
}) {
  // Utils.
  const logging = _utils__WEBPACK_IMPORTED_MODULE_0__["log"];
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);

  const adapter = {
    browserDetails,
    commonShim: _common_shim__WEBPACK_IMPORTED_MODULE_5__,
    extractVersion: _utils__WEBPACK_IMPORTED_MODULE_0__["extractVersion"],
    disableLog: _utils__WEBPACK_IMPORTED_MODULE_0__["disableLog"],
    disableWarnings: _utils__WEBPACK_IMPORTED_MODULE_0__["disableWarnings"]
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!_chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__ || !_chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimPeerConnection"] ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__;

      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimGetUserMedia"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimMediaStream"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimPeerConnection"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimOnTrack"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimAddTrackRemoveTrack"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimGetSendersWithDtmf"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimGetStats"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["shimSenderReceiverGetStats"](window);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__["fixNegotiationNeeded"](window);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimRTCIceCandidate"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimConnectionState"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimMaxMessageSize"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimSendThrowTypeError"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["removeAllowExtmapMixed"](window);
      break;
    case 'firefox':
      if (!_firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__ || !_firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimPeerConnection"] ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__;

      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimGetUserMedia"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimPeerConnection"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimOnTrack"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimRemoveStream"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimSenderGetStats"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimReceiverGetStats"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimRTCDataChannel"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimAddTransceiver"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimGetParameters"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimCreateOffer"](window);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__["shimCreateAnswer"](window);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimRTCIceCandidate"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimConnectionState"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimMaxMessageSize"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimSendThrowTypeError"](window);
      break;
    case 'edge':
      if (!_edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__ || !_edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__["shimPeerConnection"] || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__;

      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__["shimGetUserMedia"](window);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__["shimGetDisplayMedia"](window);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__["shimPeerConnection"](window);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__["shimReplaceTrack"](window);

      // the edge shim implements the full RTCIceCandidate object.

      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimMaxMessageSize"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimSendThrowTypeError"](window);
      break;
    case 'safari':
      if (!_safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__ || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__;

      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimRTCIceServerUrls"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimCreateOfferLegacy"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimCallbacksAPI"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimLocalStreamsAPI"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimRemoteStreamsAPI"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimTrackEventTransceiver"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimGetUserMedia"](window);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__["shimAudioContext"](window);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimRTCIceCandidate"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimMaxMessageSize"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["shimSendThrowTypeError"](window);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__["removeAllowExtmapMixed"](window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js":
/*!******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js ***!
  \******************************************************************/
/*! exports provided: shimGetUserMedia, shimGetDisplayMedia, shimMediaStream, shimOnTrack, shimGetSendersWithDtmf, shimGetStats, shimSenderReceiverGetStats, shimAddTrackRemoveTrackWithNative, shimAddTrackRemoveTrack, shimPeerConnection, fixNegotiationNeeded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimMediaStream", function() { return shimMediaStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimOnTrack", function() { return shimOnTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetSendersWithDtmf", function() { return shimGetSendersWithDtmf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetStats", function() { return shimGetStats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimSenderReceiverGetStats", function() { return shimSenderReceiverGetStats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimAddTrackRemoveTrackWithNative", function() { return shimAddTrackRemoveTrackWithNative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimAddTrackRemoveTrack", function() { return shimAddTrackRemoveTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimPeerConnection", function() { return shimPeerConnection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixNegotiationNeeded", function() { return fixNegotiationNeeded; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return _getusermedia__WEBPACK_IMPORTED_MODULE_1__["shimGetUserMedia"]; });

/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getdisplaymedia */ "./node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__["shimGetDisplayMedia"]; });

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */






function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
      window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }
        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', te => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === te.track.id);
              } else {
                receiver = {track: te.track};
              }

              const event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(track => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === track.id);
              } else {
                receiver = {track};
              }
              const event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["wrapPeerConnectionEvent"](window, 'track', e => {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver',
          {value: {receiver: e.receiver}});
      }
      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if (typeof window === 'object' && window.RTCPeerConnection &&
      !('getSenders' in window.RTCPeerConnection.prototype) &&
      'createDTMFSender' in window.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };

    // augment addTrack when getSenders is not available.
    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };
      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
    }
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(track => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);

        stream.getTracks().forEach(track => {
          const sender = this._senders.find(s => s.track === track);
          if (sender) { // remove sender
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
  } else if (typeof window === 'object' && window.RTCPeerConnection &&
             'getSenders' in window.RTCPeerConnection.prototype &&
             'createDTMFSender' in window.RTCPeerConnection.prototype &&
             window.RTCRtpSender &&
             !('dtmf' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;

    // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.
    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    }

    // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.
    if (origGetStats.length === 0 && (arguments.length === 0 ||
        typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    const fixChromeStats_ = function(response) {
      const standardReport = {};
      const reports = response.result();
      reports.forEach(report => {
        const standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(name => {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });

      return standardReport;
    };

    // shim getStats with maplike support
    const makeMapStats = function(stats) {
      return new Map(Object.keys(stats).map(key => [key, stats[key]]));
    };

    if (arguments.length >= 2) {
      const successCallbackWrapper_ = function(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_,
        selector]);
    }

    // promise-support
    return new Promise((resolve, reject) => {
      origGetStats.apply(this, [
        function(response) {
          resolve(makeMapStats(fixChromeStats_(response)));
        }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  }

  // shim sender stats.
  if (!('getStats' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then(result =>
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        _utils_js__WEBPACK_IMPORTED_MODULE_0__["filterStats"](result, sender.track, true));
    };
  }

  // shim receiver stats.
  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers =
        function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
    }
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["wrapPeerConnectionEvent"](window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then(result =>
        _utils_js__WEBPACK_IMPORTED_MODULE_0__["filterStats"](result, receiver.track, false));
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype &&
      'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  }

  // shim RTCPeerConnection.getStats(track).
  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 &&
        arguments[0] instanceof window.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach(s => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(r => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || (sender && receiver)) {
        return Promise.reject(new DOMException(
          'There are more than one sender or receiver for the track.',
          'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        'There is no sender or receiver for the track.',
        'InvalidAccessError'));
    }
    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams)
        .map(streamId => this._shimmedLocalStreams[streamId][0]);
    };

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders()
      .filter(newSender => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

  const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(streamId => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
}

function shimAddTrackRemoveTrack(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = _utils_js__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);
  // shim addTrack and removeTrack.
  if (window.RTCPeerConnection.prototype.addTrack &&
      browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  }

  // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.
  const origGetLocalStreams = window.RTCPeerConnection.prototype
      .getLocalStreams;
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(stream => this._reverseStreams[stream.id]);
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
      delete this._reverseStreams[(this._streams[stream.id] ?
          this._streams[stream.id].id : stream.id)];
      delete this._streams[stream.id];
    };

  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(t => t === track)) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        const newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(s => s.track === track);
    };

  // replace the internal stream id with the external one and
  // vice versa.
  function replaceInternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
          externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
          internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  ['createOffer', 'createAnswer'].forEach(function(method) {
    const nativeMethod = window.RTCPeerConnection.prototype[method];
    const methodObj = {[method]() {
      const args = arguments;
      const isLegacyCall = arguments.length &&
          typeof arguments[0] === 'function';
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments)
      .then(description => replaceInternalStreamId(this, description));
    }};
    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });

  const origSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };

  // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

  const origLocalDescription = Object.getOwnPropertyDescriptor(
      window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype,
      'localDescription', {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach(streamid => {
        const hasTrack = this._streams[streamid].getTracks()
          .find(track => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
}

function shimPeerConnection(window) {
  const browserDetails = _utils_js__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);

  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }
  if (!window.RTCPeerConnection) {
    return;
  }

  const addIceCandidateNullSupported =
    window.RTCPeerConnection.prototype.addIceCandidate.length === 0;

  // shim implicit creation of RTCSessionDescription/RTCIceCandidate
  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  // support for addIceCandidate(null or undefined)
  const nativeAddIceCandidate =
      window.RTCPeerConnection.prototype.addIceCandidate;
  window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!addIceCandidateNullSupported && !arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions. Native support planned for Chrome M77.
      if (browserDetails.version < 78 &&
        arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
}

// Attempt to fix ONN in plan-b mode.
function fixNegotiationNeeded(window) {
  const browserDetails = _utils_js__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);
  _utils_js__WEBPACK_IMPORTED_MODULE_0__["wrapPeerConnectionEvent"](window, 'negotiationneeded', e => {
    const pc = e.target;
    if (browserDetails.version < 72 || (pc.getConfiguration &&
        pc.getConfiguration().sdpSemantics === 'plan-b')) {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }
    return e;
  });
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js":
/*!**********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js ***!
  \**********************************************************************/
/*! exports provided: shimGetDisplayMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return shimGetDisplayMedia; });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.
  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' +
        'a function');
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      return getSourceId(constraints)
        .then(sourceId => {
          const widthSpecified = constraints.video && constraints.video.width;
          const heightSpecified = constraints.video &&
            constraints.video.height;
          const frameRateSpecified = constraints.video &&
            constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js":
/*!*******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js ***!
  \*******************************************************************/
/*! exports provided: shimGetUserMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return shimGetUserMedia; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


const logging = _utils_js__WEBPACK_IMPORTED_MODULE_0__["log"];

function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  const browserDetails = _utils_js__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);

  const constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach(key => {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(mix => {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      let face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      const getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            devices = devices.filter(d => d.kind === 'videoinput');
            let dev = devices.find(d => matches.some(match =>
              d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, c => {
      navigator.webkitGetUserMedia(c, onSuccess, e => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator.getUserMedia = getUserMedia_.bind(navigator);

  // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.
  if (navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          throw new DOMException('', 'NotFoundError');
        }
        return stream;
      }, e => Promise.reject(shimError_(e))));
    };
  }
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/common_shim.js":
/*!***********************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/common_shim.js ***!
  \***********************************************************/
/*! exports provided: shimRTCIceCandidate, shimMaxMessageSize, shimSendThrowTypeError, shimConnectionState, removeAllowExtmapMixed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimRTCIceCandidate", function() { return shimRTCIceCandidate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimMaxMessageSize", function() { return shimMaxMessageSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimSendThrowTypeError", function() { return shimSendThrowTypeError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimConnectionState", function() { return shimConnectionState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeAllowExtmapMixed", function() { return removeAllowExtmapMixed; });
/* harmony import */ var sdp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sdp */ "./node_modules/sdp/sdp.js");
/* harmony import */ var sdp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sdp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  const NativeRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if (typeof args === 'object' && args.candidate &&
        args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = sdp__WEBPACK_IMPORTED_MODULE_0___default.a.parseCandidate(args.candidate);
      const augmentedCandidate = Object.assign(nativeCandidate,
          parsedCandidate);

      // Add a serializer that does not serialize the extra attributes.
      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment,
        };
      };
      return augmentedCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  _utils__WEBPACK_IMPORTED_MODULE_1__["wrapPeerConnectionEvent"](window, 'icecandidate', e => {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }
    return e;
  });
}

function shimMaxMessageSize(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_1__["detectBrowser"](window);

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = sdp__WEBPACK_IMPORTED_MODULE_0___default.a.splitSections(description.sdp);
    sections.shift();
    return sections.some(mediaSection => {
      const mLine = sdp__WEBPACK_IMPORTED_MODULE_0___default.a.parseMLine(mediaSection);
      return mLine && mLine.kind === 'application'
          && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  const getRemoteFirefoxVersion = function(description) {
    // TODO: Is there a better solution for detecting Firefox?
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    // Test for NaN (yes, this is ugly)
    return version !== version ? -1 : version;
  };

  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize =
          browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };

  const getMaxMessageSize = function(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    let maxMessageSize = 65536;

    // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
    if (browserDetails.browser === 'firefox'
         && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    const match = sdp__WEBPACK_IMPORTED_MODULE_0___default.a.matchPrefix(description.sdp,
      'a=max-message-size:');
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' &&
                remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };

  const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        const {sdpSemantics} = this.getConfiguration();
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
            enumerable: true,
            configurable: true,
          });
        }
      }

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        const sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection &&
      'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  }

  // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === 'open' &&
          pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' +
          pc.sctp.maxMessageSize + ' bytes)');
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel =
    window.RTCPeerConnection.prototype.createDataChannel;
  window.RTCPeerConnection.prototype.createDataChannel =
    function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
  _utils__WEBPACK_IMPORTED_MODULE_1__["wrapPeerConnectionEvent"](window, 'datachannel', e => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}


/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */
function shimConnectionState(window) {
  if (!window.RTCPeerConnection ||
      'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange',
            this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener('connectionstatechange',
            this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });

  ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = e => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener('iceconnectionstatechange',
          this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}

function removeAllowExtmapMixed(window) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_1__["detectBrowser"](window);
  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }
  const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
  function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      desc.sdp = desc.sdp.split('\n').filter((line) => {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
    }
    return nativeSRD.apply(this, arguments);
  };
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/edge_shim.js":
/*!**************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/edge_shim.js ***!
  \**************************************************************/
/*! exports provided: shimGetUserMedia, shimGetDisplayMedia, shimPeerConnection, shimReplaceTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimPeerConnection", function() { return shimPeerConnection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimReplaceTrack", function() { return shimReplaceTrack; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _filtericeservers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filtericeservers */ "./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js");
/* harmony import */ var rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rtcpeerconnection-shim */ "./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js");
/* harmony import */ var rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/edge/getusermedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return _getusermedia__WEBPACK_IMPORTED_MODULE_3__["shimGetUserMedia"]; });

/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getdisplaymedia */ "./node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return _getdisplaymedia__WEBPACK_IMPORTED_MODULE_4__["shimGetDisplayMedia"]; });

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */









function shimPeerConnection(window) {
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);

  if (window.RTCIceGatherer) {
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        return args;
      };
    }
    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function RTCSessionDescription(args) {
        return args;
      };
    }
    // this adds an additional event listener to MediaStrackTrack that signals
    // when a tracks enabled property was changed. Workaround for a bug in
    // addStream, see below. No longer required in 15025+
    if (browserDetails.version < 15025) {
      const origMSTEnabled = Object.getOwnPropertyDescriptor(
          window.MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
        set(value) {
          origMSTEnabled.set.call(this, value);
          const ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }
  }

  // ORTC defines the DTMF sender a bit different.
  // https://github.com/w3c/ortc/issues/714
  if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = new window.RTCDtmfSender(this);
          } else if (this.track.kind === 'video') {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
  // Edge currently only implements the RTCDtmfSender, not the
  // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
  if (window.RTCDtmfSender && !window.RTCDTMFSender) {
    window.RTCDTMFSender = window.RTCDtmfSender;
  }

  const RTCPeerConnectionShim = rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2___default()(window,
      browserDetails.version);
  window.RTCPeerConnection = function RTCPeerConnection(config) {
    if (config && config.iceServers) {
      config.iceServers = Object(_filtericeservers__WEBPACK_IMPORTED_MODULE_1__["filterIceServers"])(config.iceServers,
        browserDetails.version);
      _utils__WEBPACK_IMPORTED_MODULE_0__["log"]('ICE servers after filtering:', config.iceServers);
    }
    return new RTCPeerConnectionShim(config);
  };
  window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
}

function shimReplaceTrack(window) {
  // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
  if (window.RTCRtpSender &&
      !('replaceTrack' in window.RTCRtpSender.prototype)) {
    window.RTCRtpSender.prototype.replaceTrack =
        window.RTCRtpSender.prototype.setTrack;
  }
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js ***!
  \*********************************************************************/
/*! exports provided: filterIceServers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterIceServers", function() { return filterIceServers; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */



// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  let hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(server => {
    if (server && (server.urls || server.url)) {
      let urls = server.urls || server.url;
      if (server.url && !server.urls) {
        _utils__WEBPACK_IMPORTED_MODULE_0__["deprecated"]('RTCIceServer.url', 'RTCIceServer.urls');
      }
      const isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(url => {
        // filter STUN unconditionally.
        if (url.indexOf('stun:') === 0) {
          return false;
        }

        const validTurn = url.startsWith('turn') &&
            !url.startsWith('turn:[') &&
            url.includes('transport=udp');
        if (validTurn && !hasTurn) {
          hasTurn = true;
          return true;
        }
        return validTurn && !hasTurn;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js":
/*!********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js ***!
  \********************************************************************/
/*! exports provided: shimGetDisplayMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return shimGetDisplayMedia; });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


function shimGetDisplayMedia(window) {
  if (!('getDisplayMedia' in window.navigator)) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    window.navigator.getDisplayMedia.bind(window.navigator);
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/getusermedia.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/getusermedia.js ***!
  \*****************************************************************/
/*! exports provided: shimGetUserMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return shimGetUserMedia; });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  const shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  const origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
  };
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js":
/*!********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js ***!
  \********************************************************************/
/*! exports provided: shimGetUserMedia, shimGetDisplayMedia, shimOnTrack, shimPeerConnection, shimSenderGetStats, shimReceiverGetStats, shimRemoveStream, shimRTCDataChannel, shimAddTransceiver, shimGetParameters, shimCreateOffer, shimCreateAnswer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimOnTrack", function() { return shimOnTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimPeerConnection", function() { return shimPeerConnection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimSenderGetStats", function() { return shimSenderGetStats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimReceiverGetStats", function() { return shimReceiverGetStats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimRemoveStream", function() { return shimRemoveStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimRTCDataChannel", function() { return shimRTCDataChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimAddTransceiver", function() { return shimAddTransceiver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetParameters", function() { return shimGetParameters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimCreateOffer", function() { return shimCreateOffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimCreateAnswer", function() { return shimCreateAnswer; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return _getusermedia__WEBPACK_IMPORTED_MODULE_1__["shimGetUserMedia"]; });

/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getdisplaymedia */ "./node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__["shimGetDisplayMedia"]; });

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */






function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCTrackEvent &&
      ('receiver' in window.RTCTrackEvent.prototype) &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimPeerConnection(window) {
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);

  if (typeof window !== 'object' ||
      !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }
  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  // support for addIceCandidate(null or undefined)
  // as well as ignoring {sdpMid, candidate: ""}
  if (browserDetails.version < 68) {
    const nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.
      if (arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }

  const modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };

  const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null])
      .then(stats => {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(stat => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      })
      .then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };
  }

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) :
        Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach(receiver => receiver._pc = this);
      return receivers;
    };
  }
  _utils__WEBPACK_IMPORTED_MODULE_0__["wrapPeerConnectionEvent"](window, 'track', e => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection ||
      'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["deprecated"]('removeStream', 'removeTrack');
      this.getSenders().forEach(sender => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver =
      function addTransceiver() {
        this.setParametersPromises = [];
        const initParameters = arguments[1];
        const shouldPerformCheck = initParameters &&
                                  'sendEncodings' in initParameters;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          initParameters.sendEncodings.forEach((encodingParam) => {
            if ('rid' in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          const {sender} = transceiver;
          const params = sender.getParameters();
          if (!('encodings' in params) ||
              // Avoid being fooled by patched getParameters() below.
              (params.encodings.length === 1 &&
               Object.keys(params.encodings[0]).length === 0)) {
            params.encodings = initParameters.sendEncodings;
            sender.sendEncodings = initParameters.sendEncodings;
            this.setParametersPromises.push(sender.setParameters(params)
              .then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
  }
}

function shimGetParameters(window) {
  if (!(typeof window === 'object' && window.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters =
      function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!('encodings' in params)) {
          params.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params;
      };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateOffer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateAnswer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js":
/*!***********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js ***!
  \***********************************************************************/
/*! exports provided: shimGetDisplayMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetDisplayMedia", function() { return shimGetDisplayMedia; });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


function shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js":
/*!********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js ***!
  \********************************************************************/
/*! exports provided: shimGetUserMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return shimGetUserMedia; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */




function shimGetUserMedia(window) {
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_0__["detectBrowser"](window);
  const navigator = window && window.navigator;
  const MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    _utils__WEBPACK_IMPORTED_MODULE_0__["deprecated"]('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints =
        MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/safari/safari_shim.js":
/*!******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/safari/safari_shim.js ***!
  \******************************************************************/
/*! exports provided: shimLocalStreamsAPI, shimRemoteStreamsAPI, shimCallbacksAPI, shimGetUserMedia, shimConstraints, shimRTCIceServerUrls, shimTrackEventTransceiver, shimCreateOfferLegacy, shimAudioContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimLocalStreamsAPI", function() { return shimLocalStreamsAPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimRemoteStreamsAPI", function() { return shimRemoteStreamsAPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimCallbacksAPI", function() { return shimCallbacksAPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimGetUserMedia", function() { return shimGetUserMedia; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimConstraints", function() { return shimConstraints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimRTCIceServerUrls", function() { return shimRTCIceServerUrls; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimTrackEventTransceiver", function() { return shimTrackEventTransceiver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimCreateOfferLegacy", function() { return shimCreateOfferLegacy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shimAudioContext", function() { return shimAudioContext; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */



function shimLocalStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
  }
  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    const _addTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.
      stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
        stream));
      stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
        stream));
    };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
  }
  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach(sender => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }
}

function shimRemoteStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams =
      function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
  }
  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }
        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = (e) => {
          e.streams.forEach(stream => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event('addstream');
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(stream => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
  }
}

function shimCallbacksAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  const prototype = window.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer =
    function createOffer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  prototype.createAnswer =
    function createAnswer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;

  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;

  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    const mediaDevices = navigator.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({},
      constraints,
      {video: _utils__WEBPACK_IMPORTED_MODULE_0__["compactObject"](constraints.video)}
    );
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
  const OrigPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection =
    function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["deprecated"]('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  // wrap static methods. Currently just generateCertificate.
  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if (typeof window === 'object' && window.RTCTrackEvent &&
      'receiver' in window.RTCTrackEvent.prototype &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer =
    function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio =
            !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'audio');
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          this.addTransceiver('audio');
        }

        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo =
            !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'video');
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          this.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
}

function shimAudioContext(window) {
  if (typeof window !== 'object' || window.AudioContext) {
    return;
  }
  window.AudioContext = window.webkitAudioContext;
}


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/utils.js":
/*!*****************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/utils.js ***!
  \*****************************************************/
/*! exports provided: extractVersion, wrapPeerConnectionEvent, disableLog, disableWarnings, log, deprecated, detectBrowser, compactObject, walkStats, filterStats */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractVersion", function() { return extractVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapPeerConnectionEvent", function() { return wrapPeerConnectionEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disableLog", function() { return disableLog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disableWarnings", function() { return disableWarnings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deprecated", function() { return deprecated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectBrowser", function() { return detectBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compactObject", function() { return compactObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walkStats", function() { return walkStats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterStats", function() { return filterStats; });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


let logDisabled_ = true;
let deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get() {
      return this['_on' + eventNameToWrap];
    },
    set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  logDisabled_ = bool;
  return (bool) ? 'adapter.js logging disabled' :
      'adapter.js logging enabled';
}

/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */
function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if (typeof window === 'object') {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}

/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
      ' instead.');
}

/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */
function detectBrowser(window) {
  // Returned result object.
  const result = {browser: null, version: null};

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  const {navigator} = window;

  if (navigator.mozGetUserMedia) { // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent,
        /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia ||
      (window.isSecureContext === false && window.webkitRTCPeerConnection &&
       !window.RTCIceGatherer)) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent,
        /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (navigator.mediaDevices &&
      navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
    result.browser = 'edge';
    result.version = extractVersion(navigator.userAgent,
        /Edge\/(\d+).(\d+)$/, 2);
  } else if (window.RTCPeerConnection &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent,
        /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
        'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else { // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}

/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === undefined || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {[key]: value});
  }, {});
}

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(name => {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(id => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  const filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach(value => {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(trackStat => {
    result.forEach(stats => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}



/***/ }),

/***/ "./src/awrtc/index.ts":
/*!****************************!*\
  !*** ./src/awrtc/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./network/index */ "./src/awrtc/network/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventDataType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Queue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["List"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Output"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Debug"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Encoder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["UTF16Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Random"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Helper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcInternalState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["AWebRtcPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetworkServerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketServerStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]; });

/* harmony import */ var _media_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./media/index */ "./src/awrtc/media/index.ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _media_index__WEBPACK_IMPORTED_MODULE_1__) if(["default","NetEventType","NetEventDataType","NetworkEvent","ConnectionId","Queue","List","Output","Debug","Encoder","UTF16Encoding","Encoding","Random","Helper","SLogLevel","SLog","SignalingConfig","SignalingInfo","WebRtcPeerState","WebRtcInternalState","AWebRtcPeer","WebRtcDataPeer","WebRtcNetworkServerState","WebRtcNetwork","WebsocketConnectionStatus","WebsocketServerStatus","WebsocketNetwork","LocalNetwork"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _media_browser_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./media_browser/index */ "./src/awrtc/media_browser/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserWebRtcCall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["MediaPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoInput", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["VideoInput"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoInputType", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["VideoInputType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Media", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"]; });

/* harmony import */ var _unity_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unity/index */ "./src/awrtc/unity/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_InitAsync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_PollInitState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_SLog_SetLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_IsBrowserSupported"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Release"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Connect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_StartServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_StopServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Disconnect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Shutdown"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Flush"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_SendData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_SendDataEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_GetBufferedAmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Dequeue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Peek"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_PeekEventDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_CheckEventLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_EventDataToUint8Array"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_DequeueEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_PeekEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasUserMedia"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_Configure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_GetConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_GetConfigurationError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_ResetConfiguration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_ToTexture", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrame_ToTexture"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_Resolution", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrame_Resolution"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrameDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_SetVolume"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasAudioTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasVideoTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_SetMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_IsMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_RequestUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_LastUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices_Length", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_Media_GetVideoDevices_Length"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_Media_GetVideoDevices"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddCanvasDevice", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_VideoInput_AddCanvasDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddDevice", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_VideoInput_AddDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_RemoveDevice", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_VideoInput_RemoveDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_UpdateFrame", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_VideoInput_UpdateFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetUnityCanvas", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["GetUnityCanvas"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetUnityContext", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["GetUnityContext"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
console.debug("loading awrtc modules ...");
var adapter = __webpack_require__(/*! webrtc-adapter */ "./node_modules/webrtc-adapter/src/js/adapter_core.js");


//for simplicity browser and unity are merged here
//it could as well be built and deployed separately


console.debug("loading awrtc modules completed!");


/***/ }),

/***/ "./src/awrtc/media/AWebRtcCall.ts":
/*!****************************************!*\
  !*** ./src/awrtc/media/AWebRtcCall.ts ***!
  \****************************************/
/*! exports provided: AWebRtcCall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AWebRtcCall", function() { return AWebRtcCall; });
/* harmony import */ var _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony import */ var _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CallEventArgs */ "./src/awrtc/media/CallEventArgs.ts");
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
/* harmony import */ var _NetworkConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NetworkConfig */ "./src/awrtc/media/NetworkConfig.ts");
/* harmony import */ var _MediaConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var CallException = /** @class */ (function () {
    function CallException(errorMsg) {
        this.mErrorMsg = errorMsg;
    }
    CallException.prototype.ErrorMsg = function () {
    };
    return CallException;
}());
var InvalidOperationException = /** @class */ (function (_super) {
    __extends(InvalidOperationException, _super);
    function InvalidOperationException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidOperationException;
}(CallException));
/// <summary>
/// State of the call. Mainly used to check for bugs / invalid states.
/// </summary>
var CallState;
(function (CallState) {
    /// <summary>
    /// Not yet initialized / bug
    /// </summary>
    CallState[CallState["Invalid"] = 0] = "Invalid";
    /// <summary>
    /// Object is initialized but local media not yet configured
    /// </summary>
    CallState[CallState["Initialized"] = 1] = "Initialized";
    /// <summary>
    /// In process of accessing the local media devices.
    /// </summary>
    CallState[CallState["Configuring"] = 2] = "Configuring";
    /// <summary>
    /// Configured. Video/Audio can be accessed and call is ready to start
    /// </summary>
    CallState[CallState["Configured"] = 3] = "Configured";
    /// <summary>
    /// In process of requesting an address from the server to then listen and wait for
    /// an incoming call.
    /// </summary>
    CallState[CallState["RequestingAddress"] = 4] = "RequestingAddress";
    /// <summary>
    /// Call is listening on an address and waiting for an incoming call
    /// </summary>
    CallState[CallState["WaitingForIncomingCall"] = 5] = "WaitingForIncomingCall";
    /// <summary>
    /// Call is in the process of connecting to another call object.
    /// </summary>
    CallState[CallState["WaitingForOutgoingCall"] = 6] = "WaitingForOutgoingCall";
    /// <summary>
    /// Indicating that the call object is at least connected to another object
    /// </summary>
    CallState[CallState["InCall"] = 7] = "InCall";
    //CallAcceptedIncoming,
    //CallAcceptedOutgoing,
    /// <summary>
    /// Call ended / conference room closed
    /// </summary>
    CallState[CallState["Closed"] = 8] = "Closed";
})(CallState || (CallState = {}));
/*
class ConnectionMetaData
{
}
*/
var ConnectionInfo = /** @class */ (function () {
    function ConnectionInfo() {
        this.mConnectionIds = new Array();
        //public GetMeta(id:ConnectionId) : ConnectionMetaData
        //{
        //    return this.mConnectionMeta[id.id];
        //}
    }
    //private mConnectionMeta: { [id: number]: ConnectionMetaData } = {};
    ConnectionInfo.prototype.AddConnection = function (id, incoming) {
        this.mConnectionIds.push(id.id);
        //this.mConnectionMeta[id.id] = new ConnectionMetaData();
    };
    ConnectionInfo.prototype.RemConnection = function (id) {
        var index = this.mConnectionIds.indexOf(id.id);
        if (index >= 0) {
            this.mConnectionIds.splice(index, 1);
        }
        else {
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LE("tried to remove an unknown connection with id " + id.id);
        }
        //delete this.mConnectionMeta[id.id];
    };
    ConnectionInfo.prototype.HasConnection = function (id) {
        return this.mConnectionIds.indexOf(id.id) != -1;
    };
    ConnectionInfo.prototype.GetIds = function () {
        return this.mConnectionIds;
    };
    return ConnectionInfo;
}());
/**This class wraps an implementation of
 * IMediaStream and converts its polling system
 * to an easier to use event based system.
 *
 * Ideally use only features defined by
 * ICall to avoid having to deal with internal changes
 * in future updates.
 */
var AWebRtcCall = /** @class */ (function () {
    function AWebRtcCall(config) {
        if (config === void 0) { config = null; }
        this.MESSAGE_TYPE_INVALID = 0;
        this.MESSAGE_TYPE_DATA = 1;
        this.MESSAGE_TYPE_STRING = 2;
        this.MESSAGE_TYPE_CONTROL = 3;
        this.mNetworkConfig = new _NetworkConfig__WEBPACK_IMPORTED_MODULE_3__["NetworkConfig"]();
        this.mMediaConfig = null;
        this.mCallEventHandlers = [];
        this.mNetwork = null;
        this.mConnectionInfo = new ConnectionInfo();
        this.mConferenceMode = false;
        this.mState = CallState.Invalid;
        this.mIsDisposed = false;
        this.mServerInactive = true;
        this.mPendingListenCall = false;
        this.mPendingCallCall = false;
        this.mPendingAddress = null;
        if (config != null) {
            this.mNetworkConfig = config;
            this.mConferenceMode = config.IsConference;
        }
    }
    AWebRtcCall.prototype.addEventListener = function (listener) {
        this.mCallEventHandlers.push(listener);
    };
    AWebRtcCall.prototype.removeEventListener = function (listener) {
        this.mCallEventHandlers = this.mCallEventHandlers.filter(function (h) { return h !== listener; });
    };
    Object.defineProperty(AWebRtcCall.prototype, "State", {
        get: function () {
            return this.mState;
        },
        enumerable: false,
        configurable: true
    });
    AWebRtcCall.prototype.Initialize = function (network) {
        this.mNetwork = network;
        this.mState = CallState.Initialized;
    };
    AWebRtcCall.prototype.Configure = function (config) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        this.mState = CallState.Configuring;
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Enter state CallState.Configuring");
        this.mMediaConfig = config;
        this.mNetwork.Configure(this.mMediaConfig);
    };
    AWebRtcCall.prototype.Call = function (address) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized
            && this.mState != CallState.Configuring
            && this.mState != CallState.Configured) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        if (this.mConferenceMode) {
            throw new InvalidOperationException("Method can't be used in conference calls.");
        }
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Call to " + address);
        this.EnsureConfiguration();
        if (this.mState == CallState.Configured) {
            this.ProcessCall(address);
        }
        else {
            this.PendingCall(address);
        }
    };
    AWebRtcCall.prototype.Listen = function (address) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized
            && this.mState != CallState.Configuring
            && this.mState != CallState.Configured) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        this.EnsureConfiguration();
        if (this.mState == CallState.Configured) {
            this.ProcessListen(address);
        }
        else {
            this.PendingListen(address);
        }
    };
    AWebRtcCall.prototype.Send = function (message, reliable, id) {
        this.CheckDisposed();
        if (reliable == null)
            reliable = true;
        if (id) {
            this.InternalSendTo(message, reliable, id);
        }
        else {
            this.InternalSendToAll(message, reliable);
        }
    };
    AWebRtcCall.prototype.InternalSendToAll = function (message, reliable) {
        var data = this.PackStringMsg(message);
        ;
        for (var _i = 0, _a = this.mConnectionInfo.GetIds(); _i < _a.length; _i++) {
            var id = _a[_i];
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].L("Send message to " + id + "! " + message);
            this.InternalSendRawTo(data, new _network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"](id), reliable);
        }
    };
    AWebRtcCall.prototype.InternalSendTo = function (message, reliable, id) {
        var data = this.PackStringMsg(message);
        this.InternalSendRawTo(data, id, reliable);
    };
    AWebRtcCall.prototype.SendData = function (message, reliable, id) {
        this.CheckDisposed();
        var data = this.PackDataMsg(message);
        this.InternalSendRawTo(data, id, reliable);
    };
    AWebRtcCall.prototype.PackStringMsg = function (message) {
        var data = _network_Helper__WEBPACK_IMPORTED_MODULE_2__["Encoding"].UTF16.GetBytes(message);
        var buff = new Uint8Array(data.length + 1);
        buff[0] = this.MESSAGE_TYPE_STRING;
        for (var i = 0; i < data.length; i++) {
            buff[i + 1] = data[i];
        }
        return buff;
    };
    AWebRtcCall.prototype.UnpackStringMsg = function (message) {
        var buff = new Uint8Array(message.length - 1);
        for (var i = 0; i < buff.length; i++) {
            buff[i] = message[i + 1];
        }
        var res = _network_Helper__WEBPACK_IMPORTED_MODULE_2__["Encoding"].UTF16.GetString(buff);
        return res;
    };
    AWebRtcCall.prototype.PackDataMsg = function (data) {
        var buff = new Uint8Array(data.length + 1);
        buff[0] = this.MESSAGE_TYPE_DATA;
        for (var i = 0; i < data.length; i++) {
            buff[i + 1] = data[i];
        }
        return buff;
    };
    AWebRtcCall.prototype.UnpackDataMsg = function (message) {
        var buff = new Uint8Array(message.length - 1);
        for (var i = 0; i < buff.length; i++) {
            buff[i] = message[i + 1];
        }
        return buff;
    };
    AWebRtcCall.prototype.InternalSendRawTo = function (rawdata, id, reliable) {
        this.mNetwork.SendData(id, rawdata, reliable);
    };
    AWebRtcCall.prototype.Update = function () {
        if (this.mIsDisposed)
            return;
        if (this.mNetwork == null)
            return;
        this.mNetwork.Update();
        //waiting for the media configuration?
        if (this.mState == CallState.Configuring) {
            var configState = this.mNetwork.GetConfigurationState();
            if (configState == _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Failed) {
                this.OnConfigurationFailed(this.mNetwork.GetConfigurationError());
                //bugfix: user might dispose the call during the event above
                if (this.mIsDisposed)
                    return;
                if (this.mNetwork != null)
                    this.mNetwork.ResetConfiguration();
            }
            else if (configState == _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Successful) {
                this.OnConfigurationComplete();
                if (this.mIsDisposed)
                    return;
            }
        }
        var evt;
        while ((evt = this.mNetwork.Dequeue()) != null) {
            switch (evt.Type) {
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].NewConnection:
                    if (this.mState == CallState.WaitingForIncomingCall
                        || (this.mConferenceMode && this.mState == CallState.InCall)) //keep accepting connections after 
                     {
                        //remove ability to accept incoming connections
                        if (this.mConferenceMode == false)
                            this.mNetwork.StopServer();
                        this.mState = CallState.InCall;
                        this.mConnectionInfo.AddConnection(evt.ConnectionId, true);
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    else if (this.mState == CallState.WaitingForOutgoingCall) {
                        this.mConnectionInfo.AddConnection(evt.ConnectionId, false);
                        //only possible in 1 on 1 calls
                        this.mState = CallState.InCall;
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    else {
                        //Debug.Assert(mState == CallState.WaitingForIncomingCall || mState == CallState.WaitingForOutgoingCall);
                        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogWarning("Received incoming connection during invalid state " + this.mState);
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ConnectionFailed:
                    //call failed
                    if (this.mState == CallState.WaitingForOutgoingCall) {
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConnectionFailed));
                        if (this.mIsDisposed)
                            return;
                        this.mState = CallState.Configured;
                    }
                    else {
                        //Debug.Assert(mState == CallState.WaitingForOutgoingCall);
                        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogError("Received ConnectionFailed during " + this.mState);
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].Disconnected:
                    if (this.mConnectionInfo.HasConnection(evt.ConnectionId)) {
                        this.mConnectionInfo.RemConnection(evt.ConnectionId);
                        //call ended
                        if (this.mConferenceMode == false && this.mConnectionInfo.GetIds().length == 0) {
                            this.mState = CallState.Closed;
                        }
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEndedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerInitialized:
                    //incoming calls possible
                    this.mServerInactive = false;
                    this.mState = CallState.WaitingForIncomingCall;
                    this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["WaitForIncomingCallEventArgs"](evt.Info));
                    if (this.mIsDisposed)
                        return;
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerInitFailed:
                    this.mServerInactive = true;
                    //reset state to the earlier state which is Configured (as without configuration no
                    //listening possible). Local camera/audio will keep running
                    this.mState = CallState.Configured;
                    this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ListeningFailed));
                    if (this.mIsDisposed)
                        return;
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerClosed:
                    this.mServerInactive = true;
                    //no incoming calls possible anymore
                    if (this.mState == CallState.WaitingForIncomingCall || this.mState == CallState.RequestingAddress) {
                        this.mState = CallState.Configured;
                        //might need to be handled as a special timeout event?
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ListeningFailed, _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"].Unknown, "Server closed the connection while waiting for incoming calls."));
                        if (this.mIsDisposed)
                            return;
                    }
                    else {
                        //event is normal during other states as the server connection will be closed after receiving a call
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ReliableMessageReceived:
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].UnreliableMessageReceived:
                    var reliable = evt.Type === _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ReliableMessageReceived;
                    //chat message received
                    if (evt.MessageData.length >= 2) {
                        if (evt.MessageData[0] == this.MESSAGE_TYPE_STRING) {
                            var message = this.UnpackStringMsg(evt.MessageData);
                            this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MessageEventArgs"](evt.ConnectionId, message, reliable));
                        }
                        else if (evt.MessageData[0] == this.MESSAGE_TYPE_DATA) {
                            var message = this.UnpackDataMsg(evt.MessageData);
                            this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["DataMessageEventArgs"](evt.ConnectionId, message, reliable));
                        }
                        else {
                            //invalid message?
                        }
                    }
                    else {
                        //invalid message?
                    }
                    if (this.mIsDisposed)
                        return;
                    break;
            }
        }
        var handleLocalFrames = true;
        var handleRemoteFrames = true;
        if (this.mMediaConfig.FrameUpdates && handleLocalFrames) {
            var localFrame = this.mNetwork.TryGetFrame(_network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"].INVALID);
            if (localFrame != null) {
                this.FrameToCallEvent(_network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"].INVALID, localFrame);
                if (this.mIsDisposed)
                    return;
            }
        }
        if (this.mMediaConfig.FrameUpdates && handleRemoteFrames) {
            for (var _i = 0, _a = this.mConnectionInfo.GetIds(); _i < _a.length; _i++) {
                var id = _a[_i];
                var conId = new _network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"](id);
                var remoteFrame = this.mNetwork.TryGetFrame(conId);
                if (remoteFrame != null) {
                    this.FrameToCallEvent(conId, remoteFrame);
                    if (this.mIsDisposed)
                        return;
                }
            }
        }
        var mediaEvent = null;
        while ((mediaEvent = this.mNetwork.DequeueMediaEvent()) != null) {
            this.MediaEventToCallEvent(mediaEvent);
        }
        this.mNetwork.Flush();
    };
    AWebRtcCall.prototype.FrameToCallEvent = function (id, frame) {
        var args = new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["FrameUpdateEventArgs"](id, frame);
        this.TriggerCallEvent(args);
    };
    AWebRtcCall.prototype.MediaEventToCallEvent = function (evt) {
        var videoElement = null;
        if (evt.EventType == evt.EventType) {
            var args = new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MediaUpdatedEventArgs"](evt.ConnectionId, evt.Args);
            this.TriggerCallEvent(args);
        }
    };
    AWebRtcCall.prototype.PendingCall = function (address) {
        this.mPendingAddress = address;
        this.mPendingCallCall = true;
        this.mPendingListenCall = false;
    };
    AWebRtcCall.prototype.ProcessCall = function (address) {
        this.mState = CallState.WaitingForOutgoingCall;
        this.mNetwork.Connect(address);
        this.ClearPending();
    };
    AWebRtcCall.prototype.PendingListen = function (address) {
        this.mPendingAddress = address;
        this.mPendingCallCall = false;
        this.mPendingListenCall = true;
    };
    AWebRtcCall.prototype.ProcessListen = function (address) {
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Listen at " + address);
        this.mServerInactive = false;
        this.mState = CallState.RequestingAddress;
        this.mNetwork.StartServer(address);
        this.ClearPending();
    };
    AWebRtcCall.prototype.DoPending = function () {
        if (this.mPendingCallCall) {
            this.ProcessCall(this.mPendingAddress);
        }
        else if (this.mPendingListenCall) {
            this.ProcessListen(this.mPendingAddress);
        }
        this.ClearPending();
    };
    AWebRtcCall.prototype.ClearPending = function () {
        this.mPendingAddress = null;
        this.mPendingCallCall = null;
        this.mPendingListenCall = null;
    };
    AWebRtcCall.prototype.CheckDisposed = function () {
        if (this.mIsDisposed)
            throw new InvalidOperationException("Object is disposed. No method calls possible.");
    };
    AWebRtcCall.prototype.EnsureConfiguration = function () {
        if (this.mState == CallState.Initialized) {
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Use default configuration");
            this.Configure(new _MediaConfig__WEBPACK_IMPORTED_MODULE_4__["MediaConfig"]());
        }
        else {
        }
    };
    AWebRtcCall.prototype.TriggerCallEvent = function (args) {
        var arr = this.mCallEventHandlers.slice();
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var callback = arr_1[_i];
            callback(this, args);
        }
    };
    AWebRtcCall.prototype.OnConfigurationComplete = function () {
        if (this.mIsDisposed)
            return;
        this.mState = CallState.Configured;
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Enter state CallState.Configured");
        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConfigurationComplete));
        if (this.mIsDisposed == false)
            this.DoPending();
    };
    AWebRtcCall.prototype.OnConfigurationFailed = function (error) {
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogWarning("Configuration failed: " + error);
        if (this.mIsDisposed)
            return;
        this.mState = CallState.Initialized;
        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConfigurationFailed, _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"].Unknown, error));
        //bugfix: user might dispose the call during the event above
        if (this.mIsDisposed == false)
            this.ClearPending();
    };
    AWebRtcCall.prototype.DisposeInternal = function (disposing) {
        //nothing to dispose but subclasses overwrite this
        if (!this.mIsDisposed) {
            if (disposing) {
            }
            this.mIsDisposed = true;
        }
    };
    AWebRtcCall.prototype.Dispose = function () {
        this.DisposeInternal(true);
    };
    return AWebRtcCall;
}());



/***/ }),

/***/ "./src/awrtc/media/CallEventArgs.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/CallEventArgs.ts ***!
  \******************************************/
/*! exports provided: CallEventType, CallEventArgs, CallAcceptedEventArgs, CallEndedEventArgs, CallErrorType, ErrorEventArgs, WaitForIncomingCallEventArgs, MessageEventArgs, DataMessageEventArgs, MediaUpdatedEventArgs, FrameUpdateEventArgs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEventType", function() { return CallEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEventArgs", function() { return CallEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallAcceptedEventArgs", function() { return CallAcceptedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEndedEventArgs", function() { return CallEndedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallErrorType", function() { return CallErrorType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorEventArgs", function() { return ErrorEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WaitForIncomingCallEventArgs", function() { return WaitForIncomingCallEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageEventArgs", function() { return MessageEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataMessageEventArgs", function() { return DataMessageEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaUpdatedEventArgs", function() { return MediaUpdatedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FrameUpdateEventArgs", function() { return FrameUpdateEventArgs; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/// <summary>
/// Type of the event.
/// </summary>
var CallEventType;
(function (CallEventType) {
    /// <summary>
    /// Used if the event value wasn't initialized
    /// </summary>
    CallEventType[CallEventType["Invalid"] = 0] = "Invalid";
    /// <summary>
    /// The call object is successfully connected to the server waiting for another user 
    /// to connect.
    /// </summary>
    CallEventType[CallEventType["WaitForIncomingCall"] = 1] = "WaitForIncomingCall";
    /// <summary>
    /// A call was accepted
    /// </summary>
    CallEventType[CallEventType["CallAccepted"] = 2] = "CallAccepted";
    /// <summary>
    /// The call ended
    /// </summary>
    CallEventType[CallEventType["CallEnded"] = 3] = "CallEnded";
    /**
     * Backwards compatibility. Use MediaUpdate
     */
    CallEventType[CallEventType["FrameUpdate"] = 4] = "FrameUpdate";
    /// <summary>
    /// Text message arrived
    /// </summary>
    CallEventType[CallEventType["Message"] = 5] = "Message";
    /// <summary>
    /// Connection failed. Might be due to an server, network error or the address didn't exist
    /// Using ErrorEventArgs
    /// </summary>
    CallEventType[CallEventType["ConnectionFailed"] = 6] = "ConnectionFailed";
    /// <summary>
    /// Listening failed. Address might be in use or due to server/network error
    /// Using ErrorEventArgs
    /// </summary>
    CallEventType[CallEventType["ListeningFailed"] = 7] = "ListeningFailed";
    /// <summary>
    /// Event triggered after the local media was successfully configured. 
    /// If requested the call object will have access to the users camera and/or audio now and
    /// the local camera frames can be received in events. 
    /// </summary>
    CallEventType[CallEventType["ConfigurationComplete"] = 8] = "ConfigurationComplete";
    /// <summary>
    /// Configuration failed. This happens if the configuration requested features
    /// the system doesn't support e.g. no camera, camera doesn't support the requested resolution
    /// or the user didn't allow the website to access the camera/microphone in WebGL mode.
    /// </summary>
    CallEventType[CallEventType["ConfigurationFailed"] = 9] = "ConfigurationFailed";
    /// <summary>
    /// Reliable or unreliable data msg arrived
    /// </summary>
    CallEventType[CallEventType["DataMessage"] = 10] = "DataMessage";
    /**
     *
     */
    CallEventType[CallEventType["MediaUpdate"] = 20] = "MediaUpdate";
})(CallEventType || (CallEventType = {}));
var CallEventArgs = /** @class */ (function () {
    function CallEventArgs(type) {
        this.mType = CallEventType.Invalid;
        this.mType = type;
    }
    Object.defineProperty(CallEventArgs.prototype, "Type", {
        get: function () {
            return this.mType;
        },
        enumerable: false,
        configurable: true
    });
    return CallEventArgs;
}());

var CallAcceptedEventArgs = /** @class */ (function (_super) {
    __extends(CallAcceptedEventArgs, _super);
    function CallAcceptedEventArgs(connectionId) {
        var _this = _super.call(this, CallEventType.CallAccepted) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = connectionId;
        return _this;
    }
    Object.defineProperty(CallAcceptedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    return CallAcceptedEventArgs;
}(CallEventArgs));

var CallEndedEventArgs = /** @class */ (function (_super) {
    __extends(CallEndedEventArgs, _super);
    function CallEndedEventArgs(connectionId) {
        var _this = _super.call(this, CallEventType.CallEnded) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = connectionId;
        return _this;
    }
    Object.defineProperty(CallEndedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    return CallEndedEventArgs;
}(CallEventArgs));

var CallErrorType;
(function (CallErrorType) {
    CallErrorType[CallErrorType["Unknown"] = 0] = "Unknown";
})(CallErrorType || (CallErrorType = {}));
var ErrorEventArgs = /** @class */ (function (_super) {
    __extends(ErrorEventArgs, _super);
    function ErrorEventArgs(eventType, type, errorMessage) {
        var _this = _super.call(this, eventType) || this;
        _this.mErrorType = CallErrorType.Unknown;
        _this.mErrorType = type;
        _this.mErrorMessage = errorMessage;
        if (_this.mErrorMessage == null) {
            switch (eventType) {
                //use some generic error messages as the underlaying system doesn't report the errors yet.
                case CallEventType.ConnectionFailed:
                    _this.mErrorMessage = "Connection failed.";
                    break;
                case CallEventType.ListeningFailed:
                    _this.mErrorMessage = "Failed to allow incoming connections. Address already in use or server connection failed.";
                    break;
                default:
                    _this.mErrorMessage = "Unknown error.";
                    break;
            }
        }
        return _this;
    }
    Object.defineProperty(ErrorEventArgs.prototype, "ErrorMessage", {
        get: function () {
            return this.mErrorMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ErrorEventArgs.prototype, "ErrorType", {
        get: function () {
            return this.mErrorType;
        },
        enumerable: false,
        configurable: true
    });
    return ErrorEventArgs;
}(CallEventArgs));

var WaitForIncomingCallEventArgs = /** @class */ (function (_super) {
    __extends(WaitForIncomingCallEventArgs, _super);
    function WaitForIncomingCallEventArgs(address) {
        var _this = _super.call(this, CallEventType.WaitForIncomingCall) || this;
        _this.mAddress = address;
        return _this;
    }
    Object.defineProperty(WaitForIncomingCallEventArgs.prototype, "Address", {
        get: function () {
            return this.mAddress;
        },
        enumerable: false,
        configurable: true
    });
    return WaitForIncomingCallEventArgs;
}(CallEventArgs));

var MessageEventArgs = /** @class */ (function (_super) {
    __extends(MessageEventArgs, _super);
    function MessageEventArgs(id, message, reliable) {
        var _this = _super.call(this, CallEventType.Message) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = id;
        _this.mContent = message;
        _this.mReliable = reliable;
        return _this;
    }
    Object.defineProperty(MessageEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MessageEventArgs.prototype, "Content", {
        get: function () {
            return this.mContent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MessageEventArgs.prototype, "Reliable", {
        get: function () {
            return this.mReliable;
        },
        enumerable: false,
        configurable: true
    });
    return MessageEventArgs;
}(CallEventArgs));

var DataMessageEventArgs = /** @class */ (function (_super) {
    __extends(DataMessageEventArgs, _super);
    function DataMessageEventArgs(id, message, reliable) {
        var _this = _super.call(this, CallEventType.DataMessage) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = id;
        _this.mContent = message;
        _this.mReliable = reliable;
        return _this;
    }
    Object.defineProperty(DataMessageEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataMessageEventArgs.prototype, "Content", {
        get: function () {
            return this.mContent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataMessageEventArgs.prototype, "Reliable", {
        get: function () {
            return this.mReliable;
        },
        enumerable: false,
        configurable: true
    });
    return DataMessageEventArgs;
}(CallEventArgs));

/**
 * Replaces the FrameUpdateEventArgs. Instead of
 * giving access to video frames only this gives access to
 * video html tag once it is created.
 * TODO: Add audio + video tracks + flag that indicates added, updated or removed
 * after renegotiation is added.
 */
var MediaUpdatedEventArgs = /** @class */ (function (_super) {
    __extends(MediaUpdatedEventArgs, _super);
    function MediaUpdatedEventArgs(conId, videoElement) {
        var _this = _super.call(this, CallEventType.MediaUpdate) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = conId;
        _this.mVideoElement = videoElement;
        return _this;
    }
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "IsRemote", {
        /// <summary>
        /// False if the frame is from a local camera. True if it is received from
        /// via network.
        /// </summary>
        get: function () {
            return this.mConnectionId.id != _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "VideoElement", {
        get: function () {
            return this.mVideoElement;
        },
        enumerable: false,
        configurable: true
    });
    return MediaUpdatedEventArgs;
}(CallEventArgs));

/// <summary>
/// Will be replaced with MediaUpdatedEventArgs.
/// It doesn't make a lot of sense in HTML only
/// </summary>
var FrameUpdateEventArgs = /** @class */ (function (_super) {
    __extends(FrameUpdateEventArgs, _super);
    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="conId"></param>
    /// <param name="frame"></param>
    function FrameUpdateEventArgs(conId, frame) {
        var _this = _super.call(this, CallEventType.FrameUpdate) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = conId;
        _this.mFrame = frame;
        return _this;
    }
    Object.defineProperty(FrameUpdateEventArgs.prototype, "Frame", {
        /// <summary>
        /// Raw image data. Note that the byte array contained in RawFrame will be reused
        /// for the next frames received. Only valid until the next call of ICall.Update
        /// </summary>
        get: function () {
            return this.mFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameUpdateEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameUpdateEventArgs.prototype, "IsRemote", {
        /// <summary>
        /// False if the frame is from a local camera. True if it is received from
        /// via network.
        /// </summary>
        get: function () {
            return this.mConnectionId.id != _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id;
        },
        enumerable: false,
        configurable: true
    });
    return FrameUpdateEventArgs;
}(CallEventArgs));



/***/ }),

/***/ "./src/awrtc/media/ICall.ts":
/*!**********************************!*\
  !*** ./src/awrtc/media/ICall.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/awrtc/media/IMediaNetwork.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/IMediaNetwork.ts ***!
  \******************************************/
/*! exports provided: MediaConfigurationState, MediaEventType, MediaEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaConfigurationState", function() { return MediaConfigurationState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaEventType", function() { return MediaEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaEvent", function() { return MediaEvent; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var MediaConfigurationState;
(function (MediaConfigurationState) {
    MediaConfigurationState[MediaConfigurationState["Invalid"] = 0] = "Invalid";
    MediaConfigurationState[MediaConfigurationState["NoConfiguration"] = 1] = "NoConfiguration";
    MediaConfigurationState[MediaConfigurationState["InProgress"] = 2] = "InProgress";
    MediaConfigurationState[MediaConfigurationState["Successful"] = 3] = "Successful";
    MediaConfigurationState[MediaConfigurationState["Failed"] = 4] = "Failed";
})(MediaConfigurationState || (MediaConfigurationState = {}));
var MediaEventType;
(function (MediaEventType) {
    MediaEventType[MediaEventType["Invalid"] = 0] = "Invalid";
    MediaEventType[MediaEventType["StreamAdded"] = 20] = "StreamAdded";
})(MediaEventType || (MediaEventType = {}));
/**
 * Will replace frame event / configuration system in the future.
 *
 * So far it only delivers HTMLVideoElements once connection and
 * all tracks are ready and it plays.
 *
 * This is all temporary and will be updated soon to handle
 * all events from configuration of local streams to frame updates and
 * renegotation.
 *
 */
var MediaEvent = /** @class */ (function () {
    function MediaEvent(type, id, args) {
        this.mEventType = MediaEventType.Invalid;
        this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        this.mEventType = type;
        this.mConnectionId = id;
        this.mArgs = args;
    }
    Object.defineProperty(MediaEvent.prototype, "EventType", {
        get: function () {
            return this.mEventType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaEvent.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaEvent.prototype, "Args", {
        get: function () {
            return this.mArgs;
        },
        enumerable: false,
        configurable: true
    });
    return MediaEvent;
}());



/***/ }),

/***/ "./src/awrtc/media/MediaConfig.ts":
/*!****************************************!*\
  !*** ./src/awrtc/media/MediaConfig.ts ***!
  \****************************************/
/*! exports provided: MediaConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaConfig", function() { return MediaConfig; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/// <summary>
/// Configuration for the WebRtcCall class.
/// 
/// Allows to turn on / off video and audio + configure the used servers to initialize the connection and
/// avoid firewalls.
/// </summary>
var MediaConfig = /** @class */ (function () {
    function MediaConfig() {
        this.mAudio = true;
        this.mVideo = true;
        this.mVideoDeviceName = "";
        this.mMinWidth = -1;
        this.mMinHeight = -1;
        this.mMaxWidth = -1;
        this.mMaxHeight = -1;
        this.mIdealWidth = -1;
        this.mIdealHeight = -1;
        this.mMinFps = -1;
        this.mMaxFps = -1;
        this.mIdealFps = -1;
        this.mFrameUpdates = false;
    }
    Object.defineProperty(MediaConfig.prototype, "Audio", {
        get: function () {
            return this.mAudio;
        },
        set: function (value) {
            this.mAudio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "Video", {
        get: function () {
            return this.mVideo;
        },
        set: function (value) {
            this.mVideo = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "VideoDeviceName", {
        get: function () {
            return this.mVideoDeviceName;
        },
        set: function (value) {
            this.mVideoDeviceName = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinWidth", {
        get: function () {
            return this.mMinWidth;
        },
        set: function (value) {
            this.mMinWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinHeight", {
        get: function () {
            return this.mMinHeight;
        },
        set: function (value) {
            this.mMinHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxWidth", {
        get: function () {
            return this.mMaxWidth;
        },
        set: function (value) {
            this.mMaxWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxHeight", {
        get: function () {
            return this.mMaxHeight;
        },
        set: function (value) {
            this.mMaxHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealWidth", {
        get: function () {
            return this.mIdealWidth;
        },
        set: function (value) {
            this.mIdealWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealHeight", {
        get: function () {
            return this.mIdealHeight;
        },
        set: function (value) {
            this.mIdealHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinFps", {
        get: function () {
            return this.mMinFps;
        },
        set: function (value) {
            this.mMinFps = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxFps", {
        get: function () {
            return this.mMaxFps;
        },
        set: function (value) {
            this.mMaxFps = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealFps", {
        get: function () {
            return this.mIdealFps;
        },
        set: function (value) {
            this.mIdealFps = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "FrameUpdates", {
        /** false - frame updates aren't generated. Useful for browser mode
         *  true  - library will deliver frames as ByteArray
        */
        get: function () {
            return this.mFrameUpdates;
        },
        set: function (value) {
            this.mFrameUpdates = value;
        },
        enumerable: false,
        configurable: true
    });
    return MediaConfig;
}());



/***/ }),

/***/ "./src/awrtc/media/NetworkConfig.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/NetworkConfig.ts ***!
  \******************************************/
/*! exports provided: NetworkConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkConfig", function() { return NetworkConfig; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var NetworkConfig = /** @class */ (function () {
    function NetworkConfig() {
        this.mIceServers = new Array();
        this.mSignalingUrl = "ws://because-why-not.com:12776";
        this.mIsConference = false;
    }
    Object.defineProperty(NetworkConfig.prototype, "IceServers", {
        get: function () {
            return this.mIceServers;
        },
        set: function (value) {
            this.mIceServers = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkConfig.prototype, "SignalingUrl", {
        get: function () {
            return this.mSignalingUrl;
        },
        set: function (value) {
            this.mSignalingUrl = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkConfig.prototype, "IsConference", {
        get: function () {
            return this.mIsConference;
        },
        set: function (value) {
            this.mIsConference = value;
        },
        enumerable: false,
        configurable: true
    });
    return NetworkConfig;
}());



/***/ }),

/***/ "./src/awrtc/media/RawFrame.ts":
/*!*************************************!*\
  !*** ./src/awrtc/media/RawFrame.ts ***!
  \*************************************/
/*! exports provided: FramePixelFormat, IFrameData, RawFrame, LazyFrame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FramePixelFormat", function() { return FramePixelFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IFrameData", function() { return IFrameData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RawFrame", function() { return RawFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LazyFrame", function() { return LazyFrame; });
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var FramePixelFormat;
(function (FramePixelFormat) {
    FramePixelFormat[FramePixelFormat["Invalid"] = 0] = "Invalid";
    FramePixelFormat[FramePixelFormat["Format32bppargb"] = 1] = "Format32bppargb";
})(FramePixelFormat || (FramePixelFormat = {}));
//replace with interface after typescript 2.0 update (properties in interfaces aren't supported yet)
var IFrameData = /** @class */ (function () {
    function IFrameData() {
    }
    Object.defineProperty(IFrameData.prototype, "Format", {
        get: function () {
            return FramePixelFormat.Format32bppargb;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Buffer", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Width", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Height", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    IFrameData.prototype.ToTexture = function (gl, texture) {
        return false;
    };
    return IFrameData;
}());

//Container for the raw bytes of the current frame + height and width.
//Format is currently fixed based on the browser getImageData format
var RawFrame = /** @class */ (function (_super) {
    __extends(RawFrame, _super);
    function RawFrame(buffer, width, height) {
        var _this = _super.call(this) || this;
        _this.mBuffer = null;
        _this.mBuffer = buffer;
        _this.mWidth = width;
        _this.mHeight = height;
        return _this;
    }
    Object.defineProperty(RawFrame.prototype, "Buffer", {
        get: function () {
            return this.mBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RawFrame.prototype, "Width", {
        get: function () {
            return this.mWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RawFrame.prototype, "Height", {
        get: function () {
            return this.mHeight;
        },
        enumerable: false,
        configurable: true
    });
    return RawFrame;
}(IFrameData));

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
var LazyFrame = /** @class */ (function (_super) {
    __extends(LazyFrame, _super);
    function LazyFrame(frameGenerator) {
        var _this = _super.call(this) || this;
        _this.mFrameGenerator = frameGenerator;
        return _this;
    }
    Object.defineProperty(LazyFrame.prototype, "FrameGenerator", {
        get: function () {
            return this.mFrameGenerator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Buffer", {
        get: function () {
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return null;
            return this.mRawFrame.Buffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Width", {
        /**Returns the expected width of the frame.
         * Watch out this might change inbetween frames!
         *
         */
        get: function () {
            if (this.mRawFrame == null) {
                return this.mFrameGenerator.VideoElement.videoWidth;
            }
            else {
                return this.mRawFrame.Width;
            }
            /*
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return -1;
            return this.mRawFrame.Width;
            */
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Height", {
        /**Returns the expected height of the frame.
         * Watch out this might change inbetween frames!
         *
         */
        get: function () {
            if (this.mRawFrame == null) {
                return this.mFrameGenerator.VideoElement.videoHeight;
            }
            else {
                return this.mRawFrame.Height;
            }
            /*
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return -1;
            return this.mRawFrame.Height;
            */
        },
        enumerable: false,
        configurable: true
    });
    /**Intendet for use via the Unity plugin.
     * Will copy the image directly into a texture to avoid overhead of a CPU side copy.
     *
     * The given texture should have the correct size before calling this method.
     *
     * @param gl
     * @param texture
     */
    LazyFrame.prototype.ToTexture = function (gl, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        /*
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, this.mFrameGenerator.VideoElement);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        */
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGB, gl.UNSIGNED_BYTE, this.mFrameGenerator.VideoElement);
        return true;
    };
    /*
    public ToTexture2(gl: WebGL2RenderingContext) : WebGLTexture{
        let tex = gl.createTexture()
        this.ToTexture(gl, tex)
        return;
    }
    */
    //Called before access of any frame data triggering the creation of the raw frame data
    LazyFrame.prototype.GenerateFrame = function () {
        if (this.mRawFrame == null) {
            try {
                this.mRawFrame = this.mFrameGenerator.CreateFrame();
            }
            catch (exception) {
                this.mRawFrame = null;
                _network_Helper__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogWarning("frame skipped in GenerateFrame due to exception: " + JSON.stringify(exception));
            }
        }
    };
    return LazyFrame;
}(IFrameData));



/***/ }),

/***/ "./src/awrtc/media/index.ts":
/*!**********************************!*\
  !*** ./src/awrtc/media/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AWebRtcCall */ "./src/awrtc/media/AWebRtcCall.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcCall", function() { return _AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__["AWebRtcCall"]; });

/* harmony import */ var _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CallEventArgs */ "./src/awrtc/media/CallEventArgs.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventType", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallAcceptedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEndedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEndedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallErrorType", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ErrorEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WaitForIncomingCallEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["WaitForIncomingCallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MessageEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataMessageEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["DataMessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaUpdatedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MediaUpdatedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FrameUpdateEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["FrameUpdateEventArgs"]; });

/* harmony import */ var _ICall__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ICall */ "./src/awrtc/media/ICall.ts");
/* harmony import */ var _ICall__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ICall__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _ICall__WEBPACK_IMPORTED_MODULE_2__) if(["default","AWebRtcCall","CallEventType","CallEventArgs","CallAcceptedEventArgs","CallEndedEventArgs","CallErrorType","ErrorEventArgs","WaitForIncomingCallEventArgs","MessageEventArgs","DataMessageEventArgs","MediaUpdatedEventArgs","FrameUpdateEventArgs"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _ICall__WEBPACK_IMPORTED_MODULE_2__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IMediaNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfigurationState", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_3__["MediaConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEventType", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_3__["MediaEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEvent", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_3__["MediaEvent"]; });

/* harmony import */ var _MediaConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfig", function() { return _MediaConfig__WEBPACK_IMPORTED_MODULE_4__["MediaConfig"]; });

/* harmony import */ var _NetworkConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NetworkConfig */ "./src/awrtc/media/NetworkConfig.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkConfig", function() { return _NetworkConfig__WEBPACK_IMPORTED_MODULE_5__["NetworkConfig"]; });

/* harmony import */ var _RawFrame__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RawFrame */ "./src/awrtc/media/RawFrame.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FramePixelFormat", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_6__["FramePixelFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IFrameData", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_6__["IFrameData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RawFrame", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_6__["RawFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LazyFrame", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_6__["LazyFrame"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/









/***/ }),

/***/ "./src/awrtc/media_browser/BrowserMediaNetwork.ts":
/*!********************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserMediaNetwork.ts ***!
  \********************************************************/
/*! exports provided: BrowserMediaNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return BrowserMediaNetwork; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../media/IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony import */ var _media_MediaConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../media/MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony import */ var _MediaPeer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaPeer */ "./src/awrtc/media_browser/MediaPeer.ts");
/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
/* harmony import */ var _DeviceApi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DeviceApi */ "./src/awrtc/media_browser/DeviceApi.ts");
/* harmony import */ var _Media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Media */ "./src/awrtc/media_browser/Media.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/







/**Avoid using this class directly whenever possible. Use BrowserWebRtcCall instead.
 * BrowserMediaNetwork might be subject to frequent changes to keep up with changes
 * in all other platforms.
 *
 * IMediaNetwork implementation for the browser. The class is mostly identical with the
 * C# version. Main goal is to have an interface that can easily be wrapped to other
 * programming languages and gives access to basic WebRTC features such as receiving
 * and sending audio and video + signaling via websockets.
 *
 * BrowserMediaNetwork can be used to stream a local audio and video track to a group of
 * multiple peers and receive remote tracks. The handling of the peers itself
 * remains the same as WebRtcNetwork.
 * Local tracks are created after calling Configure. This will request access from the
 * user. After the user allowed access GetConfigurationState will return Configured.
 * Every incoming and outgoing peer that is established after this will receive
 * the local audio and video track.
 * So far Configure can only be called once before any peers are connected.
 *
 *
 */
var BrowserMediaNetwork = /** @class */ (function (_super) {
    __extends(BrowserMediaNetwork, _super);
    function BrowserMediaNetwork(config) {
        var _this = _super.call(this, BrowserMediaNetwork.BuildSignalingConfig(config.SignalingUrl), BrowserMediaNetwork.BuildRtcConfig(config.IceServers)) || this;
        //media configuration set by the user
        _this.mMediaConfig = null;
        //keeps track of audio / video tracks based on local devices
        //will be shared with all connected peers.
        _this.mLocalStream = null;
        _this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Invalid;
        _this.mConfigurationError = null;
        _this.mMediaEvents = new _network_index__WEBPACK_IMPORTED_MODULE_0__["Queue"]();
        _this.MediaPeer_InternalMediaStreamAdded = function (peer, stream) {
            _this.EnqueueMediaEvent(_media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEventType"].StreamAdded, peer.ConnectionId, stream.VideoElement);
        };
        _this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].NoConfiguration;
        return _this;
    }
    /**Triggers the creation of a local audio and video track. After this
     * call the user might get a request to allow access to the requested
     * devices.
     *
     * @param config Detail configuration for audio/video devices.
     */
    BrowserMediaNetwork.prototype.Configure = function (config) {
        var _this = this;
        this.mMediaConfig = config;
        this.mConfigurationError = null;
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].InProgress;
        if (config.Audio || config.Video) {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("calling GetUserMedia. Media config: " + JSON.stringify(config));
            if (_DeviceApi__WEBPACK_IMPORTED_MODULE_5__["DeviceApi"].IsUserMediaAvailable()) {
                var promise = null;
                promise = _Media__WEBPACK_IMPORTED_MODULE_6__["Media"].SharedInstance.getUserMedia(config);
                promise.then(function (stream) {
                    //totally unrelated -> user gave access to devices. use this
                    //to get the proper names for our DeviceApi
                    _DeviceApi__WEBPACK_IMPORTED_MODULE_5__["DeviceApi"].Update();
                    //call worked -> setup a frame buffer that deals with the rest
                    _this.mLocalStream = new _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_4__["BrowserMediaStream"](stream);
                    //console.debug("Local tracks: ", stream.getTracks());
                    _this.mLocalStream.InternalStreamAdded = function (stream) {
                        _this.EnqueueMediaEvent(_media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEventType"].StreamAdded, _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, _this.mLocalStream.VideoElement);
                    };
                    //unlike native version this one will happily play the local sound causing an echo
                    //set to mute
                    _this.mLocalStream.SetMute(true);
                    _this.OnConfigurationSuccess();
                });
                promise.catch(function (err) {
                    //failed due to an error or user didn't give permissions
                    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(err.name + ": " + err.message);
                    _this.OnConfigurationFailed(err.message);
                });
            }
            else {
                //no access to media device -> fail
                var error = "Configuration failed. navigator.mediaDevices is unedfined. The browser might not allow media access." +
                    "Is the page loaded via http or file URL? Some browsers only support https!";
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(error);
                this.OnConfigurationFailed(error);
            }
        }
        else {
            this.OnConfigurationSuccess();
        }
    };
    /**Call this every time a new frame is shown to the user in realtime
     * applications.
     *
     */
    BrowserMediaNetwork.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.mLocalStream != null)
            this.mLocalStream.Update();
    };
    BrowserMediaNetwork.prototype.EnqueueMediaEvent = function (type, id, args) {
        var evt = new _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEvent"](type, id, args);
        this.mMediaEvents.Enqueue(evt);
    };
    BrowserMediaNetwork.prototype.DequeueMediaEvent = function () {
        return this.mMediaEvents.Dequeue();
    };
    /**
     * Call this every frame after interacting with this instance.
     *
     * This call might flush buffered messages in the future and clear
     * events that the user didn't process to avoid buffer overflows.
     *
     */
    BrowserMediaNetwork.prototype.Flush = function () {
        _super.prototype.Flush.call(this);
        this.mMediaEvents.Clear();
    };
    /**Poll this after Configure is called to get the result.
     * Won't change after state is Configured or Failed.
     *
     */
    BrowserMediaNetwork.prototype.GetConfigurationState = function () {
        return this.mConfigurationState;
    };
    /**Returns the error message if the configure process failed.
     * This usally either happens because the user refused access
     * or no device fulfills the configuration given
     * (e.g. device doesn't support the given resolution)
     *
     */
    BrowserMediaNetwork.prototype.GetConfigurationError = function () {
        return this.mConfigurationError;
    };
    /**Resets the configuration state to allow multiple attempts
     * to call Configure.
     *
     */
    BrowserMediaNetwork.prototype.ResetConfiguration = function () {
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].NoConfiguration;
        this.mMediaConfig = new _media_MediaConfig__WEBPACK_IMPORTED_MODULE_2__["MediaConfig"]();
        this.mConfigurationError = null;
    };
    BrowserMediaNetwork.prototype.OnConfigurationSuccess = function () {
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Successful;
    };
    BrowserMediaNetwork.prototype.OnConfigurationFailed = function (error) {
        this.mConfigurationError = error;
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Failed;
    };
    /**Allows to peek at the current frame.
     * Added to allow the emscripten C / C# side to allocate memory before
     * actually getting the frame.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.PeekFrame = function (id) {
        if (id == null)
            return;
        if (id.id == _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id) {
            if (this.mLocalStream != null) {
                return this.mLocalStream.PeekFrame();
            }
        }
        else {
            var peer = this.IdToConnection[id.id];
            if (peer != null) {
                return peer.PeekFrame();
            }
            //TODO: iterate over media peers and do the same as above
        }
        return null;
    };
    BrowserMediaNetwork.prototype.TryGetFrame = function (id) {
        if (id == null)
            return;
        if (id.id == _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id) {
            if (this.mLocalStream != null) {
                return this.mLocalStream.TryGetFrame();
            }
        }
        else {
            var peer = this.IdToConnection[id.id];
            if (peer != null) {
                return peer.TryGetRemoteFrame();
            }
            //TODO: iterate over media peers and do the same as above
        }
        return null;
    };
    /**
     * Remote audio control for each peer.
     *
     * @param volume 0 - mute and 1 - max volume
     * @param id peer id
     */
    BrowserMediaNetwork.prototype.SetVolume = function (volume, id) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("SetVolume called. Volume: " + volume + " id: " + id.id);
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.SetVolume(volume);
        }
    };
    /** Allows to check if a specific peer has a remote
     * audio track attached.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.HasAudioTrack = function (id) {
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.HasAudioTrack();
        }
        return false;
    };
    /** Allows to check if a specific peer has a remote
     * video track attached.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.HasVideoTrack = function (id) {
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.HasVideoTrack();
        }
        return false;
    };
    /**Returns true if no local audio available or it is muted.
     * False if audio is available (could still not work due to 0 volume, hardware
     * volume control or a dummy audio input device is being used)
     */
    BrowserMediaNetwork.prototype.IsMute = function () {
        if (this.mLocalStream != null && this.mLocalStream.Stream != null) {
            var stream = this.mLocalStream.Stream;
            var tracks = stream.getAudioTracks();
            if (tracks.length > 0) {
                if (tracks[0].enabled)
                    return false;
            }
        }
        return true;
    };
    /**Sets the local audio device to mute / unmute it.
     *
     * @param value
     */
    BrowserMediaNetwork.prototype.SetMute = function (value) {
        if (this.mLocalStream != null && this.mLocalStream.Stream != null) {
            var stream = this.mLocalStream.Stream;
            var tracks = stream.getAudioTracks();
            if (tracks.length > 0) {
                tracks[0].enabled = !value;
            }
        }
    };
    BrowserMediaNetwork.prototype.CreatePeer = function (peerId, lRtcConfig) {
        var peer = new _MediaPeer__WEBPACK_IMPORTED_MODULE_3__["MediaPeer"](peerId, lRtcConfig);
        peer.InternalStreamAdded = this.MediaPeer_InternalMediaStreamAdded;
        if (this.mLocalStream != null)
            peer.AddLocalStream(this.mLocalStream.Stream);
        return peer;
    };
    BrowserMediaNetwork.prototype.DisposeInternal = function () {
        _super.prototype.DisposeInternal.call(this);
        this.DisposeLocalStream();
    };
    BrowserMediaNetwork.prototype.DisposeLocalStream = function () {
        if (this.mLocalStream != null) {
            this.mLocalStream.Dispose();
            this.mLocalStream = null;
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("local buffer disposed");
        }
    };
    BrowserMediaNetwork.BuildSignalingConfig = function (signalingUrl) {
        var signalingNetwork;
        if (signalingUrl == null || signalingUrl == "") {
            signalingNetwork = new _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]();
        }
        else {
            signalingNetwork = new _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"](signalingUrl);
        }
        return new _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"](signalingNetwork);
    };
    BrowserMediaNetwork.BuildRtcConfig = function (servers) {
        var rtcConfig = { iceServers: servers };
        return rtcConfig;
    };
    return BrowserMediaNetwork;
}(_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"]));



/***/ }),

/***/ "./src/awrtc/media_browser/BrowserMediaStream.ts":
/*!*******************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserMediaStream.ts ***!
  \*******************************************************/
/*! exports provided: BrowserMediaStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return BrowserMediaStream; });
/* harmony import */ var _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../media/RawFrame */ "./src/awrtc/media/RawFrame.ts");
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**
 * Mostly used for debugging at the moment. Browser API doesn't seem to have a standard way to
 * determine if a frame was updated. This class currently uses several different methods based
 * on availability
 *
 */
var FrameEventMethod;
(function (FrameEventMethod) {
    /**We use a set default framerate. FPS is unknown and we can't recognize if a frame was updated.
     * Used for remote video tracks on firefox as the "framerate" property will not be set.
     */
    FrameEventMethod["DEFAULT_FALLBACK"] = "DEFAULT_FALLBACK";
    /**
     * Using the tracks meta data to decide the framerate. We might drop frames or deliver them twice
     * because we can't tell when exactly they are updated.
     * Some video devices also claim 30 FPS but generate less causing us to waste performance copying the same image
     * multipel times
     *
     * This system works with local video in firefox
     */
    FrameEventMethod["TRACK"] = "TRACK";
    /**
     *  uses frame numbers returned by the browser. This works for webkit based browsers only so far.
     *  Firefox is either missing the needed properties or they return always 0
     */
    FrameEventMethod["EXACT"] = "EXACT";
})(FrameEventMethod || (FrameEventMethod = {}));
/**Internal use only.
 * Bundles all functionality related to MediaStream, Tracks and video processing.
 * It creates two HTML elements: Video and Canvas to interact with the video stream
 * and convert the visible frame data to Uint8Array for compatibility with the
 * unity plugin and all other platforms.
 *
 */
var BrowserMediaStream = /** @class */ (function () {
    function BrowserMediaStream(stream) {
        this.mBufferedFrame = null;
        this.mInstanceId = 0;
        this.mCanvasElement = null;
        this.mIsActive = false;
        this.mMsPerFrame = 1.0 / BrowserMediaStream.DEFAULT_FRAMERATE * 1000;
        this.mFrameEventMethod = FrameEventMethod.DEFAULT_FALLBACK;
        //used to buffer last volume level as part of the
        //autoplat workaround that will mute the audio until it gets the ok from the user
        this.mDefaultVolume = 0.5;
        //Time the last frame was generated
        this.mLastFrameTime = 0;
        this.mNextFrameTime = 0;
        /** Number of the last frame (not yet supported in all browsers)
         * if it remains at <= 0 then we just generate frames based on
         * the timer above
         */
        this.mLastFrameNumber = 0;
        this.mHasVideo = false;
        this.InternalStreamAdded = null;
        this.mStream = stream;
        this.mInstanceId = BrowserMediaStream.sNextInstanceId;
        BrowserMediaStream.sNextInstanceId++;
        this.mMsPerFrame = 1.0 / BrowserMediaStream.DEFAULT_FRAMERATE * 1000;
        this.mFrameEventMethod = FrameEventMethod.DEFAULT_FALLBACK;
        this.SetupElements();
    }
    Object.defineProperty(BrowserMediaStream.prototype, "Stream", {
        get: function () {
            return this.mStream;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserMediaStream.prototype, "VideoElement", {
        get: function () {
            return this.mVideoElement;
        },
        enumerable: false,
        configurable: true
    });
    //must be called from onclick, touchstart, ... event handlers
    BrowserMediaStream.ResolveAutoplay = function () {
        _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("ResolveAutoplay. Trying to restart video / turn on audio after user interaction ");
        var streams = BrowserMediaStream.sBlockedStreams;
        BrowserMediaStream.sBlockedStreams = new Set();
        for (var _i = 0, _a = Array.from(streams); _i < _a.length; _i++) {
            var v = _a[_i];
            v.ResolveAutoplay();
        }
    };
    BrowserMediaStream.prototype.ResolveAutoplay = function () {
        if (BrowserMediaStream.MUTE_IF_AUTOPLAT_BLOCKED) {
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Try to replay video with audio. ");
            //if muted due to autoplay -> unmute
            this.SetVolume(this.mDefaultVolume);
            if (this.mVideoElement.muted) {
                this.mVideoElement.muted = false;
            }
        }
        //call play again if needed
        if (this.mVideoElement.paused)
            this.mVideoElement.play();
    };
    BrowserMediaStream.prototype.CheckFrameRate = function () {
        if (this.mVideoElement) {
            if (this.mStream.getVideoTracks().length > 0) {
                this.mHasVideo = true;
                var vtrack = this.mStream.getVideoTracks()[0];
                var settings = vtrack.getSettings();
                var fps = settings.frameRate;
                if (fps) {
                    if (BrowserMediaStream.VERBOSE) {
                        console.log("Track FPS: " + fps);
                    }
                    this.mMsPerFrame = 1.0 / fps * 1000;
                    this.mFrameEventMethod = FrameEventMethod.TRACK;
                }
            }
            //try to get the video fps via the track
            //fails on firefox if the track comes from a remote source
            if (this.GetFrameNumber() != -1) {
                if (BrowserMediaStream.VERBOSE) {
                    console.log("Get frame available.");
                }
                //browser returns exact frame information
                this.mFrameEventMethod = FrameEventMethod.EXACT;
            }
            //failed to determine any frame rate. This happens on firefox with
            //remote tracks
            if (this.mFrameEventMethod === FrameEventMethod.DEFAULT_FALLBACK) {
                //firefox and co won't tell us the FPS for remote stream
                _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Framerate unknown for stream " + this.mInstanceId + ". Using default framerate of " + BrowserMediaStream.DEFAULT_FRAMERATE);
            }
        }
    };
    BrowserMediaStream.prototype.TriggerAutoplayBlockled = function () {
        BrowserMediaStream.sBlockedStreams.add(this);
        if (BrowserMediaStream.onautoplayblocked !== null) {
            BrowserMediaStream.onautoplayblocked();
        }
    };
    BrowserMediaStream.prototype.TryPlay = function () {
        var _this = this;
        var playPromise = this.mVideoElement.play();
        this.mDefaultVolume = this.mVideoElement.volume;
        if (typeof playPromise !== "undefined") {
            playPromise.then(function () {
                //all good
            }).catch(function (error) {
                if (BrowserMediaStream.MUTE_IF_AUTOPLAT_BLOCKED === false) {
                    //browser blocked replay. print error & setup auto play workaround
                    console.error(error);
                    _this.TriggerAutoplayBlockled();
                }
                else {
                    //Below: Safari on Mac is able to just deactivate audio and show the video
                    //once user interacts with the content audio will be activated again via SetVolue
                    //WARNING: This fails on iOS! SetVolume fails and audio won't ever come back
                    //keep MUTE_IF_AUTOPLAT_BLOCKED === false for iOS support
                    console.warn(error);
                    _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Replay of video failed. The browser might have blocked the video due to autoplay restrictions. Retrying without audio ...");
                    //try to play without audio enabled
                    _this.SetVolume(0);
                    var promise2 = _this.mVideoElement.play();
                    if (typeof promise2 !== "undefined") {
                        promise2.then(function () {
                            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Playing video successful but muted.");
                            //still trigger for unmute on next click
                            _this.TriggerAutoplayBlockled();
                        }).catch(function (error) {
                            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE("Replay of video failed. This error is likely caused due to autoplay restrictions of the browser. Try allowing autoplay.");
                            console.error(error);
                            _this.TriggerAutoplayBlockled();
                        });
                    }
                }
            });
        }
    };
    BrowserMediaStream.prototype.SetupElements = function () {
        var _this = this;
        this.mVideoElement = this.SetupVideoElement();
        //TOOD: investigate bug here
        //In some cases onloadedmetadata is never called. This might happen due to a 
        //bug in firefox or might be related to a device / driver error
        //So far it only happens randomly (maybe 1 in 10 tries) on a single test device and only
        //with 720p. (video device "BisonCam, NB Pro" on MSI laptop)
        _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("video element created. video tracks: " + this.mStream.getVideoTracks().length);
        this.mVideoElement.onloadedmetadata = function (e) {
            //console.log("onloadedmetadata");
            //we might have shutdown everything by now already
            if (_this.mVideoElement == null)
                return;
            _this.TryPlay();
            if (_this.InternalStreamAdded != null)
                _this.InternalStreamAdded(_this);
            _this.CheckFrameRate();
            var video_log = "Resolution: " + _this.mVideoElement.videoWidth + "x" + _this.mVideoElement.videoHeight
                + " fps method: " + _this.mFrameEventMethod + " " + Math.round(1000 / (_this.mMsPerFrame));
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L(video_log);
            if (BrowserMediaStream.VERBOSE) {
                console.log(video_log);
            }
            //now create canvas after the meta data of the video are known
            if (_this.mHasVideo) {
                _this.mCanvasElement = _this.SetupCanvas();
                //canvas couldn't be created. set video to false
                if (_this.mCanvasElement == null)
                    _this.mHasVideo = false;
            }
            else {
                _this.mCanvasElement = null;
            }
            _this.mIsActive = true;
        };
        //set the src value and trigger onloadedmetadata above
        try {
            //newer method. not yet supported everywhere
            var element = this.mVideoElement;
            element.srcObject = this.mStream;
        }
        catch (error) {
            //old way of doing it. won't work anymore in firefox and possibly other browsers
            this.mVideoElement.src = window.URL.createObjectURL(this.mStream);
        }
    };
    /** Returns the current frame number.
     *  Treat a return value of 0 or smaller as unknown.
     * (Browsers might have the property but
     * always return 0)
     */
    BrowserMediaStream.prototype.GetFrameNumber = function () {
        var frameNumber;
        if (this.mVideoElement) {
            if (this.mVideoElement.webkitDecodedFrameCount) {
                frameNumber = this.mVideoElement.webkitDecodedFrameCount;
            }
            /*
            None of these work and future versions might return numbers that are only
            updated once a second or so. For now it is best to ignore these.

            TODO: Check if any of these will work in the future. this.mVideoElement.getVideoPlaybackQuality().totalVideoFrames;
            might also help in the future (so far always 0)
            this.mVideoElement.currentTime also won't work because this is updated faster than the framerate (would result in >100+ framerate)
            else if((this.mVideoElement as any).mozParsedFrames)
            {
                frameNumber = (this.mVideoElement as any).mozParsedFrames;
            }else if((this.mVideoElement as any).mozDecodedFrames)
            {
                frameNumber = (this.mVideoElement as any).mozDecodedFrames;
            }else if((this.mVideoElement as any).decodedFrameCount)
            {
                frameNumber = (this.mVideoElement as any).decodedFrameCount;
            }
            */
            else {
                frameNumber = -1;
            }
        }
        else {
            frameNumber = -1;
        }
        return frameNumber;
    };
    BrowserMediaStream.prototype.TryGetFrame = function () {
        //make sure we get the newest frame
        //this.EnsureLatestFrame();
        //remove the buffered frame if any
        var result = this.mBufferedFrame;
        this.mBufferedFrame = null;
        return result;
    };
    BrowserMediaStream.prototype.SetMute = function (mute) {
        this.mVideoElement.muted = mute;
    };
    BrowserMediaStream.prototype.PeekFrame = function () {
        //this.EnsureLatestFrame();
        return this.mBufferedFrame;
    };
    /** Ensures we have the latest frame ready
     * for the next PeekFrame / TryGetFrame calls
     */
    BrowserMediaStream.prototype.EnsureLatestFrame = function () {
        if (this.HasNewerFrame()) {
            this.GenerateFrame();
            return true;
        }
        return false;
    };
    /** checks if the html tag has a newer frame available
     * (or if 1/30th of a second passed since last frame if
     * this info isn't available)
     */
    BrowserMediaStream.prototype.HasNewerFrame = function () {
        if (this.mIsActive
            && this.mHasVideo
            && this.mCanvasElement != null) {
            if (this.mLastFrameNumber > 0) {
                this.mFrameEventMethod = FrameEventMethod.EXACT;
                //we are getting frame numbers. use those to 
                //check if we have a new one
                if (this.GetFrameNumber() > this.mLastFrameNumber) {
                    return true;
                }
            }
            else {
                //many browsers do not share the frame info
                var now = new Date().getTime();
                if (this.mNextFrameTime <= now) {
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    BrowserMediaStream.prototype.Update = function () {
        this.EnsureLatestFrame();
    };
    BrowserMediaStream.prototype.DestroyCanvas = function () {
        if (this.mCanvasElement != null && this.mCanvasElement.parentElement != null) {
            this.mCanvasElement.parentElement.removeChild(this.mCanvasElement);
        }
    };
    BrowserMediaStream.prototype.Dispose = function () {
        this.mIsActive = false;
        BrowserMediaStream.sBlockedStreams.delete(this);
        this.DestroyCanvas();
        if (this.mVideoElement != null && this.mVideoElement.parentElement != null) {
            this.mVideoElement.parentElement.removeChild(this.mVideoElement);
        }
        //track cleanup is probably not needed but
        //it might help ensure it properly stops
        //in case there are other references out there
        var tracks = this.mStream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        this.mStream = null;
        this.mVideoElement = null;
        this.mCanvasElement = null;
    };
    BrowserMediaStream.prototype.CreateFrame = function () {
        this.mCanvasElement.width = this.mVideoElement.videoWidth;
        this.mCanvasElement.height = this.mVideoElement.videoHeight;
        var ctx = this.mCanvasElement.getContext("2d");
        /*
        var fillBackgroundFirst = true;
        if (fillBackgroundFirst) {
            ctx.clearRect(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
        }
        */
        ctx.drawImage(this.mVideoElement, 0, 0);
        try {
            //risk of security exception in firefox
            var imgData = ctx.getImageData(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
            var imgRawData = imgData.data;
            var array = new Uint8Array(imgRawData.buffer);
            return new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["RawFrame"](array, this.mCanvasElement.width, this.mCanvasElement.height);
        }
        catch (exception) {
            //show white frame for now
            var array = new Uint8Array(this.mCanvasElement.width * this.mCanvasElement.height * 4);
            array.fill(255, 0, array.length - 1);
            var res = new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["RawFrame"](array, this.mCanvasElement.width, this.mCanvasElement.height);
            //attempted workaround for firefox bug / suspected cause: 
            // * root cause seems to be an internal origin-clean flag within the canvas. If set to false reading from the
            //   canvas triggers a security exceptions. This is usually used if the canvas contains data that isn't 
            //   suppose to be accessible e.g. a picture from another domain
            // * while moving the image to the canvas the origin-clean flag seems to be set to false but only 
            //   during the first few frames. (maybe a race condition within firefox? A higher CPU workload increases the risk)
            // * the canvas will work and look just fine but calling getImageData isn't allowed anymore
            // * After a few frames the video is back to normal but the canvas will still have the flag set to false
            // 
            //Solution:
            // * Recreate the canvas if the exception is triggered. During the next few frames firefox should get its flag right
            //   and then stop causing the error. It might recreate the canvas multiple times until it finally works as we
            //   can't detect if the video element will trigger the issue until we tried to access the data
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("Firefox workaround: Refused access to the remote video buffer. Retrying next frame...");
            this.DestroyCanvas();
            this.mCanvasElement = this.SetupCanvas();
            return res;
        }
    };
    //Old buffed frame was replaced with a wrapepr that avoids buffering internally
    //Only point of generate frame is now to ensure a consistent framerate
    BrowserMediaStream.prototype.GenerateFrame = function () {
        this.mLastFrameNumber = this.GetFrameNumber();
        var now = new Date().getTime();
        //js timing is very inaccurate. reduce time until next frame if we are
        //late with this one.
        var diff = now - this.mNextFrameTime;
        var delta = (this.mMsPerFrame - diff);
        delta = Math.min(this.mMsPerFrame, Math.max(1, delta));
        this.mLastFrameTime = now;
        this.mNextFrameTime = now + delta;
        //console.log("last frame , new frame", this.mLastFrameTime, this.mNextFrameTime, delta);
        this.mBufferedFrame = new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["LazyFrame"](this);
    };
    BrowserMediaStream.prototype.SetupVideoElement = function () {
        var videoElement = document.createElement("video");
        //width/doesn't seem to be important
        videoElement.width = 320;
        videoElement.height = 240;
        videoElement.controls = true;
        videoElement.id = "awrtc_mediastream_video_" + this.mInstanceId;
        //videoElement.muted = true;
        if (BrowserMediaStream.DEBUG_SHOW_ELEMENTS)
            document.body.appendChild(videoElement);
        return videoElement;
    };
    BrowserMediaStream.prototype.SetupCanvas = function () {
        if (this.mVideoElement == null || this.mVideoElement.videoWidth <= 0 ||
            this.mVideoElement.videoHeight <= 0)
            return null;
        var canvas = document.createElement("canvas");
        canvas.width = this.mVideoElement.videoWidth;
        canvas.height = this.mVideoElement.videoHeight;
        canvas.id = "awrtc_mediastream_canvas_" + this.mInstanceId;
        if (BrowserMediaStream.DEBUG_SHOW_ELEMENTS)
            document.body.appendChild(canvas);
        return canvas;
    };
    BrowserMediaStream.prototype.SetVolume = function (volume) {
        if (this.mVideoElement == null) {
            return;
        }
        if (volume < 0)
            volume = 0;
        if (volume > 1)
            volume = 1;
        this.mVideoElement.volume = volume;
    };
    BrowserMediaStream.prototype.HasAudioTrack = function () {
        if (this.mStream != null && this.mStream.getAudioTracks() != null
            && this.mStream.getAudioTracks().length > 0) {
            return true;
        }
        return false;
    };
    BrowserMediaStream.prototype.HasVideoTrack = function () {
        if (this.mStream != null && this.mStream.getVideoTracks() != null
            && this.mStream.getVideoTracks().length > 0) {
            return true;
        }
        return false;
    };
    //no double buffering in java script as it forces us to create a new frame each time
    //for debugging. Will attach the HTMLVideoElement used to play the local and remote
    //video streams to the document.
    BrowserMediaStream.DEBUG_SHOW_ELEMENTS = false;
    BrowserMediaStream.MUTE_IF_AUTOPLAT_BLOCKED = false;
    //Gives each FrameBuffer and its HTMLVideoElement a fixed id for debugging purposes.
    BrowserMediaStream.sNextInstanceId = 1;
    BrowserMediaStream.VERBOSE = false;
    //Framerate used as a workaround if
    //the actual framerate is unknown due to browser restrictions
    BrowserMediaStream.DEFAULT_FRAMERATE = 30;
    BrowserMediaStream.sBlockedStreams = new Set();
    BrowserMediaStream.onautoplayblocked = null;
    return BrowserMediaStream;
}());



/***/ }),

/***/ "./src/awrtc/media_browser/BrowserWebRtcCall.ts":
/*!******************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserWebRtcCall.ts ***!
  \******************************************************/
/*! exports provided: BrowserWebRtcCall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return BrowserWebRtcCall; });
/* harmony import */ var _media_AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../media/AWebRtcCall */ "./src/awrtc/media/AWebRtcCall.ts");
/* harmony import */ var _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserMediaNetwork */ "./src/awrtc/media_browser/BrowserMediaNetwork.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**Browser version of the C# version of WebRtcCall.
 *
 * See ICall interface for detailed documentation.
 * BrowserWebRtcCall mainly exists to allow other versions
 * in the future that might build on a different IMediaNetwork
 * interface (Maybe something running inside Webassembly?).
 */
var BrowserWebRtcCall = /** @class */ (function (_super) {
    __extends(BrowserWebRtcCall, _super);
    function BrowserWebRtcCall(config) {
        var _this = _super.call(this, config) || this;
        _this.Initialize(_this.CreateNetwork());
        return _this;
    }
    BrowserWebRtcCall.prototype.CreateNetwork = function () {
        return new _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["BrowserMediaNetwork"](this.mNetworkConfig);
    };
    BrowserWebRtcCall.prototype.DisposeInternal = function (disposing) {
        _super.prototype.DisposeInternal.call(this, disposing);
        if (disposing) {
            if (this.mNetwork != null)
                this.mNetwork.Dispose();
            this.mNetwork = null;
        }
    };
    return BrowserWebRtcCall;
}(_media_AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__["AWebRtcCall"]));



/***/ }),

/***/ "./src/awrtc/media_browser/DeviceApi.ts":
/*!**********************************************!*\
  !*** ./src/awrtc/media_browser/DeviceApi.ts ***!
  \**********************************************/
/*! exports provided: DeviceInfo, DeviceApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return DeviceInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return DeviceApi; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var DeviceInfo = /** @class */ (function () {
    function DeviceInfo() {
        this.deviceId = null;
        this.defaultLabel = null;
        this.label = null;
        this.isLabelGuessed = true;
    }
    return DeviceInfo;
}());

var DeviceApi = /** @class */ (function () {
    function DeviceApi() {
    }
    Object.defineProperty(DeviceApi, "LastUpdate", {
        get: function () {
            return DeviceApi.sLastUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "HasInfo", {
        get: function () {
            return DeviceApi.sLastUpdate > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "IsPending", {
        get: function () {
            return DeviceApi.sIsPending;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "LastError", {
        get: function () {
            return this.sLastError;
        },
        enumerable: false,
        configurable: true
    });
    DeviceApi.AddOnChangedHandler = function (evt) {
        DeviceApi.sUpdateEvents.push(evt);
    };
    DeviceApi.RemOnChangedHandler = function (evt) {
        var index = DeviceApi.sUpdateEvents.indexOf(evt);
        if (index >= 0) {
            DeviceApi.sUpdateEvents.splice(index, 1);
        }
        else {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LW("Tried to remove an unknown event handler in DeviceApi.RemOnChangedHandler");
        }
    };
    DeviceApi.TriggerChangedEvent = function () {
        for (var _i = 0, _a = DeviceApi.sUpdateEvents; _i < _a.length; _i++) {
            var v = _a[_i];
            try {
                v();
            }
            catch (e) {
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Error in DeviceApi user event handler: " + e);
                console.exception(e);
            }
        }
    };
    Object.defineProperty(DeviceApi, "Devices", {
        get: function () {
            return DeviceApi.sDeviceInfo;
        },
        enumerable: false,
        configurable: true
    });
    DeviceApi.GetVideoDevices = function () {
        var devices = DeviceApi.Devices;
        var keys = Object.keys(devices);
        var labels = keys.map(function (x) { return devices[x].label; });
        return labels;
    };
    DeviceApi.Reset = function () {
        DeviceApi.sUpdateEvents = [];
        DeviceApi.sLastUpdate = 0;
        DeviceApi.sDeviceInfo = {};
        DeviceApi.sVideoDeviceCounter = 1;
        DeviceApi.sAccessStream = null;
        DeviceApi.sLastError = null;
        DeviceApi.sIsPending = false;
    };
    /**Updates the device list based on the current
     * access. Gives the devices numbers if the name isn't known.
     */
    DeviceApi.Update = function () {
        DeviceApi.sLastError = null;
        if (DeviceApi.IsApiAvailable()) {
            DeviceApi.sIsPending = true;
            navigator.mediaDevices.enumerateDevices()
                .then(DeviceApi.InternalOnEnum)
                .catch(DeviceApi.InternalOnErrorCatch);
        }
        else {
            DeviceApi.InternalOnErrorString(DeviceApi.ENUM_FAILED);
        }
    };
    DeviceApi.UpdateAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, fail) {
                        DeviceApi.sLastError = null;
                        if (DeviceApi.IsApiAvailable() == false) {
                            DeviceApi.InternalOnErrorString(DeviceApi.ENUM_FAILED);
                            fail(DeviceApi.ENUM_FAILED);
                        }
                        resolve();
                    }).then(function () {
                        DeviceApi.sIsPending = true;
                        return navigator.mediaDevices.enumerateDevices()
                            .then(DeviceApi.InternalOnEnum)
                            .catch(DeviceApi.InternalOnErrorCatch);
                    })];
            });
        });
    };
    /**Checks if the API is available in the browser.
     * false - browser doesn't support this API
     * true - browser supports the API (might still refuse to give
     * us access later on)
     */
    DeviceApi.IsApiAvailable = function () {
        if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
            return true;
        return false;
    };
    /**Asks the user for access first to get the full
     * device names.
     */
    DeviceApi.RequestUpdate = function () {
        DeviceApi.sLastError = null;
        if (DeviceApi.IsApiAvailable()) {
            DeviceApi.sIsPending = true;
            var constraints = { video: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(DeviceApi.InternalOnStream)
                .catch(DeviceApi.InternalOnErrorCatch);
        }
        else {
            DeviceApi.InternalOnErrorString("Can't access mediaDevices or enumerateDevices");
        }
    };
    DeviceApi.GetDeviceId = function (label) {
        var devs = DeviceApi.Devices;
        for (var key in devs) {
            var dev = devs[key];
            if (dev.label == label || dev.defaultLabel == label || dev.deviceId == label) {
                return dev.deviceId;
            }
        }
        return null;
    };
    DeviceApi.IsUserMediaAvailable = function () {
        if (navigator && navigator.mediaDevices)
            return true;
        return false;
    };
    DeviceApi.ToConstraints = function (config) {
        //ugly part starts -> call get user media data (no typescript support)
        //different browsers have different calls...
        //check  getSupportedConstraints()??? 
        //see https://w3c.github.io/mediacapture-main/getusermedia.html#constrainable-interface
        //set default ideal to very common low 320x240 to avoid overloading weak computers
        var constraints = {
            audio: config.Audio
        };
        var width = {};
        var height = {};
        var video = {};
        var fps = {};
        if (config.MinWidth != -1)
            width.min = config.MinWidth;
        if (config.MaxWidth != -1)
            width.max = config.MaxWidth;
        if (config.IdealWidth != -1)
            width.ideal = config.IdealWidth;
        if (config.MinHeight != -1)
            height.min = config.MinHeight;
        if (config.MaxHeight != -1)
            height.max = config.MaxHeight;
        if (config.IdealHeight != -1)
            height.ideal = config.IdealHeight;
        if (config.MinFps != -1)
            fps.min = config.MinFps;
        if (config.MaxFps != -1)
            fps.max = config.MaxFps;
        if (config.IdealFps != -1)
            fps.ideal = config.IdealFps;
        //user requested specific device? get it now to properly add it to the
        //constraints later
        var deviceId = null;
        if (config.Video && config.VideoDeviceName && config.VideoDeviceName !== "") {
            deviceId = DeviceApi.GetDeviceId(config.VideoDeviceName);
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("using device " + config.VideoDeviceName);
            if (deviceId === "") {
                //Workaround for Chrome 81: If no camera access is allowed chrome returns the deviceId ""
                //thus we can only request any video device. We can't select a specific one
                deviceId = null;
            }
            else if (deviceId !== null) {
                //all good
            }
            else {
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Failed to find deviceId for label " + config.VideoDeviceName);
                throw new Error("Unknown device " + config.VideoDeviceName);
            }
        }
        //watch out: unity changed behaviour and will now
        //give 0 / 1 instead of false/true
        //using === won't work
        if (config.Video == false) {
            //video is off
            video = false;
        }
        else {
            if (Object.keys(width).length > 0) {
                video.width = width;
            }
            if (Object.keys(height).length > 0) {
                video.height = height;
            }
            if (Object.keys(fps).length > 0) {
                video.frameRate = fps;
            }
            if (deviceId !== null) {
                video.deviceId = { "exact": deviceId };
            }
            //if we didn't add anything we need to set it to true
            //at least (I assume?)
            if (Object.keys(video).length == 0) {
                video = true;
            }
        }
        constraints.video = video;
        return constraints;
    };
    DeviceApi.getBrowserUserMedia = function (constraints) {
        return navigator.mediaDevices.getUserMedia(constraints);
    };
    DeviceApi.getAssetUserMedia = function (config) {
        return new Promise(function (resolve) {
            var res = DeviceApi.ToConstraints(config);
            resolve(res);
        }).then(function (constraints) {
            return DeviceApi.getBrowserUserMedia(constraints);
        });
    };
    DeviceApi.sLastUpdate = 0;
    DeviceApi.sIsPending = false;
    DeviceApi.sLastError = null;
    DeviceApi.sDeviceInfo = {};
    DeviceApi.sVideoDeviceCounter = 1;
    DeviceApi.sAccessStream = null;
    DeviceApi.sUpdateEvents = [];
    DeviceApi.InternalOnEnum = function (devices) {
        DeviceApi.sIsPending = false;
        DeviceApi.sLastUpdate = new Date().getTime();
        var newDeviceInfo = {};
        for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
            var info = devices_1[_i];
            if (info.kind != "videoinput")
                continue;
            var newInfo = new DeviceInfo();
            newInfo.deviceId = info.deviceId;
            var knownInfo = null;
            if (newInfo.deviceId in DeviceApi.Devices) {
                //known device. reuse the default label
                knownInfo = DeviceApi.Devices[newInfo.deviceId];
            }
            //check if we gave this device a default label already
            //this is used to identify it via a user readable name in case
            //we update multiple times with proper labels / default labels
            if (knownInfo != null) {
                newInfo.defaultLabel = knownInfo.defaultLabel;
            }
            else {
                newInfo.defaultLabel = info.kind + " " + DeviceApi.sVideoDeviceCounter;
                ;
                DeviceApi.sVideoDeviceCounter++;
            }
            //check if we know a proper label or got one this update
            if (knownInfo != null && knownInfo.isLabelGuessed == false) {
                //already have one
                newInfo.label = knownInfo.label;
                newInfo.isLabelGuessed = false;
            }
            else if (info.label) {
                //got a new one
                newInfo.label = info.label;
                newInfo.isLabelGuessed = false;
            }
            else {
                //no known label -> just use the default one
                newInfo.label = newInfo.defaultLabel;
                newInfo.isLabelGuessed = true;
            }
            newDeviceInfo[newInfo.deviceId] = newInfo;
        }
        DeviceApi.sDeviceInfo = newDeviceInfo;
        if (DeviceApi.sAccessStream) {
            var tracks = DeviceApi.sAccessStream.getTracks();
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].stop();
            }
            DeviceApi.sAccessStream = null;
        }
        DeviceApi.TriggerChangedEvent();
    };
    DeviceApi.InternalOnErrorCatch = function (err) {
        var txt = err.toString();
        DeviceApi.InternalOnErrorString(txt);
    };
    DeviceApi.InternalOnErrorString = function (err) {
        DeviceApi.sIsPending = false;
        DeviceApi.sLastError = err;
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(err);
        DeviceApi.TriggerChangedEvent();
    };
    DeviceApi.InternalOnStream = function (stream) {
        DeviceApi.sAccessStream = stream;
        DeviceApi.Update();
    };
    DeviceApi.ENUM_FAILED = "Can't access mediaDevices or enumerateDevices";
    return DeviceApi;
}());



/***/ }),

/***/ "./src/awrtc/media_browser/Media.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media_browser/Media.ts ***!
  \******************************************/
/*! exports provided: Media */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Media", function() { return Media; });
/* harmony import */ var _DeviceApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeviceApi */ "./src/awrtc/media_browser/DeviceApi.ts");
/* harmony import */ var _VideoInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VideoInput */ "./src/awrtc/media_browser/VideoInput.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var Media = /** @class */ (function () {
    function Media() {
        this.videoInput = null;
    }
    Object.defineProperty(Media, "SharedInstance", {
        /**
         * Singleton used for now as the browser version is missing a proper factory yet.
         * Might be removed later.
         */
        get: function () {
            return this.sSharedInstance;
        },
        enumerable: false,
        configurable: true
    });
    Media.ResetSharedInstance = function () {
        this.sSharedInstance = new Media();
    };
    Object.defineProperty(Media.prototype, "VideoInput", {
        get: function () {
            if (this.videoInput === null)
                this.videoInput = new _VideoInput__WEBPACK_IMPORTED_MODULE_1__["VideoInput"]();
            return this.videoInput;
        },
        enumerable: false,
        configurable: true
    });
    Media.prototype.GetVideoDevices = function () {
        var real_devices = _DeviceApi__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].GetVideoDevices();
        var virtual_devices = this.VideoInput.GetDeviceNames();
        return real_devices.concat(virtual_devices);
    };
    Media.IsNameSet = function (videoDeviceName) {
        if (videoDeviceName !== null && videoDeviceName !== "") {
            return true;
        }
        return false;
    };
    Media.prototype.getUserMedia = function (config) {
        var _this = this;
        if (config.Video && Media.IsNameSet(config.VideoDeviceName)
            && this.videoInput != null
            && this.videoInput.HasDevice(config.VideoDeviceName)) {
            var res = Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
                var stream, constraints, audio_stream;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stream = this.videoInput.GetStream(config.VideoDeviceName);
                            if (!config.Audio) return [3 /*break*/, 2];
                            constraints = {};
                            constraints.audio = true;
                            return [4 /*yield*/, _DeviceApi__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getBrowserUserMedia(constraints)];
                        case 1:
                            audio_stream = _a.sent();
                            stream.addTrack(audio_stream.getTracks()[0]);
                            _a.label = 2;
                        case 2: return [2 /*return*/, stream];
                    }
                });
            }); });
            return res;
        }
        return _DeviceApi__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getAssetUserMedia(config);
    };
    //experimental. Will be used instead of the device api to create streams 
    Media.sSharedInstance = new Media();
    return Media;
}());



/***/ }),

/***/ "./src/awrtc/media_browser/MediaPeer.ts":
/*!**********************************************!*\
  !*** ./src/awrtc/media_browser/MediaPeer.ts ***!
  \**********************************************/
/*! exports provided: MediaPeer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return MediaPeer; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var MediaPeer = /** @class */ (function (_super) {
    __extends(MediaPeer, _super);
    function MediaPeer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mRemoteStream = null;
        //quick workaround to allow html user to get the HTMLVideoElement once it is
        //created. Might be done via events later to make wrapping to unity/emscripten possible
        _this.InternalStreamAdded = null;
        return _this;
    }
    MediaPeer.prototype.OnSetup = function () {
        var _this = this;
        _super.prototype.OnSetup.call(this);
        //TODO: test in different browsers if boolean works now
        //this is unclear in the API. according to typescript they are boolean, in native code they are int
        //and some browser failed in the past if boolean was used ... 
        this.mOfferOptions = { "offerToReceiveAudio": true, "offerToReceiveVideo": true };
        if (MediaPeer.sUseObsolete) {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LW("Using obsolete onaddstream as not all browsers support ontrack");
            this.mPeer.onaddstream = function (streamEvent) { _this.OnAddStream(streamEvent); };
        }
        else {
            this.mPeer.ontrack = function (ev) { _this.OnTrack(ev); };
        }
    };
    MediaPeer.prototype.OnCleanup = function () {
        _super.prototype.OnCleanup.call(this);
        if (this.mRemoteStream != null) {
            this.mRemoteStream.Dispose();
            this.mRemoteStream = null;
        }
    };
    MediaPeer.prototype.OnAddStream = function (streamEvent) {
        this.SetupStream(streamEvent.stream);
    };
    MediaPeer.prototype.OnTrack = function (ev) {
        if (ev && ev.streams && ev.streams.length > 0) {
            //this is getting called twice if audio and video is active
            if (this.mRemoteStream == null)
                this.SetupStream(ev.streams[0]);
        }
        else {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Unexpected RTCTrackEvent: " + JSON.stringify(ev));
        }
    };
    MediaPeer.prototype.SetupStream = function (stream) {
        var _this = this;
        this.mRemoteStream = new _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_1__["BrowserMediaStream"](stream);
        //trigger events once the stream has its meta data available
        this.mRemoteStream.InternalStreamAdded = function (stream) {
            if (_this.InternalStreamAdded != null) {
                _this.InternalStreamAdded(_this, stream);
            }
        };
    };
    MediaPeer.prototype.TryGetRemoteFrame = function () {
        if (this.mRemoteStream == null)
            return null;
        return this.mRemoteStream.TryGetFrame();
    };
    MediaPeer.prototype.PeekFrame = function () {
        if (this.mRemoteStream == null)
            return null;
        return this.mRemoteStream.PeekFrame();
    };
    MediaPeer.prototype.AddLocalStream = function (stream) {
        if (MediaPeer.sUseObsolete) {
            this.mPeer.addStream(stream);
        }
        else {
            for (var _i = 0, _a = stream.getTracks(); _i < _a.length; _i++) {
                var v = _a[_i];
                this.mPeer.addTrack(v, stream);
            }
        }
    };
    MediaPeer.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.mRemoteStream != null) {
            this.mRemoteStream.Update();
        }
    };
    MediaPeer.prototype.SetVolume = function (volume) {
        if (this.mRemoteStream != null)
            this.mRemoteStream.SetVolume(volume);
    };
    MediaPeer.prototype.HasAudioTrack = function () {
        if (this.mRemoteStream != null)
            return this.mRemoteStream.HasAudioTrack();
        return false;
    };
    MediaPeer.prototype.HasVideoTrack = function () {
        if (this.mRemoteStream != null)
            return this.mRemoteStream.HasVideoTrack();
        return false;
    };
    //true - will use obsolete onstream / add stream
    //false - will use ontrack / addtrack (seems to work fine now even on chrome)
    MediaPeer.sUseObsolete = false;
    return MediaPeer;
}(_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"]));



/***/ }),

/***/ "./src/awrtc/media_browser/VideoInput.ts":
/*!***********************************************!*\
  !*** ./src/awrtc/media_browser/VideoInput.ts ***!
  \***********************************************/
/*! exports provided: VideoInput, VideoInputType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoInput", function() { return VideoInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoInputType", function() { return VideoInputType; });
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
var VideoInput = /** @class */ (function () {
    function VideoInput() {
        this.canvasDevices = {};
    }
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
    VideoInput.prototype.AddCanvasDevice = function (canvas, deviceName, width, height, fps) {
        var cdev = CanvasDevice.CreateExternal(canvas, fps);
        if (width != canvas.width || height != canvas.height) {
            //console.warn("testing scaling");
            cdev.initScaling(width, height);
        }
        this.canvasDevices[deviceName] = cdev;
    };
    /**For internal use.
     * Allows to check if the device already exists.
     *
     * @param dev
     */
    VideoInput.prototype.HasDevice = function (dev) {
        return dev in this.canvasDevices;
    };
    /**For internal use.
     * Lists all registered devices.
     *
     */
    VideoInput.prototype.GetDeviceNames = function () {
        return Object.keys(this.canvasDevices);
    };
    /**For internal use.
     * Returns a MediaStream for the given device.
     *
     * @param dev
     */
    VideoInput.prototype.GetStream = function (dev) {
        if (this.HasDevice(dev)) {
            var device = this.canvasDevices[dev];
            //watch out: This can trigger an exception if getContext has never been called before.
            //There doesn't seem to way to detect this beforehand though
            var stream = device.captureStream();
            return stream;
        }
        return null;
    };
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
    VideoInput.prototype.AddDevice = function (name, width, height, fps) {
        var cdev = CanvasDevice.CreateInternal(width, height, fps);
        this.canvasDevices[name] = cdev;
    };
    VideoInput.prototype.RemCanvasDevice = function (deviceName) {
        var cdev = this.canvasDevices[deviceName];
        if (cdev) {
            delete this.canvasDevices[deviceName];
        }
    };
    //C# API: public void RemoveDevice(string name);
    VideoInput.prototype.RemoveDevice = function (name) {
        this.RemCanvasDevice(name);
    };
    /**
     * Use UpdateFrame with name only to trigger a new frame without changing the content (e.g. if AddCanvasDevice was used to add the device and it needs scaling)
     * Use UpdateFrame with image data if you added the device via AddDevice and want to updat its content
     *
     *
     *
     * @param name name of the device
     * @param dataPtr array to the image data
     * @param width must be the exact width of the image in dataPtr
     * @param height must be the exact height of the image in dataPtr
     * @param type must be ARGB at the moment
     * @param rotation not yet supported
     * @param firstRowIsBottom not yet supported
     */
    VideoInput.prototype.UpdateFrame = function (name, dataPtr, width, height, type, rotation, firstRowIsBottom) {
        if (type === void 0) { type = VideoInputType.ARGB; }
        if (rotation === void 0) { rotation = 0; }
        if (firstRowIsBottom === void 0) { firstRowIsBottom = true; }
        if (this.HasDevice(name)) {
            var device = this.canvasDevices[name];
            if (device.IsExternal() || dataPtr == null) {
                //can't change external images / no data available. just generate a new frame without new data 
                device.UpdateFrame();
            }
            else {
                var data = new ImageData(dataPtr, width, height);
                device.UpdateFrame(data);
            }
            return true;
        }
        return false;
    };
    return VideoInput;
}());

/**Wraps around a canvas object to use as a source for MediaStream.
 * It supports streaming via a second canvas that is used to scale the image
 * before streaming. For scaling UpdateFrame needs to be called one a frame.
 * Without scaling the browser will detect changes in the original canvas
 * and automatically update the stream
 *
 */
var CanvasDevice = /** @class */ (function () {
    function CanvasDevice(c, external_canvas, fps) {
        /**false = we own the canvas and can change its settings e.g. via VideoInput
         * true = externally used canvas. Can't change width / height or any other settings
         */
        this.external_canvas = false;
        /**Canvas element to handle scaling.
         * Remains null if initScaling is never called and width / height is expected to
         * fit the canvas.
         *
         */
        this.scaling_canvas = null;
        //private scaling_interval = -1;
        this.is_capturing = false;
        this.canvas = c;
        this.external_canvas = external_canvas;
        this.fps = fps;
    }
    CanvasDevice.prototype.getStreamingCanvas = function () {
        if (this.scaling_canvas == null)
            return this.canvas;
        return this.scaling_canvas;
    };
    CanvasDevice.prototype.captureStream = function () {
        if (this.is_capturing == false && this.scaling_canvas) {
            //scaling is active. 
            this.startScaling();
        }
        this.is_capturing = true;
        if (this.fps && this.fps > 0) {
            return this.getStreamingCanvas().captureStream(this.fps);
        }
        return this.getStreamingCanvas().captureStream();
    };
    CanvasDevice.CreateInternal = function (width, height, fps) {
        var c = CanvasDevice.MakeCanvas(width, height);
        return new CanvasDevice(c, false, fps);
    };
    CanvasDevice.CreateExternal = function (c, fps) {
        return new CanvasDevice(c, true, fps);
    };
    /**Adds scaling support to this canvas device.
     *
     * @param width
     * @param height
     */
    CanvasDevice.prototype.initScaling = function (width, height) {
        this.scaling_canvas = document.createElement("canvas");
        this.scaling_canvas.width = width;
        this.scaling_canvas.height = height;
        this.scaling_canvas.getContext("2d");
    };
    /**Used to update the frame data if the canvas is managed internally.
     * Use without image data to just trigger the scaling / generation of a new frame if the canvas is drawn to externally.
     *
     * If the canvas is managed externally and scaling is not required this method won't do anything. A new frame is instead
     * generated automatically based on the browser & canvas drawing operations.
     */
    CanvasDevice.prototype.UpdateFrame = function (data) {
        if (data) {
            var ctx = this.canvas.getContext("2d");
            //TODO: This doesn't seem to support scaling out of the box
            //we might need to combien this with the scaling system as well
            //in case users deliver different resolutions than the device is setup for
            ctx.putImageData(data, 0, 0);
        }
        this.scaleNow();
    };
    /**Called the first time we need the scaled image to ensure
     * the buffers are all filled.
     */
    CanvasDevice.prototype.startScaling = function () {
        this.scaleNow();
    };
    CanvasDevice.prototype.scaleNow = function () {
        if (this.scaling_canvas != null) {
            var ctx = this.scaling_canvas.getContext("2d");
            //ctx.fillStyle = "#FF0000";
            //ctx.fillRect(0, 0, this.scaling_canvas.width, this.scaling_canvas.height);
            //ctx.clearRect(0, 0, this.scaling_canvas.width, this.scaling_canvas.height)
            ctx.drawImage(this.canvas, 0, 0, this.scaling_canvas.width, this.scaling_canvas.height);
        }
    };
    CanvasDevice.prototype.IsExternal = function () {
        return this.external_canvas;
    };
    CanvasDevice.MakeCanvas = function (width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        //make red for debugging purposes
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    };
    return CanvasDevice;
}());
/** Only one format supported by browsers so far.
 *  Maybe more can be added in the future.
 */
var VideoInputType;
(function (VideoInputType) {
    VideoInputType[VideoInputType["ARGB"] = 0] = "ARGB";
})(VideoInputType || (VideoInputType = {}));


/***/ }),

/***/ "./src/awrtc/media_browser/index.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media_browser/index.ts ***!
  \******************************************/
/*! exports provided: BrowserMediaNetwork, BrowserWebRtcCall, BrowserMediaStream, MediaPeer, DeviceInfo, DeviceApi, VideoInput, VideoInputType, Media */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BrowserMediaNetwork */ "./src/awrtc/media_browser/BrowserMediaNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaNetwork"]; });

/* harmony import */ var _BrowserWebRtcCall__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserWebRtcCall */ "./src/awrtc/media_browser/BrowserWebRtcCall.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return _BrowserWebRtcCall__WEBPACK_IMPORTED_MODULE_1__["BrowserWebRtcCall"]; });

/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"]; });

/* harmony import */ var _MediaPeer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaPeer */ "./src/awrtc/media_browser/MediaPeer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return _MediaPeer__WEBPACK_IMPORTED_MODULE_3__["MediaPeer"]; });

/* harmony import */ var _DeviceApi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DeviceApi */ "./src/awrtc/media_browser/DeviceApi.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return _DeviceApi__WEBPACK_IMPORTED_MODULE_4__["DeviceInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return _DeviceApi__WEBPACK_IMPORTED_MODULE_4__["DeviceApi"]; });

/* harmony import */ var _VideoInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./VideoInput */ "./src/awrtc/media_browser/VideoInput.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoInput", function() { return _VideoInput__WEBPACK_IMPORTED_MODULE_5__["VideoInput"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoInputType", function() { return _VideoInput__WEBPACK_IMPORTED_MODULE_5__["VideoInputType"]; });

/* harmony import */ var _Media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Media */ "./src/awrtc/media_browser/Media.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Media", function() { return _Media__WEBPACK_IMPORTED_MODULE_6__["Media"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/









/***/ }),

/***/ "./src/awrtc/network/Helper.ts":
/*!*************************************!*\
  !*** ./src/awrtc/network/Helper.ts ***!
  \*************************************/
/*! exports provided: Queue, List, Output, Debug, Encoder, UTF16Encoding, Encoding, Random, Helper, SLogLevel, SLog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return Queue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return Output; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return Debug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return Encoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return UTF16Encoding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return Encoding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return Random; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return Helper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return SLogLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return SLog; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**Contains some helper classes to keep the typescript implementation
 * similar to the C# implementation.
 *
 */
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Queue = /** @class */ (function () {
    function Queue() {
        this.mArr = new Array();
    }
    Queue.prototype.Enqueue = function (val) {
        this.mArr.push(val);
    };
    Queue.prototype.TryDequeue = function (outp) {
        var res = false;
        if (this.mArr.length > 0) {
            outp.val = this.mArr.shift();
            res = true;
        }
        return res;
    };
    Queue.prototype.Dequeue = function () {
        if (this.mArr.length > 0) {
            return this.mArr.shift();
        }
        else {
            return null;
        }
    };
    Queue.prototype.Peek = function () {
        if (this.mArr.length > 0) {
            return this.mArr[0];
        }
        else {
            return null;
        }
    };
    Queue.prototype.Count = function () {
        return this.mArr.length;
    };
    Queue.prototype.Clear = function () {
        this.mArr = new Array();
    };
    return Queue;
}());

var List = /** @class */ (function () {
    function List() {
        this.mArr = new Array();
    }
    Object.defineProperty(List.prototype, "Internal", {
        get: function () {
            return this.mArr;
        },
        enumerable: false,
        configurable: true
    });
    List.prototype.Add = function (val) {
        this.mArr.push(val);
    };
    Object.defineProperty(List.prototype, "Count", {
        get: function () {
            return this.mArr.length;
        },
        enumerable: false,
        configurable: true
    });
    return List;
}());

var Output = /** @class */ (function () {
    function Output() {
    }
    return Output;
}());

var Debug = /** @class */ (function () {
    function Debug() {
    }
    Debug.Log = function (s) {
        SLog.Log(s);
    };
    Debug.LogError = function (s) {
        SLog.LogError(s);
    };
    Debug.LogWarning = function (s) {
        SLog.LogWarning(s);
    };
    return Debug;
}());

var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    return Encoder;
}());

var UTF16Encoding = /** @class */ (function (_super) {
    __extends(UTF16Encoding, _super);
    function UTF16Encoding() {
        return _super.call(this) || this;
    }
    UTF16Encoding.prototype.GetBytes = function (text) {
        return this.stringToBuffer(text);
    };
    UTF16Encoding.prototype.GetString = function (buffer) {
        return this.bufferToString(buffer);
    };
    UTF16Encoding.prototype.bufferToString = function (buffer) {
        var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
        return String.fromCharCode.apply(null, arr);
    };
    UTF16Encoding.prototype.stringToBuffer = function (str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        var result = new Uint8Array(buf);
        return result;
    };
    return UTF16Encoding;
}(Encoder));

var Encoding = /** @class */ (function () {
    function Encoding() {
    }
    Object.defineProperty(Encoding, "UTF16", {
        get: function () {
            return new UTF16Encoding();
        },
        enumerable: false,
        configurable: true
    });
    return Encoding;
}());

var Random = /** @class */ (function () {
    function Random() {
    }
    Random.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    return Random;
}());

var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.tryParseInt = function (value) {
        try {
            if (/^(\-|\+)?([0-9]+)$/.test(value)) {
                var result = Number(value);
                if (isNaN(result) == false)
                    return result;
            }
        }
        catch (e) {
        }
        return null;
    };
    return Helper;
}());

var SLogLevel;
(function (SLogLevel) {
    SLogLevel[SLogLevel["None"] = 0] = "None";
    SLogLevel[SLogLevel["Errors"] = 1] = "Errors";
    SLogLevel[SLogLevel["Warnings"] = 2] = "Warnings";
    SLogLevel[SLogLevel["Info"] = 3] = "Info";
})(SLogLevel || (SLogLevel = {}));
//Simplified logger
var SLog = /** @class */ (function () {
    function SLog() {
    }
    SLog.SetLogLevel = function (level) {
        SLog.sLogLevel = level;
    };
    SLog.RequestLogLevel = function (level) {
        if (level > SLog.sLogLevel)
            SLog.sLogLevel = level;
    };
    SLog.L = function (msg, tag) {
        SLog.Log(msg, tag);
    };
    SLog.LW = function (msg, tag) {
        SLog.LogWarning(msg, tag);
    };
    SLog.LE = function (msg, tag) {
        SLog.LogError(msg, tag);
    };
    SLog.Log = function (msg, tag) {
        if (SLog.sLogLevel >= SLogLevel.Info) {
            if (tag) {
                console.log(msg, tag);
            }
            else {
                console.log(msg);
            }
        }
    };
    SLog.LogWarning = function (msg, tag) {
        if (!tag)
            tag = "";
        if (SLog.sLogLevel >= SLogLevel.Warnings) {
            if (tag) {
                console.warn(msg, tag);
            }
            else {
                console.warn(msg);
            }
        }
    };
    SLog.LogError = function (msg, tag) {
        if (SLog.sLogLevel >= SLogLevel.Errors) {
            if (tag) {
                console.error(msg, tag);
            }
            else {
                console.error(msg);
            }
        }
    };
    SLog.sLogLevel = SLogLevel.Warnings;
    return SLog;
}());



/***/ }),

/***/ "./src/awrtc/network/INetwork.ts":
/*!***************************************!*\
  !*** ./src/awrtc/network/INetwork.ts ***!
  \***************************************/
/*! exports provided: NetEventType, NetEventDataType, NetworkEvent, ConnectionId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return NetEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return NetEventDataType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return NetworkEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return ConnectionId; });
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/** Abstract interfaces and serialization to keep different
 * versions compatible to each other.
 *
 * Watch out before changing anything in this file. Content is reused
 * between webclient, signaling server and needs to remain compatible to
 * the C# implementation.
 */

var NetEventType;
(function (NetEventType) {
    NetEventType[NetEventType["Invalid"] = 0] = "Invalid";
    NetEventType[NetEventType["UnreliableMessageReceived"] = 1] = "UnreliableMessageReceived";
    NetEventType[NetEventType["ReliableMessageReceived"] = 2] = "ReliableMessageReceived";
    NetEventType[NetEventType["ServerInitialized"] = 3] = "ServerInitialized";
    NetEventType[NetEventType["ServerInitFailed"] = 4] = "ServerInitFailed";
    NetEventType[NetEventType["ServerClosed"] = 5] = "ServerClosed";
    NetEventType[NetEventType["NewConnection"] = 6] = "NewConnection";
    NetEventType[NetEventType["ConnectionFailed"] = 7] = "ConnectionFailed";
    NetEventType[NetEventType["Disconnected"] = 8] = "Disconnected";
    NetEventType[NetEventType["FatalError"] = 100] = "FatalError";
    NetEventType[NetEventType["Warning"] = 101] = "Warning";
    NetEventType[NetEventType["Log"] = 102] = "Log";
    /// <summary>
    /// This value and higher are reserved for other uses. 
    /// Should never get to the user and should be filtered out.
    /// </summary>
    NetEventType[NetEventType["ReservedStart"] = 200] = "ReservedStart";
    /// <summary>
    /// Reserved.
    /// Used by protocols that forward NetworkEvents
    /// </summary>
    NetEventType[NetEventType["MetaVersion"] = 201] = "MetaVersion";
    /// <summary>
    /// Reserved.
    /// Used by protocols that forward NetworkEvents.
    /// </summary>
    NetEventType[NetEventType["MetaHeartbeat"] = 202] = "MetaHeartbeat";
})(NetEventType || (NetEventType = {}));
var NetEventDataType;
(function (NetEventDataType) {
    NetEventDataType[NetEventDataType["Null"] = 0] = "Null";
    NetEventDataType[NetEventDataType["ByteArray"] = 1] = "ByteArray";
    NetEventDataType[NetEventDataType["UTF16String"] = 2] = "UTF16String";
})(NetEventDataType || (NetEventDataType = {}));
var NetworkEvent = /** @class */ (function () {
    function NetworkEvent(t, conId, data) {
        this.type = t;
        this.connectionId = conId;
        this.data = data;
    }
    Object.defineProperty(NetworkEvent.prototype, "RawData", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "MessageData", {
        get: function () {
            if (typeof this.data != "string")
                return this.data;
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "Info", {
        get: function () {
            if (typeof this.data == "string")
                return this.data;
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "Type", {
        get: function () {
            return this.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "ConnectionId", {
        get: function () {
            return this.connectionId;
        },
        enumerable: false,
        configurable: true
    });
    //for debugging only
    NetworkEvent.prototype.toString = function () {
        var output = "NetworkEvent[";
        output += "NetEventType: (";
        output += NetEventType[this.type];
        output += "), id: (";
        output += this.connectionId.id;
        output += "), Data: (";
        if (typeof this.data == "string") {
            output += this.data;
        }
        output += ")]";
        return output;
    };
    NetworkEvent.parseFromString = function (str) {
        var values = JSON.parse(str);
        var data;
        if (values.data == null) {
            data = null;
        }
        else if (typeof values.data == "string") {
            data = values.data;
        }
        else if (typeof values.data == "object") {
            //json represents the array as an object containing each index and the
            //value as string number ... improve that later
            var arrayAsObject = values.data;
            var length = 0;
            for (var prop in arrayAsObject) {
                //if (arrayAsObject.hasOwnProperty(prop)) { //shouldnt be needed
                length++;
                //}
            }
            var buffer = new Uint8Array(Object.keys(arrayAsObject).length);
            for (var i = 0; i < buffer.length; i++)
                buffer[i] = arrayAsObject[i];
            data = buffer;
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("network event can't be parsed: " + str);
        }
        var evt = new NetworkEvent(values.type, values.connectionId, data);
        return evt;
    };
    NetworkEvent.toString = function (evt) {
        return JSON.stringify(evt);
    };
    NetworkEvent.fromByteArray = function (arrin) {
        //old node js versions seem to not return proper Uint8Arrays but
        //buffers -> make sure it is a Uint8Array
        var arr = new Uint8Array(arrin);
        var type = arr[0]; //byte
        var dataType = arr[1]; //byte
        var id = new Int16Array(arr.buffer, arr.byteOffset + 2, 1)[0]; //short
        var data = null;
        if (dataType == NetEventDataType.ByteArray) {
            var length_1 = new Uint32Array(arr.buffer, arr.byteOffset + 4, 1)[0]; //uint
            var byteArray = new Uint8Array(arr.buffer, arr.byteOffset + 8, length_1);
            data = byteArray;
        }
        else if (dataType == NetEventDataType.UTF16String) {
            var length_2 = new Uint32Array(arr.buffer, arr.byteOffset + 4, 1)[0]; //uint
            var uint16Arr = new Uint16Array(arr.buffer, arr.byteOffset + 8, length_2);
            var str = "";
            for (var i = 0; i < uint16Arr.length; i++) {
                str += String.fromCharCode(uint16Arr[i]);
            }
            data = str;
        }
        else if (dataType == NetEventDataType.Null) {
            //message has no data
        }
        else {
            throw new Error('Message has an invalid data type flag: ' + dataType);
        }
        var conId = new ConnectionId(id);
        var result = new NetworkEvent(type, conId, data);
        return result;
    };
    NetworkEvent.toByteArray = function (evt) {
        var dataType;
        var length = 4; //4 bytes are always needed
        //getting type and length
        if (evt.data == null) {
            dataType = NetEventDataType.Null;
        }
        else if (typeof evt.data == "string") {
            dataType = NetEventDataType.UTF16String;
            var str = evt.data;
            length += str.length * 2 + 4;
        }
        else {
            dataType = NetEventDataType.ByteArray;
            var byteArray = evt.data;
            length += 4 + byteArray.length;
        }
        //creating the byte array
        var result = new Uint8Array(length);
        result[0] = evt.type;
        ;
        result[1] = dataType;
        var conIdField = new Int16Array(result.buffer, result.byteOffset + 2, 1);
        conIdField[0] = evt.connectionId.id;
        if (dataType == NetEventDataType.ByteArray) {
            var byteArray = evt.data;
            var lengthField = new Uint32Array(result.buffer, result.byteOffset + 4, 1);
            lengthField[0] = byteArray.length;
            for (var i = 0; i < byteArray.length; i++) {
                result[8 + i] = byteArray[i];
            }
        }
        else if (dataType == NetEventDataType.UTF16String) {
            var str = evt.data;
            var lengthField = new Uint32Array(result.buffer, result.byteOffset + 4, 1);
            lengthField[0] = str.length;
            var dataField = new Uint16Array(result.buffer, result.byteOffset + 8, str.length);
            for (var i = 0; i < dataField.length; i++) {
                dataField[i] = str.charCodeAt(i);
            }
        }
        return result;
    };
    return NetworkEvent;
}());

var ConnectionId = /** @class */ (function () {
    function ConnectionId(nid) {
        this.id = nid;
    }
    ConnectionId.INVALID = new ConnectionId(-1);
    return ConnectionId;
}());

//export {NetEventType, NetworkEvent, ConnectionId, INetwork, IBasicNetwork};


/***/ }),

/***/ "./src/awrtc/network/LocalNetwork.ts":
/*!*******************************************!*\
  !*** ./src/awrtc/network/LocalNetwork.ts ***!
  \*******************************************/
/*! exports provided: LocalNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return LocalNetwork; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**Helper to simulate the WebsocketNetwork or WebRtcNetwork
 * within a local application without
 * any actual network components.
 *
 * This implementation might lack some features.
 */
var LocalNetwork = /** @class */ (function () {
    function LocalNetwork() {
        this.mNextNetworkId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        this.mServerAddress = null;
        this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mConnectionNetwork = {};
        this.mIsDisposed = false;
        this.mId = LocalNetwork.sNextId;
        LocalNetwork.sNextId++;
    }
    Object.defineProperty(LocalNetwork.prototype, "IsServer", {
        get: function () {
            return this.mServerAddress != null;
        },
        enumerable: false,
        configurable: true
    });
    LocalNetwork.prototype.StartServer = function (serverAddress) {
        if (serverAddress === void 0) { serverAddress = null; }
        if (serverAddress == null)
            serverAddress = "" + this.mId;
        if (serverAddress in LocalNetwork.mServers) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, serverAddress);
            return;
        }
        LocalNetwork.mServers[serverAddress] = this;
        this.mServerAddress = serverAddress;
        this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, serverAddress);
    };
    LocalNetwork.prototype.StopServer = function () {
        if (this.IsServer) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, this.mServerAddress);
            delete LocalNetwork.mServers[this.mServerAddress];
            this.mServerAddress = null;
        }
    };
    LocalNetwork.prototype.Connect = function (address) {
        var connectionId = this.NextConnectionId();
        var sucessful = false;
        if (address in LocalNetwork.mServers) {
            var server = LocalNetwork.mServers[address];
            if (server != null) {
                server.ConnectClient(this);
                //add the server as local connection
                this.mConnectionNetwork[connectionId.id] = LocalNetwork.mServers[address];
                this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, connectionId, null);
                sucessful = true;
            }
        }
        if (sucessful == false) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed, connectionId, "Couldn't connect to the given server with id " + address);
        }
        return connectionId;
    };
    LocalNetwork.prototype.Shutdown = function () {
        for (var id in this.mConnectionNetwork) //can be changed while looping?
         {
            this.Disconnect(new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+id));
        }
        //this.mConnectionNetwork.Clear();
        this.StopServer();
    };
    LocalNetwork.prototype.Dispose = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
        }
    };
    LocalNetwork.prototype.SendData = function (userId, data, reliable) {
        if (userId.id in this.mConnectionNetwork) {
            var net = this.mConnectionNetwork[userId.id];
            net.ReceiveData(this, data, reliable);
            return true;
        }
        return false;
    };
    LocalNetwork.prototype.Update = function () {
        //work around for the GarbageCollection bug
        //usually weak references are removed during garbage collection but that
        //fails sometimes as others weak references get null to even though
        //the objects still exist!
        this.CleanupWreakReferences();
    };
    LocalNetwork.prototype.Dequeue = function () {
        return this.mEvents.Dequeue();
    };
    LocalNetwork.prototype.Peek = function () {
        return this.mEvents.Peek();
    };
    LocalNetwork.prototype.Flush = function () {
    };
    LocalNetwork.prototype.Disconnect = function (id) {
        if (id.id in this.mConnectionNetwork) {
            var other = this.mConnectionNetwork[id.id];
            if (other != null) {
                other.InternalDisconnectNetwork(this);
                this.InternalDisconnect(id);
            }
            else {
                //this is suppose to never happen but it does
                //if a server is destroyed by the garbage collector the client
                //weak reference appears to be NULL even though it still exists
                //bug?
                this.CleanupWreakReferences();
            }
        }
    };
    LocalNetwork.prototype.FindConnectionId = function (network) {
        for (var kvp in this.mConnectionNetwork) {
            var network_1 = this.mConnectionNetwork[kvp];
            if (network_1 != null) {
                return new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+kvp);
            }
        }
        return _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
    };
    LocalNetwork.prototype.NextConnectionId = function () {
        var res = this.mNextNetworkId;
        this.mNextNetworkId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](res.id + 1);
        return res;
    };
    LocalNetwork.prototype.ConnectClient = function (client) {
        //if (this.IsServer == false)
        //    throw new InvalidOperationException();
        var nextId = this.NextConnectionId();
        //server side only
        this.mConnectionNetwork[nextId.id] = client;
        this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, nextId, null);
    };
    LocalNetwork.prototype.Enqueue = function (type, id, data) {
        var ev = new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](type, id, data);
        this.mEvents.Enqueue(ev);
    };
    LocalNetwork.prototype.ReceiveData = function (network, data, reliable) {
        var userId = this.FindConnectionId(network);
        var buffer = new Uint8Array(data.length);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = data[i];
        }
        var type = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived;
        if (reliable)
            type = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived;
        this.Enqueue(type, userId, buffer);
    };
    LocalNetwork.prototype.InternalDisconnect = function (id) {
        if (id.id in this.mConnectionNetwork) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
            delete this.mConnectionNetwork[id.id];
        }
    };
    LocalNetwork.prototype.InternalDisconnectNetwork = function (ln) {
        //if it can't be found it will return invalid which is ignored in internal disconnect
        this.InternalDisconnect(this.FindConnectionId(ln));
    };
    LocalNetwork.prototype.CleanupWreakReferences = function () {
        //foreach(var kvp in mConnectionNetwork.Keys.ToList())
        //{
        //    var val = mConnectionNetwork[kvp];
        //    if (val.Get() == null) {
        //        InternalDisconnect(kvp);
        //    }
        //}
    };
    LocalNetwork.sNextId = 1;
    LocalNetwork.mServers = {};
    return LocalNetwork;
}());



/***/ }),

/***/ "./src/awrtc/network/WebRtcNetwork.ts":
/*!********************************************!*\
  !*** ./src/awrtc/network/WebRtcNetwork.ts ***!
  \********************************************/
/*! exports provided: WebRtcNetworkServerState, WebRtcNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return WebRtcNetworkServerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return WebRtcNetwork; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//import {ConnectionId, NetworkEvent, NetEventType, IBasicNetwork} from './INetwork'


var WebRtcNetworkServerState;
(function (WebRtcNetworkServerState) {
    WebRtcNetworkServerState[WebRtcNetworkServerState["Invalid"] = 0] = "Invalid";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Offline"] = 1] = "Offline";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Starting"] = 2] = "Starting";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Online"] = 3] = "Online";
})(WebRtcNetworkServerState || (WebRtcNetworkServerState = {}));
/// <summary>
/// Native version of WebRtc
/// 
/// Make sure to use Shutdown before unity quits! (unity will probably get stuck without it)
/// 
/// 
/// </summary>
var WebRtcNetwork = /** @class */ (function () {
    //public
    function WebRtcNetwork(signalingConfig, lRtcConfig) {
        this.mTimeout = 60000;
        this.mInSignaling = {};
        this.mNextId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        this.mSignaling = null;
        this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mIdToConnection = {};
        //must be the same as the hashmap and later returned read only (avoids copies)
        this.mConnectionIds = new Array();
        this.mServerState = WebRtcNetworkServerState.Offline;
        this.mIsDisposed = false;
        this.mSignaling = signalingConfig;
        this.mSignalingNetwork = this.mSignaling.GetNetwork();
        this.mRtcConfig = lRtcConfig;
    }
    Object.defineProperty(WebRtcNetwork.prototype, "IdToConnection", {
        get: function () {
            return this.mIdToConnection;
        },
        enumerable: false,
        configurable: true
    });
    //only for internal use
    WebRtcNetwork.prototype.GetConnections = function () {
        return this.mConnectionIds;
    };
    //just for debugging / testing
    WebRtcNetwork.prototype.SetLog = function (logDel) {
        this.mLogDelegate = logDel;
    };
    WebRtcNetwork.prototype.StartServer = function (address) {
        this.StartServerInternal(address);
    };
    WebRtcNetwork.prototype.StartServerInternal = function (address) {
        this.mServerState = WebRtcNetworkServerState.Starting;
        this.mSignalingNetwork.StartServer(address);
    };
    WebRtcNetwork.prototype.StopServer = function () {
        if (this.mServerState == WebRtcNetworkServerState.Starting) {
            this.mSignalingNetwork.StopServer();
            //removed. the underlaying sygnaling network should set those values
            //this.mServerState = WebRtcNetworkServerState.Offline;
            //this.mEvents.Enqueue(new NetworkEvent(NetEventType.ServerInitFailed, ConnectionId.INVALID, null));
        }
        else if (this.mServerState == WebRtcNetworkServerState.Online) {
            //dont wait for confirmation
            this.mSignalingNetwork.StopServer();
            //removed. the underlaying sygnaling network should set those values
            //this.mServerState = WebRtcNetworkServerState.Offline;
            //this.mEvents.Enqueue(new NetworkEvent(NetEventType.ServerClosed, ConnectionId.INVALID, null));
        }
    };
    WebRtcNetwork.prototype.Connect = function (address) {
        return this.AddOutgoingConnection(address);
    };
    WebRtcNetwork.prototype.Update = function () {
        this.CheckSignalingState();
        this.UpdateSignalingNetwork();
        this.UpdatePeers();
    };
    WebRtcNetwork.prototype.Dequeue = function () {
        if (this.mEvents.Count() > 0)
            return this.mEvents.Dequeue();
        return null;
    };
    WebRtcNetwork.prototype.Peek = function () {
        if (this.mEvents.Count() > 0)
            return this.mEvents.Peek();
        return null;
    };
    WebRtcNetwork.prototype.Flush = function () {
        this.mSignalingNetwork.Flush();
    };
    WebRtcNetwork.prototype.SendData = function (id, data /*, offset : number, length : number*/, reliable) {
        if (id == null || data == null || data.length == 0)
            return;
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            return peer.SendData(data, /* offset, length,*/ reliable);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("unknown connection id");
            return false;
        }
    };
    WebRtcNetwork.prototype.GetBufferedAmount = function (id, reliable) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            return peer.GetBufferedAmount(reliable);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("unknown connection id");
            return -1;
        }
    };
    WebRtcNetwork.prototype.Disconnect = function (id) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            this.HandleDisconnect(id);
        }
    };
    WebRtcNetwork.prototype.Shutdown = function () {
        //bugfix. Make copy before the loop as Disconnect changes the original mConnectionIds array
        var ids = this.mConnectionIds.slice();
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            this.Disconnect(id);
        }
        this.StopServer();
        this.mSignalingNetwork.Shutdown();
    };
    WebRtcNetwork.prototype.DisposeInternal = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
            this.mIsDisposed = true;
        }
    };
    WebRtcNetwork.prototype.Dispose = function () {
        this.DisposeInternal();
    };
    //protected
    WebRtcNetwork.prototype.CreatePeer = function (peerId, rtcConfig) {
        var peer = new _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"](peerId, rtcConfig);
        return peer;
    };
    //private
    WebRtcNetwork.prototype.CheckSignalingState = function () {
        var connected = new Array();
        var failed = new Array();
        //update the signaling channels
        for (var key in this.mInSignaling) {
            var peer = this.mInSignaling[key];
            peer.Update();
            var timeAlive = peer.SignalingInfo.GetCreationTimeMs();
            var msg = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]();
            while (peer.DequeueSignalingMessage(msg)) {
                var buffer = this.StringToBuffer(msg.val);
                this.mSignalingNetwork.SendData(new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+key), buffer, true);
            }
            if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].Connected) {
                connected.push(peer.SignalingInfo.ConnectionId);
            }
            else if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].SignalingFailed || timeAlive > this.mTimeout) {
                failed.push(peer.SignalingInfo.ConnectionId);
            }
        }
        for (var _i = 0, connected_1 = connected; _i < connected_1.length; _i++) {
            var v = connected_1[_i];
            this.ConnectionEstablished(v);
        }
        for (var _a = 0, failed_1 = failed; _a < failed_1.length; _a++) {
            var v = failed_1[_a];
            this.SignalingFailed(v);
        }
    };
    WebRtcNetwork.prototype.UpdateSignalingNetwork = function () {
        //update the signaling system
        this.mSignalingNetwork.Update();
        var evt;
        while ((evt = this.mSignalingNetwork.Dequeue()) != null) {
            if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
                this.mServerState = WebRtcNetworkServerState.Online;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed) {
                this.mServerState = WebRtcNetworkServerState.Offline;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed) {
                this.mServerState = WebRtcNetworkServerState.Offline;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection) {
                //check if new incoming connection or an outgoing was established
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    peer.StartSignaling();
                }
                else {
                    this.AddIncomingConnection(evt.ConnectionId);
                }
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed) {
                //Outgoing connection failed
                this.SignalingFailed(evt.ConnectionId);
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected) {
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    peer.SignalingInfo.SignalingDisconnected();
                }
                //if signaling was completed this isn't a problem
                //SignalingDisconnected(evt.ConnectionId);
                //do nothing. either webrtc has enough information to connect already
                //or it will wait forever for the information -> after 30 sec we give up
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived) {
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    var msg = this.BufferToString(evt.MessageData);
                    peer.AddSignalingMessage(msg);
                }
                else {
                    _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("Signaling message from unknown connection received");
                }
            }
        }
    };
    WebRtcNetwork.prototype.UpdatePeers = function () {
        //every peer has a queue storing incoming messages to avoid multi threading problems -> handle it now
        var disconnected = new Array();
        for (var key in this.mIdToConnection) {
            var peer = this.mIdToConnection[key];
            peer.Update();
            var ev = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]();
            while (peer.DequeueEvent(/*out*/ ev)) {
                this.mEvents.Enqueue(ev.val);
            }
            if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].Closed) {
                disconnected.push(peer.ConnectionId);
            }
        }
        for (var _i = 0, disconnected_1 = disconnected; _i < disconnected_1.length; _i++) {
            var key_1 = disconnected_1[_i];
            this.HandleDisconnect(key_1);
        }
    };
    WebRtcNetwork.prototype.AddOutgoingConnection = function (address) {
        var signalingConId = this.mSignalingNetwork.Connect(address);
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("new outgoing connection");
        var info = new _index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"](signalingConId, false, Date.now());
        var peer = this.CreatePeer(this.NextConnectionId(), this.mRtcConfig);
        peer.SetSignalingInfo(info);
        this.mInSignaling[signalingConId.id] = peer;
        return peer.ConnectionId;
    };
    WebRtcNetwork.prototype.AddIncomingConnection = function (signalingConId) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("new incoming connection");
        var info = new _index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"](signalingConId, true, Date.now());
        var peer = this.CreatePeer(this.NextConnectionId(), this.mRtcConfig);
        peer.SetSignalingInfo(info);
        this.mInSignaling[signalingConId.id] = peer;
        //passive way of starting signaling -> send out random number. if the other one does the same
        //the one with the highest number starts signaling
        peer.NegotiateSignaling();
        return peer.ConnectionId;
    };
    WebRtcNetwork.prototype.ConnectionEstablished = function (signalingConId) {
        var peer = this.mInSignaling[signalingConId.id];
        delete this.mInSignaling[signalingConId.id];
        this.mSignalingNetwork.Disconnect(signalingConId);
        this.mConnectionIds.push(peer.ConnectionId);
        this.mIdToConnection[peer.ConnectionId.id] = peer;
        this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, peer.ConnectionId, null));
    };
    WebRtcNetwork.prototype.SignalingFailed = function (signalingConId) {
        var peer = this.mInSignaling[signalingConId.id];
        if (peer) {
            //connection was still believed to be in signaling -> notify the user of the event
            delete this.mInSignaling[signalingConId.id];
            this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed, peer.ConnectionId, null));
            if (peer.SignalingInfo.IsSignalingConnected()) {
                this.mSignalingNetwork.Disconnect(signalingConId);
            }
            peer.Dispose();
        }
    };
    WebRtcNetwork.prototype.HandleDisconnect = function (id) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            peer.Dispose();
        }
        //search for the index to remove the id (user might provide a different object with the same id
        //don't use indexOf!
        var index = this.mConnectionIds.findIndex(function (e) { return e.id == id.id; });
        if (index != -1) {
            this.mConnectionIds.splice(index, 1);
            delete this.mIdToConnection[id.id];
        }
        var ev = new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
        this.mEvents.Enqueue(ev);
    };
    WebRtcNetwork.prototype.NextConnectionId = function () {
        var id = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](this.mNextId.id);
        this.mNextId.id++;
        return id;
    };
    WebRtcNetwork.prototype.StringToBuffer = function (str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        var result = new Uint8Array(buf);
        return result;
    };
    WebRtcNetwork.prototype.BufferToString = function (buffer) {
        var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
        return String.fromCharCode.apply(null, arr);
    };
    return WebRtcNetwork;
}());



/***/ }),

/***/ "./src/awrtc/network/WebRtcPeer.ts":
/*!*****************************************!*\
  !*** ./src/awrtc/network/WebRtcPeer.ts ***!
  \*****************************************/
/*! exports provided: SignalingConfig, SignalingInfo, WebRtcPeerState, WebRtcInternalState, AWebRtcPeer, WebRtcDataPeer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return SignalingConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return SignalingInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return WebRtcPeerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return WebRtcInternalState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return AWebRtcPeer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return WebRtcDataPeer; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var SignalingConfig = /** @class */ (function () {
    function SignalingConfig(network) {
        this.mNetwork = network;
    }
    SignalingConfig.prototype.GetNetwork = function () {
        return this.mNetwork;
    };
    return SignalingConfig;
}());

var SignalingInfo = /** @class */ (function () {
    function SignalingInfo(id, isIncoming, timeStamp) {
        this.mConnectionId = id;
        this.mIsIncoming = isIncoming;
        this.mCreationTime = timeStamp;
        this.mSignalingConnected = true;
    }
    SignalingInfo.prototype.IsSignalingConnected = function () {
        return this.mSignalingConnected;
    };
    Object.defineProperty(SignalingInfo.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    SignalingInfo.prototype.IsIncoming = function () {
        return this.mIsIncoming;
    };
    SignalingInfo.prototype.GetCreationTimeMs = function () {
        return Date.now() - this.mCreationTime;
    };
    SignalingInfo.prototype.SignalingDisconnected = function () {
        this.mSignalingConnected = false;
    };
    return SignalingInfo;
}());

var WebRtcPeerState;
(function (WebRtcPeerState) {
    WebRtcPeerState[WebRtcPeerState["Invalid"] = 0] = "Invalid";
    WebRtcPeerState[WebRtcPeerState["Created"] = 1] = "Created";
    WebRtcPeerState[WebRtcPeerState["Signaling"] = 2] = "Signaling";
    WebRtcPeerState[WebRtcPeerState["SignalingFailed"] = 3] = "SignalingFailed";
    WebRtcPeerState[WebRtcPeerState["Connected"] = 4] = "Connected";
    WebRtcPeerState[WebRtcPeerState["Closing"] = 5] = "Closing";
    WebRtcPeerState[WebRtcPeerState["Closed"] = 6] = "Closed"; //either Closed call finished or closed remotely or Cleanup/Dispose finished -> peer connection is destroyed and all resources are released
})(WebRtcPeerState || (WebRtcPeerState = {}));
var WebRtcInternalState;
(function (WebRtcInternalState) {
    WebRtcInternalState[WebRtcInternalState["None"] = 0] = "None";
    WebRtcInternalState[WebRtcInternalState["Signaling"] = 1] = "Signaling";
    WebRtcInternalState[WebRtcInternalState["SignalingFailed"] = 2] = "SignalingFailed";
    WebRtcInternalState[WebRtcInternalState["Connected"] = 3] = "Connected";
    WebRtcInternalState[WebRtcInternalState["Closed"] = 4] = "Closed"; //at least one channel was closed
})(WebRtcInternalState || (WebRtcInternalState = {}));
var AWebRtcPeer = /** @class */ (function () {
    function AWebRtcPeer(rtcConfig) {
        var _this = this;
        this.mState = WebRtcPeerState.Invalid;
        //only written during webrtc callbacks
        this.mRtcInternalState = WebRtcInternalState.None;
        this.mIncomingSignalingQueue = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mOutgoingSignalingQueue = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        //Used to negotiate who starts the signaling if 2 peers listening
        //at the same time
        this.mDidSendRandomNumber = false;
        this.mRandomNumerSent = 0;
        this.mOfferOptions = { "offerToReceiveAudio": false, "offerToReceiveVideo": false };
        this.mReadyForIce = false;
        this.mBufferedIceCandidates = [];
        this.OnIceCandidate = function (ev) {
            if (ev && ev.candidate) {
                var candidate = ev.candidate;
                var msg = JSON.stringify(candidate);
                _this.EnqueueOutgoing(msg);
            }
        };
        this.OnIceConnectionStateChange = function (ev) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("oniceconnectionstatechange: " + _this.mPeer.iceConnectionState);
            //Chrome stopped emitting "failed" events. We have to react to disconnected events now
            if (_this.mPeer.iceConnectionState == "failed" || _this.mPeer.iceConnectionState == "disconnected") {
                if (_this.mState == WebRtcPeerState.Signaling) {
                    _this.RtcSetSignalingFailed();
                }
                else if (_this.mState == WebRtcPeerState.Connected) {
                    _this.RtcSetClosed();
                }
            }
        };
        /*
        So far useless. never triggered in firefox.
        In Chrome it triggers together with the DataChannels opening which might be more useful in the future
        */
        this.OnConnectionStateChange = function (ev) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("onconnectionstatechange: " + _this.mPeer.iceConnectionState);
        };
        this.OnIceGatheringStateChange = function (ev) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("onicegatheringstatechange: " + _this.mPeer.iceGatheringState);
        };
        this.OnRenegotiationNeeded = function (ev) {
        };
        //broken in chrome. won't switch to closed anymore
        this.OnSignalingChange = function (ev) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("onsignalingstatechange:" + _this.mPeer.signalingState);
            //obsolete
            if (_this.mPeer.signalingState == "closed") {
                _this.RtcSetClosed();
            }
        };
        this.SetupPeer(rtcConfig);
        //remove this. it will trigger this call before the subclasses
        //are initialized
        this.OnSetup();
        this.mState = WebRtcPeerState.Created;
    }
    AWebRtcPeer.prototype.GetState = function () {
        return this.mState;
    };
    AWebRtcPeer.prototype.SetupPeer = function (rtcConfig) {
        this.mPeer = new RTCPeerConnection(rtcConfig);
        this.mPeer.onicecandidate = this.OnIceCandidate;
        this.mPeer.oniceconnectionstatechange = this.OnIceConnectionStateChange;
        this.mPeer.onicegatheringstatechange = this.OnIceGatheringStateChange;
        this.mPeer.onnegotiationneeded = this.OnRenegotiationNeeded;
        this.mPeer.onconnectionstatechange = this.OnConnectionStateChange;
        this.mPeer.onsignalingstatechange = this.OnSignalingChange;
    };
    AWebRtcPeer.prototype.DisposeInternal = function () {
        this.Cleanup();
    };
    AWebRtcPeer.prototype.Dispose = function () {
        if (this.mPeer != null) {
            this.DisposeInternal();
        }
    };
    AWebRtcPeer.prototype.Cleanup = function () {
        //closing webrtc could cause old events to flush out -> make sure we don't call cleanup
        //recursively
        if (this.mState == WebRtcPeerState.Closed || this.mState == WebRtcPeerState.Closing) {
            return;
        }
        this.mState = WebRtcPeerState.Closing;
        this.OnCleanup();
        if (this.mPeer != null)
            this.mPeer.close();
        //js version still receives callbacks after this. would make it
        //impossible to get the state
        //this.mReliableDataChannel = null;
        //this.mUnreliableDataChannel = null;
        //this.mPeer = null;
        this.mState = WebRtcPeerState.Closed;
    };
    AWebRtcPeer.prototype.Update = function () {
        if (this.mState != WebRtcPeerState.Closed && this.mState != WebRtcPeerState.Closing && this.mState != WebRtcPeerState.SignalingFailed)
            this.UpdateState();
        if (this.mState == WebRtcPeerState.Signaling || this.mState == WebRtcPeerState.Created)
            this.HandleIncomingSignaling();
    };
    AWebRtcPeer.prototype.UpdateState = function () {
        //will only be entered if the current state isn't already one of the ending states (closed, closing, signalingfailed)
        if (this.mRtcInternalState == WebRtcInternalState.Closed) {
            //if webrtc switched to the closed state -> make sure everything is destroyed.
            //webrtc closed the connection. update internal state + destroy the references
            //to webrtc
            this.Cleanup();
            //mState will be Closed now as well
        }
        else if (this.mRtcInternalState == WebRtcInternalState.SignalingFailed) {
            //if webrtc switched to a state indicating the signaling process failed ->  set the whole state to failed
            //this step will be ignored if the peers are destroyed already to not jump back from closed state to failed
            this.mState = WebRtcPeerState.SignalingFailed;
        }
        else if (this.mRtcInternalState == WebRtcInternalState.Connected) {
            this.mState = WebRtcPeerState.Connected;
        }
    };
    AWebRtcPeer.prototype.BufferIceCandidate = function (ice) {
        this.mBufferedIceCandidates.push(ice);
    };
    /**Called after setRemoteDescription succeeded.
     * After this call we accept ice candidates and add all buffered ice candidates we received
     * until then.
     *
     * This is a workaround for problems between Safari & Firefox. Safari sometimes sends ice candidates before
     * it sends an answer causing an error in firefox.
     */
    AWebRtcPeer.prototype.StartIce = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("accepting ice candidates");
        this.mReadyForIce = true;
        if (this.mBufferedIceCandidates.length > 0) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("adding locally buffered ice candidates");
            //signaling active. Forward ice candidates we received so far
            var candidates = this.mBufferedIceCandidates;
            this.mBufferedIceCandidates = [];
            for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
                var candidate = candidates_1[_i];
                this.AddIceCandidate(candidate);
            }
        }
    };
    AWebRtcPeer.prototype.AddIceCandidate = function (ice) {
        //based on the shim internals there is a risk it triggers errors outside of the promise
        try {
            var promise = this.mPeer.addIceCandidate(ice);
            promise.then(function () { });
            promise.catch(function (error) { _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error); });
        }
        catch (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
        }
    };
    AWebRtcPeer.prototype.HandleIncomingSignaling = function () {
        //handle the incoming messages all at once
        while (this.mIncomingSignalingQueue.Count() > 0) {
            var msgString = this.mIncomingSignalingQueue.Dequeue();
            var randomNumber = _Helper__WEBPACK_IMPORTED_MODULE_1__["Helper"].tryParseInt(msgString);
            if (randomNumber != null) {
                //was a random number for signaling negotiation
                //if this peer uses negotiation as well then
                //this would be true
                if (this.mDidSendRandomNumber) {
                    //no peer is set to start signaling -> the one with the bigger number starts
                    if (randomNumber < this.mRandomNumerSent) {
                        //own diced number was bigger -> start signaling
                        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Signaling negotiation complete. Starting signaling.");
                        this.StartSignaling();
                    }
                    else if (randomNumber == this.mRandomNumerSent) {
                        //same numbers. restart the process
                        this.NegotiateSignaling();
                    }
                    else {
                        //wait for other peer to start signaling
                        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Signaling negotiation complete. Waiting for signaling.");
                    }
                }
                else {
                    //ignore. this peer starts signaling automatically and doesn't use this
                    //negotiation
                }
            }
            else {
                //must be a webrtc signaling message using default json formatting
                var msg = JSON.parse(msgString);
                if (msg.sdp) {
                    var sdp = new RTCSessionDescription(msg);
                    if (sdp.type == 'offer') {
                        this.CreateAnswer(sdp);
                        //setTimeout(() => {  }, 5000);
                    }
                    else {
                        //setTimeout(() => { }, 5000);
                        this.RecAnswer(sdp);
                    }
                }
                else {
                    var ice = new RTCIceCandidate(msg);
                    if (ice != null) {
                        if (this.mReadyForIce) {
                            //expected normal behaviour
                            this.AddIceCandidate(ice);
                        }
                        else {
                            //Safari sometimes sends ice candidates before the answer message
                            //causing firefox to trigger an error
                            //buffer and reemit once setRemoteCandidate has been called
                            this.BufferIceCandidate(ice);
                        }
                    }
                }
            }
        }
    };
    AWebRtcPeer.prototype.AddSignalingMessage = function (msg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("incoming Signaling message " + msg);
        this.mIncomingSignalingQueue.Enqueue(msg);
    };
    AWebRtcPeer.prototype.DequeueSignalingMessage = function (/*out*/ msg) {
        //lock might be not the best way to deal with this
        //lock(mOutgoingSignalingQueue)
        {
            if (this.mOutgoingSignalingQueue.Count() > 0) {
                msg.val = this.mOutgoingSignalingQueue.Dequeue();
                return true;
            }
            else {
                msg.val = null;
                return false;
            }
        }
    };
    AWebRtcPeer.prototype.EnqueueOutgoing = function (msg) {
        //lock(mOutgoingSignalingQueue)
        {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Outgoing Signaling message " + msg);
            this.mOutgoingSignalingQueue.Enqueue(msg);
        }
    };
    AWebRtcPeer.prototype.StartSignaling = function () {
        this.OnStartSignaling();
        this.CreateOffer();
    };
    AWebRtcPeer.prototype.NegotiateSignaling = function () {
        var nb = _Helper__WEBPACK_IMPORTED_MODULE_1__["Random"].getRandomInt(0, 2147483647);
        this.mRandomNumerSent = nb;
        this.mDidSendRandomNumber = true;
        this.EnqueueOutgoing("" + nb);
    };
    AWebRtcPeer.prototype.CreateOffer = function () {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("CreateOffer");
        var createOfferPromise = this.mPeer.createOffer(this.mOfferOptions);
        createOfferPromise.then(function (desc) {
            var msg = JSON.stringify(desc);
            var setDescPromise = _this.mPeer.setLocalDescription(desc);
            setDescPromise.then(function () {
                _this.RtcSetSignalingStarted();
                _this.EnqueueOutgoing(msg);
            });
            setDescPromise.catch(function (error) {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                _this.RtcSetSignalingFailed();
            });
        });
        createOfferPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.CreateAnswer = function (offer) {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("CreateAnswer");
        var remoteDescPromise = this.mPeer.setRemoteDescription(offer);
        remoteDescPromise.then(function () {
            _this.StartIce();
            var createAnswerPromise = _this.mPeer.createAnswer();
            createAnswerPromise.then(function (desc) {
                var msg = JSON.stringify(desc);
                var localDescPromise = _this.mPeer.setLocalDescription(desc);
                localDescPromise.then(function () {
                    _this.RtcSetSignalingStarted();
                    _this.EnqueueOutgoing(msg);
                });
                localDescPromise.catch(function (error) {
                    _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                    _this.RtcSetSignalingFailed();
                });
            });
            createAnswerPromise.catch(function (error) {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                _this.RtcSetSignalingFailed();
            });
        });
        remoteDescPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.RecAnswer = function (answer) {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("RecAnswer");
        var remoteDescPromise = this.mPeer.setRemoteDescription(answer);
        remoteDescPromise.then(function () {
            //all done
            _this.StartIce();
        });
        remoteDescPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.RtcSetSignalingStarted = function () {
        if (this.mRtcInternalState == WebRtcInternalState.None) {
            this.mRtcInternalState = WebRtcInternalState.Signaling;
        }
    };
    AWebRtcPeer.prototype.RtcSetSignalingFailed = function () {
        this.mRtcInternalState = WebRtcInternalState.SignalingFailed;
    };
    AWebRtcPeer.prototype.RtcSetConnected = function () {
        if (this.mRtcInternalState == WebRtcInternalState.Signaling)
            this.mRtcInternalState = WebRtcInternalState.Connected;
    };
    AWebRtcPeer.prototype.RtcSetClosed = function () {
        if (this.mRtcInternalState == WebRtcInternalState.Connected) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("triggering closure");
            this.mRtcInternalState = WebRtcInternalState.Closed;
        }
    };
    return AWebRtcPeer;
}());

var WebRtcDataPeer = /** @class */ (function (_super) {
    __extends(WebRtcDataPeer, _super);
    function WebRtcDataPeer(id, rtcConfig) {
        var _this = _super.call(this, rtcConfig) || this;
        _this.mInfo = null;
        _this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        _this.mReliableDataChannelReady = false;
        _this.mUnreliableDataChannelReady = false;
        _this.mConnectionId = id;
        return _this;
    }
    Object.defineProperty(WebRtcDataPeer.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRtcDataPeer.prototype, "SignalingInfo", {
        get: function () {
            return this.mInfo;
        },
        enumerable: false,
        configurable: true
    });
    WebRtcDataPeer.prototype.SetSignalingInfo = function (info) {
        this.mInfo = info;
    };
    WebRtcDataPeer.prototype.OnSetup = function () {
        var _this = this;
        this.mPeer.ondatachannel = function (ev) { _this.OnDataChannel(ev.channel); };
    };
    WebRtcDataPeer.prototype.OnStartSignaling = function () {
        var configReliable = {};
        this.mReliableDataChannel = this.mPeer.createDataChannel(WebRtcDataPeer.sLabelReliable, configReliable);
        this.RegisterObserverReliable();
        var configUnreliable = {};
        configUnreliable.maxRetransmits = 0;
        configUnreliable.ordered = false;
        this.mUnreliableDataChannel = this.mPeer.createDataChannel(WebRtcDataPeer.sLabelUnreliable, configUnreliable);
        this.RegisterObserverUnreliable();
    };
    WebRtcDataPeer.prototype.OnCleanup = function () {
        if (this.mReliableDataChannel != null)
            this.mReliableDataChannel.close();
        if (this.mUnreliableDataChannel != null)
            this.mUnreliableDataChannel.close();
        //dont set to null. handlers will be called later
    };
    WebRtcDataPeer.prototype.RegisterObserverReliable = function () {
        var _this = this;
        this.mReliableDataChannel.onmessage = function (event) { _this.ReliableDataChannel_OnMessage(event); };
        this.mReliableDataChannel.onopen = function (event) { _this.ReliableDataChannel_OnOpen(); };
        this.mReliableDataChannel.onclose = function (event) { _this.ReliableDataChannel_OnClose(); };
        this.mReliableDataChannel.onerror = function (event) { _this.ReliableDataChannel_OnError(""); }; //should the event just be a string?
    };
    WebRtcDataPeer.prototype.RegisterObserverUnreliable = function () {
        var _this = this;
        this.mUnreliableDataChannel.onmessage = function (event) { _this.UnreliableDataChannel_OnMessage(event); };
        this.mUnreliableDataChannel.onopen = function (event) { _this.UnreliableDataChannel_OnOpen(); };
        this.mUnreliableDataChannel.onclose = function (event) { _this.UnreliableDataChannel_OnClose(); };
        this.mUnreliableDataChannel.onerror = function (event) { _this.UnreliableDataChannel_OnError(""); }; //should the event just be a string?
    };
    WebRtcDataPeer.prototype.SendData = function (data, /* offset : number, length : number,*/ reliable) {
        //let buffer: ArrayBufferView = data.subarray(offset, offset + length) as ArrayBufferView;
        var buffer = data;
        var MAX_SEND_BUFFER = 1024 * 1024;
        //chrome bug: If the channels is closed remotely trough disconnect
        //then the local channel can appear open but will throw an exception
        //if send is called
        var sentSuccessfully = false;
        try {
            if (reliable) {
                if (this.mReliableDataChannel.readyState === "open") {
                    //bugfix: WebRTC seems to simply close the data channel if we send
                    //too much at once. avoid this from now on by returning false
                    //if the buffer gets too full
                    if ((this.mReliableDataChannel.bufferedAmount + buffer.byteLength) < MAX_SEND_BUFFER) {
                        this.mReliableDataChannel.send(buffer);
                        sentSuccessfully = true;
                    }
                }
            }
            else {
                if (this.mUnreliableDataChannel.readyState === "open") {
                    if ((this.mUnreliableDataChannel.bufferedAmount + buffer.byteLength) < MAX_SEND_BUFFER) {
                        this.mUnreliableDataChannel.send(buffer);
                        sentSuccessfully = true;
                    }
                }
            }
        }
        catch (e) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogError("Exception while trying to send: " + e);
        }
        return sentSuccessfully;
    };
    WebRtcDataPeer.prototype.GetBufferedAmount = function (reliable) {
        var result = -1;
        try {
            if (reliable) {
                if (this.mReliableDataChannel.readyState === "open") {
                    result = this.mReliableDataChannel.bufferedAmount;
                }
            }
            else {
                if (this.mUnreliableDataChannel.readyState === "open") {
                    result = this.mUnreliableDataChannel.bufferedAmount;
                }
            }
        }
        catch (e) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogError("Exception while trying to access GetBufferedAmount: " + e);
        }
        return result;
    };
    WebRtcDataPeer.prototype.DequeueEvent = function (/*out*/ ev) {
        //lock(mEvents)
        {
            if (this.mEvents.Count() > 0) {
                ev.val = this.mEvents.Dequeue();
                return true;
            }
        }
        return false;
    };
    WebRtcDataPeer.prototype.Enqueue = function (ev) {
        //lock(mEvents)
        {
            this.mEvents.Enqueue(ev);
        }
    };
    WebRtcDataPeer.prototype.OnDataChannel = function (data_channel) {
        var newChannel = data_channel;
        if (newChannel.label == WebRtcDataPeer.sLabelReliable) {
            this.mReliableDataChannel = newChannel;
            this.RegisterObserverReliable();
        }
        else if (newChannel.label == WebRtcDataPeer.sLabelUnreliable) {
            this.mUnreliableDataChannel = newChannel;
            this.RegisterObserverUnreliable();
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError("Datachannel with unexpected label " + newChannel.label);
        }
    };
    WebRtcDataPeer.prototype.RtcOnMessageReceived = function (event, reliable) {
        var eventType = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived;
        if (reliable) {
            eventType = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived;
        }
        //async conversion to blob/arraybuffer here
        if (event.data instanceof ArrayBuffer) {
            var buffer = new Uint8Array(event.data);
            this.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](eventType, this.mConnectionId, buffer));
        }
        else if (event.data instanceof Blob) {
            var connectionId = this.mConnectionId;
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function () {
                //need to use function as this pointer is needed to reference to the data
                var data = this.result;
                var buffer = new Uint8Array(data);
                self.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](eventType, self.mConnectionId, buffer));
            };
            fileReader.readAsArrayBuffer(event.data);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError("Invalid message type. Only blob and arraybuffer supported: " + event.data);
        }
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnMessage = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("ReliableDataChannel_OnMessage ");
        this.RtcOnMessageReceived(event, true);
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("mReliableDataChannelReady");
        this.mReliableDataChannelReady = true;
        if (this.IsRtcConnected()) {
            this.RtcSetConnected();
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Fully connected");
        }
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnClose = function () {
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnError = function (errorMsg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(errorMsg);
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnMessage = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("UnreliableDataChannel_OnMessage ");
        this.RtcOnMessageReceived(event, false);
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("mUnreliableDataChannelReady");
        this.mUnreliableDataChannelReady = true;
        if (this.IsRtcConnected()) {
            this.RtcSetConnected();
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Fully connected");
        }
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnClose = function () {
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnError = function (errorMsg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(errorMsg);
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.IsRtcConnected = function () {
        return this.mReliableDataChannelReady && this.mUnreliableDataChannelReady;
    };
    WebRtcDataPeer.sLabelReliable = "reliable";
    WebRtcDataPeer.sLabelUnreliable = "unreliable";
    return WebRtcDataPeer;
}(AWebRtcPeer));



/***/ }),

/***/ "./src/awrtc/network/WebsocketNetwork.ts":
/*!***********************************************!*\
  !*** ./src/awrtc/network/WebsocketNetwork.ts ***!
  \***********************************************/
/*! exports provided: WebsocketConnectionStatus, WebsocketServerStatus, WebsocketNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return WebsocketConnectionStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return WebsocketServerStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return WebsocketNetwork; });
/* harmony import */ var _INetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./INetwork */ "./src/awrtc/network/INetwork.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var WebsocketConnectionStatus;
(function (WebsocketConnectionStatus) {
    WebsocketConnectionStatus[WebsocketConnectionStatus["Uninitialized"] = 0] = "Uninitialized";
    WebsocketConnectionStatus[WebsocketConnectionStatus["NotConnected"] = 1] = "NotConnected";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Connecting"] = 2] = "Connecting";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Connected"] = 3] = "Connected";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Disconnecting"] = 4] = "Disconnecting"; //server will shut down, all clients disconnect, ...
})(WebsocketConnectionStatus || (WebsocketConnectionStatus = {}));
var WebsocketServerStatus;
(function (WebsocketServerStatus) {
    WebsocketServerStatus[WebsocketServerStatus["Offline"] = 0] = "Offline";
    WebsocketServerStatus[WebsocketServerStatus["Starting"] = 1] = "Starting";
    WebsocketServerStatus[WebsocketServerStatus["Online"] = 2] = "Online";
    WebsocketServerStatus[WebsocketServerStatus["ShuttingDown"] = 3] = "ShuttingDown";
})(WebsocketServerStatus || (WebsocketServerStatus = {}));
//TODO: handle errors if the socket connection failed
//+ send back failed events for connected / serverstart events that are buffered
var WebsocketNetwork = /** @class */ (function () {
    function WebsocketNetwork(url, configuration) {
        //currents status. will be updated based on update call
        this.mStatus = WebsocketConnectionStatus.Uninitialized;
        //queue to hold buffered outgoing messages
        this.mOutgoingQueue = new Array();
        //buffer for incoming messages
        this.mIncomingQueue = new Array();
        //Status of the server for incoming connections
        this.mServerStatus = WebsocketServerStatus.Offline;
        //outgoing connections (just need to be stored to allow to send out a failed message
        //if the whole signaling connection fails
        this.mConnecting = new Array();
        this.mConnections = new Array();
        //next free connection id
        this.mNextOutgoingConnectionId = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        /// <summary>
        /// Assume 1 until message received
        /// </summary>
        this.mRemoteProtocolVersion = 1;
        this.mUrl = null;
        this.mHeartbeatReceived = true;
        this.mIsDisposed = false;
        this.mUrl = url;
        this.mStatus = WebsocketConnectionStatus.NotConnected;
        this.mConfig = configuration;
        if (!this.mConfig)
            this.mConfig = new WebsocketNetwork.Configuration();
        this.mConfig.Lock();
    }
    WebsocketNetwork.prototype.getStatus = function () { return this.mStatus; };
    ;
    WebsocketNetwork.prototype.WebsocketConnect = function () {
        var _this = this;
        this.mStatus = WebsocketConnectionStatus.Connecting;
        this.mSocket = new WebSocket(this.mUrl);
        this.mSocket.binaryType = "arraybuffer";
        this.mSocket.onopen = function () { _this.OnWebsocketOnOpen(); };
        this.mSocket.onerror = function (error) { _this.OnWebsocketOnError(error); };
        this.mSocket.onmessage = function (e) { _this.OnWebsocketOnMessage(e); };
        this.mSocket.onclose = function (e) { _this.OnWebsocketOnClose(e); };
    };
    WebsocketNetwork.prototype.WebsocketCleanup = function () {
        this.mSocket.onopen = null;
        this.mSocket.onerror = null;
        this.mSocket.onmessage = null;
        this.mSocket.onclose = null;
        if (this.mSocket.readyState == this.mSocket.OPEN
            || this.mSocket.readyState == this.mSocket.CONNECTING) {
            this.mSocket.close();
        }
        this.mSocket = null;
    };
    WebsocketNetwork.prototype.EnsureServerConnection = function () {
        if (this.mStatus == WebsocketConnectionStatus.NotConnected) {
            //no server
            //no connection about to be established
            //no current connections
            //-> disconnect the server connection
            this.WebsocketConnect();
        }
    };
    WebsocketNetwork.prototype.UpdateHeartbeat = function () {
        if (this.mStatus == WebsocketConnectionStatus.Connected && this.mConfig.Heartbeat > 0) {
            var diff = Date.now() - this.mLastHeartbeat;
            if (diff > (this.mConfig.Heartbeat * 1000)) {
                //We trigger heatbeat timeouts only for protocol V2
                //protocol 1 can receive the heatbeats but 
                //won't send a reply
                //(still helpful to trigger TCP ACK timeout)
                if (this.mRemoteProtocolVersion > 1
                    && this.mHeartbeatReceived == false) {
                    this.TriggerHeartbeatTimeout();
                    return;
                }
                this.mLastHeartbeat = Date.now();
                this.mHeartbeatReceived = false;
                this.SendHeartbeat();
            }
        }
    };
    WebsocketNetwork.prototype.TriggerHeartbeatTimeout = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Closing due to heartbeat timeout. Server didn't respond in time.", WebsocketNetwork.LOGTAG);
        this.Cleanup();
    };
    WebsocketNetwork.prototype.CheckSleep = function () {
        if (this.mStatus == WebsocketConnectionStatus.Connected
            && this.mServerStatus == WebsocketServerStatus.Offline
            && this.mConnecting.length == 0
            && this.mConnections.length == 0) {
            //no server
            //no connection about to be established
            //no current connections
            //-> disconnect the server connection
            this.Cleanup();
        }
    };
    WebsocketNetwork.prototype.OnWebsocketOnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L('onWebsocketOnOpen', WebsocketNetwork.LOGTAG);
        this.mStatus = WebsocketConnectionStatus.Connected;
        this.mLastHeartbeat = Date.now();
        this.SendVersion();
    };
    WebsocketNetwork.prototype.OnWebsocketOnClose = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L('Closed: ' + JSON.stringify(event), WebsocketNetwork.LOGTAG);
        if (event.code != 1000) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE("Websocket closed with code: " + event.code + " " + event.reason);
        }
        //ignore closed event if it was caused due to a shutdown (as that means we cleaned up already)
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        this.Cleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.OnWebsocketOnMessage = function (event) {
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        //browsers will have ArrayBuffer in event.data -> change to byte array
        var msg = new Uint8Array(event.data);
        this.ParseMessage(msg);
    };
    WebsocketNetwork.prototype.OnWebsocketOnError = function (error) {
        //the error event doesn't seem to have any useful information?
        //browser is expected to call OnClose after this
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE('WebSocket Error ' + error);
    };
    /// <summary>
    /// called during Disconnecting state either trough server connection failed or due to Shutdown
    /// 
    /// Also used to switch to sleeping mode. In this case there connection isn't used as
    /// server and doesn't have any connections (established or connecting) thus
    /// only WebsocketCleanup is in effect.
    /// 
    /// WebsocketNetwork has to be still usable after this call like a newly
    /// created connections (except with events in the message queue)
    /// </summary>
    WebsocketNetwork.prototype.Cleanup = function () {
        //check if this was done already (or we are in the process of cleanup already)
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        this.mStatus = WebsocketConnectionStatus.Disconnecting;
        //throw connection failed events for each connection in mConnecting
        for (var _i = 0, _a = this.mConnecting; _i < _a.length; _i++) {
            var conId = _a[_i];
            //all connection it tries to establish right now fail due to shutdown
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed, new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](conId), null));
        }
        this.mConnecting = new Array();
        //throw disconnect events for all NewConnection events in the outgoing queue
        //ignore messages and everything else
        for (var _b = 0, _c = this.mConnections; _b < _c.length; _b++) {
            var conId = _c[_b];
            //all connection it tries to establish right now fail due to shutdown
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](conId), null));
        }
        this.mConnections = new Array();
        if (this.mServerStatus == WebsocketServerStatus.Starting) {
            //if server was Starting -> throw failed event
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        else if (this.mServerStatus == WebsocketServerStatus.Online) {
            //if server was Online -> throw close event
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        else if (this.mServerStatus == WebsocketServerStatus.ShuttingDown) {
            //if server was ShuttingDown -> throw close event (don't think this can happen)
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        this.mServerStatus = WebsocketServerStatus.Offline;
        this.mOutgoingQueue = new Array();
        this.WebsocketCleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.EnqueueOutgoing = function (evt) {
        this.mOutgoingQueue.push(evt);
    };
    WebsocketNetwork.prototype.EnqueueIncoming = function (evt) {
        this.mIncomingQueue.push(evt);
    };
    WebsocketNetwork.prototype.TryRemoveConnecting = function (id) {
        var index = this.mConnecting.indexOf(id.id);
        if (index != -1) {
            this.mConnecting.splice(index, 1);
        }
    };
    WebsocketNetwork.prototype.TryRemoveConnection = function (id) {
        var index = this.mConnections.indexOf(id.id);
        if (index != -1) {
            this.mConnections.splice(index, 1);
        }
    };
    WebsocketNetwork.prototype.ParseMessage = function (msg) {
        if (msg.length == 0) {
        }
        else if (msg[0] == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaVersion) {
            if (msg.length > 1) {
                this.mRemoteProtocolVersion = msg[1];
            }
            else {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Received an invalid MetaVersion header without content.");
            }
        }
        else if (msg[0] == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaHeartbeat) {
            this.mHeartbeatReceived = true;
        }
        else {
            var evt = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"].fromByteArray(msg);
            this.HandleIncomingEvent(evt);
        }
    };
    WebsocketNetwork.prototype.HandleIncomingEvent = function (evt) {
        if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection) {
            //removing connecting info
            this.TryRemoveConnecting(evt.ConnectionId);
            //add connection
            this.mConnections.push(evt.ConnectionId.id);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed) {
            //remove connecting info
            this.TryRemoveConnecting(evt.ConnectionId);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected) {
            //remove from connections
            this.TryRemoveConnection(evt.ConnectionId);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
            this.mServerStatus = WebsocketServerStatus.Online;
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed) {
            this.mServerStatus = WebsocketServerStatus.Offline;
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed) {
            this.mServerStatus = WebsocketServerStatus.ShuttingDown;
            //any cleaning up to do?
            this.mServerStatus = WebsocketServerStatus.Offline;
        }
        this.EnqueueIncoming(evt);
    };
    WebsocketNetwork.prototype.HandleOutgoingEvents = function () {
        while (this.mOutgoingQueue.length > 0) {
            var evt = this.mOutgoingQueue.shift();
            this.SendNetworkEvent(evt);
        }
    };
    WebsocketNetwork.prototype.SendHeartbeat = function () {
        var msg = new Uint8Array(1);
        msg[0] = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaHeartbeat;
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.SendVersion = function () {
        var msg = new Uint8Array(2);
        msg[0] = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaVersion;
        msg[1] = WebsocketNetwork.PROTOCOL_VERSION;
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.SendNetworkEvent = function (evt) {
        var msg = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"].toByteArray(evt);
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.InternalSend = function (msg) {
        this.mSocket.send(msg);
    };
    WebsocketNetwork.prototype.NextConnectionId = function () {
        var result = this.mNextOutgoingConnectionId;
        this.mNextOutgoingConnectionId = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](this.mNextOutgoingConnectionId.id + 1);
        return result;
    };
    WebsocketNetwork.prototype.GetRandomKey = function () {
        var result = "";
        for (var i = 0; i < 7; i++) {
            result += String.fromCharCode(65 + Math.round(Math.random() * 25));
        }
        return result;
    };
    //interface implementation
    WebsocketNetwork.prototype.Dequeue = function () {
        if (this.mIncomingQueue.length > 0)
            return this.mIncomingQueue.shift();
        return null;
    };
    WebsocketNetwork.prototype.Peek = function () {
        if (this.mIncomingQueue.length > 0)
            return this.mIncomingQueue[0];
        return null;
    };
    WebsocketNetwork.prototype.Update = function () {
        this.UpdateHeartbeat();
        this.CheckSleep();
    };
    WebsocketNetwork.prototype.Flush = function () {
        //ideally we buffer everything and then flush when it is connected as
        //websockets aren't suppose to be used for realtime communication anyway
        if (this.mStatus == WebsocketConnectionStatus.Connected)
            this.HandleOutgoingEvents();
    };
    WebsocketNetwork.prototype.SendData = function (id, data, /*offset: number, length: number,*/ reliable) {
        if (id == null || id.id == _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Ignored message. Invalid connection id.");
            return;
        }
        if (data == null || data.length == 0) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Ignored message. Invalid data.");
            return;
        }
        var evt;
        if (reliable) {
            evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived, id, data);
        }
        else {
            evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived, id, data);
        }
        this.EnqueueOutgoing(evt);
        return true;
    };
    WebsocketNetwork.prototype.Disconnect = function (id) {
        var evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
        this.EnqueueOutgoing(evt);
    };
    WebsocketNetwork.prototype.Shutdown = function () {
        this.Cleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.Dispose = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
            this.mIsDisposed = true;
        }
    };
    WebsocketNetwork.prototype.StartServer = function (address) {
        if (address == null) {
            address = "" + this.GetRandomKey();
        }
        if (this.mServerStatus == WebsocketServerStatus.Offline) {
            this.EnsureServerConnection();
            this.mServerStatus = WebsocketServerStatus.Starting;
            //TODO: address is a string but ubytearray is defined. will fail if binary
            this.EnqueueOutgoing(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, address));
        }
        else {
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, address));
        }
    };
    WebsocketNetwork.prototype.StopServer = function () {
        this.EnqueueOutgoing(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
    };
    WebsocketNetwork.prototype.Connect = function (address) {
        this.EnsureServerConnection();
        var newConId = this.NextConnectionId();
        this.mConnecting.push(newConId.id);
        var evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, newConId, address);
        this.EnqueueOutgoing(evt);
        return newConId;
    };
    WebsocketNetwork.LOGTAG = "WebsocketNetwork";
    /// <summary>
    /// Version of the protocol implemented here
    /// </summary>
    WebsocketNetwork.PROTOCOL_VERSION = 2;
    /// <summary>
    /// Minimal protocol version that is still supported.
    /// V 1 servers won't understand heartbeat and version
    /// messages but would just log an unknown message and
    /// continue normally.
    /// </summary>
    WebsocketNetwork.PROTOCOL_VERSION_MIN = 1;
    return WebsocketNetwork;
}());

(function (WebsocketNetwork) {
    var Configuration = /** @class */ (function () {
        function Configuration() {
            this.mHeartbeat = 30;
            this.mLocked = false;
        }
        Object.defineProperty(Configuration.prototype, "Heartbeat", {
            get: function () {
                return this.mHeartbeat;
            },
            set: function (value) {
                if (this.mLocked) {
                    throw new Error("Can't change configuration once used.");
                }
                this.mHeartbeat = value;
            },
            enumerable: false,
            configurable: true
        });
        Configuration.prototype.Lock = function () {
            this.mLocked = true;
        };
        return Configuration;
    }());
    WebsocketNetwork.Configuration = Configuration;
})(WebsocketNetwork || (WebsocketNetwork = {}));
//Below tests only. Move out later
function bufferToString(buffer) {
    var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
    return String.fromCharCode.apply(null, arr);
}
function stringToBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    var result = new Uint8Array(buf);
    return result;
}


/***/ }),

/***/ "./src/awrtc/network/index.ts":
/*!************************************!*\
  !*** ./src/awrtc/network/index.ts ***!
  \************************************/
/*! exports provided: NetEventType, NetEventDataType, NetworkEvent, ConnectionId, Queue, List, Output, Debug, Encoder, UTF16Encoding, Encoding, Random, Helper, SLogLevel, SLog, SignalingConfig, SignalingInfo, WebRtcPeerState, WebRtcInternalState, AWebRtcPeer, WebRtcDataPeer, WebRtcNetworkServerState, WebRtcNetwork, WebsocketConnectionStatus, WebsocketServerStatus, WebsocketNetwork, LocalNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _INetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./INetwork */ "./src/awrtc/network/INetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventDataType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"]; });

/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["List"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Encoder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["UTF16Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Random"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Helper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["SLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"]; });

/* harmony import */ var _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebRtcPeer */ "./src/awrtc/network/WebRtcPeer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["SignalingInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcPeerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcInternalState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["AWebRtcPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcDataPeer"]; });

/* harmony import */ var _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WebRtcNetwork */ "./src/awrtc/network/WebRtcNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__["WebRtcNetworkServerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__["WebRtcNetwork"]; });

/* harmony import */ var _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WebsocketNetwork */ "./src/awrtc/network/WebsocketNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketConnectionStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketServerStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketNetwork"]; });

/* harmony import */ var _LocalNetwork__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LocalNetwork */ "./src/awrtc/network/LocalNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return _LocalNetwork__WEBPACK_IMPORTED_MODULE_5__["LocalNetwork"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/








/***/ }),

/***/ "./src/awrtc/unity/CAPI.ts":
/*!*********************************!*\
  !*** ./src/awrtc/unity/CAPI.ts ***!
  \*********************************/
/*! exports provided: CAPI_InitAsync, CAPI_PollInitState, CAPI_SLog_SetLogLevel, CAPI_WebRtcNetwork_IsAvailable, CAPI_WebRtcNetwork_IsBrowserSupported, CAPI_WebRtcNetwork_Create, CAPI_WebRtcNetwork_Release, CAPI_WebRtcNetwork_Connect, CAPI_WebRtcNetwork_StartServer, CAPI_WebRtcNetwork_StopServer, CAPI_WebRtcNetwork_Disconnect, CAPI_WebRtcNetwork_Shutdown, CAPI_WebRtcNetwork_Update, CAPI_WebRtcNetwork_Flush, CAPI_WebRtcNetwork_SendData, CAPI_WebRtcNetwork_SendDataEm, CAPI_WebRtcNetwork_GetBufferedAmount, CAPI_WebRtcNetwork_Dequeue, CAPI_WebRtcNetwork_Peek, CAPI_WebRtcNetwork_PeekEventDataLength, CAPI_WebRtcNetwork_CheckEventLength, CAPI_WebRtcNetwork_EventDataToUint8Array, CAPI_WebRtcNetwork_DequeueEm, CAPI_WebRtcNetwork_PeekEm, CAPI_MediaNetwork_IsAvailable, CAPI_MediaNetwork_HasUserMedia, CAPI_MediaNetwork_Create, CAPI_MediaNetwork_Configure, CAPI_MediaNetwork_GetConfigurationState, CAPI_MediaNetwork_GetConfigurationError, CAPI_MediaNetwork_ResetConfiguration, CAPI_MediaNetwork_TryGetFrame, CAPI_MediaNetwork_TryGetFrame_ToTexture, CAPI_MediaNetwork_TryGetFrame_Resolution, CAPI_MediaNetwork_TryGetFrameDataLength, CAPI_MediaNetwork_SetVolume, CAPI_MediaNetwork_HasAudioTrack, CAPI_MediaNetwork_HasVideoTrack, CAPI_MediaNetwork_SetMute, CAPI_MediaNetwork_IsMute, CAPI_DeviceApi_Update, CAPI_DeviceApi_RequestUpdate, CAPI_DeviceApi_LastUpdate, CAPI_Media_GetVideoDevices_Length, CAPI_Media_GetVideoDevices, CAPI_VideoInput_AddCanvasDevice, CAPI_VideoInput_AddDevice, CAPI_VideoInput_RemoveDevice, CAPI_VideoInput_UpdateFrame, GetUnityCanvas, GetUnityContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return CAPI_InitAsync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return CAPI_PollInitState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return CAPI_SLog_SetLogLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return CAPI_WebRtcNetwork_IsAvailable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return CAPI_WebRtcNetwork_IsBrowserSupported; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return CAPI_WebRtcNetwork_Create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return CAPI_WebRtcNetwork_Release; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return CAPI_WebRtcNetwork_Connect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return CAPI_WebRtcNetwork_StartServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return CAPI_WebRtcNetwork_StopServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return CAPI_WebRtcNetwork_Disconnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return CAPI_WebRtcNetwork_Shutdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return CAPI_WebRtcNetwork_Update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return CAPI_WebRtcNetwork_Flush; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return CAPI_WebRtcNetwork_SendData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return CAPI_WebRtcNetwork_SendDataEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return CAPI_WebRtcNetwork_GetBufferedAmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return CAPI_WebRtcNetwork_Dequeue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return CAPI_WebRtcNetwork_Peek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return CAPI_WebRtcNetwork_PeekEventDataLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return CAPI_WebRtcNetwork_CheckEventLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return CAPI_WebRtcNetwork_EventDataToUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return CAPI_WebRtcNetwork_DequeueEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return CAPI_WebRtcNetwork_PeekEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return CAPI_MediaNetwork_IsAvailable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return CAPI_MediaNetwork_HasUserMedia; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return CAPI_MediaNetwork_Create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return CAPI_MediaNetwork_Configure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return CAPI_MediaNetwork_GetConfigurationState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return CAPI_MediaNetwork_GetConfigurationError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return CAPI_MediaNetwork_ResetConfiguration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return CAPI_MediaNetwork_TryGetFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_ToTexture", function() { return CAPI_MediaNetwork_TryGetFrame_ToTexture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_Resolution", function() { return CAPI_MediaNetwork_TryGetFrame_Resolution; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return CAPI_MediaNetwork_TryGetFrameDataLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return CAPI_MediaNetwork_SetVolume; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return CAPI_MediaNetwork_HasAudioTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return CAPI_MediaNetwork_HasVideoTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return CAPI_MediaNetwork_SetMute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return CAPI_MediaNetwork_IsMute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return CAPI_DeviceApi_Update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return CAPI_DeviceApi_RequestUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return CAPI_DeviceApi_LastUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices_Length", function() { return CAPI_Media_GetVideoDevices_Length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices", function() { return CAPI_Media_GetVideoDevices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddCanvasDevice", function() { return CAPI_VideoInput_AddCanvasDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddDevice", function() { return CAPI_VideoInput_AddDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_RemoveDevice", function() { return CAPI_VideoInput_RemoveDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_UpdateFrame", function() { return CAPI_VideoInput_UpdateFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetUnityCanvas", function() { return GetUnityCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetUnityContext", function() { return GetUnityContext; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _media_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../media/index */ "./src/awrtc/media/index.ts");
/* harmony import */ var _media_browser_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../media_browser/index */ "./src/awrtc/media_browser/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**This file contains the mapping between the awrtc_browser library and
 * Unitys WebGL support. Not needed for regular use.
 */



var CAPI_InitMode = {
    //Original mode. Devices will be unknown after startup
    Default: 0,
    //Waits for the desvice info to come in
    //names might be missing though (browser security thing)
    WaitForDevices: 1,
    //Asks the user for camera / audio access to be able to
    //get accurate device information
    RequestAccess: 2
};
var CAPI_InitState = {
    Uninitialized: 0,
    Initializing: 1,
    Initialized: 2,
    Failed: 3
};
var gCAPI_InitState = CAPI_InitState.Uninitialized;
var gCAPI_Canvas = null;
function CAPI_InitAsync(initmode) {
    console.debug("CAPI_InitAsync mode: " + initmode);
    gCAPI_InitState = CAPI_InitState.Initializing;
    if (GLctx && GLctx.canvas) {
        gCAPI_Canvas = GLctx.canvas;
    }
    InitAutoplayWorkaround();
    var hasDevApi = _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].IsApiAvailable();
    if (hasDevApi && initmode == CAPI_InitMode.WaitForDevices) {
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Update();
    }
    else if (hasDevApi && initmode == CAPI_InitMode.RequestAccess) {
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].RequestUpdate();
    }
    else {
        //either no device access available or not requested. Switch
        //to init state immediately without device info
        gCAPI_InitState = CAPI_InitState.Initialized;
        if (hasDevApi == false) {
            console.debug("Initialized without accessible DeviceAPI");
        }
    }
}
function InitAutoplayWorkaround() {
    if (gCAPI_Canvas == null) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LW("Autoplay workaround inactive. No canvas object known to register click & touch event handlers.");
        return;
    }
    var listener = null;
    listener = function () {
        //called during user input event
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"].ResolveAutoplay();
        gCAPI_Canvas.removeEventListener("click", listener, false);
        gCAPI_Canvas.removeEventListener("touchstart", listener, false);
    };
    //If a stream runs into autoplay issues we add a listener for the next on click / touchstart event
    //and resolve it on the next incoming event
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"].onautoplayblocked = function () {
        gCAPI_Canvas.addEventListener("click", listener, false);
        gCAPI_Canvas.addEventListener("touchstart", listener, false);
    };
}
function CAPI_PollInitState() {
    //keep checking if the DeviceApi left pending state
    //Once completed init is finished.
    //Later we might do more here
    if (_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].IsPending == false && gCAPI_InitState == CAPI_InitState.Initializing) {
        gCAPI_InitState = CAPI_InitState.Initialized;
        console.debug("Init completed.");
    }
    return gCAPI_InitState;
}
/**
 *
 * @param loglevel
 * None = 0,
 * Errors = 1,
 * Warnings = 2,
 * Verbose = 3
 */
function CAPI_SLog_SetLogLevel(loglevel) {
    if (loglevel < 0 || loglevel > 3) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("Invalid log level " + loglevel);
        return;
    }
    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].SetLogLevel(loglevel);
}
var gCAPI_WebRtcNetwork_Instances = {};
var gCAPI_WebRtcNetwork_InstancesNextIndex = 1;
function CAPI_WebRtcNetwork_IsAvailable() {
    //used by C# component to check if this plugin is loaded.
    //can only go wrong due to programming error / packaging
    if (_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"] && _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"])
        return true;
    return false;
}
function CAPI_WebRtcNetwork_IsBrowserSupported() {
    if (RTCPeerConnection && RTCDataChannel)
        return true;
    return false;
}
function CAPI_WebRtcNetwork_Create(lConfiguration) {
    var lIndex = gCAPI_WebRtcNetwork_InstancesNextIndex;
    gCAPI_WebRtcNetwork_InstancesNextIndex++;
    var signaling_class = "LocalNetwork";
    var signaling_param = null;
    var iceServers;
    if (lConfiguration == null || typeof lConfiguration !== 'string' || lConfiguration.length === 0) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("invalid configuration. Returning -1! Config: " + lConfiguration);
        return -1;
    }
    else {
        var conf = JSON.parse(lConfiguration);
        if (conf) {
            if (conf.signaling) {
                signaling_class = conf.signaling.class;
                signaling_param = conf.signaling.param;
            }
            if (conf.iceServers) {
                iceServers = conf.iceServers;
            }
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L(signaling_class);
            //this seems to be broken after switch to modules
            //let signalingNetworkClass = window[signaling_class];
            //let signalingNetworkClass =  new (<any>window)["awrtc.LocalNetwork"];
            //console.debug(signalingNetworkClass);
            var signalingNetworkClass = void 0;
            if (signaling_class === "LocalNetwork") {
                signalingNetworkClass = _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"];
            }
            else {
                signalingNetworkClass = _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"];
            }
            var signalingConfig = new _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"](new signalingNetworkClass(signaling_param));
            var rtcConfiguration = { iceServers: iceServers };
            gCAPI_WebRtcNetwork_Instances[lIndex] = new _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"](signalingConfig, rtcConfiguration);
        }
        else {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogWarning("Parsing configuration failed. Configuration: " + lConfiguration);
            return -1;
        }
    }
    //gCAPI_WebRtcNetwork_Instances[lIndex].OnLog = function (lMsg) {
    //    console.debug(lMsg);
    //};
    return lIndex;
}
function CAPI_WebRtcNetwork_Release(lIndex) {
    if (lIndex in gCAPI_WebRtcNetwork_Instances) {
        gCAPI_WebRtcNetwork_Instances[lIndex].Dispose();
        delete gCAPI_WebRtcNetwork_Instances[lIndex];
    }
}
function CAPI_WebRtcNetwork_Connect(lIndex, lRoom) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Connect(lRoom);
}
function CAPI_WebRtcNetwork_StartServer(lIndex, lRoom) {
    gCAPI_WebRtcNetwork_Instances[lIndex].StartServer(lRoom);
}
function CAPI_WebRtcNetwork_StopServer(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].StopServer();
}
function CAPI_WebRtcNetwork_Disconnect(lIndex, lConnectionId) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Disconnect(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
}
function CAPI_WebRtcNetwork_Shutdown(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Shutdown();
}
function CAPI_WebRtcNetwork_Update(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Update();
}
function CAPI_WebRtcNetwork_Flush(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Flush();
}
function CAPI_WebRtcNetwork_SendData(lIndex, lConnectionId, lUint8ArrayData, lReliable) {
    gCAPI_WebRtcNetwork_Instances[lIndex].SendData(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), lUint8ArrayData, lReliable);
}
//helper for emscripten
function CAPI_WebRtcNetwork_SendDataEm(lIndex, lConnectionId, lUint8ArrayData, lUint8ArrayDataOffset, lUint8ArrayDataLength, lReliable) {
    //console.debug("SendDataEm: " + lReliable + " length " + lUint8ArrayDataLength + " to " + lConnectionId);
    var arrayBuffer = new Uint8Array(lUint8ArrayData.buffer, lUint8ArrayDataOffset, lUint8ArrayDataLength);
    return gCAPI_WebRtcNetwork_Instances[lIndex].SendData(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), arrayBuffer, lReliable);
}
function CAPI_WebRtcNetwork_GetBufferedAmount(lIndex, lConnectionId, lReliable) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].GetBufferedAmount(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), lReliable);
}
function CAPI_WebRtcNetwork_Dequeue(lIndex) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Dequeue();
}
function CAPI_WebRtcNetwork_Peek(lIndex) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Peek();
}
/**Allows to peek into the next event to figure out its length and allocate
 * the memory needed to store it before calling
 *      CAPI_WebRtcNetwork_DequeueEm
 *
 * @param {type} lIndex
 * @returns {Number}
 */
function CAPI_WebRtcNetwork_PeekEventDataLength(lIndex) {
    var lNetEvent = gCAPI_WebRtcNetwork_Instances[lIndex].Peek();
    return CAPI_WebRtcNetwork_CheckEventLength(lNetEvent);
}
//helper
function CAPI_WebRtcNetwork_CheckEventLength(lNetEvent) {
    if (lNetEvent == null) {
        //invalid event
        return -1;
    }
    else if (lNetEvent.RawData == null) {
        //no data
        return 0;
    }
    else if (typeof lNetEvent.RawData === "string") {
        //no user strings are allowed thus we get away with counting the characters
        //(ASCII only!)
        return lNetEvent.RawData.length;
    }
    else //message event types 1 and 2 only? check for it?
     {
        //its not null and not a string. can only be a Uint8Array if we didn't
        //mess something up in the implementation
        return lNetEvent.RawData.length;
    }
}
function CAPI_WebRtcNetwork_EventDataToUint8Array(data, dataUint8Array, dataOffset, dataLength) {
    //data can be null, string or Uint8Array
    //return value will be the length of data we used
    if (data == null) {
        return 0;
    }
    else if ((typeof data) === "string") {
        //in case we don't get a large enough array we need to cut off the string
        var i = 0;
        for (i = 0; i < data.length && i < dataLength; i++) {
            dataUint8Array[dataOffset + i] = data.charCodeAt(i);
        }
        return i;
    }
    else {
        var i = 0;
        //in case we don't get a large enough array we need to cut off the string
        for (i = 0; i < data.length && i < dataLength; i++) {
            dataUint8Array[dataOffset + i] = data[i];
        }
        return i;
    }
}
//Version for emscripten or anything that doesn't have a garbage collector.
// The memory for everything needs to be allocated before the call.
function CAPI_WebRtcNetwork_DequeueEm(lIndex, lTypeIntArray, lTypeIntIndex, lConidIntArray, lConidIndex, lDataUint8Array, lDataOffset, lDataLength, lDataLenIntArray, lDataLenIntIndex) {
    var nEvt = CAPI_WebRtcNetwork_Dequeue(lIndex);
    if (nEvt == null)
        return false;
    lTypeIntArray[lTypeIntIndex] = nEvt.Type;
    lConidIntArray[lConidIndex] = nEvt.ConnectionId.id;
    //console.debug("event" + nEvt.netEventType);
    var length = CAPI_WebRtcNetwork_EventDataToUint8Array(nEvt.RawData, lDataUint8Array, lDataOffset, lDataLength);
    lDataLenIntArray[lDataLenIntIndex] = length; //return the length if so the user knows how much of the given array is used
    return true;
}
function CAPI_WebRtcNetwork_PeekEm(lIndex, lTypeIntArray, lTypeIntIndex, lConidIntArray, lConidIndex, lDataUint8Array, lDataOffset, lDataLength, lDataLenIntArray, lDataLenIntIndex) {
    var nEvt = CAPI_WebRtcNetwork_Peek(lIndex);
    if (nEvt == null)
        return false;
    lTypeIntArray[lTypeIntIndex] = nEvt.Type;
    lConidIntArray[lConidIndex] = nEvt.ConnectionId.id;
    //console.debug("event" + nEvt.netEventType);
    var length = CAPI_WebRtcNetwork_EventDataToUint8Array(nEvt.RawData, lDataUint8Array, lDataOffset, lDataLength);
    lDataLenIntArray[lDataLenIntIndex] = length; //return the length if so the user knows how much of the given array is used
    return true;
}
function CAPI_MediaNetwork_IsAvailable() {
    if (_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"] && _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserWebRtcCall"])
        return true;
    return false;
}
function CAPI_MediaNetwork_HasUserMedia() {
    if (navigator && navigator.mediaDevices)
        return true;
    return false;
}
function CAPI_MediaNetwork_Create(lJsonConfiguration) {
    var config = new _media_index__WEBPACK_IMPORTED_MODULE_1__["NetworkConfig"]();
    config = JSON.parse(lJsonConfiguration);
    var mediaNetwork = new _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"](config);
    var lIndex = gCAPI_WebRtcNetwork_InstancesNextIndex;
    gCAPI_WebRtcNetwork_InstancesNextIndex++;
    gCAPI_WebRtcNetwork_Instances[lIndex] = mediaNetwork;
    return lIndex;
}
//Configure(config: MediaConfig): void;
function CAPI_MediaNetwork_Configure(lIndex, audio, video, minWidth, minHeight, maxWidth, maxHeight, idealWidth, idealHeight, minFps, maxFps, idealFps, deviceName) {
    if (deviceName === void 0) { deviceName = ""; }
    var config = new _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaConfig"]();
    config.Audio = audio;
    config.Video = video;
    config.MinWidth = minWidth;
    config.MinHeight = minHeight;
    config.MaxWidth = maxWidth;
    config.MaxHeight = maxHeight;
    config.IdealWidth = idealWidth;
    config.IdealHeight = idealHeight;
    config.MinFps = minFps;
    config.MaxFps = maxFps;
    config.IdealFps = idealFps;
    config.VideoDeviceName = deviceName;
    config.FrameUpdates = true;
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.Configure(config);
}
//GetConfigurationState(): MediaConfigurationState;
function CAPI_MediaNetwork_GetConfigurationState(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.GetConfigurationState();
}
//Note: not yet glued to the C# version!
//GetConfigurationError(): string;
function CAPI_MediaNetwork_GetConfigurationError(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.GetConfigurationError();
}
//ResetConfiguration(): void;
function CAPI_MediaNetwork_ResetConfiguration(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.ResetConfiguration();
}
//TryGetFrame(id: ConnectionId): RawFrame;
function CAPI_MediaNetwork_TryGetFrame(lIndex, lConnectionId, lWidthInt32Array, lWidthIntArrayIndex, lHeightInt32Array, lHeightIntArrayIndex, lBufferUint8Array, lBufferUint8ArrayOffset, lBufferUint8ArrayLength) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.TryGetFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
    if (frame == null || frame.Buffer == null) {
        return false;
    }
    else {
        lWidthInt32Array[lWidthIntArrayIndex] = frame.Width;
        lHeightInt32Array[lHeightIntArrayIndex] = frame.Height;
        for (var i = 0; i < lBufferUint8ArrayLength && i < frame.Buffer.length; i++) {
            lBufferUint8Array[lBufferUint8ArrayOffset + i] = frame.Buffer[i];
        }
        return true;
    }
}
function CAPI_MediaNetwork_TryGetFrame_ToTexture(lIndex, lConnectionId, lWidth, lHeight, gl, texture) {
    //console.log("CAPI_MediaNetwork_TryGetFrame_ToTexture");
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.TryGetFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
    if (frame == null) {
        return false;
    }
    else if (frame.Width != lWidth || frame.Height != lHeight) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LW("CAPI_MediaNetwork_TryGetFrame_ToTexture failed. Width height expected: " + frame.Width + "x" + frame.Height + " but received " + lWidth + "x" + lHeight);
        return false;
    }
    else {
        frame.ToTexture(gl, texture);
        return true;
    }
}
/*
export function CAPI_MediaNetwork_TryGetFrame_ToTexture2(lIndex: number, lConnectionId: number,
    lWidthInt32Array: Int32Array, lWidthIntArrayIndex: number,
    lHeightInt32Array: Int32Array, lHeightIntArrayIndex: number,
    gl:WebGL2RenderingContext): WebGLTexture
{
    //console.log("CAPI_MediaNetwork_TryGetFrame_ToTexture");
    let mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex] as BrowserMediaNetwork;
    let frame = mediaNetwork.TryGetFrame(new ConnectionId(lConnectionId));

    if (frame == null) {
        return false;
    } else {
        lWidthInt32Array[lWidthIntArrayIndex] = frame.Width;
        lHeightInt32Array[lHeightIntArrayIndex] = frame.Height;
        let texture  = frame.ToTexture2(gl);
        return texture;
    }
}
*/
function CAPI_MediaNetwork_TryGetFrame_Resolution(lIndex, lConnectionId, lWidthInt32Array, lWidthIntArrayIndex, lHeightInt32Array, lHeightIntArrayIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.PeekFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
    if (frame == null) {
        return false;
    }
    else {
        lWidthInt32Array[lWidthIntArrayIndex] = frame.Width;
        lHeightInt32Array[lHeightIntArrayIndex] = frame.Height;
        return true;
    }
}
//Returns the frame buffer size or -1 if no frame is available
function CAPI_MediaNetwork_TryGetFrameDataLength(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.PeekFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
    var length = -1;
    //added frame.Buffer != null as the frame might be a LazyFrame just creating a copy of the html video element
    //in the moment frame.Buffer is called. if this fails for any reasion it might return null despite
    //the frame object itself being available
    if (frame != null && frame.Buffer != null) {
        length = frame.Buffer.length;
    }
    //SLog.L("data length:" + length);
    return length;
}
function CAPI_MediaNetwork_SetVolume(lIndex, volume, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.SetVolume(volume, new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_HasAudioTrack(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.HasAudioTrack(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_HasVideoTrack(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.HasVideoTrack(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_SetMute(lIndex, value) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.SetMute(value);
}
function CAPI_MediaNetwork_IsMute(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.IsMute();
}
function CAPI_DeviceApi_Update() {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Update();
}
function CAPI_DeviceApi_RequestUpdate() {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].RequestUpdate();
}
function CAPI_DeviceApi_LastUpdate() {
    return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].LastUpdate;
}
function CAPI_Media_GetVideoDevices_Length() {
    return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.GetVideoDevices().length;
}
function CAPI_Media_GetVideoDevices(index) {
    var devs = _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.GetVideoDevices();
    if (devs.length > index) {
        return devs[index];
    }
    else {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Requested device with index " + index + " does not exist.");
        //it needs to be "" to behave the same to the C++ API. std::string can't be null
        return "";
    }
}
function CAPI_VideoInput_AddCanvasDevice(query, name, width, height, fps) {
    var canvas = document.querySelector(query);
    if (canvas) {
        console.debug("CAPI_VideoInput_AddCanvasDevice", { query: query, name: name, width: width, height: height, fps: fps });
        if (width <= 0 || height <= 0) {
            width = canvas.width;
            height = canvas.height;
        }
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.VideoInput.AddCanvasDevice(canvas, name, width, height, fps); //, width, height, fps);
        return true;
    }
    return false;
}
function CAPI_VideoInput_AddDevice(name, width, height, fps) {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.VideoInput.AddDevice(name, width, height, fps);
}
function CAPI_VideoInput_RemoveDevice(name) {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.VideoInput.RemoveDevice(name);
}
function CAPI_VideoInput_UpdateFrame(name, lBufferUint8Array, lBufferUint8ArrayOffset, lBufferUint8ArrayLength, width, height, rotation, firstRowIsBottom) {
    var dataPtrClamped = null;
    if (lBufferUint8Array && lBufferUint8ArrayLength > 0) {
        dataPtrClamped = new Uint8ClampedArray(lBufferUint8Array.buffer, lBufferUint8ArrayOffset, lBufferUint8ArrayLength);
    }
    return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["Media"].SharedInstance.VideoInput.UpdateFrame(name, dataPtrClamped, width, height, _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["VideoInputType"].ARGB, rotation, firstRowIsBottom);
}
function GetUnityCanvas() {
    if (gCAPI_Canvas !== null)
        return gCAPI_Canvas;
    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogWarning("Using GetUnityCanvas without a known cavans reference.");
    return document.querySelector("canvas");
}
function GetUnityContext() {
    return GetUnityCanvas().getContext("webgl2");
}


/***/ }),

/***/ "./src/awrtc/unity/index.ts":
/*!**********************************!*\
  !*** ./src/awrtc/unity/index.ts ***!
  \**********************************/
/*! exports provided: CAPI_InitAsync, CAPI_PollInitState, CAPI_SLog_SetLogLevel, CAPI_WebRtcNetwork_IsAvailable, CAPI_WebRtcNetwork_IsBrowserSupported, CAPI_WebRtcNetwork_Create, CAPI_WebRtcNetwork_Release, CAPI_WebRtcNetwork_Connect, CAPI_WebRtcNetwork_StartServer, CAPI_WebRtcNetwork_StopServer, CAPI_WebRtcNetwork_Disconnect, CAPI_WebRtcNetwork_Shutdown, CAPI_WebRtcNetwork_Update, CAPI_WebRtcNetwork_Flush, CAPI_WebRtcNetwork_SendData, CAPI_WebRtcNetwork_SendDataEm, CAPI_WebRtcNetwork_GetBufferedAmount, CAPI_WebRtcNetwork_Dequeue, CAPI_WebRtcNetwork_Peek, CAPI_WebRtcNetwork_PeekEventDataLength, CAPI_WebRtcNetwork_CheckEventLength, CAPI_WebRtcNetwork_EventDataToUint8Array, CAPI_WebRtcNetwork_DequeueEm, CAPI_WebRtcNetwork_PeekEm, CAPI_MediaNetwork_IsAvailable, CAPI_MediaNetwork_HasUserMedia, CAPI_MediaNetwork_Create, CAPI_MediaNetwork_Configure, CAPI_MediaNetwork_GetConfigurationState, CAPI_MediaNetwork_GetConfigurationError, CAPI_MediaNetwork_ResetConfiguration, CAPI_MediaNetwork_TryGetFrame, CAPI_MediaNetwork_TryGetFrame_ToTexture, CAPI_MediaNetwork_TryGetFrame_Resolution, CAPI_MediaNetwork_TryGetFrameDataLength, CAPI_MediaNetwork_SetVolume, CAPI_MediaNetwork_HasAudioTrack, CAPI_MediaNetwork_HasVideoTrack, CAPI_MediaNetwork_SetMute, CAPI_MediaNetwork_IsMute, CAPI_DeviceApi_Update, CAPI_DeviceApi_RequestUpdate, CAPI_DeviceApi_LastUpdate, CAPI_Media_GetVideoDevices_Length, CAPI_Media_GetVideoDevices, CAPI_VideoInput_AddCanvasDevice, CAPI_VideoInput_AddDevice, CAPI_VideoInput_RemoveDevice, CAPI_VideoInput_UpdateFrame, GetUnityCanvas, GetUnityContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CAPI */ "./src/awrtc/unity/CAPI.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_InitAsync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_PollInitState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_SLog_SetLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_IsBrowserSupported"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Release"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Connect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_StartServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_StopServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Disconnect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Shutdown"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Flush"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_SendData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_SendDataEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_GetBufferedAmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Dequeue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Peek"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_PeekEventDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_CheckEventLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_EventDataToUint8Array"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_DequeueEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_PeekEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasUserMedia"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_Configure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_GetConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_GetConfigurationError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_ResetConfiguration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_ToTexture", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrame_ToTexture"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame_Resolution", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrame_Resolution"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrameDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_SetVolume"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasAudioTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasVideoTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_SetMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_IsMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_RequestUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_LastUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices_Length", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_Media_GetVideoDevices", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddCanvasDevice", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_VideoInput_AddCanvasDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_AddDevice", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_VideoInput_AddDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_RemoveDevice", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_VideoInput_RemoveDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_VideoInput_UpdateFrame", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_VideoInput_UpdateFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetUnityCanvas", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["GetUnityCanvas"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetUnityContext", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["GetUnityContext"]; });




/***/ }),

/***/ "./src/test/BrowserApiTest.ts":
/*!************************************!*\
  !*** ./src/test/BrowserApiTest.ts ***!
  \************************************/
/*! exports provided: some_random_export_1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "some_random_export_1", function() { return some_random_export_1; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//current setup needs to load everything as a module
function some_random_export_1() {
}
describe("BrowserApiTest_MediaStreamApi", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it("devices", function (done) {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
            expect(devices).not.toBeNull();
            devices.forEach(function (device) {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
            });
            done();
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
    it("devices2", function (done) {
        var gStream;
        var constraints = { video: { deviceId: undefined }, audio: { deviceId: undefined } };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
            //if this stream stops the access to labels disapears again after
            //a few ms (tested in firefox)
            gStream = stream;
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                expect(devices).not.toBeNull();
                devices.forEach(function (device) {
                    expect(device.label).not.toBeNull();
                    expect(device.label).not.toBe("");
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
                gStream.getTracks().forEach(function (t) {
                    t.stop();
                });
                done();
            })
                .catch(function (err) {
                console.log(err.name + ": " + err.message);
                fail();
            });
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
    it("devices3", function (done) {
        var gStream;
        var constraints = { video: true, audio: false };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
            //if this stream stops the access to labels disapears again after
            //a few ms (tested in firefox)
            gStream = stream;
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                expect(devices).not.toBeNull();
                devices.forEach(function (device) {
                    expect(device.label).not.toBeNull();
                    expect(device.label).not.toBe("");
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
                gStream.getTracks().forEach(function (t) {
                    t.stop();
                });
                done();
            })
                .catch(function (err) {
                console.log(err.name + ": " + err.message);
                fail();
            });
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
});


/***/ }),

/***/ "./src/test/CallTest.ts":
/*!******************************!*\
  !*** ./src/test/CallTest.ts ***!
  \******************************/
/*! exports provided: CallTestHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallTestHelper", function() { return CallTestHelper; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var CallTestHelper = /** @class */ (function () {
    function CallTestHelper() {
    }
    CallTestHelper.CreateCall = function (video, audio) {
        var nconfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetworkConfig"]();
        nconfig.SignalingUrl = "wss://signaling.because-why-not.com:443/test";
        var call = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserWebRtcCall"](nconfig);
        return call;
    };
    return CallTestHelper;
}());

describe("CallTest", function () {
    var originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it("CallTest normal", function () {
        expect(true).toBe(true);
    });
    it("CallTest async", function (done) {
        setTimeout(function () {
            expect(true).toBe(true);
            done();
        }, 1000);
    });
    it("Send test", function (done) {
        var call1 = null;
        var call2 = null;
        var call1ToCall2;
        var call2ToCall1;
        var address = "webunittest";
        var teststring1 = "teststring1";
        var teststring2 = "teststring2";
        var testdata1 = new Uint8Array([1, 2]);
        var testdata2 = new Uint8Array([3, 4]);
        call1 = CallTestHelper.CreateCall(false, false);
        expect(call1).not.toBeNull();
        call2 = CallTestHelper.CreateCall(false, false);
        expect(call2).not.toBeNull();
        expect(true).toBe(true);
        var mconfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
        mconfig.Audio = false;
        mconfig.Video = false;
        call1.addEventListener(function (sender, args) {
            if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].ConfigurationComplete) {
                console.debug("call1 ConfigurationComplete");
                call2.Configure(mconfig);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].WaitForIncomingCall) {
                console.debug("call1 WaitForIncomingCall");
                call2.Call(address);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].CallAccepted) {
                var ar = args;
                call1ToCall2 = ar.ConnectionId;
                //wait for message
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].Message) {
                console.debug("call1 Message");
                var margs = args;
                expect(margs.Content).toBe(teststring1);
                expect(margs.Reliable).toBe(true);
                call1.Send(teststring2, false, call1ToCall2);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].DataMessage) {
                console.debug("call1 DataMessage");
                var dargs = args;
                expect(dargs.Reliable).toBe(true);
                var recdata = dargs.Content;
                expect(testdata1[0]).toBe(recdata[0]);
                expect(testdata1[1]).toBe(recdata[1]);
                console.debug("call1 send DataMessage");
                call1.SendData(testdata2, false, call1ToCall2);
            }
            else {
                console.error("unexpected event: " + args.Type);
                expect(true).toBe(false);
            }
        });
        call2.addEventListener(function (sender, args) {
            if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].ConfigurationComplete) {
                console.debug("call2 ConfigurationComplete");
                call1.Listen(address);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].CallAccepted) {
                var ar = args;
                call2ToCall1 = ar.ConnectionId;
                expect(call2ToCall1).toBeDefined();
                call2.Send(teststring1);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].Message) {
                console.debug("call2 Message");
                var margs = args;
                expect(margs.Content).toBe(teststring2);
                expect(margs.Reliable).toBe(false);
                console.debug("call2 send DataMessage " + call2ToCall1.id);
                call2.SendData(testdata1, true, call2ToCall1);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].DataMessage) {
                console.debug("call2 DataMessage");
                var dargs = args;
                expect(dargs.Reliable).toBe(false);
                var recdata = dargs.Content;
                expect(testdata2[0]).toBe(recdata[0]);
                expect(testdata2[1]).toBe(recdata[1]);
                done();
            }
            else {
                console.error("unexpected event: " + args.Type);
                expect(true).toBe(false);
            }
        });
        setInterval(function () {
            call1.Update();
            call2.Update();
        }, 50);
        call1.Configure(mconfig);
    });
});


/***/ }),

/***/ "./src/test/DeviceApiTest.ts":
/*!***********************************!*\
  !*** ./src/test/DeviceApiTest.ts ***!
  \***********************************/
/*! exports provided: DeviceApiTest_export */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceApiTest_export", function() { return DeviceApiTest_export; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//current setup needs to load everything as a module

function DeviceApiTest_export() {
}
describe("DeviceApiTest", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Reset();
    });
    function printall() {
        console.log("current DeviceApi.Devices:");
        for (var k in _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices) {
            var v = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices[k];
            console.log(v.deviceId + " defaultLabel:" + v.defaultLabel + " label:" + v.label + " guessed:" + v.isLabelGuessed);
        }
    }
    it("update", function (done) {
        var update1complete = false;
        var update2complete = false;
        var deviceCount = 0;
        expect(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length).toBe(0);
        //first without device labels
        var updatecall1 = function () {
            expect(update1complete).toBe(false);
            expect(update2complete).toBe(false);
            console.debug("updatecall1");
            printall();
            var devices1 = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices;
            deviceCount = Object.keys(devices1).length;
            expect(deviceCount).toBeGreaterThan(0);
            var key1 = Object.keys(devices1)[0];
            //these tests don't work anymore due to forcing permissions for devices in
            //unit tests. 
            //In a real browser we don't have access to device names until GetUserMedia
            //returned. Meaning the API will fill in the names using "videoinput 1"
            //"videoinput 2" and so on. 
            //Now the tests force permissions = true so we already have full
            //access at the start
            /*
            expect(devices1[key1].label).toBe("videoinput 1");
            expect(devices1[key1].isLabelGuessed).toBe(true);
            if(deviceCount > 1)
            {
                let key2 = Object.keys(devices1)[1];
                expect(devices1[key2].label).toBe("videoinput 2");
                expect(devices1[key2].isLabelGuessed).toBe(true);
            }
            */
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RemOnChangedHandler(updatecall1);
            //second call with device labels
            var updatecall2 = function () {
                console.debug("updatecall2");
                printall();
                //check if the handler work properly
                expect(update1complete).toBe(true);
                expect(update2complete).toBe(false);
                //sadly can't simulate fixed device names for testing
                var devices2 = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices;
                expect(Object.keys(devices2).length).toBe(deviceCount);
                var key2 = Object.keys(devices2)[0];
                //should have original label now
                expect(devices2[key1].label).not.toBe("videodevice 1");
                //and not be guessed anymore
                expect(devices2[key1].isLabelGuessed).toBe(false, "Chrome fails this now. Likely due to file://. Check for better test setup");
                update2complete = true;
                _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Reset();
                expect(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length).toBe(0);
                done();
            };
            update1complete = true;
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(updatecall2);
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RequestUpdate();
        };
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(updatecall1);
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Update();
    });
    it("capi_update", function (done) {
        var update1complete = false;
        var update2complete = false;
        var deviceCount = 0;
        var devices_length_unitialized = Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"])();
        expect(devices_length_unitialized).toBe(0);
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(function () {
            var dev_length = Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"])();
            expect(dev_length).not.toBe(0);
            expect(dev_length).toBe(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length);
            var keys = Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices);
            var counter = 0;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                var expectedVal = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices[k].label;
                var actual = Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices"])(counter);
                expect(actual).toBe(expectedVal);
                counter++;
            }
            done();
        });
        Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Update"])();
    });
    it("isMediaAvailable", function () {
        var res = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].IsUserMediaAvailable();
        expect(res).toBe(true);
    });
    it("getUserMedia", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getBrowserUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    expect(stream).not.toBeNull();
                    expect(stream.getVideoTracks().length).toBe(0);
                    expect(stream.getAudioTracks().length).toBe(1);
                    return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getBrowserUserMedia({ video: true })];
                case 2:
                    stream = _a.sent();
                    expect(stream).not.toBeNull();
                    expect(stream.getAudioTracks().length).toBe(0);
                    expect(stream.getVideoTracks().length).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("getAssetMedia", function () { return __awaiter(void 0, void 0, void 0, function () {
        var config, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = true;
                    config.Video = false;
                    return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getAssetUserMedia(config)];
                case 1:
                    stream = _a.sent();
                    expect(stream).not.toBeNull();
                    expect(stream.getVideoTracks().length).toBe(0);
                    expect(stream.getAudioTracks().length).toBe(1);
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = false;
                    config.Video = true;
                    return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getAssetUserMedia(config)];
                case 2:
                    stream = _a.sent();
                    expect(stream).not.toBeNull();
                    expect(stream.getAudioTracks().length).toBe(0);
                    expect(stream.getVideoTracks().length).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("getAssetMedia_invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var config, error, stream, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = false;
                    config.Video = true;
                    config.VideoDeviceName = "invalid name";
                    error = null;
                    stream = null;
                    console.log("Expecting error message: Failed to find deviceId for label invalid name");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getAssetUserMedia(config)];
                case 2:
                    stream = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    expect(stream).toBeNull();
                    expect(error).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    //check for a specific bug causing promise catch not to trigger correctly
    //due to error in ToConstraints
    it("getAssetMedia_invalid_promise", function (done) {
        var config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
        config.Audio = false;
        config.Video = true;
        config.VideoDeviceName = "invalid name";
        var result = null;
        result = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].getAssetUserMedia(config);
        result.then(function () {
            fail("getAssetUserMedia returned but was expected to fail");
        }).catch(function (error) {
            expect(error).toBeTruthy();
            done();
        });
    });
    it("UpdateAsync", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].GetVideoDevices().length).toBe(0);
                    return [4 /*yield*/, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].UpdateAsync()];
                case 1:
                    _a.sent();
                    expect(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].GetVideoDevices().length).toBeGreaterThan(0);
                    expect(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].GetVideoDevices().length).toBe(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"])());
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    /*
    it("Devices", async () => {

        DeviceApi.RequestUpdate

        let config = new MediaConfig();
        config.Audio = false;
        config.Video = true;
        config.VideoDeviceName = "invalid name"
        let error = null;
        let stream :MediaStream = null;
        console.log("Expecting error message: Failed to find deviceId for label invalid name");
        try
        {
            stream = await DeviceApi.getAssetUserMedia(config);
        }catch(err){
            error = err;
        }
        expect(stream).toBeNull();
        expect(error).toBeTruthy();
    });
*/
});


/***/ }),

/***/ "./src/test/LocalNetworkTest.ts":
/*!**************************************!*\
  !*** ./src/test/LocalNetworkTest.ts ***!
  \**************************************/
/*! exports provided: LocalNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalNetworkTest", function() { return LocalNetworkTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var LocalNetworkTest = /** @class */ (function (_super) {
    __extends(LocalNetworkTest, _super);
    function LocalNetworkTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalNetworkTest.prototype.setup = function () {
        _super.prototype.setup.call(this);
        //special tests
    };
    LocalNetworkTest.prototype._CreateNetworkImpl = function () {
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]();
    };
    return LocalNetworkTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("LocalNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new LocalNetworkTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/MediaNetworkTest.ts":
/*!**************************************!*\
  !*** ./src/test/MediaNetworkTest.ts ***!
  \**************************************/
/*! exports provided: MediaNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaNetworkTest", function() { return MediaNetworkTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var MediaNetworkTest = /** @class */ (function () {
    function MediaNetworkTest() {
        this.createdNetworks = [];
    }
    MediaNetworkTest.prototype.createDefault = function () {
        var netConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetworkConfig"]();
        netConfig.SignalingUrl = null;
        var createdNetwork = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaNetwork"](netConfig);
        this.createdNetworks.push(createdNetwork);
        return createdNetwork;
    };
    MediaNetworkTest.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterEach(function () {
            for (var _i = 0, _a = _this.createdNetworks; _i < _a.length; _i++) {
                var net = _a[_i];
                net.Dispose();
            }
            _this.createdNetworks = new Array();
        });
        it("FrameUpdates", function (done) {
            var mediaConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
            var network = _this.createDefault();
            network.Configure(mediaConfig);
            setInterval(function () {
                network.Update();
                var localFrame = network.TryGetFrame(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID);
                if (localFrame != null) {
                    expect(localFrame.Height).toBeGreaterThan(0);
                    expect(localFrame.Width).toBeGreaterThan(0);
                    expect(localFrame.Buffer).not.toBeNull();
                    done();
                }
                network.Flush();
            }, 10);
        });
        it("MediaEventLocal", function (done) {
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaStream"].DEBUG_SHOW_ELEMENTS = true;
            var mediaConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
            var network = _this.createDefault();
            network.Configure(mediaConfig);
            setInterval(function () {
                network.Update();
                var evt = null;
                while ((evt = network.DequeueMediaEvent()) != null) {
                    console.log("Stream added", evt);
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    done();
                }
                network.Flush();
            }, 10);
        });
        it("MediaEventRemote", function (done) {
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaStream"].DEBUG_SHOW_ELEMENTS = true;
            var testaddress = "testaddress" + Math.random();
            var sender = _this.createDefault();
            var receiver = _this.createDefault();
            var configureComplete = false;
            var senderFrame = false;
            var receiverFrame = false;
            sender.Configure(new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]());
            setInterval(function () {
                sender.Update();
                receiver.Update();
                if (configureComplete == false) {
                    var state = sender.GetConfigurationState();
                    if (state == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Successful) {
                        configureComplete = true;
                        sender.StartServer(testaddress);
                    }
                    else if (state == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Failed) {
                        fail();
                    }
                }
                var sndEvt = sender.Dequeue();
                if (sndEvt != null) {
                    console.log("sender event: " + sndEvt);
                    if (sndEvt.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
                        receiver.Connect(testaddress);
                    }
                }
                var recEvt = receiver.Dequeue();
                if (recEvt != null) {
                    console.log("receiver event: " + recEvt);
                }
                var evt = null;
                while ((evt = sender.DequeueMediaEvent()) != null) {
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    senderFrame = true;
                    console.log("sender received first frame");
                }
                while ((evt = receiver.DequeueMediaEvent()) != null) {
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    receiverFrame = true;
                    console.log("receiver received first frame");
                }
                sender.Flush();
                receiver.Flush();
                if (senderFrame && receiverFrame)
                    done();
            }, 40);
        }, 15000);
    };
    return MediaNetworkTest;
}());

describe("MediaNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new MediaNetworkTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/MediaTest.ts":
/*!*******************************!*\
  !*** ./src/test/MediaTest.ts ***!
  \*******************************/
/*! exports provided: MediaTest_export */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaTest_export", function() { return MediaTest_export; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/* harmony import */ var VideoInputTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! VideoInputTest */ "./src/test/VideoInputTest.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


function MediaTest_export() {
}
describe("MediaTest", function () {
    beforeEach(function (done) {
        var handler = function () {
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RemOnChangedHandler(handler);
            done();
        };
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(handler);
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Update();
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].ResetSharedInstance();
    });
    it("SharedInstance", function () {
        expect(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].SharedInstance).toBeTruthy();
        var instance1 = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].SharedInstance;
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].ResetSharedInstance();
        expect(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].SharedInstance).not.toBe(instance1);
    });
    it("GetVideoDevices", function () {
        var media = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"]();
        var devs = media.GetVideoDevices();
        expect(devs).toBeTruthy();
        expect(devs.length).toBeGreaterThan(0);
    });
    it("GetUserMedia", function () { return __awaiter(void 0, void 0, void 0, function () {
        var media, config, stream, err, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    media = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"]();
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = false;
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 1:
                    stream = _a.sent();
                    expect(stream).not.toBeNull();
                    expect(stream.getAudioTracks().length).toBe(0);
                    expect(stream.getVideoTracks().length).toBe(1);
                    stream = null;
                    err = null;
                    config.VideoDeviceName = "invalid name";
                    console.log("Expecting error message: Failed to find deviceId for label invalid name");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 3:
                    stream = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    err = error_1;
                    return [3 /*break*/, 5];
                case 5:
                    expect(err).not.toBeNull();
                    expect(stream).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    it("GetUserMedia_videoinput", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var name, media, config, canvas, streamCamera, streamCanvas, streamCanvas2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = "test_canvas";
                    media = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"]();
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = false;
                    config.Video = true;
                    canvas = Object(VideoInputTest__WEBPACK_IMPORTED_MODULE_1__["MakeTestCanvas"])();
                    media.VideoInput.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 1:
                    streamCamera = _a.sent();
                    expect(streamCamera).not.toBeNull();
                    expect(streamCamera.getAudioTracks().length).toBe(0);
                    expect(streamCamera.getVideoTracks().length).toBe(1);
                    config.VideoDeviceName = name;
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 2:
                    streamCanvas = _a.sent();
                    expect(streamCanvas).not.toBeNull();
                    expect(streamCanvas.getAudioTracks().length).toBe(0);
                    expect(streamCanvas.getVideoTracks().length).toBe(1);
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 3:
                    streamCanvas2 = _a.sent();
                    expect(streamCanvas2).not.toBeNull();
                    expect(streamCanvas2.getAudioTracks().length).toBe(0);
                    expect(streamCanvas2.getVideoTracks().length).toBe(1);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it("GetUserMedia_videoinput_and_audio", function () { return __awaiter(void 0, void 0, void 0, function () {
        var name, media, config, canvas, stream, err_1, error_result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = "test_canvas";
                    media = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"]();
                    config = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
                    config.Audio = true;
                    config.Video = true;
                    canvas = Object(VideoInputTest__WEBPACK_IMPORTED_MODULE_1__["MakeTestCanvas"])();
                    media.VideoInput.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
                    config.VideoDeviceName = name;
                    stream = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 2:
                    stream = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    fail(err_1);
                    return [3 /*break*/, 4];
                case 4:
                    expect(stream).not.toBeNull();
                    expect(stream.getAudioTracks().length).toBe(1);
                    expect(stream.getVideoTracks().length).toBe(1);
                    config.VideoDeviceName = "invalid name";
                    stream = null;
                    error_result = null;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, media.getUserMedia(config)];
                case 6:
                    stream = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    error_result = err_2;
                    return [3 /*break*/, 8];
                case 8:
                    expect(error_result).not.toBeNull();
                    expect(stream).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); }, 15000);
    //CAPI needs to be changed to use Media only instead the device API
    it("MediaCapiVideoInput", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var name, canvas;
        return __generator(this, function (_a) {
            //empty normal device api
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Reset();
            expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"])()).toBe(0);
            name = "test_canvas";
            canvas = Object(VideoInputTest__WEBPACK_IMPORTED_MODULE_1__["MakeTestCanvas"])();
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].SharedInstance.VideoInput.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
            expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices_Length"])()).toBe(1);
            expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_Media_GetVideoDevices"])(0)).toBe(name);
            done();
            return [2 /*return*/];
        });
    }); });
});
describe("MediaStreamTest", function () {
    beforeEach(function (done) {
        var handler = function () {
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RemOnChangedHandler(handler);
            done();
        };
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(handler);
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Update();
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["Media"].ResetSharedInstance();
    });
    var TestStreamContainer = /** @class */ (function () {
        function TestStreamContainer() {
            var canvas = document.createElement("canvas");
            canvas.width = 4;
            canvas.height = 4;
            var ctx = canvas.getContext("2d");
            //make blue for debugging purposes
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.canvas = canvas;
            this.stream = canvas.captureStream();
        }
        TestStreamContainer.prototype.MakeFrame = function (color) {
            var ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //make blue for debugging purposes
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        return TestStreamContainer;
    }());
    function MakeTestStreamContainer() {
        return new TestStreamContainer();
    }
    //TODO: need proper way to wait and check with async/ await
    function sleep(ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    }
    function WaitFor() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    }
    it("buffer_and_trygetframe", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var testcontainer, stream, frame, buffer, r, g, b, a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testcontainer = MakeTestStreamContainer();
                    stream = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaStream"](testcontainer.stream);
                    frame = stream.TryGetFrame();
                    expect(frame).toBeNull();
                    return [4 /*yield*/, sleep(100)];
                case 1:
                    _a.sent();
                    stream.Update();
                    //waited for the internals to get initialized. We should have a frame now
                    frame = stream.TryGetFrame();
                    expect(frame).not.toBeNull();
                    ;
                    buffer = frame.Buffer;
                    expect(buffer).not.toBeNull();
                    ;
                    r = buffer[0];
                    g = buffer[1];
                    b = buffer[2];
                    a = buffer[3];
                    expect(r).toBe(0);
                    expect(g).toBe(0);
                    expect(b).toBe(255);
                    expect(a).toBe(255);
                    //we removed the frame now. this should be null
                    frame = stream.TryGetFrame();
                    expect(frame).toBeNull();
                    //make a new frame with different color
                    testcontainer.MakeFrame("#FFFF00");
                    return [4 /*yield*/, sleep(100)];
                case 2:
                    _a.sent();
                    stream.Update();
                    //get new frame
                    frame = stream.TryGetFrame();
                    expect(frame).not.toBeNull();
                    ;
                    buffer = frame.Buffer;
                    expect(buffer).not.toBeNull();
                    ;
                    //should be different color now
                    r = buffer[0];
                    g = buffer[1];
                    b = buffer[2];
                    a = buffer[3];
                    expect(r).toBe(255);
                    expect(g).toBe(255);
                    expect(b).toBe(0);
                    expect(a).toBe(255);
                    //done
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    function createTexture(gl) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        var level = 0;
        var internalFormat = gl.RGBA;
        var width = 1;
        var height = 1;
        var border = 0;
        var srcFormat = gl.RGBA;
        var srcType = gl.UNSIGNED_BYTE;
        var pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        return texture;
    }
    it("texture", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var testcontainer, stream, frame, canvas, gl, texture, res, dst_buffer, fb, r, g, b, a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testcontainer = MakeTestStreamContainer();
                    stream = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaStream"](testcontainer.stream);
                    //document.body.appendChild(testcontainer.canvas);
                    //waited for the internals to get initialized. We should have a frame now
                    return [4 /*yield*/, sleep(100)];
                case 1:
                    //document.body.appendChild(testcontainer.canvas);
                    //waited for the internals to get initialized. We should have a frame now
                    _a.sent();
                    stream.Update();
                    frame = stream.PeekFrame();
                    expect(frame).not.toBeNull();
                    canvas = document.createElement("canvas");
                    canvas.width = testcontainer.canvas.width;
                    canvas.height = testcontainer.canvas.height;
                    gl = canvas.getContext("webgl2");
                    //testing only. draw this one red
                    gl.clearColor(1, 0, 0, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    texture = createTexture(gl);
                    res = frame.ToTexture(gl, texture);
                    expect(res).toBe(true);
                    dst_buffer = new Uint8Array(testcontainer.canvas.width * testcontainer.canvas.height * 4);
                    fb = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                    gl.readPixels(0, 0, testcontainer.canvas.width, testcontainer.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, dst_buffer);
                    r = dst_buffer[0];
                    g = dst_buffer[1];
                    b = dst_buffer[2];
                    a = dst_buffer[3];
                    expect(r).toBe(0);
                    expect(g).toBe(0);
                    expect(b).toBe(255);
                    expect(a).toBe(255);
                    //TODO: could compare whole src / dst buffer to check if something is cut off
                    //const compare_buffer = frame.Buffer;
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
});


/***/ }),

/***/ "./src/test/VideoInputTest.ts":
/*!************************************!*\
  !*** ./src/test/VideoInputTest.ts ***!
  \************************************/
/*! exports provided: VideoInputTest_export, MakeTestCanvas, MakeBrokenTestCanvas, MakeTestImage, ExtractData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoInputTest_export", function() { return VideoInputTest_export; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeTestCanvas", function() { return MakeTestCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeBrokenTestCanvas", function() { return MakeBrokenTestCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeTestImage", function() { return MakeTestImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExtractData", function() { return ExtractData; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");

function VideoInputTest_export() {
}
function MakeTestCanvas(w, h) {
    if (w == null)
        w = 4;
    if (h == null)
        h = 4;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    //make blue for debugging purposes
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}
function MakeBrokenTestCanvas() {
    var canvas = document.createElement("canvas");
    return canvas;
}
/**Create test image with pattern
 * Black White
 * White Black
 *
 * So each corner can be tested for correct results.
 *
 * @param src_width
 * @param src_height
 */
function MakeTestImage(src_width, src_height) {
    var src_size = src_width * src_height * 4;
    var src_data = new Uint8ClampedArray(src_size);
    for (var y = 0; y < src_height; y++) {
        for (var x = 0; x < src_width; x++) {
            var pos = y * src_width + x;
            var xp = x >= src_width / 2;
            var yp = y >= src_height / 2;
            var val = 0;
            if (xp || yp)
                val = 255;
            if (xp && yp)
                val = 0;
            src_data[pos * 4 + 0] = val;
            src_data[pos * 4 + 1] = val;
            src_data[pos * 4 + 2] = val;
            src_data[pos * 4 + 3] = 255;
        }
    }
    var src_img = new ImageData(src_data, src_width, src_height);
    return src_img;
}
function ExtractData(video) {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var dst_context = canvas.getContext('2d');
    dst_context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var dst_img = dst_context.getImageData(0, 0, canvas.width, canvas.height);
    return dst_img;
}
describe("VideoInputTest", function () {
    beforeEach(function () {
    });
    it("AddRem", function () {
        var name = "test_canvas";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var canvas = document.createElement("canvas");
        expect(vi.HasDevice(name)).toBe(false);
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        expect(vi.HasDevice(name)).toBe(true);
        vi.RemoveDevice(name);
        expect(vi.HasDevice(name)).toBe(false);
    });
    it("GetDeviceNames", function () {
        var name = "test_canvas";
        var name2 = "test_canvas2";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var canvas = document.createElement("canvas");
        var names = vi.GetDeviceNames();
        expect(names).toBeTruthy();
        expect(names.length).toBe(0);
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        names = vi.GetDeviceNames();
        expect(names).toBeTruthy();
        expect(names.length).toBe(1);
        expect(names[0]).toBe(name);
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        names = vi.GetDeviceNames();
        expect(names).toBeTruthy();
        expect(names.length).toBe(1);
        expect(names[0]).toBe(name);
        vi.AddCanvasDevice(canvas, name2, canvas.width, canvas.height, 30);
        names = vi.GetDeviceNames();
        expect(names).toBeTruthy();
        expect(names.length).toBe(2);
        expect(names.sort()).toEqual([name, name2].sort());
    });
    it("GetStream", function () {
        var name = "test_canvas";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var canvas = MakeTestCanvas();
        var stream = vi.GetStream(name);
        expect(stream).toBeNull();
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
    });
    it("AddCanvasDevice_no_scaling", function (done) {
        var name = "test_canvas";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var src_width = 40;
        var src_height = 30;
        var canvas = MakeTestCanvas(src_width, src_height);
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        var stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
        var videoOutput = document.createElement("video");
        videoOutput.onloadedmetadata = function () {
            expect(videoOutput.videoWidth).toBe(src_width);
            expect(videoOutput.videoHeight).toBe(src_height);
            done();
        };
        videoOutput.srcObject = stream;
    }, 1000);
    it("AddCanvasDevice_scaling", function (done) {
        var debug = false;
        var name = "test_canvas";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var src_width = 64;
        var src_height = 64;
        var dst_width = 32;
        var dst_height = 32;
        var canvas = MakeTestCanvas(src_width, src_height);
        var srcContext = canvas.getContext("2d");
        var src_img = MakeTestImage(src_width, src_height);
        srcContext.putImageData(src_img, 0, 0);
        if (debug)
            document.body.appendChild(canvas);
        vi.AddCanvasDevice(canvas, name, dst_width, dst_height, 30);
        var stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
        var videoOutput = document.createElement("video");
        if (debug)
            document.body.appendChild(videoOutput);
        videoOutput.onloadedmetadata = function () {
            expect(videoOutput.videoWidth).toBe(dst_width);
            expect(videoOutput.videoHeight).toBe(dst_height);
            var dst_img_data = ExtractData(videoOutput);
            //upper left
            expect(dst_img_data.data[0]).toBe(0);
            //upper right
            expect(dst_img_data.data[((dst_width - 1) * 4)]).toBe(255);
            //lower left
            expect(dst_img_data.data[((dst_height - 1) * dst_width) * 4]).toBe(255);
            //lower right
            expect(dst_img_data.data[(dst_height * dst_width - 1) * 4]).toBe(0);
            vi.RemoveDevice(name);
            done();
        };
        videoOutput.srcObject = stream;
    }, 1000);
    //not yet clear how this can be handled
    //this test will trigger an error in firefox
    xit("GetStream_no_context", function () {
        var name = "test_canvas";
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var canvas = MakeBrokenTestCanvas();
        //if we try to record from a canvas before
        //a context was accessed it will fail. 
        //uncommenting this line fixes the bug
        //but this is out of our control / within user code
        //let ctx = canvas.getContext("2d");
        var stream = vi.GetStream(name);
        expect(stream).toBeNull();
        vi.AddCanvasDevice(canvas, name, canvas.width, canvas.height, 30);
        stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
    });
    //not yet clear how this can be handled
    //this test will trigger an error in firefox
    it("AddRemDevice", function () {
        var name = "test_canvas";
        var w = 640;
        var h = 480;
        var fps = 30;
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var stream = vi.GetStream(name);
        expect(stream).toBeNull();
        vi.AddDevice(name, w, h, fps);
        var res = vi.GetDeviceNames().indexOf(name);
        expect(res).toBe(0);
        vi.RemoveDevice(name);
        var res2 = vi.GetDeviceNames().indexOf(name);
        expect(res2).toBe(-1);
    });
    it("Device_int_array", function () {
        var name = "test_canvas";
        var w = 2;
        var h = 2;
        var fps = 30;
        var arr = new Uint8ClampedArray([
            1, 2, 3, 255,
            4, 5, 6, 255,
            7, 8, 9, 255,
            10, 11, 12, 255,
            13, 14, 15, 255
        ]);
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        vi.AddDevice(name, w, h, fps);
        var stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
        var clamped = new Uint8ClampedArray(arr.buffer, 4, 4 * 4);
        var res = vi.UpdateFrame(name, clamped, w, h, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInputType"].ARGB, 0, false);
        expect(res).toBe(true);
        var result_canvas = vi.canvasDevices[name].canvas;
        expect(result_canvas.width).toBe(w);
        expect(result_canvas.height).toBe(h);
        var result_img = result_canvas.getContext("2d").getImageData(0, 0, result_canvas.width, result_canvas.height);
        var result_arr = new Uint8Array(result_img.data.buffer);
        var base_arr = new Uint8Array(arr.buffer, 4, 4 * 4);
        expect(base_arr).toEqual(result_arr);
    });
    it("Device_full", function () {
        var src_canvas = MakeTestCanvas();
        var src_ctx = src_canvas.getContext("2d");
        src_ctx.fillStyle = "yellow";
        src_ctx.fillRect(0, 0, src_canvas.width, src_canvas.height);
        var name = "test_canvas";
        var w = 2;
        var h = 2;
        var fps = 30;
        src_canvas.width = w;
        src_canvas.height = h;
        var vi = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInput"]();
        var src_img = src_ctx.getImageData(0, 0, src_canvas.width, src_canvas.height);
        vi.AddDevice(name, w, h, fps);
        var stream = vi.GetStream(name);
        expect(stream).toBeTruthy();
        var res = vi.UpdateFrame(name, src_img.data, src_img.width, src_img.height, _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["VideoInputType"].ARGB, 0, false);
        expect(res).toBe(true);
        //test if the internal array was set correctly
        var result_canvas = vi.canvasDevices[name].canvas;
        expect(result_canvas.width).toBe(src_canvas.width);
        expect(result_canvas.height).toBe(src_canvas.height);
        var result_img = result_canvas.getContext("2d").getImageData(0, 0, result_canvas.width, result_canvas.height);
        expect(result_img.width).toBe(src_img.width);
        expect(result_img.height).toBe(src_img.height);
        expect(result_img.data).toEqual(src_img.data);
    });
});


/***/ }),

/***/ "./src/test/WebRtcNetworkTest.ts":
/*!***************************************!*\
  !*** ./src/test/WebRtcNetworkTest.ts ***!
  \***************************************/
/*! exports provided: WebRtcNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkTest", function() { return WebRtcNetworkTest; });
/* harmony import */ var WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! WebsocketNetworkTest */ "./src/test/WebsocketNetworkTest.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



var WebRtcNetworkTest = /** @class */ (function (_super) {
    __extends(WebRtcNetworkTest, _super);
    function WebRtcNetworkTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrl;
        //allows each test to overwrite the default behaviour
        _this.mUseWebsockets = false;
        return _this;
    }
    WebRtcNetworkTest.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrl;
            _this.mUseWebsockets = WebRtcNetworkTest.mAlwaysUseWebsockets;
        });
        it("GetBufferedAmount", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.then(function () {
                //TODO: more detailed testing by actually triggering the buffer to fill?
                //might be tricky as this is very system dependent
                var buf;
                buf = srv.GetBufferedAmount(srvToCltId, false);
                expect(buf).toBe(0);
                buf = srv.GetBufferedAmount(srvToCltId, true);
                expect(buf).toBe(0);
                buf = clt.GetBufferedAmount(cltToSrvId, false);
                expect(buf).toBe(0);
                buf = clt.GetBufferedAmount(cltToSrvId, true);
                expect(buf).toBe(0);
                done();
            });
            _this.start();
        });
        it("SharedAddress", function (done) {
            //turn off websockets and use shared websockets for this test as local network doesn't support shared mode
            _this.mUseWebsockets = true;
            _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrlShared;
            var sharedAddress = "sharedtestaddress";
            var evt;
            var net1;
            var net2;
            _this.thenAsync(function (finished) {
                net1 = _this._CreateNetwork();
                net1.StartServer(sharedAddress);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].ServerInitialized);
                net2 = _this._CreateNetwork();
                net2.StartServer(sharedAddress);
                _this.waitForEvent(net2, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].ServerInitialized);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                _this.waitForEvent(net2, finished);
            });
            _this.then(function () {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                done();
            });
            _this.start();
        });
        //connect using only direct local connections (give no ice servers)
        it("ConnectLocalOnly", function (done) {
            var srv;
            var address;
            var clt;
            var cltId;
            var evt;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect(address);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).toBe(cltId.id);
            });
            _this.thenAsync(function (finished) {
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["ConnectionId"].INVALID.id);
                done();
            });
            _this.start();
        });
        _super.prototype.setup.call(this);
        //special tests
    };
    WebRtcNetworkTest.prototype._CreateNetworkImpl = function () {
        var rtcConfig = { iceServers: [WebRtcNetworkTest.sDefaultIceServer] };
        var sigConfig;
        if (this.mUseWebsockets) {
            sigConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"](new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["WebsocketNetwork"](this.mUrl));
        }
        else {
            sigConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"](new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["LocalNetwork"]());
        }
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["WebRtcNetwork"](sigConfig, rtcConfig);
    };
    WebRtcNetworkTest.sUrl = 'ws://localhost:12776/test';
    WebRtcNetworkTest.sUrlShared = 'ws://localhost:12776/testshared';
    WebRtcNetworkTest.sDefaultIceServer = { urls: ["stun:stun.l.google.com:19302"] };
    //will set use websocket flag for each test
    WebRtcNetworkTest.mAlwaysUseWebsockets = false;
    return WebRtcNetworkTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("WebRtcNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new WebRtcNetworkTest();
    test.mDefaultWaitTimeout = 5000;
    test.setup();
});


/***/ }),

/***/ "./src/test/WebsocketNetworkTest.ts":
/*!******************************************!*\
  !*** ./src/test/WebsocketNetworkTest.ts ***!
  \******************************************/
/*! exports provided: WebsocketTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketTest", function() { return WebsocketTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var WebsocketTest = /** @class */ (function (_super) {
    __extends(WebsocketTest, _super);
    function WebsocketTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebsocketTest.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        //special tests
        beforeEach(function () {
            _this.mUrl = WebsocketTest.sUrl;
        });
        //can only be done manually so far
        xit("Timeout", function (done) {
            //this needs to be a local test server
            //that can be disconnected to test the timeout
            _this.mUrl = "ws://192.168.1.3:12776";
            var evt;
            var srv;
            var address;
            _this.thenAsync(function (finished) {
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                console.log("Server ready at " + address);
                expect(srv).not.toBeNull();
                expect(address).not.toBeNull();
                console.debug("Waiting for timeout");
                _this.waitForEvent(srv, finished, 120000);
            });
            _this.then(function () {
                console.log("Timeout over");
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        }, 130000);
        it("SharedAddress", function (done) {
            _this.mUrl = WebsocketTest.sUrlShared;
            var sharedAddress = "sharedtestaddress";
            var evt;
            var net1;
            var net2;
            _this.thenAsync(function (finished) {
                net1 = _this._CreateNetwork();
                net1.StartServer(sharedAddress);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                net2 = _this._CreateNetwork();
                net2.StartServer(sharedAddress);
                _this.waitForEvent(net2, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                _this.waitForEvent(net2, finished);
            });
            _this.then(function () {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                done();
            });
            _this.start();
        });
        it("BadUrlStartServer", function (done) {
            _this.mUrl = WebsocketTest.sBadUrl;
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StartServer();
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connecting);
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        });
        it("BadUrlConnect", function (done) {
            _this.mUrl = WebsocketTest.sBadUrl;
            var evt;
            var clt;
            var cltId;
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                cltId = clt.Connect("invalid address");
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connecting);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        });
        it("WebsocketState", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                //both should be connected
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                srv.Disconnect(srvToCltId);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected);
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                //after disconnect the client doesn't have any active connections -> expect disconnected
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StopServer();
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StartServer(address);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                _this._Connect(srv, address, clt, function (srvToCltIdOut, cltToSrvIdOut) {
                    finished();
                });
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
    };
    WebsocketTest.prototype._CreateNetworkImpl = function () {
        //let url = 'ws://because-why-not.com:12776';
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"](this.mUrl);
    };
    //replace with valid url that has a server behind it
    //public static sUrl = 'ws://localhost:12776/test';
    //public static sUrlShared = 'ws://localhost:12776/testshared';
    WebsocketTest.sUrl = 'ws://signaling.because-why-not.com';
    //public static sUrl = 'ws://192.168.1.3:12776';
    WebsocketTest.sUrlShared = 'ws://signaling.because-why-not.com/testshared';
    //any url to simulate offline server
    WebsocketTest.sBadUrl = 'ws://localhost:13776';
    return WebsocketTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("WebsocketNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    beforeEach(function () {
    });
    var test = new WebsocketTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/helper/BasicNetworkTestBase.ts":
/*!*************************************************!*\
  !*** ./src/test/helper/BasicNetworkTestBase.ts ***!
  \*************************************************/
/*! exports provided: TestTaskRunner, BasicNetworkTestBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestTaskRunner", function() { return TestTaskRunner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasicNetworkTestBase", function() { return BasicNetworkTestBase; });
/* harmony import */ var _awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../awrtc/network/index */ "./src/awrtc/network/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var TestTaskRunner = /** @class */ (function () {
    function TestTaskRunner() {
        this._toDoList = new Array();
    }
    TestTaskRunner.prototype.then = function (syncTask) {
        var wrap = function (finished) {
            syncTask();
            finished();
        };
        this._toDoList.push(wrap);
    };
    TestTaskRunner.prototype.thenAsync = function (task) {
        this._toDoList.push(task);
    };
    TestTaskRunner.prototype.start = function () {
        var task = this._toDoList.shift();
        this._run(task);
    };
    TestTaskRunner.prototype.stop = function () {
    };
    TestTaskRunner.prototype._run = function (task) {
        var _this = this;
        task(function () {
            if (_this._toDoList.length > 0) {
                setTimeout(function () {
                    _this._run(_this._toDoList.shift());
                }, 1);
            }
        });
    };
    return TestTaskRunner;
}());

var BasicNetworkTestBase = /** @class */ (function () {
    function BasicNetworkTestBase() {
        this.mTestRunner = new TestTaskRunner();
        this.mCreatedNetworks = new Array();
        this.mDefaultWaitTimeout = 5000;
    }
    BasicNetworkTestBase.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            _this.mTestRunner.stop();
            _this.mTestRunner = new TestTaskRunner();
            _this.mCreatedNetworks = new Array();
        });
    };
    BasicNetworkTestBase.prototype._CreateNetwork = function () {
        var net = this._CreateNetworkImpl();
        this.mCreatedNetworks.push(net);
        return net;
    };
    BasicNetworkTestBase.prototype.then = function (syncTask) {
        this.mTestRunner.then(syncTask);
    };
    BasicNetworkTestBase.prototype.thenAsync = function (task) {
        this.mTestRunner.thenAsync(task);
    };
    BasicNetworkTestBase.prototype.start = function () {
        this.mTestRunner.start();
    };
    //public waitForEvent(net: IBasicNetwork) {
    //    var wrap = (finished: Task) => {
    //        var timeout = 1000;
    //        var interval = 100;
    //        var intervalHandle;
    //        intervalHandle = setInterval(() => {
    //            this.UpdateAll();
    //            this.FlushAll();
    //            timeout -= interval;
    //            if (net.Peek() != null) {
    //                clearInterval(intervalHandle);
    //                finished();
    //            } else if (timeout <= 0) {
    //                clearInterval(intervalHandle);
    //                finished();
    //            }
    //        }, interval);
    //    };
    //    this.mTestRunner.thenAsync(wrap);
    //}
    BasicNetworkTestBase.prototype.waitForEvent = function (net, finished, timeout) {
        var _this = this;
        if (timeout == null)
            timeout = this.mDefaultWaitTimeout;
        var interval = 50;
        var intervalHandle;
        intervalHandle = setInterval(function () {
            _this.UpdateAll();
            _this.FlushAll();
            timeout -= interval;
            if (net.Peek() != null) {
                clearInterval(intervalHandle);
                finished();
            }
            else if (timeout <= 0) {
                clearInterval(intervalHandle);
                finished();
            }
        }, interval);
    };
    BasicNetworkTestBase.prototype.UpdateAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Update();
        }
    };
    BasicNetworkTestBase.prototype.FlushAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Flush();
        }
    };
    BasicNetworkTestBase.prototype.ShutdownAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Shutdown();
        }
        this.mCreatedNetworks = new Array();
    };
    BasicNetworkTestBase.prototype._CreateServerNetwork = function (result) {
        var srv = this._CreateNetwork();
        srv.StartServer();
        this.waitForEvent(srv, function () {
            var evt = srv.Dequeue();
            expect(evt).not.toBeNull();
            expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
            expect(evt.Info).not.toBeNull();
            var address = evt.Info;
            result(srv, address);
        });
    };
    BasicNetworkTestBase.prototype._Connect = function (srv, address, clt, result) {
        var _this = this;
        var evt;
        var cltToSrvId = clt.Connect(address);
        var srvToCltId;
        this.waitForEvent(clt, function () {
            evt = clt.Dequeue();
            expect(evt).not.toBeNull();
            expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
            expect(evt.ConnectionId.id).toBe(cltToSrvId.id);
            _this.waitForEvent(srv, function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id);
                srvToCltId = evt.ConnectionId;
                result(srvToCltId, cltToSrvId);
            });
        });
    };
    BasicNetworkTestBase.prototype._CreateServerClient = function (result) {
        var _this = this;
        var srv;
        var address;
        var srvToCltId;
        var clt;
        var cltToSrvId;
        this._CreateServerNetwork(function (rsrv, raddress) {
            srv = rsrv;
            address = raddress;
            clt = _this._CreateNetwork();
            _this._Connect(srv, address, clt, function (rsrvToCltId, rcltToSrvId) {
                srvToCltId = rsrvToCltId;
                cltToSrvId = rcltToSrvId;
                result(srv, address, srvToCltId, clt, cltToSrvId);
            });
        });
    };
    return BasicNetworkTestBase;
}());



/***/ }),

/***/ "./src/test/helper/IBasicNetworkTest.ts":
/*!**********************************************!*\
  !*** ./src/test/helper/IBasicNetworkTest.ts ***!
  \**********************************************/
/*! exports provided: IBasicNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IBasicNetworkTest", function() { return IBasicNetworkTest; });
/* harmony import */ var _BasicNetworkTestBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BasicNetworkTestBase */ "./src/test/helper/BasicNetworkTestBase.ts");
/* harmony import */ var _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../awrtc/network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var IBasicNetworkTest = /** @class */ (function (_super) {
    __extends(IBasicNetworkTest, _super);
    function IBasicNetworkTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IBasicNetworkTest.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        var originalTimeout = 5000;
        beforeEach(function () {
            _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["SLog"].RequestLogLevel(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["SLogLevel"].Info);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = _this.mDefaultWaitTimeout + 5000;
        });
        afterEach(function () {
            console.debug("Test shutting down ...");
            _this.ShutdownAll();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = _this.mDefaultWaitTimeout + 5000;
        });
        //add all reusable tests here
        //TODO: check how to find the correct line where it failed
        it("TestEnvironmentAsync", function (done) {
            var value1 = false;
            var value2 = false;
            _this.then(function () {
                expect(value1).toBe(false);
                expect(value2).toBe(false);
                value1 = true;
            });
            _this.thenAsync(function (finished) {
                expect(value1).toBe(true);
                expect(value2).toBe(false);
                value2 = true;
                finished();
            });
            _this.then(function () {
                expect(value1).toBe(true);
                expect(value2).toBe(true);
                done();
            });
            _this.start();
        });
        it("Create", function () {
            var clt;
            clt = _this._CreateNetwork();
            expect(clt).not.toBe(null);
        });
        it("StartServer", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StartServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).not.toBe(null);
                done();
            });
            _this.start();
        });
        it("StartServerNamed", function (done) {
            var name = "StartServerNamedTest";
            var evt;
            var srv1;
            var srv2;
            srv1 = _this._CreateNetwork();
            srv2 = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                srv1.StartServer(name);
                _this.waitForEvent(srv1, finished);
            });
            _this.then(function () {
                evt = srv1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).toBe(name);
            });
            _this.thenAsync(function (finished) {
                srv2.StartServer(name);
                _this.waitForEvent(srv2, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitFailed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).toBe(name);
                //stop the other server to free the address
                srv1.StopServer();
                _this.waitForEvent(srv1, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                //stop the other server to free the address
                srv2.StartServer(name);
                _this.waitForEvent(srv2, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                done();
            });
            _this.start();
        });
        it("StopServer", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StopServer();
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("StopServer2", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StartServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).not.toBe(null);
            });
            _this.thenAsync(function (finished) {
                srv.StopServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                //enforce address in this to prepare having multiple addresses?
                //expect(evt.Info).not.toBe(null);
                done();
            });
            _this.start();
        });
        it("_CreateServerNetwork", function (done) {
            var srv;
            var address;
            _this.thenAsync(function (finished) {
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.then(function () {
                expect(srv).not.toBeNull();
                expect(address).not.toBeNull();
                done();
            });
            _this.start();
        });
        it("ConnectFail", function (done) {
            var evt;
            var clt;
            var cltId;
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect("invalid address");
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId.id);
                done();
            });
            _this.start();
        });
        it("ConnectTwo", function (done) {
            var srv;
            var address;
            var clt;
            var cltId;
            var evt;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect(address);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).toBe(cltId.id);
            });
            _this.thenAsync(function (finished) {
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                done();
            });
            _this.start();
        });
        it("ConnectHelper", function (done) {
            var srv;
            var address;
            var clt;
            var cltToSrvId;
            var srvToCltId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    done();
                });
            });
            _this.start();
        });
        it("Peek", function (done) {
            var evt;
            var net = _this._CreateNetwork();
            var cltId1 = net.Connect("invalid address1");
            var cltId2 = net.Connect("invalid address2");
            var cltId3 = net.Connect("invalid address3");
            _this.thenAsync(function (finished) {
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId1.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId1.id);
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId2.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId2.id);
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId3.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId3.id);
                done();
            });
            _this.start();
        });
        it("Disconnect", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                clt.Disconnect(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
                clt.Disconnect(new _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"](1234));
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("DisconnectClient", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.Disconnect(cltToSrvId);
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("DisconnectServer", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Disconnect(srvToCltId);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("DisconnectServerMulti", function (done) {
            var srv;
            var address;
            var srvToClt1Id;
            var srvToClt2Id;
            var clt1;
            var clt1ToSrvId;
            var clt2;
            var clt2ToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToClt1Id = rsrvToCltId;
                    clt1 = rclt;
                    clt1ToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt2 = _this._CreateNetwork();
                _this._Connect(srv, address, clt2, function (rsrvToCltId, rcltToSrvId) {
                    srvToClt2Id = rsrvToCltId;
                    clt2ToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Disconnect(srvToClt1Id);
                srv.Disconnect(srvToClt2Id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToClt1Id.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToClt2Id.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(clt1ToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt2, finished);
            });
            _this.then(function () {
                evt = clt2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(clt2ToSrvId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("ShutdownEmpty", function (done) {
            var net;
            var evt;
            net = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                net.Shutdown();
                _this.waitForEvent(net, finished);
            });
            _this.then(function () {
                evt = net.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("ShutdownServer", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Shutdown();
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                //no further events are suppose to be triggered after shutdown
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("ShutdownClient", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.Shutdown();
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("DisconnectInvalid", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            clt.Disconnect(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
            clt.Disconnect(new _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"](1234));
            _this.thenAsync(function (finished) {
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
        it("SendDataTolerateInvalidDestination", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            var testData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            _this.thenAsync(function (finished) {
                clt.SendData(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID, testData, true);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.thenAsync(function (finished) {
                clt.SendData(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID, testData, false);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
        it("SendDataReliable", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            var testMessage = "SendDataReliable_testmessage1234";
            var testMessageBytes = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetBytes(testMessage);
            var receivedTestMessage;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.SendData(cltToSrvId, testMessageBytes, true);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ReliableMessageReceived);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                srv.SendData(srvToCltId, testMessageBytes, true);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ReliableMessageReceived);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                done();
            });
            _this.start();
        });
        it("SendDataUnreliable", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            var testMessage = "SendDataUnreliable_testmessage1234";
            var testMessageBytes = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetBytes(testMessage);
            var receivedTestMessage;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.SendData(cltToSrvId, testMessageBytes, false);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].UnreliableMessageReceived);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                srv.SendData(srvToCltId, testMessageBytes, false);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].UnreliableMessageReceived);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                done();
            });
            _this.start();
        });
    };
    return IBasicNetworkTest;
}(_BasicNetworkTestBase__WEBPACK_IMPORTED_MODULE_0__["BasicNetworkTestBase"]));



/***/ }),

/***/ "./src/test/test_entry.ts":
/*!********************************!*\
  !*** ./src/test/test_entry.ts ***!
  \********************************/
/*! exports provided: LocalNetworkTest, WebRtcNetworkTest, WebsocketTest, CallTestHelper, MediaNetworkTest, some_random_export_1, DeviceApiTest_export, VideoInputTest_export, MakeTestCanvas, MakeBrokenTestCanvas, MakeTestImage, ExtractData, MediaTest_export */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LocalNetworkTest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LocalNetworkTest */ "./src/test/LocalNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetworkTest", function() { return _LocalNetworkTest__WEBPACK_IMPORTED_MODULE_0__["LocalNetworkTest"]; });

/* harmony import */ var _WebRtcNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebRtcNetworkTest */ "./src/test/WebRtcNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkTest", function() { return _WebRtcNetworkTest__WEBPACK_IMPORTED_MODULE_1__["WebRtcNetworkTest"]; });

/* harmony import */ var _WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebsocketNetworkTest */ "./src/test/WebsocketNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketTest", function() { return _WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_2__["WebsocketTest"]; });

/* harmony import */ var _CallTest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CallTest */ "./src/test/CallTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallTestHelper", function() { return _CallTest__WEBPACK_IMPORTED_MODULE_3__["CallTestHelper"]; });

/* harmony import */ var _MediaNetworkTest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MediaNetworkTest */ "./src/test/MediaNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaNetworkTest", function() { return _MediaNetworkTest__WEBPACK_IMPORTED_MODULE_4__["MediaNetworkTest"]; });

/* harmony import */ var _BrowserApiTest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BrowserApiTest */ "./src/test/BrowserApiTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "some_random_export_1", function() { return _BrowserApiTest__WEBPACK_IMPORTED_MODULE_5__["some_random_export_1"]; });

/* harmony import */ var _DeviceApiTest__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DeviceApiTest */ "./src/test/DeviceApiTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApiTest_export", function() { return _DeviceApiTest__WEBPACK_IMPORTED_MODULE_6__["DeviceApiTest_export"]; });

/* harmony import */ var _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./VideoInputTest */ "./src/test/VideoInputTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoInputTest_export", function() { return _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__["VideoInputTest_export"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MakeTestCanvas", function() { return _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__["MakeTestCanvas"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MakeBrokenTestCanvas", function() { return _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__["MakeBrokenTestCanvas"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MakeTestImage", function() { return _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__["MakeTestImage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ExtractData", function() { return _VideoInputTest__WEBPACK_IMPORTED_MODULE_7__["ExtractData"]; });

/* harmony import */ var _MediaTest__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./MediaTest */ "./src/test/MediaTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaTest_export", function() { return _MediaTest__WEBPACK_IMPORTED_MODULE_8__["MediaTest_export"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/











/***/ })

/******/ });
//# sourceMappingURL=test.js.map