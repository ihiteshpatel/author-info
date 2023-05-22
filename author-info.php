<?php
/**
 * Plugin Name:       Author Info
 * Description:       Author Info dynamic block
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Hitesh
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       authorinfo
*/
function author_info_plugin( $attr ) {
	
	$my_posts = get_posts( $args );
	
	if( ! empty( $my_posts ) ){
		$output = '<div ' . get_block_wrapper_attributes() . '>';
		
		if( $attr['displayAuthorInfo'] ){
			$output .= '<div class="author-info__author">';
			
			if( $attr['showAvatar'] ){
				$output .= '<div class="author-info__avatar">' 
					. get_avatar( get_the_author_meta( 'ID' ), $attr['avatarSize'] ) 
					. '</div>';
			}

			$output .= '<div class="author-info__author-content">';
			
			$output .= '<div class="author-info__name">' 
				. get_the_author_meta( 'display_name' ) 
				. '</div>';

			if( $attr['showBio'] ){
				$output .= '<div class="author-info__description">' 
					. get_the_author_meta( 'description' ) 
					. '</div>';
			}

			$output .= '</div>';
			$output .= '</div>';
		}
	}
	return $output ?? '<strong>Sorry. No posts matching your criteria!</strong>';
}

function author_info_plugin_init() {
	register_block_type( __DIR__ . '/build', array(
        'render_callback' => 'author_info_plugin'
    ) );
}
add_action( 'init', 'author_info_plugin_init' );
