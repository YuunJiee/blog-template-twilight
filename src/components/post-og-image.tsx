import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { OG_IMAGE_SIZE } from '@/config/constants';

// Satori (next/og) renders inline styles only — no CSS variables or Tailwind —
// so OG colours live here as literals.

export interface PillColor {
  bg: string;
  border: string;
  text: string;
}

export const PILL_INDIGO: PillColor = { bg: 'rgba(196,186,240,0.15)', border: 'rgba(196,186,240,0.35)', text: '#d6cff5' };
export const PILL_AMBER:  PillColor = { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' };
const PILL_TAG:           PillColor = { bg: 'rgba(217,163,198,0.18)', border: 'rgba(217,163,198,0.4)', text: '#f0c8e0' };

export function OgPill({ color, children }: { color: PillColor; children: ReactNode }) {
  return (
    <div
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        padding: '8px 20px',
        borderRadius: '9999px',
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </div>
  );
}

interface PostOgImageOptions {
  title: string;
  tags: string[];
  date: string;
  /** Rendered above the title (e.g. a LeetCode problem number). */
  eyebrow?: ReactNode;
  /** Rendered at the right of the site-name row. */
  topRight?: ReactNode;
  /** Rendered at the right of the date row. */
  bottomRight?: ReactNode;
}

/** Shared 1200×630 card for /blog/[id] and /leetcode/[id] OG images. */
export function renderPostOgImage({ title, tags, date, eyebrow, topRight, bottomRight }: PostOgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: `${OG_IMAGE_SIZE.width}px`,
          height: `${OG_IMAGE_SIZE.height}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #2e2950 0%, #4a3d6e 55%, #6e4a6c 100%)',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 85% 15%, rgba(217,163,198,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(139,133,201,0.35) 0%, transparent 50%)',
          }}
        />

        {/* Top: site name (+ optional label) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b85c9, #d9a3c6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>{siteConfig.name.charAt(0).toUpperCase()}</span>
            </div>
            <span style={{ color: '#d6d0ee', fontSize: '20px', letterSpacing: '0.02em' }}>
              {siteConfig.name}
            </span>
          </div>
          {topRight}
        </div>

        {/* Middle: title + tags */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {eyebrow}
          <div
            style={{
              fontSize: title.length > 40 ? '44px' : '56px',
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              // Limit to 3 lines
              display: '-webkit-box',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: PILL_TAG.bg,
                    border: `1px solid ${PILL_TAG.border}`,
                    color: PILL_TAG.text,
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: date (+ optional label) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#b5aed4', fontSize: '18px' }}>{date}</span>
          {bottomRight}
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
