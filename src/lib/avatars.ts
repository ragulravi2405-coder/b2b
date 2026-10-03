// High quality, diverse modern cartoon/illustrated adult male avatars
export function generateMaleAvatarSvg(seed: string, options: {
  bgGradient: [string, string];
  skinTone: string;
  hairColor: string;
  hairStyle: 'quiff' | 'curly' | 'wavy' | 'fade' | 'textured' | 'slick' | 'side-part';
  beardStyle?: 'none' | 'stubble' | 'trim' | 'full';
  hasGlasses?: boolean;
  shirtColor: string;
  accessory?: 'none' | 'earring' | 'chain';
}): string {
  const { bgGradient, skinTone, hairColor, hairStyle, beardStyle = 'stubble', hasGlasses, shirtColor, accessory } = options;

  let hairSvg = '';
  switch (hairStyle) {
    case 'curly':
      hairSvg = `
        <path d="M50 48 C45 28, 65 16, 100 16 C135 16, 155 28, 150 48 C160 55, 160 75, 152 82 C145 68, 140 50, 130 45 C120 40, 80 40, 70 45 C60 50, 55 68, 48 82 C40 75, 40 55, 50 48 Z" fill="${hairColor}" />
        <circle cx="70" cy="30" r="14" fill="${hairColor}" />
        <circle cx="95" cy="22" r="16" fill="${hairColor}" />
        <circle cx="120" cy="26" r="15" fill="${hairColor}" />
        <circle cx="140" cy="38" r="13" fill="${hairColor}" />
        <circle cx="60" cy="42" r="13" fill="${hairColor}" />
      `;
      break;
    case 'quiff':
      hairSvg = `
        <path d="M48 65 C45 42, 60 20, 95 14 C130 8, 158 24, 154 55 C152 68, 145 74, 145 74 C140 50, 125 35, 95 38 C75 40, 58 52, 48 65 Z" fill="${hairColor}" />
        <path d="M75 16 C105 10, 145 20, 150 45 C135 25, 95 24, 75 16 Z" fill="${hairColor}" opacity="0.9" />
      `;
      break;
    case 'wavy':
      hairSvg = `
        <path d="M46 65 C44 35, 65 22, 100 20 C135 18, 156 35, 154 65 C146 52, 134 42, 102 42 C70 42, 54 52, 46 65 Z" fill="${hairColor}" />
        <path d="M54 38 C70 24, 130 22, 146 38 C135 30, 75 30, 54 38 Z" fill="${hairColor}" />
      `;
      break;
    case 'fade':
      hairSvg = `
        <path d="M52 62 C50 40, 68 28, 100 28 C132 28, 150 40, 148 62 C144 50, 132 40, 100 40 C68 40, 56 50, 52 62 Z" fill="${hairColor}" />
        <rect x="52" y="55" width="96" height="15" rx="7" fill="${hairColor}" />
      `;
      break;
    case 'slick':
      hairSvg = `
        <path d="M48 60 C46 30, 70 20, 100 20 C130 20, 154 30, 152 60 C146 45, 130 36, 100 36 C70 36, 54 45, 48 60 Z" fill="${hairColor}" />
      `;
      break;
    default:
      hairSvg = `
        <path d="M48 60 C45 35, 68 22, 100 20 C135 20, 155 35, 152 60 C146 48, 132 38, 100 38 C68 38, 54 48, 48 60 Z" fill="${hairColor}" />
      `;
  }

  let beardSvg = '';
  if (beardStyle === 'stubble') {
    beardSvg = `
      <path d="M72 108 C75 128, 85 138, 100 138 C115 138, 125 128, 128 108 C128 116, 122 136, 100 136 C78 136, 72 116, 72 108 Z" fill="${hairColor}" opacity="0.35" />
      <path d="M88 120 C92 124, 108 124, 112 120" stroke="${hairColor}" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
    `;
  } else if (beardStyle === 'trim') {
    beardSvg = `
      <path d="M68 98 C72 128, 82 142, 100 142 C118 142, 128 128, 132 98 C130 120, 120 138, 100 138 C80 138, 70 120, 68 98 Z" fill="${hairColor}" opacity="0.8" />
      <path d="M86 112 C92 116, 108 116, 114 112 C108 118, 92 118, 86 112 Z" fill="${hairColor}" />
    `;
  } else if (beardStyle === 'full') {
    beardSvg = `
      <path d="M64 92 C68 132, 80 148, 100 148 C120 148, 132 132, 136 92 C134 126, 122 144, 100 144 C78 144, 66 126, 64 92 Z" fill="${hairColor}" opacity="0.9" />
      <path d="M84 110 C92 116, 108 116, 116 110 C108 120, 92 120, 84 110 Z" fill="${hairColor}" />
    `;
  }

  const glassesSvg = hasGlasses ? `
    <g stroke="#17152A" stroke-width="3" fill="none" opacity="0.9">
      <rect x="68" y="70" width="26" height="20" rx="6" fill="#FFFFFF" fill-opacity="0.2" />
      <rect x="106" y="70" width="26" height="20" rx="6" fill="#FFFFFF" fill-opacity="0.2" />
      <line x1="94" y1="78" x2="106" y2="78" />
      <line x1="56" y1="76" x2="68" y2="76" />
      <line x1="132" y1="76" x2="144" y2="76" />
    </g>
  ` : '';

  const accessorySvg = accessory === 'earring' ? `
    <circle cx="58" cy="94" r="3" fill="#FCD34D" stroke="#B45309" stroke-width="1" />
  ` : accessory === 'chain' ? `
    <path d="M86 150 C94 165, 106 165, 114 150" stroke="#FBBF24" stroke-width="2.5" fill="none" stroke-linecap="round" />
  ` : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGradient[0]}" />
          <stop offset="100%" stop-color="${bgGradient[1]}" />
        </linearGradient>
        <linearGradient id="shirt-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${shirtColor}" />
          <stop offset="100%" stop-color="#1E1B4B" stop-opacity="0.3" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="200" height="200" rx="28" fill="url(#bg-${seed})" />

      <!-- Subtle geometric aura -->
      <circle cx="100" cy="100" r="76" fill="#FFFFFF" fill-opacity="0.12" />
      <circle cx="150" cy="50" r="45" fill="#FFFFFF" fill-opacity="0.08" />

      <!-- Neck & Chest -->
      <path d="M84 122 L84 152 L116 152 L116 122 Z" fill="${skinTone}" />
      <path d="M84 130 C92 138, 108 138, 116 130" stroke="#000000" stroke-width="1.5" stroke-opacity="0.1" fill="none" />

      <!-- Shirt / Collar -->
      <path d="M35 200 C38 165, 65 145, 86 148 L100 162 L114 148 C135 145, 162 165, 165 200 Z" fill="${shirtColor}" />
      <path d="M86 148 L100 170 L114 148 Z" fill="#FFFFFF" fill-opacity="0.85" />
      ${accessorySvg}

      <!-- Ears -->
      <circle cx="58" cy="88" r="10" fill="${skinTone}" />
      <circle cx="142" cy="88" r="10" fill="${skinTone}" />
      <circle cx="58" cy="88" r="6" fill="#000000" fill-opacity="0.08" />
      <circle cx="142" cy="88" r="6" fill="#000000" fill-opacity="0.08" />

      <!-- Head Base -->
      <path d="M60 80 C60 50, 75 42, 100 42 C125 42, 140 50, 140 80 C140 114, 126 136, 100 136 C74 136, 60 114, 60 80 Z" fill="${skinTone}" />

      <!-- Hair -->
      ${hairSvg}

      <!-- Eyebrows -->
      <path d="M72 68 Q82 64 92 67" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M108 67 Q118 64 128 68" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" fill="none" />

      <!-- Eyes -->
      <ellipse cx="82" cy="78" rx="4.5" ry="4.5" fill="#17152A" />
      <ellipse cx="118" cy="78" rx="4.5" ry="4.5" fill="#17152A" />
      <circle cx="83.5" cy="76.5" r="1.5" fill="#FFFFFF" />
      <circle cx="119.5" cy="76.5" r="1.5" fill="#FFFFFF" />

      <!-- Nose -->
      <path d="M100 78 L97 94 L104 94" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.25" fill="none" />

      <!-- Smile -->
      <path d="M88 104 Q100 114 112 104" stroke="#831843" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M94 105 Q100 110 106 105" fill="#FFFFFF" />

      <!-- Beard / Facial Hair -->
      ${beardSvg}

      <!-- Glasses -->
      ${glassesSvg}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
