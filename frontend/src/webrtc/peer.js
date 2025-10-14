class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      this.onIceCandidateCallback = null;

      // Automatically handle ICE candidates
      this.peer.onicecandidate = (event) => {
        if (event.candidate && this.onIceCandidateCallback) {
          this.onIceCandidateCallback(event.candidate);
        }
      };
    }
  }

  // Generates an offer
  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  // Accepts offer and returns answer
  async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  // Sets the remote answer (from remote peer)
  async setRemoteDescription(ans) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }

  // Adds a received ICE candidate
  async addIceCandidate(candidate) {
    if (candidate) {
      try {
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Failed to add ICE candidate", err);
      }
    }
  }

  // Sets a callback to emit ICE candidates to signaling server
  setOnIceCandidate(callback) {
    this.onIceCandidateCallback = callback;
  }

  // Optional cleanup method
  destroy() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
  }
}

export default new PeerService();
