/**
 * WP React Admin — Entry point
 */
import { render } from '@wordpress/element';
import Dashboard from './components/Dashboard';
import './styles/dashboard.css';

const root = document.getElementById( 'wp-react-admin-root' );

if ( root ) {
	render( <Dashboard />, root );
}
