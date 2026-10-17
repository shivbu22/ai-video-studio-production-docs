import { describe, it, expect } from 'vitest';
import { BarChart } from '../src/templates/BarChart';
import { LineChart } from '../src/templates/LineChart';
import { Comparison } from '../src/templates/Comparison';
import { TierList } from '../src/templates/TierList';
import { QuoteCard } from '../src/templates/QuoteCard';
import { StatCounter } from '../src/templates/StatCounter';
import { AnimatedCaptions } from '../src/components/AnimatedCaptions';

describe('Remotion Templates & Captions', () => {
  it('should export all 6 MVP motion graphic templates', () => {
    expect(BarChart).toBeDefined();
    expect(LineChart).toBeDefined();
    expect(Comparison).toBeDefined();
    expect(TierList).toBeDefined();
    expect(QuoteCard).toBeDefined();
    expect(StatCounter).toBeDefined();
  });

  it('should export AnimatedCaptions component', () => {
    expect(AnimatedCaptions).toBeDefined();
  });
});
