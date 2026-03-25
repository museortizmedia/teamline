import { useState } from "react";

export default function ImageWithSkeleton({ src, alt, className, onClick }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {!loaded && (
                <div className="absolute inset-0 bg-slate-700 animate-pulse rounded" />
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover rounded transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                onClick={onClick}
            />
        </div>
    );
}