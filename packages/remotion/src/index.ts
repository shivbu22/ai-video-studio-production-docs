import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);

export * from './Root';
export * from './compositions/MainTimeline';
export * from './templates/BarChart';
export * from './templates/StatCounter';
export * from './templates/QuoteCard';
export * from './templates/Comparison';
