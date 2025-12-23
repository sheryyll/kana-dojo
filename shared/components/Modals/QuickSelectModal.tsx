import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { X, CircleCheck, Circle, Check, Trash2, Dices } from 'lucide-react';
import { useClick } from '@/shared/hooks/useAudio';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import { cn } from '@/shared/lib/utils';

// Canary change: verifying Husky/Prettier pre-commit formatting.
// Canary change #2: verifying jsxSingleQuote formatting in JSX attributes.

type QuickSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sets: Array<{
    name: string;
    start: number;
    end: number;
    id: string;
    isMastered: boolean;
  }>;
  selectedSets: string[];
  onToggleSet: (setName: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectRandom: (count: number) => void;
  unitName: string;
};

const QuickSelectModal = ({
  isOpen,
  onClose,
  sets,
  selectedSets,
  onToggleSet,
  onSelectAll,
  onClearAll,
  onSelectRandom,
  unitName
}: QuickSelectModalProps) => {
  const { playClick } = useClick();

  const [searchLevel, setSearchLevel] = useState('');

  const filteredSets = useMemo(() => {
    if (!searchLevel) return sets;

    return sets.filter(set => {
      const levelNumber = set.name.match(/\d+/)?.[0] || '';
      return levelNumber.includes(searchLevel);
    });
  }, [sets, searchLevel]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4'
      onClick={e => {
        if (e.target === e.currentTarget) {
          playClick();
          onClose();
        }
      }}
    >
      <div className='flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-[var(--border-color)] bg-[var(--background-color)] sm:max-h-[80vh]'>
        <div className='flex flex-shrink-0 items-center justify-between border-b-2 border-[var(--border-color)] p-4 sm:p-6'>
          <div>
            <h2 className='text-xl font-bold text-[var(--main-color)] sm:text-2xl'>
              Quick Select - {unitName.toUpperCase()}
            </h2>
            <p className='mt-1 text-xs text-[var(--secondary-color)] sm:text-sm'>
              {selectedSets.length} of {sets.length} levels selected
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className='flex-shrink-0 rounded-xl p-2 transition-colors hover:cursor-pointer hover:bg-[var(--card-color)]'
          >
            <X size={24} className='text-[var(--secondary-color)]' />
          </button>
        </div>

        <div className='flex flex-shrink-0 flex-wrap gap-2 border-b-2 border-[var(--border-color)] p-3 sm:gap-3 sm:p-4'>
          {[
            {
              label: 'Select All',
              onClick: onSelectAll,
              disabled: false,
              icon: CircleCheck,
              iconOnly: false,
              colorScheme: 'main' as const,
              borderColorScheme: 'main' as const,
              show: true
            },
            {
              label: 'Clear All',
              onClick: onClearAll,
              disabled: false,
              icon: Trash2,
              iconOnly: true,
              colorScheme: 'main' as const,
              borderColorScheme: 'main' as const,
              show: true
            },
            {
              label: 'Random 3',
              onClick: () => onSelectRandom(3),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            },
            {
              label: 'Random 5',
              onClick: () => onSelectRandom(5),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            },
            {
              label: 'Random 10',
              onClick: () => onSelectRandom(10),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            }
          ]
            .filter(btn => btn.show)
            .map(btn => (
              <ActionButton
                key={btn.label}
                onClick={() => {
                  playClick();
                  btn.onClick();
                }}
                disabled={btn.disabled}
                colorScheme={btn.colorScheme ?? 'secondary'}
                borderColorScheme={btn.borderColorScheme ?? 'secondary'}
                borderRadius='3xl'
                borderBottomThickness={10}
                className={clsx(
                  'w-auto text-sm disabled:cursor-not-allowed disabled:opacity-50',
                  btn.iconOnly ? 'px-4 py-4 sm:px-6' : 'px-3 py-4 sm:px-4'
                )}
              >
                <span
                  className={clsx(
                    'flex items-center',
                    btn.iconOnly ? 'gap-0' : 'gap-2'
                  )}
                >
                  {btn.icon ? (
                    <btn.icon
                      size={16}
                      className={cn(
                        'fill-current text-current',
                        btn.label === 'Clear All' && 'px-2'
                      )}
                    />
                  ) : null}
                  {btn.iconOnly ? (
                    <span className='sr-only'>{btn.label}</span>
                  ) : (
                    btn.label
                  )}
                </span>
              </ActionButton>
            ))}
          <input
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            onChange={e => {
              playClick();
              const value = e.target.value.replace(/\D/g, '');
              setSearchLevel(value);
            }}
            placeholder='search for a level...'
            className={clsx(
              'rounded-xl border-2 px-3 py-2 text-sm transition-all sm:px-4',
              'border-[var(--border-color)] hover:bg-[var(--card-color)]',
              'text-[var(--secondary-color)]',
              'focus:ring-offset-2-[var(--secondary-color)]/80 focus:ring focus:outline-0'
            )}
          />
        </div>

        {/* Grid of Sets */}
        <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
          {filteredSets.length === 0 ? (
            <div className='flex h-full items-center justify-center'>
              <p className='text-sm text-[var(--secondary-color)]'>
                No level found. Available levels:{' '}
                {sets[0]?.name.match(/\d+/)?.[0]} -{' '}
                {sets[sets.length - 1]?.name.match(/\d+/)?.[0]}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5'>
              {filteredSets.map(set => {
                const isSelected = selectedSets.includes(set.name);
                return (
                  <ActionButton
                    key={set.id}
                    onClick={() => {
                      playClick();
                      onToggleSet(set.name);
                    }}
                    colorScheme={isSelected ? 'main' : undefined}
                    borderColorScheme={isSelected ? 'main' : undefined}
                    borderRadius='3xl'
                    borderBottomThickness={isSelected ? 10 : 0}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 sm:p-4',
                      isSelected
                        ? 'order-first'
                        : 'border-2 border-[var(--border-color)] bg-[var(--card-color)] text-[var(--secondary-color)]'
                    )}
                  >
                    {isSelected ? (
                      <CircleCheck
                        size={18}
                        className='flex-shrink-0 fill-current text-[var(--background-color)]'
                      />
                    ) : (
                      <Circle
                        size={18}
                        className='flex-shrink-0 text-[var(--main-color)]'
                      />
                    )}
                    <span className='text-center text-xs font-medium sm:text-sm'>
                      {set.name.replace('Set ', 'Level ')}
                    </span>
                    {set.isMastered && (
                      <span className='text-[10px] opacity-70 sm:text-xs'>
                        Mastered
                      </span>
                    )}
                  </ActionButton>
                );
              })}
            </div>
          )}
        </div>

        <div className='flex flex-shrink-0 justify-end border-t-2 border-[var(--border-color)] p-3 sm:p-4'>
          <ActionButton
            onClick={() => {
              playClick();
              onClose();
            }}
            colorScheme='main'
            borderColorScheme='main'
            borderRadius='3xl'
            borderBottomThickness={10}
            className='w-auto px-5 py-2.5 text-sm font-medium sm:px-6 sm:py-3 sm:text-base'
          >
            <CircleCheck size={24} />
            Done
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default QuickSelectModal;
