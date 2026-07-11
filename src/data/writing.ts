export interface Clip {
  title: string;
  outlet: string;
  // e.g. "Op-ed", "Essay", "Interview"
  kind: string;
  date: string;
  href: string;
  blurb: string;
  // The lead piece gets larger treatment
  featured?: boolean;
}

export const clips: Clip[] = [
  {
    title: 'Norwood Hospital Was Done In by Inadequate State Regulations',
    outlet: 'CommonWealth Beacon',
    kind: 'Op-ed',
    date: 'May 2026',
    href: 'https://commonwealthbeacon.org/opinion/norwood-hospital-was-done-in-by-inadequate-state-regulations-here-is-the-fix/',
    blurb:
      'On hospital REITs, private-equity extraction, and the regulatory gap that let a Massachusetts hospital sit closed for six years. A state that regulates utilities and transit has no equivalent tools for hospital infrastructure.',
    featured: true,
  },
  {
    title: "The Corporate Takeover of Cannabis Isn't Inevitable",
    outlet: 'The Parabola Papers',
    kind: 'Essay',
    date: 'February 2026',
    href: 'https://parabolacenter.substack.com/p/the-corporate-takeover-of-cannabis',
    blurb:
      'How alcohol and tobacco companies have tried to buy their way into legal cannabis, what the research says about how far they have actually gotten, and why the outcome depends on the regulatory structure we choose to build.',
  },
  {
    title: 'The Drug Policy U-Curve',
    outlet: 'The Parabola Papers',
    kind: 'Essay',
    date: '2024',
    href: 'https://parabolacenter.substack.com',
    blurb:
      'The foundational essay on why both prohibition and unregulated commercial markets cause harm, and why the best policy sits in the space between them. Published alongside a companion interview with Dr. John Marks.',
  },
];
