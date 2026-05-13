// Dwell-window timing for chapter copy reveals. CornerSection reads these
// to compute when its chapter mark + glass card fade in, hold, and fade
// out as the section passes through the viewport center. Originally
// shared with a page-wide scroll-scrub video; the chapter-side timing
// remains a useful primitive even where no video is present.

/**
 * Half-width of the pre-roll before a chapter's "fills viewport" scroll
 * position. The video locks onto the dwell frame, and the chapter copy
 * reaches full opacity, this many viewport-heights of scroll BEFORE the
 * section's center hits the viewport center. Smaller = the lock arrives
 * later (frame snaps in as the section fully takes over the screen).
 * Generous value (0.25) — together with TRAIL = 0.5 and FADE = 0.4 the
 * visible window for adjacent sections overlaps so there's no empty
 * gap when scrolling between them.
 */
export const DWELL_LEAD_VH = 0.25;

/**
 * Default trail (post-roll) of the dwell window. The video stays paused
 * and the chapter copy stays fully visible for this many viewport-heights
 * of scroll AFTER the section's center hits viewport center, before the
 * scrub resumes toward the next chapter. Individual chapters can override
 * via the `scrubTrailVh` prop (forwarded as `data-scrub-trail`). Large
 * value (0.5) keeps the body card at full opacity for an extra
 * half-viewport of scroll past center — gives the reader time on the
 * card before it starts to fade out.
 */
export const DWELL_TRAIL_VH = 0.5;
