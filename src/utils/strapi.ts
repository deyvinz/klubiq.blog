interface StrapiImage {
  data: {
    attributes: {
      url: string
      alternativeText: string
    }
  }
}

export function getStrapiImageAttributes(image: StrapiImage) {
  return {
    url: image.data.attributes.url,
    alt: image.data.attributes.alternativeText,
  }
} 