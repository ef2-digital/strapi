import React from 'react';

import { Button } from '@strapi/design-system';
import {  SubNav } from '@strapi/admin/strapi-admin';
import { registerPreviewRoute } from './preview';
import { parse, stringify } from 'qs';

const menuItems = [
	{
		id: 'website',
		title: 'Website',
		links: [
			{
				uid: 'api::general-setting.general-setting',
				title: 'Instellingen',
				to: '/content-manager/single-types/api::general-setting.general-setting',
			},
			{
				uid: 'api::menu.menu',
				title: 'Navigatie',
				to: '/content-manager/collection-types/api::menu.menu',
			},
			{
				uid: 'api::redirect.redirect',
				title: 'Redirects',
				to: '/content-manager/collection-types/api::redirect.redirect',
			},
		],
	},

	{
		id: 'pages',
		title: "Pagina's",
		links: [
			{
				uid: 'api::page.page',
				title: "Pagina's",
				to: '/content-manager/collection-types/api::page.page',
			},
			{
				uid: 'api::home-page.home-page',
				title: 'Homepage',
				to: '/content-manager/single-types/api::homepage.homepage',
			},
		],
	},
	{
		id: 'news',
		title: 'Nieuws',
		links: [
			{
				uid: 'api::overview.overview',
				title: 'Overzichtspagina',
				to: '/content-manager/single-types/api::overview.overview',
			},
			{
				uid: 'api::post.post',
				title: 'Nieuwsberichten',
				to: '/content-manager/collection-types/api::post.post',
			},
		],
	},
];

const config = {
  locales: ['it', 'es', 'en', 'en-GB'],
};
const bootstrap = (app) => {
	app.getPlugin('content-manager').injectComponent('menu', 'left-menu', {
		name: 'customMenu',
		  Component: ({props}) => {
		  return (
			   <SubNav.Sections>
							{menuItems.map((section) => {
								return (
									<SubNav.Section key={section.id} label={section.title} badgeLabel={section.links.length.toString()}>
										{section.links.map((link) => {
											return (
												<SubNav.Link
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
													label={link.title}
												 />
											);
										})}
									</SubNav.Section>
								);
							})}
						</SubNav.Sections>
		  );
		  }
	  });
  app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
    name: 'PreviewButton',
    Component: () => (
      <Button onClick={() => window.alert('Not here, The preview is.')}>Preview</Button>
    ),
  });
};

export default {
  config,
  register: (app) => {
    registerPreviewRoute(app);
  },
  bootstrap,
};


// return (
// 	<SubNav.Section key={section.id} label={section.title}>
// 	  {section.links.map((link) => {
// 		return (
// 		  <SubNav.Link
// 			key={link.uid}
// 			to={{
// 			  pathname: link.to,
// 			  search: stringify({
// 				...parse(link.search ?? ''),
// 				plugins: getPluginsParamsForLink(link),
// 			  }),
// 			}}
// 			label={link.title}
// 		  />
// 		);
// 	  })}
// 	</SubNav.Section>
//   );
// })}