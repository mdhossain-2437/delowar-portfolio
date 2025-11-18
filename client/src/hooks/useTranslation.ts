import { useLocale } from "./useLocale";

export function useTranslation() {
  const { translate } = useLocale();
  return translate;
}
