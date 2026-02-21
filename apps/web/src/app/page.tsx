import { WizardBuilder } from '@/components/wizard-builder';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cron Expression Builder</h1>
        <p className="text-muted-foreground">
          Generate, validate, and export cron expressions with an intuitive wizard.
        </p>
      </div>
      <WizardBuilder />
    </div>
  );
}
