// Campus Connect – single source of truth for all visual tokens
export const T = {
  bg:      '#272722',
  surface: '#DCDDBD',
  light:   '#FFFEE6',
  accent:  '#E8672F',
  danger:  '#D64B3A',
  success: '#5E9B52',
  muted:   '#8A8A78',
  white:   '#FFFFFF',
  black:   '#1A1A18',

  radius: 20,
  radiusSm: 12,
  radiusPill: 999,

  font: {
    heading: 28,
    title: 20,
    body: 15,
    caption: 12,
    small: 11,
  },
} as const;

export const ATTENDANCE_THRESHOLD = 0.75;
