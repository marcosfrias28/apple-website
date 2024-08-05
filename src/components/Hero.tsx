import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { heroVideo, smallHeroVideo } from "../utils"
import { useEffect, useState } from "react"


const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 768 ? smallHeroVideo : heroVideo)

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 768) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet)

    return () => {
      window.removeEventListener("resize", handleVideoSrcSet)
    }

  }, []);

  useGSAP(()=> {
    gsap.to("#hero", {
      opacity: 1,
      duration: 1,
      delay: 2,
      ease: "power1.inOut"
    })

    gsap.to("#cta", {
      opacity: 1,
      duration: 1,
      delay: 2,
      ease: "power1.inOut",
      y: -50
    })
  }, [])

  return (
    <section className='container w-full nav-height bg-black relative mx-auto'>
        <div className="h-5/6 w-full flex-center flex-col">
          <p id="hero" className='hero-title'>iPhone 15 Pro</p>
          <div className="md:w-10/12 w-9/12">
            <video src={videoSrc} autoPlay playsInline={true} key={videoSrc} muted className=" pointer-events-none">
              <source type="video/mp4" src={videoSrc} />
            </video>
          </div>
        </div>

        <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
          <a href="#highlights" className="btn">Buy</a>
          <p>From $199/month or $999</p>
        </div>
    </section>
  )
}

export default Hero
