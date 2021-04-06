import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";

export const linkItems = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Blog',
    url: '/blog',
  },
  {
    name: 'Resume',
    url: '/docs/Jason Maa - Resume.pdf',
  },
];

export const socialMediaItems = [
  {
    name: 'Email',
    url: 'mailto:jasonmaa3955@gmail.com',
    icon: faEnvelope,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/jasmaa',
    icon: faLinkedin,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/jasmaa',
    icon: faGithub,
  },
  {
    name: 'RSS',
    url: '/rss.xml',
    icon: faRss,
  },
];

export const projectItems = [
  {
    name: 'Kuiperbowl',
    description: `Real-time multiplayer quizbowl platform in Django with WebSockets.`,
    sourceURL: 'https://github.com/jasmaa/kuiperbowl',
    siteURL: 'https://kuiperbowl.com',
    imageURL: '/images/projects/kuiperbowl.png',
  },
  {
    name: 'Open Terpmatch',
    description: `Open-source anonymous crushing for University of Maryland students with
    UMD SSO integration and email & SMS notifications.`,
    sourceURL: 'https://github.com/jasmaa/open-terpmatch',
    siteURL: 'http://openterpmatch.xyz',
    imageURL: '/images/projects/openterpmatch.png',
  },
  {
    name: 'Speed Trig',
    description: `React Native mobile app for helping students improve at trigonometry.`,
    siteURL: 'https://play.google.com/store/apps/details?id=com.speedtrig',
    imageURL: '/images/projects/speedtrig.png',
  },
  {
    name: 'Hareclip',
    description: `Mobile reader for University of Maryland's the Hare made in Flutter.`,
    sourceURL: 'https://github.com/hareclip/hareclip-mobile',
    siteURL: 'https://play.google.com/store/apps/details?id=com.hareclip.hareclip_mobile',
    imageURL: '/images/projects/hareclip.png',
  },
];