import { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "../../store/user/User.api";
import peerService from "../webrtc/peer";

function Call({ isClose, selectedUser }) {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { user, socket } = useUserStore();

  // 1️⃣ Get camera once
  const initCamera = useCallback(async () => {
    if (!myStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      return stream;
    }
    return myStream;
  }, [myStream]);

  // 2️⃣ Add tracks to peer
  const addTracks = useCallback(
    (stream) => {
      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });
    },
    [peerService]
  );

  // 3️⃣ Outgoing call
  const handleCall = useCallback(async () => {
    const stream = await initCamera();
    addTracks(stream);

    const offer = await peerService.getOffer();
    socket.emit("user:call", { to: selectedUser, offer });
    setRemoteUser(selectedUser);
  }, [initCamera, addTracks, selectedUser, socket]);

  // 4️⃣ Incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const stream = await initCamera();
      addTracks(stream);

      setRemoteUser(from);
      const answer = await peerService.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans: answer });
    },
    [initCamera, addTracks, socket]
  );

  // 5️⃣ Call accepted
  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      await peerService.setRemoteDescription(ans);
    },
    []
  );

  // 6️⃣ Peer negotiation
  const handleNegotiationNeeded = useCallback(async () => {
    if (!remoteUser) return;
    const offer = await peerService.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteUser });
  }, [remoteUser, socket]);

  const handleNegotiationIncoming = useCallback(
    async ({ offer, from }) => {
      const answer = await peerService.getAnswer(offer);
      socket.emit("peer:nego:final", { ans: answer, to: from });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(
    async ({ ans }) => {
      await peerService.setRemoteDescription(ans);
    },
    []
  );

  // 7️⃣ Attach streams
  useEffect(() => {
    if (myVideoRef.current && myStream) myVideoRef.current.srcObject = myStream;
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  // 8️⃣ Peer listeners
  useEffect(() => {
    const peer = peerService.peer;
    const handleTrack = (event) => setRemoteStream(event.streams[0]);

    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    peer.addEventListener("track", handleTrack);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
      peer.removeEventListener("track", handleTrack);
    };
  }, [handleNegotiationNeeded]);

  // 9️⃣ Socket listeners
  useEffect(() => {
    socket.emit("join", selectedUser);

    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);

    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [
    socket,
    selectedUser,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex flex-col items-center justify-center gap-4 bg-black text-white">
      <div className="flex gap-4">
        <video ref={myVideoRef} autoPlay muted playsInline className="w-1/2 h-auto border border-white" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 h-auto border border-white" />
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={handleCall} className="px-4 py-2 bg-green-600 rounded">
          Call
        </button>
        <button onClick={isClose} className="px-4 py-2 bg-red-600 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Call;
