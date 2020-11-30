import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";

export const linkItems = [
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
]

export const workItems = [
  {
    dates: "Jun 2020 - Aug 2020",
    company: "Redhorse Corporation",
    position: "Software Developer Intern",
    descriptionItems: [
      "Deployed a web application as part of a team of interns for analyzing COVID-19 research using a knowledge graph approach to interact with the CORD-19 dataset.",
      "Responsible for developing Spring Boot microservice to interface with Elasticsearch and Neo4j graph database.",
      "Improved code maintainability by applying DRY principles to reduce redundancies in backend data repositories.",
      "Achieved a more lightweight search, reducing application search time by 41% by splitting the search procedure to only use Elasticsearch to find and retrieve document metadata.",
    ],
  },
  {
    dates: "Jun 2019 - Aug 2019",
    company: "Google Summer of Code: aimacode",
    position: "Student Developer",
    descriptionItems: [
      "Designed and contributed JavaScript visualizations illustrating the Canny edge detection algorithm as part of a supplementary project for the Artificial Intelligence: A Modern Approach textbook.",
      "Built interactive demonstrations using React, allowing users to visualize edge detection via Webcam and image upload.",
      "Created each visualization as a separate module, ensuring visualizations to be organized and easy to maintain for the future.",
    ],
  },
];

export const projectItems = [
  {
    name: 'Kuiperbowl',
    description: `Real-time multiplayer quizbowl platform in Django with WebSockets.`,
    sourceURL: 'https://github.com/jasmaa/kuiperbowl',
    siteURL: 'https://kuiperbowl.com',
  },
  {
    name: 'Open Terpmatch',
    description: `Open-source anonymous crushing for University of Maryland students with
    UMD SSO integration and email & SMS notifications.`,
    sourceURL: 'https://github.com/jasmaa/open-terpmatch',
    siteURL: 'http://openterpmatch.xyz',
  },
  {
    name: 'Speed Trig',
    description: `React Native mobile app for helping students improve at trigonometry.`,
    siteURL: 'https://play.google.com/store/apps/details?id=com.speedtrig',
  },
];