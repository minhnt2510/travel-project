// /Util_Images/index.ts
import type { ImageSource } from 'expo-image';

export const IMAGES = {
  dalat:    require('@/assets/images/DaLat.png'),
  danang:   require('@/assets/images/DaNang.png'),
  halong:   require('@/assets/images/HaLong.png'),
  hoian:    require('@/assets/images/HoiAn.png'),
  hue:      require('@/assets/images/Hue.png'),
  nhatrang: require('@/assets/images/NhaTrang.png'),
  phuquoc:  require('@/assets/images/PhuQuoc.png'),
  sapa:     require('@/assets/images/SaPa.png'),

  dalat2n1d: require('@/assets/images/featuredToursImage/DaLat2N1D.png'),
} as const;

export type ImageKey = keyof typeof IMAGES;
export const getImage = (key: ImageKey): ImageSource => IMAGES[key];

export default IMAGES;
