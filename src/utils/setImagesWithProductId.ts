export const setImagesWithProductId = (
  images: {
    id: string;
    publicId: string;
  }[],
  productId: number,
) =>
  images.map((image) => ({
    cloudinaryId: image.id,
    cloudinaryPublicId: image.publicId,
    productId: productId,
  }));
