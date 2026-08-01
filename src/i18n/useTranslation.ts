import { useAppStore } from '@/store/useAppStore';
import es from './locales/es.json';
import en from './locales/en.json';

type Dictionary = typeof es;

type Join<K extends string | number, P extends string | number> = "" extends P ? K : `${K}.${P}`;

type Leaves<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T & (string | number)]: Join<K, Leaves<T[K], Prev[D]>> }[keyof T & (string | number)]
  : "";

type Prev = [never, 0, 1, 2, 3, 4];

export type TranslationKey = Leaves<Dictionary>;

const dictionaries: Record<'ES' | 'EN', any> = {
  ES: es,
  EN: en,
};

export const useTranslation = () => {
  const language = useAppStore((state) => state.language) || 'ES';
  const activeDict = dictionaries[language];
  const fallbackDict = es;

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const keyParts = key.split('.');
    
    let resolvedValue: any = activeDict;
    for (const part of keyParts) {
      resolvedValue = resolvedValue?.[part];
    }

    if (resolvedValue === undefined || resolvedValue === null) {
      resolvedValue = fallbackDict;
      for (const part of keyParts) {
        resolvedValue = resolvedValue?.[part];
      }
    }

    if (typeof resolvedValue !== 'string') {
      return key;
    }

    if (params) {
      return resolvedValue.replace(/\{(\w+)\}/g, (match, paramName) => {
        return params[paramName] !== undefined ? String(params[paramName]) : match;
      });
    }

    return resolvedValue;
  };

  return { t, language };
};
