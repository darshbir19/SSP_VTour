import type { TimelineItem } from '../components/TimelineScroll'
import timelineImage1980 from '../assets/1.jpg'
import timelineImage2000 from '../assets/2.jpg'
import timelineImage2025 from '../assets/3.png'
import fukWingStreet2025Image from '../assets/fkw.jpg'
import peiHoStreetMarket2005Image from '../assets/pp.jpg'
import peiHoStreetMarket2025Image from '../assets/pp1.jpg'

export const goldenTimelineItems: TimelineItem[] = [
  {
    year: '2025',
    title: 'A Dense Hub of Digital Consumption',
    image: timelineImage1980,
    text: 'The district blends classic bargain hunting with modern creator, gaming, and DIY tech communities. Narrow corridors, layered soundscapes, and tightly packed vendors create an intense, fast-paced environment. What was once about repair and necessity has now evolved into a culture of continuous upgrading, comparison, and consumption.',
    imageLabel: 'Now',
  },
  {
    year: '2005',
    title: 'Rise of Consumer Electronics Culture',
    image: timelineImage2000,
    text: 'By the early 2000s, Golden Computer Centre had established itself as a key destination for PC parts, consoles, and gaming culture. Independent vendors competed closely, creating an environment driven by price comparison and product specialization. The space became not just a marketplace, but a hub for enthusiasts navigating a rapidly growing digital world.',
    imageLabel: '2005',
  },
  {
    year: '1980',
    title: 'Early Street Electronics Culture',
    image: timelineImage2025,
    text: '"I remember coming here when most shops were small and crowded, filled with parts more than finished products. People came to fix things, not replace them. You could hear tools, voices, and radios all at once - it was not organized, but it felt alive. There was a kind of energy in the mess, where everyone seemed to be building or repairing something." - Anonymous Community Member. Originally written in Chinese, AI-Image Generated.',
    imageLabel: 'AI reconstruction',
  },
]

export const locationTimelineItems: Record<string, TimelineItem[]> = {
  golden: goldenTimelineItems,
  apliu: [
    {
      year: '2025',
      title: 'In Transition — Gentrification',
      image: '/images/Apliu_2025.jpg',
      text: 'In the background, buildings are stripped and rebuilt behind layers of scaffolding. What looks like maintenance signals something deeper—rising values, shifting ownership, and a slow redefinition of the neighborhood. The streets remain familiar, still full of movement, routine, and everyday life. Even as the foundations shift, the place holds on to its character—for now.',
      imageLabel: 'Now',
    },
    {
      year: '2005',
      title: 'Bargain Tech Culture',
      image: '/images/ApLiuStreet_2005.jpg',
      text: 'By the 2000s, the street had become a familiar destination for bargain hunters, collectors, and hobbyists looking for parts that could not be found in regular shops. Its value came from comparison, negotiation, and local knowledge.',
      imageLabel: '2005',
    },
    {
      year: '1980',
      title: 'Street-Level Electronics Trade',
      image: '/images/Apliu_80.png',
      text: 'Under hanging signs and crowded stalls, Apliu Street thrived as a place of exchange. Vendors laid out rows of second-hand cameras, each with its own story, while customers gathered not just to buy, but to compare, negotiate, and connect. It wasn’t polished—but it was alive, practical, and deeply human.',
      imageLabel: 'Ai reconstruction',
    },
  ],
  'pei-ho': [
    {
      year: '2025',
      title: 'Everyday Food Infrastructure',
      image: peiHoStreetMarket2025Image,
      text: 'Pei Ho Street Wet Market continues to anchor daily routines through produce stalls, fish vendors, and lunchtime movement. Its atmosphere reflects the importance of food shopping as a repeated neighborhood ritual.',
      imageLabel: 'Now',
    },
    {
      year: '2005',
      title: 'A Market of Regulars',
      image: peiHoStreetMarket2005Image,
      text: 'By the 2000s, the market was already shaped by familiar exchanges between vendors and returning customers. Price, freshness, trust, and habit all helped define the rhythm of the place.',
      imageLabel: '2005',
    },
    {
      year: '1980',
      title: 'Wet Market Social Life',
      image: '/images/Wet_Market_2000.png',
      text: 'Earlier memories of the market center on voices, preparation sounds, and crowded movement. It was not only a place to buy food, but a social space where neighbors recognized one another through everyday exchange.',
      imageLabel: 'Archive memory',
    },
  ],
  'fuk-wing': [
    {
      year: '2025',
      title: 'Nostalgia in Retail Form',
      image: fukWingStreet2025Image,
      text: 'Toy Street remains colorful and visually dense, with displays of toys, balloons, models, and seasonal goods. It turns childhood memory into a browsing experience shared by children, parents, and collectors.',
      imageLabel: 'Now',
    },
    {
      year: '2005',
      title: 'Wholesale Play Culture',
      image: '/images/toy2005.jpg',
      text: 'By the 2000s, Fuk Wing Street was known for toy wholesalers and small shops where school supplies, party goods, and novelty items mixed together. The street became a place where play, commerce, and memory overlapped.',
      imageLabel: '2005',
    },
    {
      year: '1980',
      title: 'Small Shops and Childhood Memory',
      image: '/images/Toy_80.png',
      text: 'Earlier toy shopping was remembered through crowded storefronts, simple displays, and the excitement of looking even when nothing was bought. The street carried a sense of discovery through small, affordable objects.',
      imageLabel: 'Archive memory',
    },
  ],
}

/** Four immersive field sites — order for combined research views */
export const immersiveTimelineLocationIds = ['golden', 'apliu', 'pei-ho', 'fuk-wing'] as const
