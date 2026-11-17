"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { siteConfig } from "@/config/site";

/** Giscus comments that follow the site's light / dark mode. */
export function Comments() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        const read = () => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
        read();
        window.addEventListener("themechange", read);
        return () => window.removeEventListener("themechange", read);
    }, []);

    // Wait until the theme is known so the iframe doesn't flash the wrong colours
    if (!siteConfig.giscus || !theme) return null;
    const g = siteConfig.giscus;

    return (
        <div className="w-full">
            <Giscus
                id="comments"
                repo={g.repo}
                repoId={g.repoId}
                category={g.category}
                categoryId={g.categoryId}
                mapping="pathname"
                term=""
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={theme === "dark" ? "transparent_dark" : "light"}
                lang={g.lang}
                loading="lazy"
            />
        </div>
    );
}
