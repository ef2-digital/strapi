import React from 'react';

import { Button, SubNavLink, SubNavSection, SubNavSections } from '@strapi/design-system';

import { registerPreviewRoute } from './preview';
import { NavLink } from 'react-router-dom';
import { parse, stringify } from 'qs';

const config = {
  locales: ['it', 'es', 'en', 'en-GB'],
};

const menuItems = [

	{
		id: 'pages',
		title: "Pagina's",
		links: [
			
			{
				uid: 'api::home-page.home-page',
				title: 'Homepage',
				to: '/content-manager/single-types/api::homepage.homepage',
			},
		],
	},
	{
		id: 'restaurant',
		title: 'Restaurant',
		links: [
			
			{
				uid: 'api::post.post',
				title: 'Restaurants',
				to: '/content-manager/collection-types/api::restaurant.restaurant',
			},
		],
	},
];

const bootstrap = (app) => {
  app.getPlugin('content-manager').injectComponent('menu', 'left-menu', {
    name: 'customMenu',
      Component: ({props}) => {
      return (
       	<SubNavSections>
						{menuItems.map((section) => {
							return (
								<SubNavSection key={section.id} label={section.title} badgeLabel={section.links.length.toString()}>
									{section.links.map((link) => {
										return (
											<SubNavLink
												tag={NavLink}
												key={link.uid}
												to={{
													pathname: link.to,
													search: stringify({
														...parse(link.search ?? ''),
														plugins: props.getPluginsParamsForLink(link),
													}),
												}}
												width="100%"
												active={false}
											>
												<>{link.title}</>
											</SubNavLink>
										);
									})}
								</SubNavSection>
							);
						})}
					</SubNavSections>
      );
      }
  });
};

export default {
  config,
  register: (app) => {
    registerPreviewRoute(app);
  },
  bootstrap,
};
