import { useRef } from "react";
import "./CvlLab.css";
import useRevealOnScroll from "../../hooks/useRevealOnScroll";
import HomeIntroduction from "./Home.Introduction";

function CvlLab({ isHome }) {
    const heroRef = useRef(null);
    useRevealOnScroll(heroRef, isHome ? "home" : "inner");

    return (
        <div ref={heroRef} className={`hero ${isHome ? "hero--home" : ""}`}>
            <h1 data-reveal data-reveal-load-delay="90">
                CVL-
                <wbr />
                Lab
            </h1>

            {isHome ? (
                <div
                    data-reveal
                    data-reveal-load-delay="150"
                    className="hero__intro">
                    <HomeIntroduction />
                </div>
            ) : null}
        </div>
    );
}

export default CvlLab;
