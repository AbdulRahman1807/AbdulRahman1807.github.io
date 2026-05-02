import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSound } from '../hooks/useSound';

const VerticalMarquee = ({ direction = "vertical" }) => {
  const { play } = useSound();
  const bannerRef = useRef(null);
  const phrases = [
    "LEGOS",
    "CARS",
    "NIGHT DRIVES",
    "MUSIC",
    "FOOD",
    "LATE NIGHTS",
    "PHOTOGRAPHY",
    "SODA",
    "TRY OR DIE"
  ];

  // We need to repeat the phrases enough times to fill the container 
  // and have a seamless loop. For short lists, doubling isn't enough.
  const repeatedPhrases = [...phrases, ...phrases, ...phrases, ...phrases];

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const isVertical = direction === "vertical";
    // For a seamless loop with multiple repetitions, we scroll by the 
    // distance of exactly one set of phrases.
    const oneSetDistance = isVertical
      ? banner.scrollHeight / 4
      : banner.scrollWidth / 4;

    const tl = gsap.to(banner, {
      [isVertical ? "y" : "x"]: -oneSetDistance,
      duration: isVertical ? 15 : 10, 
      ease: "none",
      repeat: -1,
    });

    return () => tl.kill();
  }, [direction, phrases.length]);

  return (
    <div 
      className={`${direction}-marquee-container`} 
      data-cursor="banner"
      onMouseEnter={() => play("whoosh")}
    >
      <div className={`${direction}-marquee-inner`} ref={bannerRef}>
        {repeatedPhrases.map((phrase, i) => (
          <div key={i} className="marquee-item">
            <span className="marquee-dot"></span>
            {phrase}
          </div>
        ))}
      </div>

      {direction === "vertical" ? (
        <>
          <div className="marquee-overlay-top"></div>
          <div className="marquee-overlay-bottom"></div>
        </>
      ) : (
        <>
          <div className="marquee-overlay-left"></div>
          <div className="marquee-overlay-right"></div>
        </>
      )}
    </div>
  );
};

export default VerticalMarquee;
