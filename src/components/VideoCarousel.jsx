import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    // video and indicator
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const [loadedData, setLoadedData] = useState([]);
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none",
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    // useEffect(() => {
    //     let currentProgress = 0;
    //     let span = videoSpanRef.current;
    //     let div = videoDivRef.current;

    //     if (span[videoId]) {
    //         let anim = gsap.to(span[videoId], {
    //             onUpdate: () => {
    //                 const progress = Math.ceil(anim.progress() * 100);

    //                 if (progress != currentProgress) {
    //                     currentProgress = progress;

    //                     console.log("videoId", videoId, currentProgress);
    //                     gsap.to(div[videoId], {
    //                         width: window.innerWidth < 1200 ? "10vw" : "4vw",
    //                     });

    //                     gsap.to(span[videoId], {
    //                         width: `${currentProgress}%`,
    //                         backgroundColor: "white",
    //                     });
    //                 }
    //             },

    //             onComplete: () => {
    //                 if (isPlaying) {
    //                     gsap.to(videoDivRef.current[videoId], {
    //                         width: "12px",
    //                     });
    //                     gsap.to(span[videoId], {
    //                         backgroundColor: "#afafaf",
    //                     });
    //                 }
    //             },
    //         });

    //         if (videoId == 0) {
    //             anim.restart();
    //         }

    //         const animUpdate = () => {
    //             anim.progress(
    //                 videoRef.current[videoId].currentTime /
    //                 hightlightsSlides[videoId].videoDuration
    //             );
    //         };

    //         if (isPlaying) {
    //             gsap.ticker.add(animUpdate);
    //         } else {
    //             gsap.ticker.remove(animUpdate);
    //         }
    //     }

    //     return () => {
    //         console.log("clean up",gsap, videoId);
    //         console.log(videoDivRef);
    //         span[videoId]?.kill?.()
    //         span[videoId]?.vars?.onComplete?.()
    //         div[videoId]?.kill?.()
    //         div[videoId]?.vars?.onComplete?.()
    //         gsap.killTweensOf(span[videoId]);
    //         gsap.killTweensOf(div[videoId]);


    //     }
    // }, [videoId, startPlay]);


    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        let div = videoDivRef.current;
        let anim;

        const animUpdate = () => {
            anim.progress(
                videoRef.current[videoId].currentTime /
                hightlightsSlides[videoId].videoDuration
            );
        };

        if (span[videoId]) {
            anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(div[videoId], {
                            width: window.innerWidth < 1200 ? "10vw" : "4vw",
                        });
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        });
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        });
                    }
                },
            });

            if (videoId === 0) {
                anim.restart();
            }



            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }

        return () => {
            anim && anim.kill(); // Kill the animation
            gsap.ticker.remove(animUpdate);
            gsap.killTweensOf(span[videoId]);
            gsap.killTweensOf(div[videoId]);

            gsap.to(videoDivRef.current[videoId], {
                width: "12px",
            });
            gsap.to(span[videoId], {
                backgroundColor: "#afafaf",
                width: "100%"
            });

        };
    }, [videoId, startPlay]);

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    // vd id is the id for every video until id becomes number 3
    const handleProcess = (type, i) => {
        switch (type) {
            case "video-end":
                setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
                break;

            case "video-last":
                setVideo((pre) => ({ ...pre, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            case "play":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            default:
                return video;
        }
    };

    const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    className={`${list.id === 2 && "translate-x-44"
                                        } pointer-events-none`}
                                    preload="auto"
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onEnded={() => {
                                        if (video.videoId === i) {
                                            i !== 3
                                                ? handleProcess("video-end", i)
                                                : handleProcess("video-last", i)
                                        }
                                    }}
                                    onPlay={() =>
                                        setVideo((pre) => ({ ...pre, isPlaying: i === video.videoId }))
                                    }
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, i) => (
                                    <p key={i} className="md:text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            style={{ width: video.videoId !== i ? "12px" : "inherit" }}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            ref={(el) => (videoDivRef.current[i] = el)}
                            onClick={() => {
                                gsap.killTweensOf(videoDivRef.current[i])
                                setVideo((pre) => ({ ...pre, videoId: i, isLastVideo: false }));
                            }}
                        >
                            <span
                                style={{}}
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => (videoSpanRef.current[i] = el)}
                            />
                        </span>
                    ))}
                </div>

                <button className="control-btn"
                    onClick={
                        isLastVideo
                            ? () => handleProcess("video-reset")
                            : !isPlaying
                                ? () => handleProcess("play")
                                : () => handleProcess("pause")
                    }
                >
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;