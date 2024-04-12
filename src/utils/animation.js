import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap/gsap-core";

gsap.registerPlugin(ScrollTrigger)

export const animateGsapTimeline = (timeline, rotationRef, rotationState, firstTarget, secondTarget, animationProps) => {
    timeline.to(rotationRef.current.rotation, {
        duration: 1,
        ease: "power2.inOut",
        y: rotationState
    })

    timeline.to(firstTarget, {
        ...animationProps,
        ease: "power2.inOut",
    }, "<")

    timeline.to(secondTarget, {
        ...animationProps,
        ease: "power2.inOut",
    }, "<")
}

export const animateWithGsap = (target, animationProps, scrollProps, gsapProps = {}) => {
    gsap.to(target, {
        ...animationProps,
        scrollTrigger: {
            trigger: target,
            toggleActions: "restart reverse restart reverse",
            top: 'top 85%',
            ...scrollProps
        },
        ...gsapProps
    })
}