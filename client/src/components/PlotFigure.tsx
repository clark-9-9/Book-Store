"use client";

import * as Plot from "@observablehq/plot";
// import { createElement } from "react";
import { useEffect, useRef } from "react";

interface PlotFigureProps {
    options: Record<string, unknown>;
}

export default function PlotFigure({ options }: PlotFigureProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && containerRef.current) {
            const plot = Plot.plot({
                ...options,
                document: window.document,
                // height: 300,
                // width: 900,
                width: 700,
            });
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(plot);
        }
    }, [options]);

    // return createElement("div", { ref: containerRef });
    return <div ref={containerRef}></div>;
}
