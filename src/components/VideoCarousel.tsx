import { useEffect, useRef, useState } from "react"
import { hightlightsSlides } from "../constants"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { pauseImg, playImg, replayImg } from "../utils"

const initialVideoState = {
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
}

type VideoState = typeof initialVideoState

const VideoCarousel = () => {

    const videoRef = useRef<HTMLVideoElement[] | []>([])
    const videoSpanRef = useRef<HTMLSpanElement[] | []>([])
    const videoDivRef = useRef<HTMLDivElement[] | []>([])

    const [loadedData, setLoadedData] = useState<React.SyntheticEvent<HTMLVideoElement, Event>[]>([])
    const [video, setVideo] = useState<VideoState>(initialVideoState)

    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut'
        })
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none'
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true
                }))
            }
        })
    }, [isEnd, videoId])

    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        setLoadedData((pre) => [...pre, e])
    }

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause()
            } else {
                startPlay && videoRef.current[videoId].play()
            }
        }

    }, [startPlay, videoId, isPlaying, loadedData]);

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current
        if (span && span[videoId]) {
            //Animation the progress bar of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100)
                    if (progress != currentProgress) {
                        currentProgress = progress

                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 768 ? `10vw` : window.innerWidth < 1200 ? `10vw` : `4vw`,
                        })
                        gsap.to(videoSpanRef.current[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: `white`
                        })
                    }
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px',
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: `#afafaf`
                        })
                    }
                }
            })

            if (videoId === 0) {
                anim.restart()
            }
            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
            }

            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            } else {
                gsap.ticker.remove(animUpdate)
            }
        }
     }, [videoId, startPlay]);


    const handleProcess = (type: string, index: number = 0) => {
        switch (type) {
            case 'video-end':
                setVideo((pre) => ({
                    ...pre,
                    isEnd: true,
                    videoId: index + 1
                }))
                break;
            case 'video-last':
                setVideo((pre) => ({
                    ...pre,
                    isLastVideo: true
                }))
                break;
            case 'video-reset':
                setVideo((pre) => ({
                    ...pre,
                    isLastVideo: false, videoId: 0
                }))
                break;
            case 'play':
                setVideo((pre) => ({
                    ...pre,
                    isPlaying: !pre.isPlaying
                }))
                break;
            default:
                return video;
        }
    }

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, index) => (
                    <div key={list.id + index} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="size-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    preload="auto"
                                    muted
                                    onPlay={() => {
                                        setVideo((prevVideo) => ({
                                            ...prevVideo,
                                            isPlaying: true,
                                        }))
                                    }}
                                    onEnded={() => index !== 3 ? handleProcess('video-end', index) : handleProcess('video-last')}
                                    onLoadedMetadata={(e) => handleLoadedMetadata(e)}
                                    ref={(el: HTMLVideoElement) => videoRef.current[index] = el}
                                >
                                    <source type="video/mp4" src={list.video} />
                                </video>
                            </div>
                            <div className=" absolute top-12 left-[5%] z-10">
                                {
                                    list.textLists.map((text, index) => (
                                        <p key={text + index} className="md:text-2xl text-xl font-medium">{text}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div >

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current?.map((_, i) => (
                        <span key={i} ref={(el: HTMLDivElement) => videoDivRef.current[i] = el} className="mx-2 w-3 h-3 bg-gray-200 relative rounded-full cursor-pointer">
                            <span className="absolute size-full rounded-full" ref={(el: HTMLSpanElement) => videoSpanRef.current[i] = el} />
                        </span>
                    ))}
                </div>

                <button onClick={isLastVideo
                    ? () => handleProcess('video-reset')
                    : !isPlaying
                        ? () => handleProcess('play')
                        : () => handleProcess('pause')
                } className="control-btn">
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"} />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel
