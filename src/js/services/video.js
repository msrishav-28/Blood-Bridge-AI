/**
 * VIDEO SERVICE
 * WebRTC Video Consultation
 */

export class VideoService {
    constructor() {
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
    }

    async startCall() {
        try {
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            // Display local video
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }
            
            console.log('📹 Video call started');
            return this.localStream;
            
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw new Error('Could not access camera/microphone');
        }
    }

    stopCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        console.log('📹 Video call ended');
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            return videoTrack.enabled;
        }
        return false;
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            return audioTrack.enabled;
        }
        return false;
    }

    async shareScreen() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            
            return screenStream;
            
        } catch (error) {
            console.error('Error sharing screen:', error);
            throw new Error('Could not share screen');
        }
    }
}
