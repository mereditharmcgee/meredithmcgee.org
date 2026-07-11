export interface Project {
  title: string;
  role: string;
  // Category label shown as a small chip
  tag: string;
  // Maps to a color class: product | research | practice | dev | policy
  tone: 'product' | 'research' | 'practice' | 'dev' | 'policy';
  // Concrete format/length line, e.g. "9-slide pitch deck"
  format: string;
  cover: string;
  coverAlt: string;
  pdf: string;
  desc: string;
  // Optional secondary link (e.g. the thesis talk behind the poster)
  also?: { label: string; href: string };
  cta: string;
}

export const projects: Project[] = [
  {
    title: 'RateMyPlace',
    role: 'Yale Innovation Summit 2026',
    tag: 'Product',
    tone: 'product',
    format: '9-slide pitch deck',
    cover: '/projects/covers/ratemyplace-deck.jpg',
    coverAlt: 'RateMyPlace pitch deck title slide, "Know before you sign"',
    pdf: '/projects/pdfs/ratemyplace-deck.pdf',
    desc: 'The full pitch for the tenant-review platform I built, from the problem I lived in New Haven to the public-health scoring underneath it.',
    cta: 'Open the deck',
  },
  {
    title: 'Joint Realities',
    role: 'Yale School of Public Health · MPH thesis, 2025',
    tag: 'Research',
    tone: 'research',
    format: 'Conference poster + talk',
    cover: '/projects/covers/joint-realities.jpg',
    coverAlt: 'Joint Realities thesis poster on cannabis use among sexual minority adults',
    pdf: '/projects/pdfs/joint-realities-poster.pdf',
    desc: 'Patterns of cannabis use among sexual minority adults, built on multi-state BRFSS data. Shown here as the conference poster.',
    also: { label: 'Or page through the thesis talk', href: '/projects/pdfs/joint-realities-deck.pdf' },
    cta: 'Open the poster',
  },
  {
    title: 'Diet Weed or Deception?',
    role: 'Yale School of Public Health',
    tag: 'Research',
    tone: 'research',
    format: 'Research poster',
    cover: '/projects/covers/diet-weed.jpg',
    coverAlt: 'Diet Weed or Deception research poster on hemp-derived THC marketing',
    pdf: '/projects/pdfs/diet-weed.pdf',
    desc: 'A look at how "federally legal" hemp-derived THC gets marketed, and how little real health information comes with it.',
    cta: 'Open the poster',
  },
  {
    title: 'Voices and Visions',
    role: 'Yale LGBTQ+ Mental Health Initiative · 2024',
    tag: 'Research',
    tone: 'research',
    format: '29-slide deck',
    cover: '/projects/covers/pachankis.jpg',
    coverAlt: 'Voices and Visions presentation title slide',
    pdf: '/projects/pdfs/pachankis.pdf',
    desc: 'Mapping what LGBTQ+ organizations across the region actually need, and what makes an academic-community partnership work.',
    cta: 'Open the deck',
  },
  {
    title: 'From Insights to Impact',
    role: 'Yale LGBTQ+ Mental Health Initiative · December 2024',
    tag: 'Practice',
    tone: 'practice',
    format: '43-slide talk',
    cover: '/projects/covers/guilford.jpg',
    coverAlt: 'From Insights to Impact presentation title slide',
    pdf: '/projects/pdfs/guilford.pdf',
    desc: 'A talk on turning health-disparities research into something communities can actually use.',
    cta: 'Open the talk',
  },
  {
    title: 'Afterparty Sponsorship Prospectus',
    role: 'Parabola Center · Development, 2026',
    tag: 'Development',
    tone: 'dev',
    format: '8-page prospectus',
    cover: '/projects/covers/people-over-profits.jpg',
    coverAlt: 'People Over Profits sponsorship prospectus cover',
    pdf: '/projects/pdfs/people-over-profits.pdf',
    desc: "The sponsorship case I wrote and designed for Parabola's People Over Profits event in Fort Lauderdale.",
    cta: 'Open the prospectus',
  },
  {
    title: "Why We're Called Parabola",
    role: 'Parabola Center · Research and design',
    tag: 'Policy comms',
    tone: 'policy',
    format: '6-panel explainer',
    cover: '/projects/covers/why-parabola.jpg',
    coverAlt: "Why We're Called Parabola explainer cover",
    pdf: '/projects/pdfs/why-parabola.pdf',
    desc: 'I did the research, wrote the copy, and designed this explainer of the idea at the center of our drug-policy work.',
    cta: 'Open the piece',
  },
];
