export const previewerFileTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
];

export const isURL = (maybeUrl: string) =>
  maybeUrl.startsWith('http') || maybeUrl.startsWith('https');

export const isValidFile = (file: File) =>
  previewerFileTypes.some((type) => type === file.type);
