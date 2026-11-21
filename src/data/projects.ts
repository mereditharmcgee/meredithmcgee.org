export interface Project {
  title: string;
  role: string;
  // Category label shown as a small chip
  tag: string;
  // The kind of project: product | research | practice | dev | policy
  tone: 'product' | 'research' | 'practice' | 'dev' | 'policy';
  // Which of the four verbs this belongs to. Product is build; research and
  // practice are study; development is fund; policy comms is write.
  verb: 'study' | 'write' | 'build' | 'fund';
  // Concrete format/length line, e.g. "9-slide pitch deck"
  format: string;
  // The compressed cover image, with its pixel size
  thumb: { src: string; width: number; height: number };
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
    verb: 'build',
    format: '9-slide pitch deck',
    thumb: { src: '/img/cover-ratemyplace-deck.jpg', width: 640, height: 360 },
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
    verb: 'study',
    format: 'Conference poster + talk',
    thumb: { src: '/img/cover-joint-realities.jpg', width: 640, height: 480 },
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
    verb: 'study',
    format: 'Research poster',
    thumb: { src: '/img/cover-diet-weed.jpg', width: 640, height: 480 },
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
    verb: 'study',
    format: '29-slide deck',
    thumb: { src: '/img/cover-pachankis.jpg', width: 640, height: 360 },
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
    verb: 'study',
    format: '43-slide talk',
    thumb: { src: '/img/cover-guilford.jpg', width: 640, height: 360 },
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
    verb: 'fund',
    format: '8-page prospectus',
    thumb: { src: '/img/cover-people-over-profits.jpg', width: 640, height: 829 },
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
    verb: 'write',
    format: '6-panel explainer',
    thumb: { src: '/img/cover-why-parabola.jpg', width: 640, height: 800 },
    coverAlt: "Why We're Called Parabola explainer cover",
    pdf: '/projects/pdfs/why-parabola.pdf',
    desc: 'I did the research, wrote the copy, and designed this explainer of the idea at the center of our drug-policy work.',
    cta: 'Open the piece',
  },
];
