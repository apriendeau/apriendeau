import { site } from '$lib/config';

export const person = {
	'@type': 'Person',
	'@id': `${site.url}/#person`,
	name: site.name,
	url: `${site.url}/`,
	jobTitle: site.jobTitle,
	worksFor: { '@type': 'Organization', name: site.worksFor },
	sameAs: site.social.map((s) => s.link)
};
