// CORE CONFIG
export const themes = {
	'light': {
		'name': 'light',
		'text': '#222',
		'muted': '#777',
		'pale': '#f0f0f0',
		'background': '#fff'
	},
	'dark': {
		'name': 'dark',
		'text': '#fff',
		'muted': '#bbb',
		'pale': '#333',
		'background': '#222'
	}
};

export const urls = {
	options: 'https://datavis.nisra.gov.uk/techlab/drpvze/places_2001.csv',
	places:'https://datavis.nisra.gov.uk/techlab/gsjtcr/',
	//places: '/data_jsons/',
	base: 'https://explore.nisra.gov.uk/area-explorer-2021/'
};

export const types = {
	//	ew: {name: '', pl: ''},
	//	oa: {name: 'Output area', pl: 'Output areas'},
	//	lsoa: {name: 'Super Output Area', pl: 'Super Output Areas'},
	dea: { name: 'District Electoral Area', pl: 'District Electoral Areas' },
	town: { name: 'settlement', pl: 'Settlement' },
	lgd: { name: 'Local Government District', pl: 'Districts' },
	postcode: { name: 'postcode', pl: 'postcode' },
	//	cty: {name: 'County', pl: 'Counties'},
	//	rgn: {name: 'Region', pl: 'Regions'},
	ctry: { name: 'Country', pl: 'Countries' }
};

export const codes = {
	age: [
		{ code: 'a0to14', label: '0-14' },
		{ code: 'a15to39', label: '15-39' },
		{ code: 'a40to64', label: '40-64' },
		{ code: 'a65plus', label: '65+' }
	],
	cob: [
		{ code: 'northern_ireland', label: 'Northern Ireland' },
		{ code: 'england', label: 'England' },
		{ code: 'scotland', label: 'Scotland' },
		{ code: 'wales', label: 'Wales' },
		{ code: 'republic_of_ireland', label: 'Republic of Ireland' },
		{ code: 'other_cob', label: 'Other countries' }
	],
	mainlang: [
		{ code: 'english', label: 'English' },
		{ code: 'other_languages', label: 'Other languages' }
	],
	irish: [
		{ code: 'no_ability_in_irish', label: 'No ability in Irish' },
		{ code: 'some_ability_in_irish', label: 'Some ability in Irish' }
	],
	ulster: [
		{ code: 'no_ability_in_ulsterscots', label: 'No ability in Ulster-Scots' },
		{ code: 'some_ability_in_ulsterscots', label: 'Some ability in Ulster-Scots' },
	],
	ethnic: [
		{ code: 'white', label: 'White' },
		{ code: 'other_ethnic', label: 'Other ethnic groups' }
	],
	natid: [
		{ code: 'british_only', label: 'British only' },
		{ code: 'irish_only', label: 'Irish only' },
		{ code: 'northern_irish_only', label: 'Northern Irish only' },
		{ code: 'british_and_irish_only', label: 'British & Irish only' },
		{ code: 'british_and_northern_irish_only', label: 'British & Northern Irish only' },
		{ code: 'irish_and_northern_irish_only', label: 'Irish & Northern Irish only' },
		{ code: 'british_irish_and_northern_irish_only', label: 'British, Irish & Northern Irish only' },
		{ code: 'other_natid', label: 'Other national identities' }
	],
	religion: [
		{ code: 'catholic', label: 'Catholic' },
		{ code: 'presbyterian_church_in_ireland', label: 'Presbyterian' },
		{ code: 'church_of_ireland', label: 'Church of Ireland' },
		{ code: 'methodist_church_in_ireland', label: 'Methodist' },
		{ code: 'other_christian_including_christian_related', label: 'Other Christian religions' },
		{ code: 'other_religions', label: 'Other religions' },
		{ code: 'no_religion_or_religion_not_stated', label: 'No religion/Not stated' }
	],
	religion_or_religion_brought_up_in: [
		{ code: 'catholic', label: 'Catholic' },
		{ code: 'protestant_and_other_christian_including_christian_related', label: 'Protestant & other Christian religions' },
		{ code: 'other_religions', label: 'Other religions' },
		{ code: 'none', label: 'None' }
	],
	passport: [
		{ code: 'united_kingdom_only', label: 'UK only' },
		{ code: 'ireland_only', label: 'Ireland only' },
		{ code: 'united_kingdom_and_ireland_only', label: 'UK & Ireland' },
		{ code: 'other_passports', label: 'Other passport(s)' },
		{ code: 'no_passport', label: 'No passport' }
	],
	hh_size: [
		{ code: 'one_person', label: '1 person' },
		{ code: 'two_people', label: '2 people' },
		{ code: 'three_people', label: '3 people' },
		{ code: 'four_people', label: '4 people' },
		{ code: 'five_people', label: '5 or more people' }
	],


	number_of_long_term_health: [
		{ code: 'none', label: 'No conditions' },
		{ code: 'one', label: '1 condition' },
		{ code: 'two', label: '2 conditions' },
		{ code: 'three_or_more', label: '3 or more conditions' }
	],

	provision_care: [
		{ code: 'no_care', label: 'Provides no unpaid care' },
		{ code: 'a1to19_hours', label: '1-19 hours' },
		{ code: 'a20to49_hours', label: '20-49 hours' },
		{ code: 'a50plus_hours', label: '50+ hours' }
	],

	long_term_disability: [
		{ code: 'not_limited', label: 'Activities not limited' },
		{ code: 'limited_a_little', label: 'Limited a little' },
		{ code: 'limited_a_lot', label: 'Limited a lot' }
	],

	general_health: [
		{ code: 'very_good', label: 'Very good' },
		{ code: 'good', label: 'Good' },
		{ code: 'fair', label: 'Fair' },
		{ code: 'bad', label: 'Bad' },
		{ code: 'very_bad', label: 'Very bad' }
	],

	households: [
		{ code: 'all_households' }
	],

	car_or_van: [
		{ code: 'none', label: 'No cars or vans' },
		{ code: 'one', label: '1 car or van' },
		{ code: 'two', label: '2 cars or vans' },
		{ code: 'three', label: '3 cars or vans' },
		{ code: 'four', label: '4 cars or vans' },
		{ code: 'five_or_more', label: '5 or more cars or vans' }
	],

	accommodation_type: [
		{ code: 'detached', label: 'Detached' },
		{ code: 'semi_detached', label: 'Semi-detached' },
		{ code: 'terraced', label: 'Terraced' },
		{ code: 'flat_maisonette_apartment', label: 'Flat, maisonette or apartment' },
		{ code: 'caravan', label: 'Caravan or other mobile or temporary structure' }
	],

	renewable_energy: [
		{ code: 'no_renewable', label: 'No renewable energy systems' },
		{ code: 'any_renewable', label: 'Any renewable energy systems' }
	],


	hh_tenure: [
		{ code: 'owns', label: 'Owns (inc. shared ownership)' },
		{ code: 'socially_rented', label: 'Social rented' },
		{ code: 'private_rented', label: 'Private rented' },
		{ code: 'rent_free', label: 'Lives rent free' }
	],

	number_of_adaptations: [
		{ code: 'none', label: 'Not designed or adapted' },
		{ code: 'one', label: 'One' },
		{ code: 'two_or_more', label: 'Two or more' }
	],

	central_heating: [
		{ code: 'oil_only', label: 'Oil only' },
		{ code: 'mains_gas_only', label: 'Gas only' },
		{ code: 'other', label: 'Other' },
		{ code: 'none', label: 'None' }
	],
	population: [
		{ code: 'females', label: 'Females' },
		{ code: 'males', label: 'Males' }
	]
};



export const mapStyle = 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json';

export const mapSources = {
	lgd: {
		id: 'lgd',
		promoteId: 'LGDCode',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/lgd2014/{z}/{x}/{y}.pbf',
		maxzoom: 12
	},
	dea: {
		id: 'dea',
		promoteId: 'areacd',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/dea/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	}
	//	lsoa: {
	//		id: 'lsoa',
	//		promoteId: 'areacd',
	//		type: 'vector',
	//		url: 'https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v2/boundaries/{z}/{x}/{y}.pbf',
	//		minzoom: 6,
	//		maxzoom: 12
	//	},
	//	oa: {
	//		id: 'oa',
	//		promoteId: 'areacd',
	//		type: 'vector',
	//		url: 'https://cdn.ons.gov.uk/maptiles/administrative/oa/v1/boundaries/{z}/{x}/{y}.pbf',
	//		minzoom: 6,
	//		maxzoom: 12
	//	}
};

export const mapLayers = {
	//	ctry: {
	//		source: 'crd',
	//		sourceLayer: 'region',
	//		code: 'areacd',
	//		name: 'areanm',
	//		filter: [
	//			"all",
	//			["==", "nation", "true"],
	//			["in", "country", "E", "W"]
	//		]
	//	},
	//	rgn: {
	//		source: 'crd',
	//		sourceLayer: 'region',
	//		code: 'areacd',
	//		name: 'areanm',
	//		filter: [
	//			"all",
	//			["==", "region", "true"],
	//			["==", "country", "E"]
	//		]
	//	},
	//	cty: {
	//		source: 'crd',
	//		sourceLayer: 'authority',
	//		code: 'areacd',
	//		name: 'areanm',
	//		filter: [
	//			"all",
	//			["==", "upper", "true"],
	//			["in", "country", "E", "W"]
	//		]
	//	},
	lgd: {
		source: 'lgd',
		sourceLayer: 'lgd',
		code: 'LGDCode',
		name: 'LGDNAME'
// removing filter for lgd2012
//		filter: [
//			"all",
//			["==", "lower", "true"],
//			["in", "country", "E", "W", "N"]
//		]
	},
	dea: {
		source: 'dea',
		sourceLayer: 'dea',
		code: 'areacd',
		name: 'areanm'
	}
	//	lsoa: {
	//		source: 'lsoa',
	//		sourceLayer: 'lsoa',
	//		code: 'areacd',
	//		name: 'areanm'
	//	},
	//	oa: {
	//		source: 'oa',
	//		sourceLayer: 'oa',
	//		code: 'areacd',
	//		name: 'areanm'
	//	}
};

export const mapPaint = {
	fill: {
		'fill-color': 'rgba(255,255,255,0)',
		'fill-opacity': 0
	},
	line: {
		'line-color': 'rgba(255,255,255,0)',
		'line-width': 1,
		'line-opacity': 0
	},
	'fill-active': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgba(255,255,255,0)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['!=', ['feature-state', 'selected'], true], 0.1,
			0
		]
	},
	'fill-self': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			0.1
		]
	},
	'fill-child': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 'rgb(17,140,123)',
			'rgba(255,255,255,0)'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['==', ['feature-state', 'highlighted'], true], 0.1,
			0
		]
	},
	'line-active': {
		'line-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
			'grey'
		],
		'line-width': 2,
		'line-opacity': 1
	},
	'line-self': {
		'line-color': 'rgb(17,140,123)',
		'line-width': 2,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'selected'], true], 1,
			0
		]
	},
	'line-child': {
		'line-color': 'rgb(17,140,123)',
		'line-width': 1,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 1,
			0
		]
	}
};