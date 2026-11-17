"use client";

import { useState, useRef } from "react";
import { ImageOff, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackClassName?: string;
}

export function ImageWithFallback({
    src,
    alt,
    className,
    fallbackClassName,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

    const handleWheel = (e: React.WheelEvent) => {
        const delta = -e.deltaY * 0.001;
        setScale(prev => {
            const next = Math.min(Math.max(1, prev + delta), 5);
            if (next === 1) setOffset({ x: 0, y: 0 });
            return next;
        });
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setScale(prev => {
        const next = Math.max(1, prev - 0.5);
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
    });
    const handleReset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragStart.current) return;
        setOffset({
            x: dragStart.current.ox + e.clientX - dragStart.current.x,
            y: dragStart.current.oy + e.clientY - dragStart.current.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragStart.current = null;
    };

    // Reset scale + offset when closing
    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) { setScale(1); setOffset({ x: 0, y: 0 }); }
    };

    if (error) {
        return (
            <span
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-8 text-center text-muted-foreground w-full",
                    className,
                    fallbackClassName
                )}
            >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ImageOff className="h-6 w-6" />
                </span>
                <span className="text-sm font-medium block">Image Not Found</span>
                <span className="mt-1 text-xs text-muted-foreground/70 break-all max-w-[300px] block">
                    {alt || "No description available"}
                </span>
            </span>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className={cn("transition-opacity duration-300 cursor-zoom-in hover:opacity-90", className)}
                    onError={() => setError(true)}
                    {...props}
                />
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh] p-0 border-none bg-transparent shadow-none flex flex-col items-center justify-center outline-none [&>button.absolute]:hidden">
                <DialogTitle className="sr-only">{alt || "Image Lightbox"}</DialogTitle>

                <div
                    className="flex-1 min-h-0 w-full relative flex items-center justify-center overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
                        className={cn(
                            "relative transition-transform duration-200 ease-out bg-background p-2 rounded-md shadow-2xl flex items-center justify-center select-none",
                            scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            className={cn(
                                "max-w-full max-h-[calc(90vh-100px)] object-contain",
                                className
                            )}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-lg">
                    <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 1} className="h-8 w-8 rounded-full">
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 5} className="h-8 w-8 rounded-full">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 rounded-full">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="fixed top-4 right-4 z-50 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-destructive hover:text-destructive-foreground ring-1 ring-border/50"
                >
                    <X className="h-6 w-6" />
                </Button>
            </DialogContent>
        </Dialog>
    );
}
