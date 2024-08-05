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

const VideoCarousel = () => {

    const videoRef = useRef<HTMLVideoElement[] | []>([])
    const videoSpanRef = useRef<HTMLSpanElement[] | []>([])
    const videoDivRef = useRef<HTMLDivElement[] | []>([])

    const [loadedData, setLoadedData] = useState<string[]>([])
    const [video, setVideo] = useState(initialVideoState)

    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

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
        const currentProgress = 0;
        let span = videoSpanRef.current
        if (span && span[videoId]) {
            //Animation the progress bar of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {

                },
                onComplete: () => {

                }
            })
            anim.play()
        }
    }, [videoId, startPlay]);


    const handleProcess = (type: string, index?: number) => {
        switch (type) {
            case 'video-end':
                setVideo((pre) => ({
                    ...pre,
                    isEnd: true, videoid: index && index + 1
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
                    isLastVideo: false, videoid: 0
                }))
                break;
            case 'play':
                break;
            case 'pause':
                break;

            default: break;
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
                        <div key={i} ref={(el: HTMLDivElement) => videoDivRef.current[i] = el} className="mx-2 w-3 h-3 bg-gray-200 relative rounded-full cursor-pointer">
                            <span className="absolute size-full rounded-full" ref={(el: HTMLSpanElement) => videoSpanRef.current[i] = el} />
                        </div>
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
