import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faClose } from '@fortawesome/free-solid-svg-icons';
import useUserStore from '../../store/user/User.api';
import useCallStore from '../../store/call/call.api';

function Call({ isClose, selectedUser }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const { user, socket } = useUserStore();
  const { startCalling, closeCalling } = useCallStore();

  useEffect(() => {
    startCamera();
    setupSocketListeners();
    return () => cleanup();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera", error);
    }
  };

  const setupSocketListeners = () => {
    socket.on("offer", ({ offer, from, name, avatar }) => {
      setIncomingCall({ offer, from, name, avatar });
    });

    socket.on("answer", async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (e) {
        console.error("Error adding received ICE candidate", e);
      }
    });

    socket.on("call-ended", () => {
      handleClose();
    });
  };

  const createPeer = () => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection();

    localStream?.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", e.candidate);
      }
    };

    peerConnection.current.ontrack = (e) => {
      const stream = e.streams[0];
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };
  };

  const createOffer = async () => {
    createPeer();
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    await startCalling({ userId: selectedUser.id, offer });
  };

  const createAnswer = async (offer, from) => {
    createPeer();
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { answer, to: from });
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    await createAnswer(incomingCall.offer, incomingCall.from);
    setIncomingCall(null);
  };

  const rejectCall = async () => {
    if (!incomingCall) return;
    socket.emit("call-ended", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const handleClose = async () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peerConnection.current) peerConnection.current.close();
    peerConnection.current = null;

    await closeCalling({ userId: selectedUser.id });
    isClose(false);
  };

  const cleanup = () => {
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    socket.off("call-ended");
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peerConnection.current) peerConnection.current.close();
    peerConnection.current = null;
  };

  return (
    <>
      {incomingCall && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
            <h2 className="text-lg font-semibold mb-2">{incomingCall.name} is calling...</h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={acceptCall}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-40 bg-black bg-opacity-60 flex justify-center items-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 flex flex-col items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full sm:w-1/2 h-40 bg-black rounded-xl" />
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full sm:w-1/2 h-40 bg-black rounded-xl" />
          </div>

          <div className="flex gap-6 mt-4">
            <button onClick={createOffer} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-md">
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-md">
              <FontAwesomeIcon icon={faVideo} />
            </button>
            <button onClick={handleClose} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-md">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Call;
