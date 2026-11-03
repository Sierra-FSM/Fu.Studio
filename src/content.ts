import pdfManifest from './pdf-manifest.json';
export const media = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
export type Project = { id: string; order: number; title: string; description: string; cover: string; pdf: string };
const descriptions = [
  ['g-spine', 'G-SPINE', 'An assisted positioning system and devices for spinal pedicle screw surgery, developed with Xiangya Hospital’s Spine Surgery Department.'],
  ['fresh-loop', 'Fresh Loop', 'A community-based system that redistributes surplus produce and turns food waste into reusable resources.'],
  ['fq-lab', 'FQ Lab', 'A scenario-based financial literacy experience product that teaches children budgeting, money management, and emergency planning.'],
  ['pneuassist', 'PneuAssist', 'An EMG-based soft pneumatic hand rehabilitation device designed to ease fatigue and support functional training.'],
  ['culturgen', 'CulturGen', 'A generative AI platform that helps automotive designers explore CMF concepts and material combinations.'],
  ['herb-code', 'Herb Code', 'An interactive aromatherapy experience inspired by the herbal fragrances found in Lady Xin Zhui’s tomb.'],
];
export const projects: Project[] = descriptions.map(([id, title, description], i) => ({
  id, title, description, order: i + 1, cover: media(`project-${i+1}-960.webp`), pdf: `${media(`pdf/${i+1}.pdf`)}?v=${(pdfManifest.files as Record<string,{hash:string}>)[`${i+1}.pdf`].hash}`,
}));
export const skills = ['Prototyping', 'UI Design', 'Modeling', 'Coding', 'Hands-on Execution'];
export const links = { undergraduate: 'https://pinwall.cn/users/10351', youtube: 'https://www.youtube.com/@ShiminFu-letusgo' };
export const contact = [
  { label: 'TEL', value: '(+86) 13574862558', href: 'tel:+8613574862558' },
  { label: 'EMAIL', value: 'fushimin0622@outlook.com', href: 'mailto:fushimin0622@outlook.com' },
  { label: 'WeChat', value: 'fsm2724339350', href: undefined },
  { label: 'YOUTUBE', value: '@ShiminFu-letusgo', href: links.youtube },
];
export const research = [
  {
    title: 'Evaluating the Friction of Integrating New Technologies into Existing Workflows',
    category: 'Research Idea · Exploring',
    body: 'In hardware–software coupled environments, such as medical robotics and VR, usability goes beyond interface design. It is also about how seamlessly new technologies fit into existing workflows.',
    question: 'How can we identify and measure the cognitive load, operational burden, and workflow friction introduced by AI, robotics, or VR before real-world deployment?',
    methods: 'Workflow Observation · Cognitive Load Assessment · Usability Testing · Controlled Experiments',
  },
  {
    title: 'Designing for Unknown Users', category: 'Research Musings · Exploring',
    body: 'Traditional UX approaches often assume clearly defined users and tasks. But emerging technologies may serve users whose needs, behaviors, and contexts are not yet fully understood.',
    question: 'How can we make design decisions for users we cannot yet define, while allowing our assumptions to evolve through real-world use?',
    methods: 'Personas as Hypotheses · Assumption Testing · Longitudinal Studies · Participatory Futures',
  },
];
