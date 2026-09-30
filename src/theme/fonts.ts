/**
 * TEMA VISUAL: fontes do app.
 * COM BASE EM UM PROTOTIPO FEITO UTILIZANDO O VO.DEV E UX PILOT
 *  * Duas famílias do Google Fonts:
 *  - Nunito   -> textos corridos, rótulos e botões (`sans`)
 *  - Baloo 2  -> títulos e números em destaque (`display`)
 */
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';

// Nomes espelhando as variáveis --font-sans (Nunito) e --font-display (Baloo 2)
// definidas em components/ecoara/app/globals.css do projeto Ecoara v0.
// Nas telas, use assim: fontFamily: fonts.sansBold
export const fonts = {
  sans: 'Nunito_400Regular',
  sansSemiBold: 'Nunito_600SemiBold',
  sansBold: 'Nunito_700Bold',
  sansExtraBold: 'Nunito_800ExtraBold',
  display: 'Baloo2_700Bold',
  displayExtraBold: 'Baloo2_800ExtraBold',
} as const;

/**
 * Hook que carrega os arquivos de fonte.
 * Retorna `false` enquanto o carregamento não termina e `true` depois.
 * O App.tsx usa esse retorno para segurar a tela até as fontes estarem prontas.
 */
export function useEcoaraFonts() {
  // useFonts devolve [carregou, erro]; usamos só o primeiro valor.
  const [loaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  return loaded;
}
