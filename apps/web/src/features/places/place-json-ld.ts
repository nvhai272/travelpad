import { MIN_VOTES_TO_SHOW_RATING, type PlaceDetail } from '@travelpad/contracts';

/** schema.org TouristAttraction – Google hiện sao đánh giá khi đủ vote (BR-PLACE-03). */
export const placeJsonLd = (place: PlaceDetail) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: place.name,
  description: place.description,
  geo: { '@type': 'GeoCoordinates', latitude: place.location.lat, longitude: place.location.lng },
  // Điểm đến không có đánh giá riêng (BR-PLACE-06)
  ...(place.kind === 'spot' && place.reviewCount >= MIN_VOTES_TO_SHOW_RATING && {
    aggregateRating: { '@type': 'AggregateRating', ratingValue: place.ratingAvg, reviewCount: place.reviewCount },
  }),
});
