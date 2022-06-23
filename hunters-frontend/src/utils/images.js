import * as React from 'react';

export const Coinbase = (props) => (
    <svg width={100} height={100} xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle
      cx={512}
      cy={512}
      r={512}
      style={{
        fill: "#0052ff",
      }}
    />
    <path
      d="M516.3 361.83c60.28 0 108.1 37.18 126.26 92.47H764C742 336.09 644.47 256 517.27 256 372.82 256 260 365.65 260 512.49S370 768 517.27 768c124.35 0 223.82-80.09 245.84-199.28H642.55c-17.22 55.3-65 93.45-125.32 93.45-83.23 0-141.56-63.89-141.56-149.68.04-86.77 57.43-150.66 140.63-150.66z"
      style={{
        fill: "#fff",
      }}
    />
  </svg>
);

export function Logo() {
  return (
    <svg
      width='60'
      height='60'
      viewBox='0 0 150 150'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='75'
        cy='75'
        r='57.5'
        stroke='url(#paint0_linear_1210_876)'
        stroke-width='35'
      />
      <defs>
        <linearGradient
          id='paint0_linear_1210_876'
          x1='23.5'
          y1='9'
          x2='93.5'
          y2='150'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#E41F66' />
          <stop offset='1' stop-color='#1DB3F9' stop-opacity='0.63' />
        </linearGradient>
      </defs>
    </svg>
  );
}