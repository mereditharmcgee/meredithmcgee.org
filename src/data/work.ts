export interface WorkItem {
  title: string;
  description: string;
  category: string;
  featured: boolean;
}

export const work: WorkItem[] = [
  {
    title: 'Cannabis and Psychiatric Risk: A Two-Study Analysis',
    description: 'Synthesized findings from two major cannabis studies to examine how doubled psychiatric risk and declining youth use together raise harder questions about legal market regulation.',
    category: 'RESEARCH',
    featured: true,
  },
  {
    title: 'Parabola Center Content Strategy',
    description: 'Developed and executed a content strategy for the Parabola Center, translating complex public health research into accessible narratives for policy audiences.',
    category: 'WRITING',
    featured: true,
  },
  {
    title: 'Bradbury-Sullivan LGBT Community Center Grant Portfolio',
    description: 'Wrote and managed grant applications supporting health equity programming at Bradbury-Sullivan LGBT Community Center, securing funding for community health initiatives.',
    category: 'GRANTS',
    featured: true,
  },
  {
    title: 'Yale School of Public Health Program Evaluation',
    description: 'Conducted program evaluation research at the Yale School of Public Health, assessing intervention outcomes and developing frameworks for measuring community health impact.',
    category: 'EVALUATION',
    featured: true,
  },
  {
    title: 'Ground Level Newsletter',
    description: 'An ongoing newsletter exploring public health, research, and the gaps between what we know and what we do about it. Published on Substack.',
    category: 'WRITING',
    featured: false,
  },
  {
    title: 'Hemp-Derived THC Policy Analysis',
    description: 'Analyzed the regulatory landscape of hemp-derived THC products across state jurisdictions, mapping gaps between federal and state frameworks.',
    category: 'POLICY',
    featured: false,
  },
  {
    title: 'LGBTQ+ Health Equity Research',
    description: 'Contributed to research examining health disparities in LGBTQ+ communities, with focus on access to affirming care and community-level intervention models.',
    category: 'RESEARCH',
    featured: false,
  },
  {
    title: 'Community Health Needs Assessment',
    description: 'Led a community health needs assessment integrating quantitative health data with qualitative community input to identify priority areas for intervention.',
    category: 'EVALUATION',
    featured: false,
  },
];
