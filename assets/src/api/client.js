/**
 * REST API client using @wordpress/api-fetch
 */
import apiFetch from '@wordpress/api-fetch';

const BASE = '/wpra/v1';

export async function fetchOverview() {
	return apiFetch( { path: `${ BASE }/analytics/overview` } );
}

export async function fetchPostsChart( months = 6 ) {
	return apiFetch( { path: `${ BASE }/analytics/posts-chart?months=${ months }` } );
}

export async function fetchActivity() {
	return apiFetch( { path: `${ BASE }/analytics/activity` } );
}

export async function fetchContentBreakdown() {
	return apiFetch( { path: `${ BASE }/analytics/content-breakdown` } );
}

export async function fetchRecentPosts( perPage = 5 ) {
	return apiFetch( { path: `${ BASE }/posts/recent?per_page=${ perPage }` } );
}
