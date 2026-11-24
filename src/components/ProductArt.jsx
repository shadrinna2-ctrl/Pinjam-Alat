import React from 'react'

/**
 * Ilustrasi vektor perangkat laboratorium. Dipakai untuk kartu produk, galeri,
 * hero, dan fallback saat model 3D tidak tersedia.
 */

const METAL = '#B9BFD9'
const METAL_DARK = '#7C83A8'
const BODY = '#232A55'
const BODY_LIGHT = '#2F3768'
const SCREEN = '#7FE7FF'
const ACCENT = '#8B7BFF'
const PINK = '#FF8FBC'

function Bg({ tint = '#7865FF', uid }) {
  return (
    <>
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.45" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`surface-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D2447" />
          <stop offset="100%" stopColor="#0D1027" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#surface-${uid})`} />
      <rect width="400" height="300" fill={`url(#glow-${uid})`} />
      <g stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="0" y1={20 + i * 32} x2="400" y2={20 + i * 32} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={20 + i * 32} y1="0" x2={20 + i * 32} y2="300" />
        ))}
      </g>
      <ellipse cx="200" cy="262" rx="120" ry="17" fill="#000" opacity="0.35" />
    </>
  )
}

const Screen = ({ x, y, w, h, lines = 3, color = SCREEN }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="4" fill="#0A1A2E" stroke="#4A5480" />
    <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="2" fill={color} opacity="0.22" />
    {Array.from({ length: lines }).map((_, i) => (
      <rect
        key={i}
        x={x + 7}
        y={y + 8 + i * Math.max(5, (h - 14) / lines)}
        width={(w - 16) * (0.55 + ((i * 37) % 40) / 100)}
        height="2"
        rx="1"
        fill={color}
        opacity={0.85 - i * 0.12}
      />
    ))}
  </g>
)

const Knob = ({ cx, cy, r = 7, color = METAL }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={color} />
    <circle cx={cx} cy={cy} r={r * 0.55} fill="#3B4470" />
    <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.8} stroke="#E6E9F7" strokeWidth="1.5" />
  </g>
)

const lights = (x, y, count, gap = 7) =>
  Array.from({ length: count }).map((_, i) => (
    <circle
      key={i}
      cx={x + i * gap}
      cy={y}
      r="2"
      fill={i % 3 === 0 ? '#59F2B0' : i % 3 === 1 ? '#8B7BFF' : '#FFCA6B'}
    />
  ))

const drawings = {
  workstation: () => (
    <g>
      <rect x="150" y="78" width="118" height="150" rx="8" fill={BODY} stroke="#4B5480" />
      <rect x="162" y="90" width="94" height="126" rx="4" fill={BODY_LIGHT} />
      <rect x="172" y="100" width="74" height="3" rx="1.5" fill={ACCENT} opacity="0.8" />
      <circle cx="209" cy="176" r="24" fill="#171C3C" stroke="#5A6494" />
      <circle cx="209" cy="176" r="16" fill={ACCENT} opacity="0.35" />
      <rect x="164" y="150" width="90" height="4" rx="2" fill="#4B5480" />
      <rect x="62" y="74" width="86" height="60" rx="5" fill={BODY} stroke="#4B5480" />
      <rect x="67" y="79" width="76" height="46" rx="3" fill="#0E2340" />
      <Screen x={70} y={82} w={70} h={40} lines={4} />
      <rect x="96" y="134" width="18" height="18" fill={METAL_DARK} />
      <rect x="80" y="152" width="50" height="6" rx="3" fill={METAL} />
      <rect x="285" y="180" width="58" height="10" rx="4" fill={BODY_LIGHT} />
      {lights(292, 185, 5, 9)}
      <rect x="150" y="228" width="118" height="8" rx="4" fill="#12162F" />
    </g>
  ),
  laptop: () => (
    <g>
      <rect x="112" y="82" width="176" height="112" rx="8" fill={BODY} stroke="#4B5480" />
      <rect x="120" y="90" width="160" height="96" rx="4" fill="#0E2340" />
      <Screen x={128} y={100} w={144} h={76} lines={6} />
      <path d="M96 194h208l16 26H80z" fill={METAL_DARK} />
      <rect x="160" y="202" width="80" height="10" rx="3" fill="#454F7C" />
      <rect x="80" y="220" width="240" height="6" rx="3" fill="#12162F" />
    </g>
  ),
  server: () => (
    <g>
      <rect x="120" y="52" width="160" height="190" rx="8" fill={BODY} stroke="#4B5480" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <rect x="130" y={62 + i * 25} width="140" height="19" rx="3" fill={BODY_LIGHT} />
          <rect x="136" y={68 + i * 25} width="42" height="7" rx="2" fill="#0E2340" />
          {lights(250, 71 + i * 25, 3, 7)}
          <rect x="186" y={68 + i * 25} width="38" height="7" rx="2" fill={METAL_DARK} opacity="0.7" />
        </g>
      ))}
      <rect x="132" y="240" width="40" height="10" rx="3" fill="#12162F" />
      <rect x="228" y="240" width="40" height="10" rx="3" fill="#12162F" />
    </g>
  ),
  nas: () => (
    <g>
      <rect x="132" y="86" width="136" height="140" rx="8" fill={BODY} stroke="#4B5480" />
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x="142" y={96 + i * 30} width="116" height="24" rx="4" fill={BODY_LIGHT} />
          <rect x="150" y={103 + i * 30} width="70" height="10" rx="2" fill="#0E2340" />
          <circle cx="248" cy={108 + i * 30} r="3" fill="#59F2B0" />
        </g>
      ))}
      <rect x="142" y="214" width="116" height="4" rx="2" fill={ACCENT} opacity="0.6" />
    </g>
  ),
  router: () => (
    <g>
      <rect x="100" y="122" width="200" height="46" rx="9" fill={BODY} stroke="#4B5480" />
      <rect x="112" y="132" width="86" height="26" rx="4" fill={BODY_LIGHT} />
      {lights(210, 138, 5, 10)}
      <line x1="122" y1="122" x2="112" y2="66" stroke={METAL} strokeWidth="4" strokeLinecap="round" />
      <line x1="278" y1="122" x2="292" y2="66" stroke={METAL} strokeWidth="4" strokeLinecap="round" />
      <line x1="150" y1="122" x2="150" y2="74" stroke={METAL_DARK} strokeWidth="3" strokeLinecap="round" />
      <line x1="250" y1="122" x2="250" y2="74" stroke={METAL_DARK} strokeWidth="3" strokeLinecap="round" />
      <rect x="100" y="168" width="200" height="8" rx="4" fill="#12162F" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={112 + i * 22} y="176" width="14" height="26" rx="2" fill={i % 2 ? '#2F3768' : '#3B4470'} />
      ))}
    </g>
  ),
  switch: () => (
    <g>
      <rect x="76" y="120" width="248" height="44" rx="7" fill={BODY} stroke="#4B5480" />
      <rect x="86" y="128" width="46" height="28" rx="3" fill={BODY_LIGHT} />
      <text x="109" y="147" fill={ACCENT} fontSize="12" fontWeight="700" textAnchor="middle">
        48
      </text>
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={146 + c * 38}
            y={128 + r * 9}
            width="26"
            height="7"
            rx="1.5"
            fill="#3B4470"
          />
        )),
      )}
      {lights(92, 174, 6, 9)}
      <rect x="76" y="170" width="248" height="4" rx="2" fill="#12162F" />
      <text x="200" y="111" fill="#8F97BE" fontSize="10" letterSpacing="2" textAnchor="middle">
        MANAGED SWITCH
      </text>
    </g>
  ),
  firewall: () => (
    <g>
      <rect x="110" y="104" width="180" height="92" rx="10" fill={BODY} stroke="#4B5480" />
      <path
        d="M200 116l30 10v22c0 18-13 30-30 36-17-6-30-18-30-36v-22z"
        fill={ACCENT}
        opacity="0.85"
      />
      <path d="M188 152l9 9 16-17" stroke="#0D1027" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="122" y="176" width="60" height="8" rx="3" fill="#0E2340" />
      {lights(238, 182, 3, 10)}
      <rect x="150" y="196" width="100" height="8" rx="4" fill="#12162F" />
    </g>
  ),
  splicer: () => (
    <g>
      <rect x="96" y="112" width="208" height="98" rx="10" fill={BODY} stroke="#4B5480" />
      <Screen x={110} y={124} w={96} h={62} lines={5} />
      <rect x="220" y="124" width="72" height="30" rx="4" fill={BODY_LIGHT} />
      {lights(230, 133, 4, 12)}
      <circle cx="256" cy="170" r="17" fill={BODY_LIGHT} stroke="#4B5480" />
      <path d="M70 150c24-18 44-18 60 0" stroke={PINK} strokeWidth="2" fill="none" />
      <path d="M330 150c-24-18-44-18-60 0" stroke={ACCENT} strokeWidth="2" fill="none" />
      <rect x="120" y="210" width="160" height="8" rx="4" fill="#12162F" />
      <text x="200" y="104" fill="#8F97BE" fontSize="9" letterSpacing="2" textAnchor="middle">
        FUSION SPLICER
      </text>
    </g>
  ),
  instrument: ({ accent = ACCENT }) => (
    <g>
      <rect x="82" y="96" width="236" height="112" rx="10" fill={BODY} stroke="#4B5480" />
      <Screen x={94} y={108} w={140} h={66} lines={4} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={96 + i * 46} y={180} width="38" height="6" rx="3" fill="#4B5480" />
      ))}
      <Knob cx={262} cy={132} r={14} color={accent} />
      <Knob cx={294} cy={132} r={10} />
      <Knob cx={262} cy={172} r={10} />
      {lights(286, 176, 4, 9)}
      <Screen x={248} y={188} w={54} h={12} lines={1} color={accent} />
      <rect x="110" y="208" width="46" height="6" rx="3" fill="#2A315C" />
      <rect x="244" y="208" width="46" height="6" rx="3" fill="#2A315C" />
      <text x="164" y="88" fill="#8F97BE" fontSize="9" letterSpacing="2" textAnchor="middle">
        LAB INSTRUMENT
      </text>
    </g>
  ),
  psu: () => (
    <g>
      <rect x="88" y="104" width="224" height="104" rx="10" fill={BODY} stroke="#4B5480" />
      <Screen x={100} y={116} w={72} h={40} lines={2} />
      <Screen x={100} y={162} w={72} h={34} lines={2} color="#FFC86B" />
      <Screen x={184} y={116} w={72} h={40} lines={2} color="#FF9BC7" />
      <Knob cx={276} cy={134} r={12} />
      <Knob cx={276} cy={172} r={12} />
      <rect x="184" y="166" width="72" height="30" rx="3" fill="#0A1A2E" stroke="#4A5480" />
      {lights(192, 180, 4, 12)}
      <rect x="110" y="208" width="40" height="6" rx="3" fill="#2A315C" />
      <rect x="250" y="208" width="40" height="6" rx="3" fill="#2A315C" />
    </g>
  ),
  machine: () => (
    <g>
      <rect x="74" y="76" width="252" height="150" rx="8" fill={BODY} stroke="#4B5480" />
      <rect x="88" y="88" width="224" height="126" rx="4" fill="#151B3B" />
      <rect x="88" y="88" width="224" height="16" rx="4" fill="#2A315C" />
      <line x1="88" y1="120" x2="312" y2="120" stroke={METAL} strokeWidth="5" />
      <rect x="176" y="104" width="48" height="34" rx="5" fill={METAL_DARK} />
      <line x1="200" y1="138" x2="200" y2="164" stroke={METAL} strokeWidth="3" />
      <circle cx="200" cy="170" r="6" fill={PINK} />
      <rect x="104" y="182" width="70" height="24" rx="3" fill="#232A55" stroke="#4B5480" />
      {lights(110, 194, 4, 10)}
      <rect x="228" y="182" width="70" height="24" rx="3" fill="#232A55" stroke="#4B5480" />
      <Screen x={236} y={186} w={54} h={16} lines={2} />
      <rect x="120" y="226" width="60" height="8" rx="4" fill="#12162F" />
      <rect x="220" y="226" width="60" height="8" rx="4" fill="#12162F" />
    </g>
  ),
  printer3d: () => (
    <g>
      <rect x="112" y="64" width="176" height="168" rx="6" fill="none" stroke={METAL} strokeWidth="6" />
      <rect x="112" y="64" width="176" height="12" fill={BODY_LIGHT} />
      <rect x="112" y="220" width="176" height="12" fill={BODY_LIGHT} />
      <line x1="112" y1="64" x2="112" y2="232" stroke={METAL_DARK} strokeWidth="6" />
      <line x1="288" y1="64" x2="288" y2="232" stroke={METAL_DARK} strokeWidth="6" />
      <line x1="118" y1="112" x2="282" y2="112" stroke={METAL} strokeWidth="4" />
      <rect x="184" y="96" width="42" height="26" rx="4" fill={ACCENT} />
      <line x1="205" y1="122" x2="205" y2="146" stroke={PINK} strokeWidth="2" />
      <rect x="136" y="190" width="128" height="10" rx="3" fill="#2A315C" />
      <path d="M136 186h128l-10-22H146z" fill={ACCENT} opacity="0.35" />
      <rect x="158" y="232" width="84" height="8" rx="4" fill="#12162F" />
    </g>
  ),
  handheld: () => (
    <g>
      <rect x="146" y="86" width="108" height="150" rx="12" fill={BODY} stroke="#4B5480" />
      <Screen x={158} y={98} w={84} h={62} lines={3} color="#FFC46B" />
      <circle cx="200" cy="182" r="16" fill={BODY_LIGHT} stroke={ACCENT} />
      <circle cx="200" cy="182" r="7" fill={ACCENT} />
      {lights(176, 216, 4, 10)}
      <rect x="264" y="126" width="34" height="46" rx="6" fill={BODY_LIGHT} />
      <circle cx="281" cy="142" r="9" fill="#0E2340" stroke={METAL_DARK} />
      <circle cx="281" cy="160" r="5" fill={PINK} />
    </g>
  ),
  camera: () => (
    <g>
      <rect x="112" y="108" width="176" height="92" rx="12" fill={BODY} stroke="#4B5480" />
      <rect x="132" y="90" width="52" height="22" rx="5" fill={BODY_LIGHT} />
      <circle cx="200" cy="154" r="42" fill="#151B3B" stroke={METAL_DARK} strokeWidth="4" />
      <circle cx="200" cy="154" r="30" fill="#0A1A2E" />
      <circle cx="200" cy="154" r="20" fill="#233B6B" />
      <circle cx="200" cy="154" r="9" fill="#7FD4FF" opacity="0.8" />
      <circle cx="188" cy="142" r="5" fill="#FFFFFF" opacity="0.5" />
      <rect x="232" y="120" width="34" height="18" rx="4" fill="#2A315C" />
      <circle cx="272" cy="132" r="7" fill={PINK} />
    </g>
  ),
  tripod: () => (
    <g>
      <line x1="200" y1="130" x2="140" y2="238" stroke={METAL} strokeWidth="7" strokeLinecap="round" />
      <line x1="200" y1="130" x2="260" y2="238" stroke={METAL} strokeWidth="7" strokeLinecap="round" />
      <line x1="200" y1="130" x2="200" y2="240" stroke={METAL_DARK} strokeWidth="7" strokeLinecap="round" />
      <rect x="186" y="118" width="28" height="26" rx="4" fill={BODY_LIGHT} />
      <rect x="160" y="92" width="80" height="30" rx="6" fill={BODY} stroke="#4B5480" />
      <circle cx="200" cy="106" r="8" fill={ACCENT} />
      <rect x="150" y="70" width="100" height="18" rx="5" fill={BODY_LIGHT} />
      <circle cx="200" cy="79" r="4" fill={PINK} />
    </g>
  ),
  mic: () => (
    <g>
      <rect x="182" y="76" width="36" height="112" rx="18" fill={BODY} stroke="#4B5480" />
      <rect x="188" y="86" width="24" height="70" rx="12" fill="#3B4470" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="188" y1={94 + i * 11} x2="212" y2={94 + i * 11} stroke="#20264C" strokeWidth="2" />
      ))}
      <rect x="176" y="188" width="48" height="10" rx="5" fill={ACCENT} />
      <path d="M160 206h80l-14 26h-52z" fill={METAL_DARK} />
      <rect x="120" y="150" width="26" height="52" rx="13" fill={BODY_LIGHT} />
      <circle cx="133" cy="163" r="4" fill={PINK} />
    </g>
  ),
  ring: () => (
    <g>
      <circle cx="200" cy="130" r="66" fill="none" stroke={PINK} strokeWidth="14" opacity="0.9" />
      <circle cx="200" cy="130" r="66" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" />
      <circle cx="200" cy="130" r="26" fill={BODY} stroke="#4B5480" />
      <circle cx="200" cy="130" r="14" fill="#2A315C" />
      <line x1="200" y1="196" x2="200" y2="238" stroke={METAL} strokeWidth="6" />
      <line x1="200" y1="238" x2="160" y2="254" stroke={METAL_DARK} strokeWidth="6" />
      <line x1="200" y1="238" x2="240" y2="254" stroke={METAL_DARK} strokeWidth="6" />
    </g>
  ),
  speaker: () => (
    <g>
      <rect x="152" y="66" width="96" height="176" rx="12" fill={BODY} stroke="#4B5480" />
      <circle cx="200" cy="110" r="26" fill="#151B3B" stroke={METAL_DARK} strokeWidth="3" />
      <circle cx="200" cy="110" r="12" fill={ACCENT} opacity="0.8" />
      <circle cx="200" cy="178" r="20" fill="#151B3B" stroke={METAL_DARK} strokeWidth="3" />
      <circle cx="200" cy="178" r="8" fill={PINK} opacity="0.8" />
      <rect x="166" y="210" width="68" height="8" rx="4" fill={ACCENT} />
      <rect x="176" y="232" width="48" height="6" rx="3" fill="#12162F" />
    </g>
  ),
  webcam: () => (
    <g>
      <rect x="102" y="122" width="196" height="48" rx="24" fill={BODY} stroke="#4B5480" />
      <circle cx="200" cy="146" r="23" fill="#0A1A2E" stroke={METAL_DARK} strokeWidth="4" />
      <circle cx="200" cy="146" r="14" fill="#233B6B" />
      <circle cx="200" cy="146" r="6" fill={SCREEN} opacity="0.9" />
      <circle cx="256" cy="146" r="4" fill="#59F2B0" />
      <rect x="176" y="168" width="48" height="26" rx="4" fill={METAL_DARK} />
      <rect x="150" y="194" width="100" height="8" rx="4" fill="#12162F" />
    </g>
  ),
  projector: () => (
    <g>
      <rect x="96" y="114" width="208" height="82" rx="12" fill={BODY} stroke="#4B5480" />
      <circle cx="150" cy="155" r="28" fill="#0A1A2E" stroke={METAL_DARK} strokeWidth="4" />
      <circle cx="150" cy="155" r="17" fill="#2E5A9C" />
      <circle cx="150" cy="155" r="8" fill="#A7E9FF" />
      <path d="M60 155l56-26v52z" fill="#FFE6A8" opacity="0.16" />
      <rect x="196" y="134" width="60" height="10" rx="5" fill="#2A315C" />
      {lights(204, 162, 4, 10)}
      <rect x="120" y="196" width="40" height="8" rx="4" fill="#12162F" />
      <rect x="240" y="196" width="40" height="8" rx="4" fill="#12162F" />
    </g>
  ),
}

export const artKinds = Object.keys(drawings).sort()

export default function ProductArt({ kind = 'instrument', className = '', tint = '#7865FF' }) {
  const uid = React.useId().replace(/:/g, '')
  const draw = drawings[kind] || drawings.instrument
  const safeTint = ['#7865FF', '#FF6DA9', '#22C3B8', '#F59E0B'].includes(tint) ? tint : '#7865FF'
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="Ilustrasi alat laboratorium"
      preserveAspectRatio="xMidYMid slice"
    >
      <Bg tint={safeTint} uid={uid} />
      {draw({ accent: safeTint })}
    </svg>
  )
}
