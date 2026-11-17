"use client";

import { useEffect } from "react";

export function CopyCodeListener() {
    useEffect(() => {
        const preTags = document.querySelectorAll("pre");

        preTags.forEach((pre) => {
            if (pre.querySelector(".copy-code-btn")) return; // Already added

            // Make pre relative to position button
            pre.style.position = "relative";
            pre.classList.add("group"); // For hover effect

            const button = document.createElement("button");
            button.className = "copy-code-btn absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-border/50";
            button.setAttribute("aria-label", "Copy code");

            const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
            const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500"><path d="M20 6 9 17l-5-5"/></svg>`;

            button.innerHTML = copyIcon;

            button.onclick = async () => {
                const code = pre.querySelector("code")?.innerText || pre.innerText;
                try {
                    await navigator.clipboard.writeText(code);
                    button.innerHTML = checkIcon;

                    setTimeout(() => {
                        button.innerHTML = copyIcon;
                    }, 2000);
                } catch (err) {
                    console.error("Failed to copy!", err);
                }
            };

            pre.appendChild(button);
        });
    }, []);

    return null;
}
