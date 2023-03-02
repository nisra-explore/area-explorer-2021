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

export const app_inputs = {
	//search_data: 'https://datavis.nisra.gov.uk/techlab/drpvze/places_2001.csv',
	search_data: 'https://datavis.nisra.gov.uk/census/aex-hj77sh/places_dz.csv',
	//search_data: '/data_jsons_dz/places_dz.csv',
	app_json_data: 'https://datavis.nisra.gov.uk/census/aex-hj77sh/',
	//app_json_data: '/data_jsons_dz/',
	base: 'https://explore.nisra.gov.uk/area-explorer-2021/'
};

export const geog_types = {
	dz: {name: 'Data Zone', pl: 'Data Zones'},
	sdz: {name: 'Super Data Zone', pl: 'Super Data Zones'},
	ward: { name: 'Electoral Ward', pl: 'Ward' },

	dea: {name: 'District Electoral Area', pl: 'District Electoral Areas'},
	town: {name: 'settlement', pl: 'settlements'},
	lgd: {name: 'Local Government District', pl: 'Local Government Districts'},
	postcode: {name: 'postcode', pl: 'postcodes'},
	ctry: { name: 'Country', pl: 'Countries' }
};

export const topics = {
	age: [
		{ category: 'a0to14', label: '0-14' },
		{ category: 'a15to39', label: '15-39' },
		{ category: 'a40to64', label: '40-64' },
		{ category: 'a65plus', label: '65+' }
	],
	cob: [
		{ category: 'northern_ireland', label: 'Northern Ireland' },
		{ category: 'england', label: 'England' },
		{ category: 'scotland', label: 'Scotland' },
		{ category: 'wales', label: 'Wales' },
		{ category: 'republic_of_ireland', label: 'Republic of Ireland' },
		{ category: 'other_cob', label: 'Other countries' }
	],
	mainlang: [
		{ category: 'english', label: 'English' },
		{ category: 'other_languages', label: 'Other languages' }
	],
	irish: [
		{ category: 'no_ability_in_irish', label: 'No ability in Irish' },
		{ category: 'some_ability_in_irish', label: 'Some ability in Irish' }
	],
	ulster: [
		{ category: 'no_ability_in_ulsterscots', label: 'No ability in Ulster-Scots' },
		{ category: 'some_ability_in_ulsterscots', label: 'Some ability in Ulster-Scots' },
	],
	ethnic: [
		{ category: 'white', label: 'White' },
		{ category: 'other_ethnic', label: 'Other ethnic groups' }
	],
	natid: [
		{ category: 'british_only', label: 'British only' },
		{ category: 'irish_only', label: 'Irish only' },
		{ category: 'northern_irish_only', label: 'Northern Irish only' },
		{ category: 'british_and_irish_only', label: 'British & Irish only' },
		{ category: 'british_and_northern_irish_only', label: 'British & Northern Irish only' },
		{ category: 'irish_and_northern_irish_only', label: 'Irish & Northern Irish only' },
		{ category: 'british_irish_and_northern_irish_only', label: 'British, Irish & Northern Irish only' },
		{ category: 'other_natid', label: 'Other national identities' }
	],
	religion: [
		{ category: 'catholic', label: 'Catholic' },
		{ category: 'presbyterian_church_in_ireland', label: 'Presbyterian' },
		{ category: 'church_of_ireland', label: 'Church of Ireland' },
		{ category: 'methodist_church_in_ireland', label: 'Methodist' },
		{ category: 'other_christian_including_christian_related', label: 'Other Christian religions' },
		{ category: 'other_religions', label: 'Other religions' },
		{ category: 'no_religion_or_religion_not_stated', label: 'No religion/Not stated' }
	],
	religion_or_religion_brought_up_in: [
		{ category: 'catholic', label: 'Catholic' },
		{ category: 'protestant_and_other_christian_including_christian_related', label: 'Protestant & other Christian religions' },
		{ category: 'other_religions', label: 'Other religions' },
		{ category: 'none', label: 'None' }
	],
	passport: [
		{ category: 'united_kingdom_only', label: 'UK only' },
		{ category: 'ireland_only', label: 'Ireland only' },
		{ category: 'united_kingdom_and_ireland_only', label: 'UK & Ireland' },
		{ category: 'other_passports', label: 'Other passport(s)' },
		{ category: 'no_passport', label: 'No passport' }
	],
	hh_size: [
		{ category: 'one_person', label: '1 person' },
		{ category: 'two_people', label: '2 people' },
		{ category: 'three_people', label: '3 people' },
		{ category: 'four_people', label: '4 people' },
		{ category: 'five_people', label: '5 or more people' }
	],


	number_of_long_term_health: [
		{ category: 'none', label: 'No conditions' },
		{ category: 'one', label: '1 condition' },
		{ category: 'two', label: '2 conditions' },
		{ category: 'three_or_more', label: '3 or more conditions' }
	],

	provision_care: [
		{ category: 'no_care', label: 'Provides no unpaid care' },
		{ category: 'a1to19_hours', label: '1-19 hours' },
		{ category: 'a20to49_hours', label: '20-49 hours' },
		{ category: 'a50plus_hours', label: '50+ hours' }
	],

	long_term_disability: [
		{ category: 'not_limited', label: 'Activities not limited' },
		{ category: 'limited_a_little', label: 'Limited a little' },
		{ category: 'limited_a_lot', label: 'Limited a lot' }
	],

	general_health: [
		{ category: 'very_good', label: 'Very good' },
		{ category: 'good', label: 'Good' },
		{ category: 'fair', label: 'Fair' },
		{ category: 'bad', label: 'Bad' },
		{ category: 'very_bad', label: 'Very bad' }
	],

	households: [
		{ category: 'all_households' }
	],

	car_or_van: [
		{ category: 'none', label: 'No cars or vans' },
		{ category: 'one', label: '1 car or van' },
		{ category: 'two', label: '2 cars or vans' },
		{ category: 'three', label: '3 cars or vans' },
		{ category: 'four', label: '4 cars or vans' },
		{ category: 'five_or_more', label: '5 or more cars or vans' }
	],

	accommodation_type: [
		{ category: 'detached', label: 'Detached' },
		{ category: 'semi_detached', label: 'Semi-detached' },
		{ category: 'terraced', label: 'Terraced' },
		{ category: 'flat_maisonette_apartment', label: 'Flat, maisonette or apartment' },
		{ category: 'caravan', label: 'Caravan or other mobile or temporary structure' }
	],

	renewable_energy: [
		{ category: 'no_renewable', label: 'No renewable energy systems' },
		{ category: 'any_renewable', label: 'Any renewable energy systems' }
	],


	hh_tenure: [
		{ category: 'owns', label: 'Owns (inc. shared ownership)' },
		{ category: 'socially_rented', label: 'Social rented' },
		{ category: 'private_rented', label: 'Private rented' },
		{ category: 'rent_free', label: 'Lives rent free' }
	],

	number_of_adaptations: [
		{ category: 'none', label: 'Not designed or adapted' },
		{ category: 'one', label: 'One' },
		{ category: 'two_or_more', label: 'Two or more' }
	],

	central_heating: [
		{ category: 'oil_only', label: 'Oil only' },
		{ category: 'mains_gas_only', label: 'Gas only' },
		{ category: 'other', label: 'Other' },
		{ category: 'none', label: 'None' }
	],
	sex: [
		{ category: 'females', label: 'Females' },
		{ category: 'males', label: 'Males' }
	]
};



export const mapStyle = 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json';


export const mapSources = {
	lgd: {
		id: 'lgd',
		promoteId: 'lgd_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/lgd2014/{z}/{x}/{y}.pbf',
		maxzoom: 12
	},
	dea: {
		id: 'dea',
		promoteId: 'dea_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/dea_2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	},
	sdz: {
		id: 'sdz',
		promoteId: 'sdz_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/sdz_2021/{z}/{x}/{y}.pbf',
//		url: '/data/map_tiles/soa21/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	},
	dz: {
		id: 'dz',
		promoteId: 'dz_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/dz_2021/{z}/{x}/{y}.pbf',
//		url: '/data/map_tiles/sa/{z}/{x}/{y}.pbf',
 		minzoom: 6,
		maxzoom: 12, 
	},
	ward: {
		id: 'ward',
		promoteId: 'ward_Code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/ward2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	} 
};

export const mapLayers = {

	lgd: {
		source: 'lgd',
		sourceLayer: 'LGD2014_clipped',
		code: 'lgd_code',
		name: 'lgd_name'	},
	dea: {
		source: 'dea',
		sourceLayer: 'DEA2014_clipped',
		code: 'dea_code',
		name: 'dea_name'},
	sdz: {
		source: 'sdz',
		sourceLayer: 'SDZ2021_clipped',
		code: 'sdz_code',
		name: 'sdz_name'
	},
	dz: {
		source: 'dz',
		sourceLayer: 'DZ2021_clipped',
		code: 'dz_code',
		name: 'dz_name', 
		
	}, 

	ward: {
		source: 'ward',
		sourceLayer: 'WARD2014_clipped',
		code: 'ward_code',
		name: 'ward_name'
	} 

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
			['==', ['feature-state', 'selected'], true], 'rgb(143,31,129)',
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
			['==', ['feature-state', 'highlighted'], true], 'rgb(143,31,129)',
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
			['==', ['feature-state', 'selected'], true], 'rgb(143,31,129)',
			'grey'
		],
		'line-width': 2,
		'line-opacity': 1
	},
	'line-self': {
		'line-color': 'rgb(143,31,129)',
		'line-width': 2,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'selected'], true], 1,
			0
		]
	},
	'line-child': {
		'line-color': 'rgb(143,31,129)',
		'line-width': 1,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 1,
			0
		]
	}
};