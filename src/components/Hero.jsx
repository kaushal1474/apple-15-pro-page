import { useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap/gsap-core"
import { heroVideo, smallHeroVideo } from "../utils"

const Hero = () => {

    const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

    const handelVidoeSource = () => {
        if (window.innerWidth < 760) {
            setVideoSrc(smallHeroVideo)
        } else {
            setVideoSrc(heroVideo)
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handelVidoeSource)

        return () => {
            window.removeEventListener("resize", handelVidoeSource)
        }
    }, [])


    useGSAP(() => {
        gsap.to("#hero", { opacity: 1, delay: 1 })
        gsap.to("#cta", { opacity: 1, delay: 1.5, y: -50 })
    }, [])


    return (
        <section className="w-full nav-height bg-black relative">
            <div className="h-5/6 w-full flex-center flex-col">
                <p id="hero" className="hero-title">iPhone 15 Pro</p>

                <div className="w-9/12 md:w-10/12">
                    <video muted controls={false} autoPlay playsInline={true} key={videoSrc}
                        className="pointer-events-none"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                </div>
            </div>

            <div id="cta"
                className="flex flex-col items-center opacity-0 translate-y-20"
            >
                <a href="#highlights" className="btn">Buy</a>
                <p className="font-normal text-xl">From ₹134900.00*</p>
            </div>
        </section>
    )
}

export default Hero