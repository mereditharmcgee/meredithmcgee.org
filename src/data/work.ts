export interface CaseStudySection {
  heading: string;
  paragraphs: string[];
}

export interface WorkItem {
  title: string;
  description: string;
  category: string;
  featured: boolean;
  // Present when the item has its own case-study page at /work/[slug]
  slug?: string;
  // Short line of context (organization, year) shown under the title
  role?: string;
  // External or internal link when the item points to a real artifact
  href?: string;
  // Custom label for the link (defaults handled in WorkCard)
  linkLabel?: string;
  // Optional image shown on the case-study page
  image?: string;
  imageAlt?: string;
  // Optional small thumbnail shown on the work card
  thumb?: string;
  // Long-form content for flagship case-study pages
  caseStudy?: {
    lede: string;
    sections: CaseStudySection[];
  };
}

export const work: WorkItem[] = [
  {
    title: "RateMyPlace",
    description: "A public, health-weighted record of rental housing that I designed and built solo. Renters search an address and see what people who actually lived there reported. Live in New Haven and Boston.",
    category: "PROJECTS",
    featured: true,
    slug: "rate-my-place",
    role: "Founder and builder · 2025 to present",
    href: "https://ratemyplace.org",
    linkLabel: "Visit RateMyPlace",
    image: "/rate-my-place.png",
    imageAlt: "The RateMyPlace homepage, with the tagline Know before you sign and a search bar",    caseStudy: {
      lede: "Renters make one of the highest-stakes decisions of their lives with almost no reliable information. Landlords have data on tenants. Tenants have word of mouth. RateMyPlace is my attempt to even that out.",
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "RateMyPlace is a tenant review platform I designed and built from scratch, live in New Haven and Boston. You search an address and see what people who actually lived there reported about conditions, management, and the problems research shows affect your health. Then you leave your own review for the next tenant.",
          ],
        },
        {
          heading: "The scoring isn't vibes",
          paragraphs: [
            "I built a 27-item housing assessment out of three validated public health instruments, the OHQS, the PHQS, and the WHO LARES, and weighted each item by its documented health impact. Every reviewed building gets traced back through public records to the owner actually accountable for its conditions, so the score points at a person, not just a place.",
          ],
        },
        {
          heading: "How I built it",
          paragraphs: [
            "I built the whole thing solo and full-stack: Astro, TypeScript, React, running on Cloudflare.",
            "I designed it privacy-first. Reviewers stay anonymous, move-out dates show as seasons instead of exact dates, and no IP addresses or personal identifiers are stored. The point is that a tenant can tell the truth about a place without fear of retaliation.",
          ],
        },
        {
          heading: "Where it's going",
          paragraphs: [
            "I pitched RateMyPlace at the 2026 Yale Innovation Summit, where it picked up local news coverage. It's growing by word of mouth, one honest review at a time, which is exactly how a public record of housing should grow.",
          ],
        },
      ],
    },
  },
  {
    title: "Cannabis Legalization, From the Ground Up",
    description: "I co-lead a qualitative study at Parabola Center on how people in states with five or more years of legal cannabis actually experience it. Legalization gets argued about in the abstract. This is what it looks like from the inside.",
    category: "RESEARCH",
    featured: true,
    slug: "cannabis-legalization-study",
    role: "Parabola Center for Law and Policy · Junior Research Fellow",    image: "/boston-group.jpg",
    imageAlt: "Meredith with the Parabola Center team and attendees",
    caseStudy: {
      lede: "Legalization gets argued about in the abstract constantly. I wanted to know what it looks like from the inside, in the states that have lived with it the longest.",
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "I co-lead an IRB-approved qualitative study at Parabola Center with Faith English of Johns Hopkins, looking at how people in states with five or more years of legal adult-use cannabis actually experience it. I built the interview guides, run the interviews, and code the transcripts with a structured, theory-driven approach across more than twenty participants.",
          ],
        },
        {
          heading: "What we're hearing",
          paragraphs: [
            "The short version: most people living in these markets see legalization as a real improvement, and the stigma that shadowed cannabis for decades has dropped off sharply.",
            "The part that's come up shortest is repair. The expungement and reinvestment these laws promised to the people the drug war hit hardest is the piece that keeps falling through.",
          ],
        },
        {
          heading: "Where it's going",
          paragraphs: [
            "I've shared early findings at the University of Illinois Chicago's Cannabis Research Institute and at Parabola's own research roundup, and the full findings are being released publicly in 2026.",
            "The point isn't to relitigate whether legalization was a good idea. It's to show where market design falls short of what it promised, and what it would take to close that gap.",
          ],
        },
      ],
    },
  },
  {
    title: "A Million Dollars, One Proposal at a Time",
    description: "I write and manage grants for Bradbury-Sullivan LGBT Community Center. That work has brought in more than a million dollars for health equity and community programming.",
    category: "GRANTS",
    featured: true,
    slug: "bradbury-sullivan-grants",
    role: "Bradbury-Sullivan LGBT Community Center · 2023 to present",
    caseStudy: {
      lede: "A grant proposal is a case for why a community deserves resources it shouldn't have to keep asking for. I've written enough of them to have brought in over a million dollars.",
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "I independently manage a funding portfolio for Bradbury-Sullivan LGBT Community Center across forecasting, writing, reporting, and compliance. Every proposal starts with a real community need and the evidence behind a program, and ends with a funder who understands why the work matters and what changes because of it.",
          ],
        },
        {
          heading: "Why it counts as public health",
          paragraphs: [
            "Development work is public health work. Writing these taught me to build an argument that holds up to a skeptical reviewer and still reads like a person wrote it. That combination, rigor that doesn't sound like a robot, is the thing I care most about getting right.",
          ],
        },
        {
          heading: "The number",
          paragraphs: [
            "Over a million dollars in foundation, government, and corporate grants, one proposal at a time. Each one funded something specific: a program, a service, a staff line that keeps a door open for people who need what's behind it.",
          ],
        },
      ],
    },
  },
  {
    title: "Norwood Hospital Was Done In by Inadequate State Regulations",
    description: "An op-ed on hospital REITs, private-equity extraction, and the regulatory gap that let a Massachusetts hospital close for six years. A state that regulates utilities and transit has no equivalent tools for hospital infrastructure.",
    category: "WRITING",
    featured: true,
    role: "CommonWealth Beacon · May 2026",
    href: "https://commonwealthbeacon.org/opinion/norwood-hospital-was-done-in-by-inadequate-state-regulations-here-is-the-fix/",
    linkLabel: "Read in CommonWealth Beacon",
  },
  {
    title: "Ground Level",
    description: "My Substack about cannabis, public health, and the gap between policy and practice. It's where I work out the ideas that don't fit in a research paper, in plain language, most weeks.",
    category: "WRITING",
    featured: true,
    href: "https://groundlevelmm.substack.com",
    linkLabel: "Read on Substack",
  },
  {
    title: "A Reliability Tool for Qualitative Coders",
    description: "A free browser tool I built that calculates inter-rater reliability straight from Dedoose exports. Drop in two or three coders' files and it does the kappa math, no spreadsheet gymnastics. I made it because I needed it.",
    category: "TOOLS",
    featured: true,
    href: "/tools/kappa",
    linkLabel: "Open the tool",
  },
  {
    title: "The Corporate Takeover of Cannabis Isn't Inevitable",
    description: "How alcohol and tobacco companies have tried to buy their way into legal cannabis, what the research says about how far they've actually gotten, and why the outcome depends on the regulatory structure we choose to build.",
    category: "WRITING",
    featured: false,
    role: "The Parabola Papers · February 2026",
    href: "https://parabolacenter.substack.com/p/the-corporate-takeover-of-cannabis",
    linkLabel: "Read on the Parabola Papers",
  },
  {
    title: "The Drug Policy U-Curve",
    description: "Parabola Center's foundational essay on why both prohibition and unregulated commercial markets cause harm, and why the best policy sits in the space between them. I also published a companion interview with Dr. John Marks.",
    category: "WRITING",
    featured: false,
    role: "Parabola Center for Law and Policy · 2024",
    href: "https://parabolacenter.substack.com",
    linkLabel: "Read on the Parabola Papers",
  },
  {
    title: "Joint Realities: Cannabis Use and Sexual Identity",
    description: "My MPH thesis, using multi-state BRFSS data to measure the prevalence, frequency, and modality of cannabis use by sexual identity, part of a broader look at health disparities in queer communities. Advised by John Pachankis.",
    category: "RESEARCH",
    featured: false,
    role: "Yale School of Public Health · MPH thesis, 2025",
  },
  {
    title: "Psychotherapy for Sexual Minority Women",
    description: "As a graduate research assistant in the Pachankis Lab, I helped run one of the largest psychotherapy studies of sexual minority women (N=450): recruitment, diagnostic interviews, REDCap databases, and analyses in R across five studies through R01 trials.",
    category: "RESEARCH",
    featured: false,
    role: "Yale LGBTQ+ Mental Health Initiative",
  },
  {
    title: "LGBTQ+ Community Capacity Needs Assessment",
    description: "A needs assessment of LGBTQ+ organizations across Connecticut, New York, and New Jersey. I conducted more than twenty semi-structured interviews and wrote the report to inform academic-community partnerships.",
    category: "EVALUATION",
    featured: false,
    role: "Yale Center for Interdisciplinary Research on AIDS · 2024",
  },
  {
    title: "Program Evaluation, Yale Public Health Practice",
    description: "I led a full-cycle evaluation of how students experienced their public health internships, from recruitment and consent through focus groups and analysis, and delivered concrete recommendations the program used with the next class.",
    category: "EVALUATION",
    featured: false,
    role: "Yale Office of Public Health Practice",
  },
  {
    title: "Hemp-Derived THC Marketing Under the 2018 Farm Bill",
    description: "Original research on how hemp-derived THC products are marketed in the regulatory gap the 2018 Farm Bill left open, presented at the American Public Health Association annual meeting.",
    category: "POLICY",
    featured: false,
    role: "APHA Annual Meeting · 2024",  },
];
