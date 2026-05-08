# Frontier — Design Direction

## Inspiration
Dark, premium AI startup. Deep space aesthetic. Glowing blue orb hero. Clean, confident, futuristic.

## Colors
- Background: #05050F (near-black, deep navy)
- Surface: rgba(255,255,255,0.04) glassmorphism
- Border: rgba(255,255,255,0.08)
- Accent Blue: #3B82F6
- Accent Indigo: #6366F1
- Accent Cyan: #06B6D4
- Glow: #3B82F680
- Text Primary: #F0F4FF
- Text Secondary: #94A3B8
- Text Muted: #475569

## Typography
- Display: "Outfit", 600–800 weight, tight tracking
- Body: "Inter", 400–500 weight
- Mono: "JetBrains Mono" for code/scores

## Visual Language
- Hero: large glowing orb (radial gradient blue/indigo) as background centerpiece
- Cards: glassmorphism — backdrop-blur, semi-transparent bg, subtle border, soft box-shadow
- Grid/dot texture overlay on background sections
- Tags/chips: pill-shaped, filled with low-opacity accent color, border with accent
- Active/selected chips: solid accent bg, white text, glow shadow
- Buttons: gradient blue-indigo, glow on hover
- Scores: colored number badges (green=high, yellow=mid, red=low)

## Layout
- Wide centered max-w-7xl
- Generous vertical padding
- Two-column grids for main content
- Asymmetric hero with orb behind text

## Motion
- Staggered fade-up on page load
- Chip select: scale bounce
- Card hover: translateY(-4px) + glow
- Orb: slow pulse animation
- Number counters animate up on appear

## Anti-patterns to avoid
- Pure white backgrounds
- Flat card grids without depth
- Generic purple gradients
- Overused Inter-only typography
