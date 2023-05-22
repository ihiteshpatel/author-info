import { forEach } from 'lodash';

import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { PanelBody, PanelRow, SelectControl, ToggleControl } from '@wordpress/components';

import './editor.scss';

import { useSelect } from '@wordpress/data';

import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';

export default function Edit( { attributes, setAttributes } ) {

    const { displayAuthorInfo, showAvatar, avatarSize, showUsername, showDescription, showEmail } = attributes;

	const { authorDetails } = useSelect(
		( select ) => {

			const _authorId = select( 'core/editor' ).getCurrentPostAttribute( 'author' );

			const authorDetails = _authorId ? select( 'core' ).getUser( _authorId ) : null;
		
			const posts = select( 'core' ).getEntityRecords( 'postType', 'post', {
				'author': _authorId,
				'_embed': true
			});

			return { 
				authorDetails: authorDetails,
				posts: posts
			};
		},
		
	);

	const avatarSizes = [];
	if ( authorDetails ) {
		forEach( authorDetails.avatar_urls, ( url, size ) => {
			avatarSizes.push( {
				value: size,
				label: `${ size } x ${ size }`,
			} );
		} );
	}
	
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Author Info', 'authorinfo' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Author Info', 'authorinfo' ) }
							checked={ displayAuthorInfo }
							onChange={ () =>
								setAttributes( { displayAuthorInfo: ! displayAuthorInfo } )
							}
						/>
					</PanelRow>
					{ displayAuthorInfo && (
						<>
							<PanelRow>
								<ToggleControl
									label={ __( 'Show avatar' ) }
									checked={ showAvatar }
									onChange={ () =>
										setAttributes( { showAvatar: ! showAvatar } )
									}
								/>
								{ showAvatar && (
									<SelectControl
										label={ __( 'Avatar size' ) }
										value={ avatarSize }
										options={ avatarSizes }
										onChange={ ( size ) => {
											setAttributes( {
												avatarSize: Number( size ),
											} );
										} }
									/>
								) }
							</PanelRow>
                            			<PanelRow>
								<ToggleControl
									label={ __( 'Show Username', 'authorinfo' ) }
									checked={ showUsername }
									onChange={ showUsername => setAttributes({ showUsername }) }
								/>
							</PanelRow>
                            			<PanelRow>
								<ToggleControl
									label={ __( 'Show Email', 'authorinfo' ) }
									checked={ showEmail }
									onChange={ showEmail => setAttributes({ showEmail }) }
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={ __( 'Show Description', 'authorinfo' ) }
									checked={ showDescription }
									onChange={ () =>
										setAttributes( { showDescription: ! showDescription } )
									}
								/>
							</PanelRow>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ displayAuthorInfo  && authorDetails && (
					<div className="author-info__author">
						{ showAvatar && (
							<div className="author-info__avatar">
								<img
									width={ avatarSize }
									src={
										authorDetails.avatar_urls[
											avatarSize
										]
									}
									alt={ authorDetails.name }
								/>
							</div>
						) }
						<div className='author-info__author-content'>
                            			{showUsername && 
								<div className='author-info__name'>
									Username: { authorDetails.name }
								</div>
                            			}
                            			{showEmail && 
                            				<div className='author-info__email'>
									Email: { authorDetails.email }
								</div>
                            			}
							{ showDescription &&
								authorDetails?.description &&
								authorDetails.description.length > 0 && (
								<p className='author-info__description'>Description: { authorDetails.description }</p>
							) }
						</div>
					</div>
				)}
			</div>
		</>
	);
}
