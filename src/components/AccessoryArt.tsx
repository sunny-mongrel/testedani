import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

type AccessoryArtProps = {
  id: string;
  size?: number;
};

export function AccessoryArt({ id, size = 64 }: AccessoryArtProps) {
  let artwork: React.ReactNode;

  switch (id) {
    case 'coroa-folhas':
      artwork = (
        <>
          <Path d="M17 61 Q49 73 83 60 L79 71 Q49 81 21 70 Z" fill="#8B5A35" stroke="#563923" strokeWidth={3} />
          <Path d="M19 61 Q50 72 81 61" fill="none" stroke="#D9A86C" strokeWidth={3} />
          <Path d="M24 61 Q16 43 30 29 Q42 40 39 64 Z" fill="#64A94F" stroke="#376D39" strokeWidth={3} />
          <Path d="M37 65 Q31 43 49 22 Q62 40 54 69 Z" fill="#83BF52" stroke="#376D39" strokeWidth={3} />
          <Path d="M56 66 Q57 43 76 32 Q83 49 69 65 Z" fill="#4B984E" stroke="#376D39" strokeWidth={3} />
          <Path d="M29 57 Q31 43 32 35 M47 60 Q49 42 50 28 M65 60 Q71 47 76 38" fill="none" stroke="#C5E28A" strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={21} cy={61} r={3} fill="#F2D08B" />
          <Circle cx={79} cy={61} r={3} fill="#F2D08B" />
        </>
      );
      break;
    case 'flor-amarela':
      artwork = (
        <>
          <G>
            <Ellipse cx={50} cy={25} rx={12} ry={19} fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={50} cy={75} rx={12} ry={19} fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={25} cy={50} rx={19} ry={12} fill="#FFE27A" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={75} cy={50} rx={19} ry={12} fill="#FFE27A" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={32} cy={32} rx={12} ry={18} transform="rotate(-45 32 32)" fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={68} cy={32} rx={12} ry={18} transform="rotate(45 68 32)" fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={32} cy={68} rx={12} ry={18} transform="rotate(45 32 68)" fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
            <Ellipse cx={68} cy={68} rx={12} ry={18} transform="rotate(-45 68 68)" fill="#FFD45B" stroke="#D89825" strokeWidth={2.5} />
          </G>
          <Circle cx={50} cy={50} r={15} fill="#9B5B2E" stroke="#70401F" strokeWidth={3} />
          <Circle cx={45} cy={45} r={3} fill="#E9B75A" />
          <Circle cx={55} cy={47} r={2.5} fill="#E9B75A" />
          <Circle cx={49} cy={56} r={2.5} fill="#E9B75A" />
        </>
      );
      break;
    case 'oculos-sol':
      artwork = (
        <>
          <Path d="M8 38 Q8 32 15 30 L42 30 Q49 31 49 39 L46 57 Q44 67 31 68 L25 68 Q13 66 11 56 Z" fill="#173951" stroke="#102B40" strokeWidth={4} />
          <Path d="M51 38 Q51 31 58 30 L85 30 Q92 32 92 38 L89 56 Q87 66 75 68 L69 68 Q56 67 54 57 Z" fill="#173951" stroke="#102B40" strokeWidth={4} />
          <Path d="M15 40 Q15 36 20 36 L38 36 Q42 36 42 41 L40 54 Q39 60 31 61 L26 61 Q19 60 18 54 Z" fill="#63B0C1" opacity={0.82} />
          <Path d="M58 41 Q58 36 63 36 L81 36 Q86 36 85 40 L82 54 Q81 60 74 61 L69 61 Q61 60 60 54 Z" fill="#63B0C1" opacity={0.82} />
          <Path d="M48 39 Q50 35 53 39 M8 39 L3 35 M92 39 L97 35" fill="none" stroke="#102B40" strokeWidth={4} strokeLinecap="round" />
          <Path d="M22 40 L33 40 M66 40 L77 40" fill="none" stroke="#D8F4F3" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        </>
      );
      break;
    case 'lenco-verde':
      artwork = (
        <>
          <Path d="M22 30 Q49 48 78 30 L73 50 Q50 67 27 50 Z" fill="#278A62" stroke="#176747" strokeWidth={3} />
          <Path d="M29 48 Q42 55 51 54 L43 88 Q34 91 24 85 Z" fill="#36A978" stroke="#176747" strokeWidth={3} />
          <Path d="M52 54 Q64 54 74 48 L80 83 Q70 91 60 86 Z" fill="#23895F" stroke="#176747" strokeWidth={3} />
          <Path d="M29 39 Q48 51 70 39 M32 58 L29 79 M66 59 L72 78" fill="none" stroke="#8BD2A4" strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M43 47 Q50 52 57 47 L53 59 Q49 63 45 59 Z" fill="#E4B45D" stroke="#8A6035" strokeWidth={2} />
        </>
      );
      break;
    case 'mochila':
      artwork = (
        <>
          <Path d="M25 30 Q25 17 39 15 L61 15 Q75 17 75 31 L82 70 Q82 82 70 84 L30 84 Q18 82 18 70 Z" fill="#D56845" stroke="#8C3F2F" strokeWidth={4} />
          <Path d="M32 26 Q33 18 42 18 L58 18 Q67 18 68 26 L68 36 Q50 42 32 36 Z" fill="#F09A5E" stroke="#8C3F2F" strokeWidth={3} />
          <Path d="M29 51 Q50 44 71 51 L73 72 Q51 78 27 72 Z" fill="#E9834F" stroke="#8C3F2F" strokeWidth={3} />
          <Path d="M24 37 Q13 45 18 68 M76 37 Q87 45 82 68" fill="none" stroke="#70423D" strokeWidth={6} strokeLinecap="round" />
          <Path d="M36 56 Q50 53 64 56 L64 68 Q50 71 36 68 Z" fill="#F7C56D" stroke="#8C3F2F" strokeWidth={2.5} />
          <Path d="M44 31 Q50 35 56 31" fill="none" stroke="#FFE1A0" strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
      break;
    case 'lacinho':
      artwork = (
        <>
          <Path d="M45 48 Q29 20 10 25 Q8 45 33 55 Q16 63 16 78 Q39 80 50 59 Z" fill="#398DB8" stroke="#205D86" strokeWidth={3.5} />
          <Path d="M55 48 Q71 20 90 25 Q92 45 67 55 Q84 63 84 78 Q61 80 50 59 Z" fill="#55B0D2" stroke="#205D86" strokeWidth={3.5} />
          <Path d="M44 48 Q50 42 56 48 L59 57 Q50 66 41 57 Z" fill="#F3C45D" stroke="#9D7130" strokeWidth={3} />
          <Path d="M19 35 Q28 38 36 50 M82 35 Q72 39 65 50" fill="none" stroke="#BCE9F1" strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
      break;
    case 'broche-folha':
      artwork = (
        <>
          <Path d="M16 63 Q23 27 82 17 Q78 69 34 80 Q23 80 16 63 Z" fill="#65AA51" stroke="#376D39" strokeWidth={4} />
          <Path d="M20 69 Q46 47 75 25" fill="none" stroke="#D3E79A" strokeWidth={3.5} strokeLinecap="round" />
          <Path d="M37 55 L34 40 M50 45 L48 33 M48 48 L64 49 M35 58 L28 58" fill="none" stroke="#3E7C40" strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={20} cy={75} r={7} fill="#E6B653" stroke="#9C6A2F" strokeWidth={3} />
          <Circle cx={20} cy={75} r={2} fill="#FFF0BA" />
        </>
      );
      break;
    case 'varinha-flor':
      artwork = (
        <>
          <Path d="M48 85 Q51 62 48 42" fill="none" stroke="#397B45" strokeWidth={5} strokeLinecap="round" />
          <Path d="M48 70 Q31 55 25 63 Q30 76 48 76 M49 62 Q65 48 73 55 Q69 67 49 69" fill="#64A94F" stroke="#376D39" strokeWidth={3} />
          <Path d="M48 48 Q34 38 39 25 Q47 20 51 34 Q58 18 68 24 Q73 35 58 43 Q74 42 73 53 Q64 61 52 50 Q47 63 37 56 Q34 50 48 48 Z" fill="#E97D9A" stroke="#A84767" strokeWidth={3} />
          <Circle cx={52} cy={43} r={8} fill="#F7C85C" stroke="#B78030" strokeWidth={2.5} />
          <Circle cx={49} cy={40} r={2} fill="#FFF0B0" />
        </>
      );
      break;
    default:
      artwork = <Circle cx={50} cy={50} r={3} fill="#000000" />;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {artwork}
    </Svg>
  );
}