import type { IntroPhrase } from '../types/login.ts';

type IntroPhraseSectionProps = {
  introPhrase: IntroPhrase;
};

export const IntroPhraseSection = ({ introPhrase }: IntroPhraseSectionProps) => {
  return (
    <section className="flex-1 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white animate-fade">{introPhrase}</h1>
    </section>
  );
};
