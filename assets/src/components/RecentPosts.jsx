/**
 * Recent posts table — consumes custom REST endpoint
 */
import { __ } from '@wordpress/i18n';

export default function RecentPosts( { posts } ) {
	return (
		<div className="wpra-recent-posts">
			<h3 className="wpra-panel__title">{ __( 'Recent Posts', 'wp-react-admin' ) }</h3>
			{ ! posts?.length ? (
				<p className="wpra-empty">{ __( 'No posts found.', 'wp-react-admin' ) }</p>
			) : (
				<table className="wpra-table">
					<thead>
						<tr>
							<th>{ __( 'Title', 'wp-react-admin' ) }</th>
							<th>{ __( 'Author', 'wp-react-admin' ) }</th>
							<th>{ __( 'Date', 'wp-react-admin' ) }</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{ posts.map( ( post ) => (
							<tr key={ post.id }>
								<td>
									<strong>{ post.title }</strong>
									{ post.excerpt && <small>{ post.excerpt }</small> }
								</td>
								<td>{ post.author }</td>
								<td>{ new Date( post.date ).toLocaleDateString() }</td>
								<td>
									<a href={ post.edit_link } className="wpra-link">{ __( 'Edit', 'wp-react-admin' ) }</a>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</div>
	);
}
