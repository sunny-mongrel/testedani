/**
 * PONTO DE ENTRADA DO APLICATIVO.
 *
 * É o primeiro arquivo executado (definido em "main" no package.json).
 * Ele só registra o componente <App /> como raiz do app; toda a interface
 * e a lógica começam em App.tsx.
 */

// Precisa ser o PRIMEIRO import do app: a biblioteca de gestos (usada pela
// navegação) exige ser carregada antes de qualquer outro código.
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App).
// Ele também garante que o app funcione da mesma forma no Expo Go.
registerRootComponent(App);
