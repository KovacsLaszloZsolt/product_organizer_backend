import cloudinary from 'cloudinary/cloudinary.config';

export const createCloudinaryImageUrl = (
  images: {
    id: string | number;
    publicId: string;
  }[],
) => {
  const imagesWithUrl = images.map((image) => ({
    ...image,
    previewUrl: cloudinary.url(image.publicId, {
      transformation: {
        background: 'transparent',
        width: 225,
        height: 225,
        crop: 'pad',
        quality: 'auto',
      },
      fetch_format: 'auto',
    }),
    fullSizeUrl: cloudinary.url(image.publicId, {
      transformation: {
        background: 'transparent',
        width: 1024,
        height: 768,
        crop: 'pad',
        quality: 'auto',
      },
      fetch_format: 'auto',
    }),
  }));
  return imagesWithUrl;
};
