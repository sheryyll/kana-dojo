'use client';
import TrainingActionBar from '@/shared/components/Menu/TrainingActionBar';
import Info from '@/shared/components/Menu/Info';
import { KanaCards, useKanaContent, useKanaSelection } from '@/features/Kana';
import UnitSelector from '@/shared/components/Menu/UnitSelector';
import { KanjiCards } from '@/features/Kanji';
import { usePathname } from 'next/navigation';
import { VocabCards } from '@/features/Vocabulary';
import { removeLocaleFromPath } from '@/shared/lib/pathUtils';
import SelectionStatusBar from '@/shared/components/Menu/SelectionStatusBar';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import { MousePointer } from 'lucide-react';
import { useClick } from '@/shared/hooks/useAudio';
import SidebarLayout from '@/shared/components/layout/SidebarLayout';
import { cn } from '@/shared/lib/utils';

const DojoMenu = () => {
  const { playClick } = useClick();
  const pathname = usePathname();
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  const { addGroups: addKanaGroupIndices } = useKanaSelection();
  const { allGroups: kana } = useKanaContent();

  return (
    <SidebarLayout>
      {pathWithoutLocale === '/kana' ? (
        <div className='flex flex-col gap-3'>
          <Info />
          <ActionButton
            onClick={e => {
              e.currentTarget.blur();
              playClick();
              const indices = kana
                .map((k, i) => ({ k, i }))
                .filter(({ k }) => !k.groupName.startsWith('challenge.'))
                .map(({ i }) => i);
              addKanaGroupIndices(indices);
            }}
            className='px-2 py-3'
            borderBottomThickness={14}
            borderRadius='3xl'
          >
            <MousePointer className={cn('fill-current')} />
            Select All Kana
          </ActionButton>
          <KanaCards />
          <SelectionStatusBar />
        </div>
      ) : pathWithoutLocale === '/kanji' ? (
        <div className='flex flex-col gap-4'>
          <Info />
          <UnitSelector />
          <KanjiCards />
        </div>
      ) : pathWithoutLocale === '/vocabulary' ? (
        <div className='flex flex-col gap-4'>
          <Info />
          <UnitSelector />
          <VocabCards />
        </div>
      ) : null}
      <TrainingActionBar currentDojo={pathWithoutLocale.slice(1)} />
    </SidebarLayout>
  );
};

export default DojoMenu;
