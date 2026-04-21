import { Button } from '@/shared/components/Button';
import { FormInput } from '@/shared/components/FormInput';

const neutralColors = [
  { token: 'neutral-bright', bg: 'bg-neutral-bright', hex: '#FAF9F5', label: 'Page background' },
  { token: 'neutral-light', bg: 'bg-neutral-light', hex: '#F4F4F0', label: 'Cards, panels' },
  { token: 'neutral-mid', bg: 'bg-neutral-mid', hex: '#EEEEE8', label: 'Nested sections' },
  { token: 'neutral-dark', bg: 'bg-neutral-dark', hex: '#E5E4DE', label: 'Inputs, inset areas' },
  { token: 'neutral-deep', bg: 'bg-neutral-deep', hex: '#C2C8BE', label: 'Borders, dividers' },
  { token: 'neutral-black', bg: 'bg-neutral-black', hex: '#737970', label: 'Subtle text, metadata' },
  { token: 'neutral-coal', bg: 'bg-neutral-coal', hex: '#424841', label: 'Secondary text' },
  { token: 'neutral', bg: 'bg-neutral', hex: '#1A1C1A', label: 'Primary text' },
];

const accentColors = [
  { token: 'sage', bg: 'bg-sage', hex: '#47633E', label: 'Primary action (dark)' },
  { token: 'sage-mid', bg: 'bg-sage-mid', hex: '#5F7C55', label: 'Primary action (mid)' },
  { token: 'sage-light', bg: 'bg-sage-light', hex: '#E3E6DD', label: 'Sage at 15% opacity' },
  { token: 'sage-bright', bg: 'bg-sage-bright', hex: '#EEEFE8', label: 'Sage at 8% opacity' },
  { token: 'terra', bg: 'bg-terra', hex: '#79542E', label: 'Labels only' },
  { token: 'terra-light', bg: 'bg-terra-light', hex: '#E7E0D7', label: 'Terra at 15% opacity' },
  { token: 'terra-bright', bg: 'bg-terra-bright', hex: '#F1EDE7', label: 'Terra at 7% opacity' },
  { token: 'steel', bg: 'bg-steel', hex: '#48626E', label: 'Secondary links, Hard difficulty' },
  { token: 'steel-light', bg: 'bg-steel-light', hex: '#DFE2E1', label: 'Steel at 15% opacity' },
  { token: 'red', bg: 'bg-red', hex: '#BA1A1A', label: 'Errors, destructive' },
  { token: 'red-light', bg: 'bg-red-light', hex: '#F4E3DF', label: 'Red at 10% opacity' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-neutral-coal mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatch({ token, bg, hex, label }: { token: string; bg: string; hex: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`border-neutral-deep h-10 w-10 shrink-0 rounded-lg border ${bg}`} />
      <div className="min-w-0">
        <div className="text-neutral font-mono text-sm">{token}</div>
        <div className="text-neutral-black text-xs">{label}</div>
      </div>
      <div className="text-neutral-black ml-auto font-mono text-xs">{hex}</div>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <div className="space-y-12 py-4">
      <div>
        <h1 className="text-neutral text-2xl font-bold">Design Guides</h1>
        <p className="text-neutral-black mt-1">Color tokens, typography, and component reference.</p>
      </div>

      {/* Colors */}
      <Section title="Colors — Neutral">
        <div className="bg-neutral-light grid grid-cols-1 gap-3 rounded-xl p-6 sm:grid-cols-2">
          {neutralColors.map(c => (
            <ColorSwatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      <Section title="Colors — Accent">
        <div className="bg-neutral-light grid grid-cols-1 gap-3 rounded-xl p-6 sm:grid-cols-2">
          {accentColors.map(c => (
            <ColorSwatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="bg-neutral-light space-y-4 rounded-xl p-6">
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-2xl font-bold</p>
            <p className="text-neutral text-2xl font-bold">The quick brown fox</p>
          </div>
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-xl font-semibold</p>
            <p className="text-neutral text-xl font-semibold">The quick brown fox</p>
          </div>
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-lg font-medium</p>
            <p className="text-neutral text-lg font-medium">The quick brown fox</p>
          </div>
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-base (body)</p>
            <p className="text-neutral text-base">The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-sm text-neutral-coal</p>
            <p className="text-neutral-coal text-sm">Secondary text, descriptions, captions.</p>
          </div>
          <div>
            <p className="text-neutral-black mb-1 font-mono text-xs">text-xs text-neutral-black</p>
            <p className="text-neutral-black text-xs">Metadata, timestamps, labels.</p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="bg-neutral-light space-y-6 rounded-xl p-6">
          <div>
            <p className="text-neutral-black mb-3 font-mono text-xs">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div>
            <p className="text-neutral-black mb-3 font-mono text-xs">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
            </div>
          </div>
          <div>
            <p className="text-neutral-black mb-3 font-mono text-xs">Disabled</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled>
                Primary
              </Button>
              <Button variant="outline" disabled>
                Secondary
              </Button>
              <Button variant="ghost" disabled>
                Ghost
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <div className="bg-neutral-light space-y-4 rounded-xl p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <FormInput label='size="sm"' size="sm" placeholder="Small input" className="w-full" />
            </div>
            <div>
              <FormInput label='size="md"' size="md" placeholder="Medium input" className="w-full" />
            </div>
          </div>
          <div>
            <FormInput label="Disabled" placeholder="Disabled input" className="w-full max-w-sm" />
          </div>
        </div>
      </Section>

      {/* Surfaces */}
      <Section title="Surfaces">
        <div className="bg-neutral-light space-y-3 rounded-xl p-6">
          {[
            { bg: 'bg-neutral-bright', label: 'neutral-bright — page background' },
            { bg: 'bg-neutral-light', label: 'neutral-light — cards, panels' },
            { bg: 'bg-neutral-mid', label: 'neutral-mid — nested sections' },
            { bg: 'bg-neutral-dark', label: 'neutral-dark — inputs, inset areas' },
            { bg: 'bg-sage-bright', label: 'sage-bright — active/highlighted areas' },
            { bg: 'bg-terra-bright', label: 'terra-bright — label backgrounds' },
            { bg: 'bg-red-light', label: 'red-light — error backgrounds' },
          ].map(({ bg, label }) => (
            <div key={bg} className={`border-neutral-deep rounded-lg border px-4 py-3 ${bg}`}>
              <span className="text-neutral-coal font-mono text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
