import { createRequest, type ApiClientOptions } from './http.js';
import { authResource } from './resources/auth.js';
import { itinerariesResource, placesResource, reviewsResource } from './resources/places.js';
import { postsResource } from './resources/posts.js';
import { adminProvidersResource, myProvidersResource, providersResource } from './resources/providers.js';
import { rankingsResource } from './resources/rankings.js';
import { followsResource, storiesResource } from './resources/social.js';
import { journeysResource, usersResource } from './resources/users.js';

export { ApiClientError, type ApiClientOptions } from './http.js';

/** Client API có kiểu dùng chung cho web (server + trình duyệt) và app mobile. */
export function createApiClient(opts: ApiClientOptions) {
  const request = createRequest(opts);
  return {
    auth: authResource(request),
    users: usersResource(request),
    journeys: journeysResource(request),
    places: placesResource(request),
    reviews: reviewsResource(request),
    itineraries: itinerariesResource(request),
    rankings: rankingsResource(request),
    providers: providersResource(request),
    myProviders: myProvidersResource(request),
    adminProviders: adminProvidersResource(request),
    posts: postsResource(request),
    stories: storiesResource(request),
    follows: followsResource(request),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
