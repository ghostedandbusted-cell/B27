import React, { useRef, useEffect } from 'react';

const Video = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video attributes for iOS compatibility
    const setupVideo = () => {
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('x-webkit-airplay', 'allow');
      
      // Attempt to play the video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video autoplay failed:', error);
          // Video will fallback to poster automatically
        });
      }
    };

    // Setup video immediately
    setupVideo();

    // Add user interaction listeners for iOS autoplay restrictions
    const handleUserInteraction = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Video play failed after user interaction:', error);
          });
        }
      }
      
      // Remove listeners after first successful interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction, { passive: true });

    // Handle video load events
    const handleLoadedData = () => {
      // Ensure video dimensions and properties are set correctly
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.objectPosition = 'center center';
      
      // Try to play again after data loads
      setupVideo();
    };

    const handleError = (e) => {
      console.warn('Video failed to load:', e);
      // Hide video element to show poster background
      video.style.display = 'none';
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <div className="hero-section">
      {/* Main background video with responsive sources and fallbacks */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        poster="/video-poster.jpg"
        webkit-playsinline="true"
        x-webkit-airplay="allow"
      >
        {/* Mobile-optimized version for smaller screens */}
        <source 
          src="/video-720.mp4" 
          media="(max-width: 820px)" 
          type="video/mp4" 
        />
        {/* WebM for modern browsers (better compression) */}
        <source 
          src="/video.webm" 
          type="video/webm" 
        />
        {/* Main HD MP4 for desktop */}
        <source 
          src="/video.mp4" 
          type="video/mp4" 
        />
        {/* Fallback message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;