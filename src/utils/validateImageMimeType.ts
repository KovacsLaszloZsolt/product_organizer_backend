export type ValidMimeType = 'image/jpeg' | 'image/jpg' | 'image/png';
const validMimeTypes: ValidMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const validateImageMimeType = (mimeType: string): boolean => {
  return validMimeTypes.includes(mimeType as ValidMimeType);
};
