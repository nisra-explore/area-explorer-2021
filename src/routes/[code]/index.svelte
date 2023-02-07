<script context="module">
	export const prerender = true;
	// getData is a function in utils.js that goes to a url input and looks for a return of csv data
	import { getData } from "$lib/utils";
	// a constant with 3 string urls, options - the places.csv, places - json files for each area code (accessed via urls.places),
	// quantiles - not sure but not used in index currently
	import { urls } from "$lib/config";

	// create a reference to the json for the current area to be loaded - called in the load() func below
	async function loadArea(code, fetch) {
		let res = await fetch(urls.places + code + ".json");
		let json = await res.json();

		return json;
	}

	export async function load({ params, fetch }) {
		let code = params.code;

		let res = await getData(urls.options, fetch);

		let lookup = {};
		res.forEach((d) => (lookup[d.code] = d.name));
		res.forEach((d) => {
			d.typepl = types[d.type].pl;
			d.typenm = types[d.type].name;
			//		  d.typestr = lookup[d.parent] ? `${lookup[d.parent]} includes ${types[d.type].name} within ${lookup[d.parent]}` : '';
			d.typestr = lookup[d.parent]
				? `${types[d.type].name} within ${lookup[d.parent]}`
				: "";
		});

		let options = res.sort((a, b) => a.name.localeCompare(b.name));
		let ew = await loadArea("N92000002", fetch);
		let place = await loadArea(code, fetch);

		return {
			props: { options, place, ew },
		};
	}
</script>

<script>
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import { suffixer, changeClass, changeStr, adjectify } from "$lib/utils";
	import {
		types,
		codes,
		mapStyle,
		mapSources,
		mapLayers,
		mapPaint,
	} from "$lib/config";
	import Section from "$lib/layout/Section.svelte";
	import ColChart from "$lib/chart/ColChart.svelte";
	import StackedBarChart from "$lib/chart/StackedBarChart.svelte";
	import StackedBarChart_nocomparator from "$lib/chart/StackedBarChart_nocomparator.svelte";
	import Em from "$lib/ui/Em.svelte";
	import Select from "$lib/ui/Select.svelte";
	import Map from "$lib/map/Map.svelte";
	import MapSource from "$lib/map/MapSource.svelte";
	import MapLayer from "$lib/map/MapLayer.svelte";
	import GroupChart from "$lib/chart/GroupChart.svelte";
	import AnalyticsBanner from "$lib/layout/AnalyticsBanner.svelte";

	export let options, place, ew;

	let w, cols;
	let map = null;
	let overtime = false;

	let active = {
		selected: null,
		type: null,
		childType: null,
		highlighted: [],
		hovered: null,
	};

	let isChild = {};
	Object.keys(mapLayers).forEach((key) => (isChild[key] = false));

	function makeData(props) {
		const sum = (a, b) => a + b;
		let code = props[0];
		let val = props[1];

		let source = place.data[code][val]["2021"];
		let sourcePrev = place.data[code][val]["2011"];
		let sourceEW = ew.data[code][val]["2021"];

		let keys = codes[code].map((d) => d.code);
		let labels = codes[code].map((d) => (d.label ? d.label : d.code));
		let data = keys.map((key, i) => {
			if (Array.isArray(key)) {
				return {
					x: labels[i],
					y: key.map((k) => source[k]).reduce(sum, 0),
					ew: key.map((k) => sourceEW[k]).reduce(sum, 0),
					prev: key.map((k) => sourcePrev[k]).reduce(sum, 0),
				};
			} else {
				return {
					x: labels[i],
					y: source[key],
					ew: sourceEW[key],
					prev: sourcePrev[key],
				};
			}
		});

		return data;
	}

	function fitMap(bounds) {
		if (map) {
			map.fitBounds(bounds, { padding: 20 });
		}
	}

	function updateActive(place) {
		let prev = JSON.parse(JSON.stringify(active));
		let code = place.code;
		let type = place.type;
		let children = place.children[0]
			? place.children.map((d) => d.code)
			: [];
		let childType =
			place.type == "rgn"
				? "cty"
				: children[0]
				? place.children[0].type
				: null;

		active.selected = code;
		active.type = type;
		active.childType = childType;
		active.highlighted = children;

		let keys = Object.keys(mapLayers);
		let fillProps = ["fill-color", "fill-opacity"];
		let lineProps = ["line-color", "line-width", "line-opacity"];

		// Change layer visibility and paint properties if geography level changes
		if (
			map &&
			(active.type != prev.type || active.childType != prev.childType)
		) {
			// Set map layer visibility properties
			keys.forEach((key) => {
				let visibility =
					key == type || (childType && key == childType)
						? "visible"
						: "none";
				map.setLayoutProperty(key + "-fill", "visibility", visibility);
				map.setLayoutProperty(
					key + "-bounds",
					"visibility",
					visibility
				);
				if (place.parents[0]) {
					map.setLayoutProperty(
						key + "-self",
						"visibility",
						visibility
					);
				}
				isChild[key] = key == childType ? true : false;
			});

			// Set new paint properties
			if (place.parents[0]) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						type + "-fill",
						prop,
						mapPaint[children[0] ? "fill-active" : "fill-self"][
							prop
						]
					)
				);
				lineProps.forEach((prop) => {
					map.setPaintProperty(
						type + "-bounds",
						prop,
						mapPaint["line-active"][prop]
					);
					map.setPaintProperty(
						type + "-self",
						prop,
						mapPaint["line-self"][prop]
					);
				});
			}
			if (childType) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-fill",
						prop,
						mapPaint["fill-child"][prop]
					)
				);
				lineProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-bounds",
						prop,
						mapPaint["line-child"][prop]
					)
				);
			}
		}
	}

	function update(place) {
		updateActive(place);
		fitMap(place.bounds);
	}

	function mapSelect(ev) {
		goto(`${base}/${ev.detail.code}/`, { noscroll: true });
	}

	function menuSelect(ev) {
		goto(`${base}/${ev.detail.value}/`, { noscroll: true });
	}

	function onResize() {
		cols =
			w < 575
				? 1
				: window
						.getComputedStyle(grid)
						.getPropertyValue("grid-template-columns")
						.split(" ").length;
	}

	$: w && onResize();
	$: chartLabel = overtime
		? "Same area 2011"
		: place && place.parents[0]
		? "NI 2021"
		: null;
	$: place && update(place);
	//	$: hasChange = place && place.data.population.value.change.all != null;
	$: hasChange = false;
	$: noCompare = true;

	$: demog = true;
	$: cob_nat = true;
	$: language = true;
	$: religion = true;
	$: housing = true;
	$: health = true;
</script>

<svelte:head>
	<title>{place.name} Census Data</title>
	<meta name="description" content="" />
	<meta property="og:title" content="{place.name} Census Data" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{urls.base}/{place.code}/" />
	<meta
		property="og:description"
		content="Explore census data for {place.name}."
	/>
	<meta name="description" content="Explore census data for {place.name}." />
</svelte:head>

<Section column="wide">
	{#if place && ew}
		<div class="grid mtl">
			<div>
				<span class="text-small">
					<a href="{base}/" sveltekit:noscroll>Home</a
					>{@html " &gt; "}
					{#if place.parents[0]}
						{#each [...place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" sveltekit:noscroll
								>{parent.name}</a
							>{@html " &gt; "}
						{/each}

						{place.name}
					{:else}
						{place.name}
					{/if}
				</span><br />
				<span class="text-big title">{place.name}</span>
				<div class="text-bold" style="font-size: 0.85em;">
					Click for:
		
					<button
						class="btn"
						class:btn-active={noCompare}
						on:click={() => (noCompare = true)}
						on:click={() => (overtime = false)}
						on:click={() => (hasChange = false)}
						>No comparison</button
					>
					{#if place.type != "ew"}
						<button
							class="btn"
							class:btn-active={hasChange &
								!noCompare &
								!overtime}
							on:click={() => (hasChange = true)}
							on:click={() => (noCompare = false)}
							on:click={() => (overtime = false)}
							>NI 2021</button>
					{/if}
					<button
						class="btn"
						class:btn-active={overtime & !noCompare & !hasChange}
						on:click={() => (overtime = true)}
						on:click={() => (noCompare = false)}
						on:click={() => (hasChange = false)}
						>Same area 2011</button
					>
				</div>
			</div>
			
			<div>
				<div
					style="width: 350px; padding-top: 5px;"
					class:float-right={cols > 1}
				>
					<b>Search for your Local Government District:</b>
					<Select
						{options}
						group="typestr"
						search={true}
						on:select={menuSelect}
					/>

					<!-- Code credit: https://css-tricks.com/on-the-web-share-api/ -->

					<script>
						// Share button
						// Possible tooltip: https://stackoverflow.com/questions/37798967/tooltip-on-click-of-a-button

						function copyToClipboard(text) {
							var inputc = document.body.appendChild(
								document.createElement("input")
							);
							inputc.value = window.location.href;
							inputc.select();
							document.execCommand("copy");
							inputc.parentNode.removeChild(inputc);
							alert("URL Copied.");
						}

						(function (win, doc) {
							const testButton = doc.createElement("button");
							testButton.setAttribute("type", "share");
							if (testButton.type != "share") {
								win.addEventListener("click", function (ev) {
									ev = ev || win.event;
									let target = ev.target;
									let button = target.closest(
										'button[type="share"]'
									);
									if (button) {
										const title = "Share URL";
										const url = win.location.href;
										if (navigator.share) {
											navigator.share({
												title: title,
												url: url,
											});
										} else {
											copyToClipboard();
										}
									}
								});
							}
						})(this, this.document);
					</script>
							

					<!-- 			<button style="cursor: pointer; background-image: url('https://icons.getbootstrap.com/assets/icons/share.svg'); float: right; margin-top: 5px; margin-left: 8px; background-color: transparent !important; background-size: cover; width: 30px; height: 30px; border: 0" type="share"></button>
 -->
					<div width="100%">
						<button
							class="btn"
							style="width: 33%"
							title="Click to print this page to pdf or printer"
							onclick="window.print();return false;"
							>Print / PDF </button>
						<button
							class="btn"
							style="width: 33%"
							alt="Return to the landing page"
							onclick="window.location.href='{base}';"
							>Menu </button>
						<button
							class="btn"
							style="width: 30%"
							type="share"
							alt="Share this page">Share </button>
					</div>
				</div>
			</div>
		</div>

		<div id="grid" class="grid mt">
			<div class="div-grey-box" style="line-height: 1.3;">
				<h3 style="margin: 0 0 10px 0; line-height: 1.78;">Overview</h3>
				{#if place.type == "ew" || place.type == "ctry"}
					The population of {place.name} was {place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census.
				{:else}
					The population of {place.name} was {place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census, which
					made it the
					{#if place.data.population.value_rank["2021"].all == 1}
						largest area.
					{:else if place.data.population.value_rank["2021"].all == place.count}
						smallest area.
					{:else if place.data.population.value_rank["2021"].all <= (place.count + 1) / 2 && place.data.population.value_rank["2021"].all != 1}
						{place.data.population.value_rank[
							"2021"
						].all.toLocaleString()}{suffixer(
							place.data.population.value_rank["2021"].all
						)} largest area.
					{:else}
						{place.count +
							1 -
							place.data.population.value_rank[
								"2021"
							].all.toLocaleString()}{suffixer(
							place.count +
								1 -
								place.data.population.value_rank["2021"].all
						)} smallest area.
					{/if}
				{/if}
				{#if place.data.population.value.change.all == 0}
					No change in population since the 2011 Census.
				{:else if place.data.population.value.change.all > 0}
					An increase of {changeStr(
						place.data.population.value.change.all,
						"%",
						1
					)} since the 2011 Census.
				{:else}
					A decrease of {changeStr(
						place.data.population.value.change.all,
						"%",
						1
					)} since the 2011 Census.
				{/if}
			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#pop-info"
					aria-expanded="false"
					aria-controls="pop-info"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Population <span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}
						</span>
					</div>
				</div>
				<div class="collapse" id="pop-info">
					<div class="card card-body">
						Population is based on the number of usual residents. A
						usual resident is anyone who, on 21 March 2021 is in the
						UK, and staying in the UK for a period of 3 months or
						more; or has a permanent UK address and is outside the
						UK and is staying outside the UK for less than 12
						months. <a
							href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
							><strong>Statistical bulletins</strong></a
						>
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>{place.data.population.value[
						"2021"
					].all.toLocaleString()}</span
				><br />
				{#if place.type != "ew"}
					{#if (place.type != "ctry") & hasChange & !overtime}
						<span class="text-small "
							><Em
								>{place.data.population.value["2021"].all /
									ew.data.population.value["2021"].all >=
								0.001
									? (
											(place.data.population.value["2021"] .all / ew.data.population.value["2021"] 	.all) *
											100
									  ).toFixed(1)
									: "<0.1"}%</Em
							> of Northern Ireland population</span
						>
						<div class="text-small ">
							{#if place.data.population.value_rank["2021"].all == 1}
								The largest
							{:else if place.data.population.value_rank["2021"].all == place.count}
								The smallest
							{:else if place.data.population.value_rank["2021"].all <= (place.count + 1) / 2 && place.data.population.value_rank["2021"].all != 1}
								{place.data.population.value_rank[
									"2021"
								].all.toLocaleString()}{suffixer(
									place.data.population.value_rank["2021"].all
								)} largest
							{:else}
								{place.count +
									1 -
									place.data.population.value_rank[
										"2021"
									].all.toLocaleString()}{suffixer(
									place.count +
										1 -
										place.data.population.value_rank["2021"]
											.all
								)} smallest
							{/if}
							population of {place.count.toLocaleString()}
							{types[place.type].pl.toLowerCase()}
						</div>
					{/if}
				{/if}
				{#if overtime}
					<span class="text-small "
						><Em
							><span
								class={changeClass(
									place.data.population.value.change.all
								)}
								>{changeStr(
									place.data.population.value.change.all,
									"%",
									1
								)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#households-info"
					aria-expanded="false"
					aria-controls="households-info"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Households<span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}</span
						>
					</div>
				</div>
				<div class="collapse" id="households-info">
					<div class="card card-body">
						A household is either one person living alone or a group
						of people living at the same address who share cooking
						facilities and share a living room, sitting room or
						dining area. <a
							href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
							><strong>Statistical bulletins</strong></a
						>
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>{place.data.households.value[
						"2021"
					].all_households.toLocaleString()}</span
				><br />
				{#if (place.type != "ew") & hasChange}
					<span class="text-small"
						><Em
							>{place.data.households.value["2021"]
								.all_households /
								ew.data.households.value["2021"]
									.all_households >=
							0.001
								? (
										(place.data.households.value["2021"]
											.all_households /
											ew.data.households.value["2021"] .all_households) *
										100
								  ).toFixed(1)
								: "<0.1"}%</Em
						> of Northern Ireland households</span
					>
				{/if}
				{#if overtime}
					<span class="text-small"
						><Em
							><span
								class={changeClass(
									place.data.households.value.change
										.all_households
								)}
								>{changeStr(
									place.data.households.value.change
										.all_households,
									"%",
									1
								)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div>
		</div>

		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>
					Explore <span style="color: #93328E">{place.name} </span>
				</h3>
			</div>
			<div
				id="map"
				style="padding-right: 45px; grid-column: span {cols == 2
					? 2
					: cols && cols > 2
					? cols - 1
					: 1};  "
			>
				<Map
					bind:map
					location={{ bounds: place.bounds }}
					options={{ fitBoundsOptions: { padding: 20 } }}
					style={mapStyle}
				>
					{#each ["dea"] as key}
						<MapSource {...mapSources[key]}>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-fill"
								type="fill"
								isChild={isChild[key]}
								click={true}
								selected={active.selected}
								on:select={mapSelect}
								highlight={true}
								highlighted={active.highlighted}
								hover={true}
								hovered={active.hovered}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["fill-self"]
									: active.childType == key
									? mapPaint["fill-child"]
									: mapPaint.fill}
							/>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-bounds"
								type="line"
								selected={active.selected}
								highlight={true}
								highlighted={active.highlighted}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["line-active"]
									: active.childType == key
									? mapPaint["line-child"]
									: mapPaint.line}
							/>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-self"
								type="line"
								selected={active.selected}
								layout={{
									visibility:
										active.type == key ? "visible" : "none",
								}}
								paint={active.type == key
									? mapPaint["line-self"]
									: mapPaint.line}
							/>
						</MapSource>
					{/each}
					<MapSource {...mapSources.lgd}>
						{#each ["lgd"] as key}
							<MapLayer
								{...mapLayers[key]}
								id={key + "-fill"}
								type="fill"
								isChild={isChild[key]}
								click={true}
								selected={active.selected}
								on:select={mapSelect}
								highlight={true}
								highlighted={active.highlighted}
								hover={true}
								hovered={active.hovered}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["fill-self"]
									: active.childType == key
									? mapPaint["fill-child"]
									: mapPaint.fill}
							/>
							<MapLayer
								{...mapLayers[key]}
								id={key + "-bounds"}
								type="line"
								selected={active.selected}
								highlight={true}
								highlighted={active.highlighted}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["line-active"]
									: active.childType == key
									? mapPaint["line-child"]
									: mapPaint.line}
							/>
							<MapLayer
								{...mapLayers[key]}
								id={key + "-self"}
								type="line"
								selected={active.selected}
								layout={{
									visibility:
										active.type == key ? "visible" : "none",
								}}
								paint={active.type == key
									? mapPaint["line-self"]
									: mapPaint.line}
							/>
						{/each}
					</MapSource>
				</Map>
			</div>
			<div>
				<span>
					{#if place.parents[0]}
						{#each [...place.parents].reverse() as parent, i}
							<span>{place.name} is located in </span><span
								class="text-bold"
								><a
									href="{base}/{parent.code}/"
									sveltekit:noscroll>{parent.name}</a
								></span
							>
						{/each}
					{/if}
				</span>
			</div>
			<div>
				<span
					><ul style="padding-left:0;">
						{#if ew.children[0]}
							<span class="text-bold"
								>Districts within Northern Ireland</span
							><br />
							{#each ew.children as child, i}
								<li
									style="margin: 3px; display: block; line-height: 20px; padding-bottom: 5px"
								>
									<a
										href="{base}/{child.code}/"
										sveltekit:noscroll>{child.name}</a
									>{i < ew.children.length - 1 ? "" : ""}
								</li>
							{/each}
						{:else}
							<span class="muted"
								>No areas within {place.name}</span
							>
						{/if}
					</ul></span
				>
			</div>
		</div>



 		<div class="text-bold" style="font-size: 0.85em;">
			<br />
			<div class="text-bold" style="font-size: 1.2em;">
				Select Census 2021 topics:
			</div>

			{#if demog == true}
				<button
					class="btn"
					class:btn-active={demog}
					on:click={() => (demog = false)}
					>Demography <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={demog}
					on:click={() => (demog = true)}>Demography </button>
			{/if}
			{#if cob_nat == true}
				<button
					class="btn"
					class:btn-active={cob_nat}
					on:click={() => (cob_nat = false)}
					>Country of Birth & Nationality <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={cob_nat}
					on:click={() => (cob_nat = true)}
					>Country of Birth & Nationality </button>
			{/if}
			{#if language == true}
				<button
					class="btn"
					class:btn-active={language}
					on:click={() => (language = false)}
					>Language <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={language}
					on:click={() => (language = true)}>Language </button>
			{/if}
			{#if religion == true}
				<button
					class="btn"
					class:btn-active={religion}
					on:click={() => (religion = false)}
					>Religion & Ethnicity <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={religion}
					on:click={() => (religion = true)}>Religion & Ethnicity</button>
			{/if}
			{#if health == true}
				<button
					class="btn"
					class:btn-active={health}
					on:click={() => (health = false)}
					>Health & Care <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={health}
					on:click={() => (health = true)}>Health & Care </button>
			{/if}
			{#if housing == true}
				<button
					class="btn"
					class:btn-active={housing}
					on:click={() => (housing = false)}
					>Housing & Accommodation <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={housing}
					on:click={() => (housing = true)}
					>Housing & Accommodation </button>
			{/if}

			<br />
			<br />

<!-- 			<div class="text-bold" style="font-size: 1.2em;">
				Build your profile :
			</div>
			<span style="font-weight: normal; font-size: 1.2em;">
				Demography <input
					type="checkbox"
					border = "3px solid red;"
					name="checkfield"
					id="check-01"
					checked={demog}
					on:click={() => (demog = !demog)}/>
				Country of Birth and Nationality
				<input
					type="checkbox"
					name="checkfield"
					id="check-02"
					checked={cob_nat}
					on:click={() => (cob_nat = !cob_nat)}/>
				Language
				<input
					type="checkbox"
					name="checkfield"
					id="check-03"
					checked={language}
					on:click={() => (language = !language)}/>
				<br />Religion
				<input
					type="checkbox"
					name="checkfield"
					id="check-04"
					checked={religion}
					on:click={() => (religion = !religion)}/>
				Health and Care
				<input
					type="checkbox"
					name="checkfield"
					id="check-05"
					checked={health}
					on:click={() => (health = !health)}/>
				Housing and Accommodation
				<input
					type="checkbox"
					name="checkfield"
					id="check-06"
					checked={housing}
					on:click={() => (housing = !housing)}/>
			</span>-->
		</div> 



	
		{#if demog}
			<div style="grid-column: span {cols};">
				<h2>
					Demography <span class="title-inset muted"
						>{place.name} - Census 2021
<!-- 						<input
							type="checkbox"
							name="checkfield"
							id="check-01"
							checked={demog}
							on:click={() => (demog = !demog)}
						/> --></span
					>
				</h2>
			</div>
			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#broadagebands-info"
						aria-expanded="false"
						aria-controls="broadagebands-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Broad age bands (years) <span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="broadagebands-info">
						<div class="card card-body">
							A grouping of ages where a person’s age is their age
							at their last birthday on or prior to census day. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>

					<div
						class="chart"
						style="height: 100px; padding-bottom: 5px"
					>
						<ColChart
							data={place && makeData(["age", "perc", "2021"])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
						/>
					</div>
					{#if !noCompare && chartLabel}
						<div class="text-small muted; ">
							<svg
								width="25"
								height="4"
								style="display: inline-block;margin-bottom: 3px;"
							>
								<rect
									width="25"
									height="4"
									style="fill:#CEDC20;"
								/>
							</svg>
							{chartLabel}
						</div>
					{/if}
					{#if noCompare}
						<span class="text-small"
							>0-14 years {changeStr(
								place.data.age.perc["2021"].a0to14,
								"%",
								0
							)}
						</span><span
							class="text-small"
							style="color: #3878C5"
						/><br />
						<span class="text-small"
							>15-39 years {changeStr(
								place.data.age.perc["2021"].a15to39,
								"%",
								0
							)}
						</span><span
							class="text-small"
							style="color: #3878C5"
						/><br />
						<span class="text-small"
							>40-64 years {changeStr(
								place.data.age.perc["2021"].a40to64,
								"%",
								0
							)}
						</span><span
							class="text-small"
							style="color: #3878C5"
						/><br />
						<span class="text-small"
							>65+ years {changeStr(
								place.data.age.perc["2021"].a65plus,
								"%",
								0
							)}
						</span><span
							class="text-small"
							style="color: #3878C5"
						/>
					{:else if overtime}
						<span class="text-small"
							>0-14 years {changeStr(
								place.data.age.perc["2021"].a0to14,
								"%",
								0
							)}
						</span><span class="text-small" style="color: #3878C5"
							>(2011 {changeStr(
								place.data.age.perc["2011"].a0to14,
								"%",
								0
							)})</span
						><br />
						<span class="text-small"
							>15-39 years {changeStr(
								place.data.age.perc["2021"].a15to39,
								"%",
								0
							)}
						</span><span class="text-small" style="color: #3878C5"
							>(2011 {changeStr(
								place.data.age.perc["2011"].a15to39,
								"%",
								0
							)})</span
						><br />
						<span class="text-small"
							>40-64 years {changeStr(
								place.data.age.perc["2021"].a40to64,
								"%",
								0
							)}
						</span><span class="text-small" style="color: #3878C5"
							>(2011 {changeStr(
								place.data.age.perc["2011"].a40to64,
								"%",
								0
							)})</span
						><br />
						<span class="text-small"
							>65+ years {changeStr(
								place.data.age.perc["2021"].a65plus,
								"%",
								0
							)}
						</span><span class="text-small" style="color: #3878C5"
							>(2011 {changeStr(
								place.data.age.perc["2011"].a65plus,
								"%",
								0
							)})</span
						>
					{:else if hasChange}
						<span class="text-small"
							>0-14 years {changeStr(
								place.data.age.perc["2021"].a0to14,
								"%",
								0
							)}
						</span>{#if place.parents[0]}<span
								class="text-small"
								style="color: #3878C5"
								>(NI {changeStr(
									ew.data.age.perc["2021"].a0to14,
									"%",
									0
								)})</span
							>{/if}<br />
						<span class="text-small"
							>15-39 years {changeStr(
								place.data.age.perc["2021"].a15to39,
								"%",
								0
							)}
						</span>{#if place.parents[0]}<span
								class="text-small"
								style="color: #3878C5"
								>(NI {changeStr(
									ew.data.age.perc["2021"].a15to39,
									"%",
									0
								)})</span
							>{/if}<br />
						<span class="text-small"
							>40-64 years {changeStr(
								place.data.age.perc["2021"].a40to64,
								"%",
								0
							)}
						</span>{#if place.parents[0]}<span
								class="text-small"
								style="color: #3878C5"
								>(NI {changeStr(
									ew.data.age.perc["2021"].a40to64,
									"%",
									0
								)})</span
							>{/if}<br />
						<span class="text-small"
							>65+ years {changeStr(
								place.data.age.perc["2021"].a65plus,
								"%",
								0
							)}
						</span>{#if place.parents[0]}<span
								class="text-small"
								style="color: #3878C5"
								>(NI {changeStr(
									ew.data.age.perc["2021"].a65plus,
									"%",
									0
								)})</span
							>{/if}
					{/if}
				</div>
				<div class = "div-grey-box">
		<div class="blocktitle" style="margin: 0; width: 100%">Sex</div>
		<StackedBarChart data="{place && makeData(['population', 'perc', '2021'])}" zKey="{noCompare ? null: overtime  ? 'prev' : !overtime && place.type != 'ew' ? 'ew' : null}" label={chartLabel}/>
	</div>
	<!-- <div class="div-grey-box">
					<div class="blocktitle" style="margin: 0; width: 100%">
						Sex
					</div>
					{#if noCompare}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Female",
									perc: place.data.population.perc["2021"]
										.males,
								},
								{
									group: place.name,
									category: "Male",
									perc: place.data.population.perc["2021"]
										.females,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if overtime}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Female",
									perc: place.data.population.perc["2021"]
										.males,
								},
								{
									group: place.name,
									category: "Male",
									perc: place.data.population.perc["2021"]
										.females,
								},
								{
									group: "2011",
									category: "Female",
									perc: place.data.population.perc["2011"]
										.males,
								},
								{
									group: "2011",
									category: "Male",
									perc: place.data.population.perc["2011"]
										.females,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if hasChange}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Female",
									perc: place.data.population.perc["2021"]
										.males,
								},
								{
									group: place.name,
									category: "Male",
									perc: place.data.population.perc["2021"]
										.females,
								},
								{
									group: "NI",
									category: "Female",
									perc: ew.data.population.perc["2021"].males,
								},
								{
									group: "NI",
									category: "Male",
									perc: ew.data.population.perc["2021"]
										.females,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{/if}
				</div> -->
 	<div class = "div-grey-box">
		<div class="row" style="display: flex; cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#hhsize-info" aria-expanded="false" aria-controls="hhsize-info">
			<div class="blocktitle" style="margin: 0; width: 100%">Household size<span style="color: gray; font-size: 14pt;">{@html ' &#x24D8; '}</span></div>
		</div>
		<div class="collapse" id="hhsize-info">
			<div class="card card-body">
				The number of usual residents in the household.      <a href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"><strong>Statistical bulletins</strong></a>
			</div>
		</div>
		<StackedBarChart data="{place && makeData(['hh_size', 'perc', '2021'])}" zKey="{noCompare ? null: overtime  ? 'prev' : !overtime && place.type != 'ew' ? 'ew' : null}" label={chartLabel}/>
	</div> 
<!-- 				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#hhsize-info"
						aria-expanded="false"
						aria-controls="hhsize-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Household size<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="hhsize-info">
						<div class="card card-body">
							The number of usual residents in the household. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					{#if noCompare}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "1 person",
									perc: place.data.hh_size.perc["2021"]
										.one_person,
								},
								{
									group: place.name,
									category: "2 people",
									perc: place.data.hh_size.perc["2021"]
										.two_people,
								},
								{
									group: place.name,
									category: "3 people",
									perc: place.data.hh_size.perc["2021"]
										.three_people,
								},
								{
									group: place.name,
									category: "4 people",
									perc: place.data.hh_size.perc["2021"]
										.four_people,
								},
								{
									group: place.name,
									category: "5 or more people",
									perc: place.data.hh_size.perc["2021"]
										.five_people,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if overtime}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "1 person",
									perc: place.data.hh_size.perc["2021"]
										.one_person,
								},
								{
									group: place.name,
									category: "2 people",
									perc: place.data.hh_size.perc["2021"]
										.two_people,
								},
								{
									group: place.name,
									category: "3 people",
									perc: place.data.hh_size.perc["2021"]
										.three_people,
								},
								{
									group: place.name,
									category: "4 people",
									perc: place.data.hh_size.perc["2021"]
										.four_people,
								},
								{
									group: place.name,
									category: "5 or more people",
									perc: place.data.hh_size.perc["2021"]
										.five_people,
								},
								{
									group: "2011",
									category: "1 person",
									perc: place.data.hh_size.perc["2011"]
										.one_person,
								},
								{
									group: "2011",
									category: "2 people",
									perc: place.data.hh_size.perc["2011"]
										.two_people,
								},
								{
									group: "2011",
									category: "3 people",
									perc: place.data.hh_size.perc["2011"]
										.three_people,
								},
								{
									group: "2011",
									category: "4 people",
									perc: place.data.hh_size.perc["2011"]
										.four_people,
								},
								{
									group: "2011",
									category: "5 or more people",
									perc: place.data.hh_size.perc["2011"]
										.five_people,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if hasChange}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "1 person",
									perc: place.data.hh_size.perc["2021"]
										.one_person,
								},
								{
									group: place.name,
									category: "2 people",
									perc: place.data.hh_size.perc["2021"]
										.two_people,
								},
								{
									group: place.name,
									category: "3 people",
									perc: place.data.hh_size.perc["2021"]
										.three_people,
								},
								{
									group: place.name,
									category: "4 people",
									perc: place.data.hh_size.perc["2021"]
										.four_people,
								},
								{
									group: place.name,
									category: "5 or more people",
									perc: place.data.hh_size.perc["2021"]
										.five_people,
								},
								{
									group: "NI",
									category: "1 person",
									perc: ew.data.hh_size.perc["2021"]
										.one_person,
								},
								{
									group: "NI",
									category: "2 people",
									perc: ew.data.hh_size.perc["2021"]
										.two_people,
								},
								{
									group: "NI",
									category: "3 people",
									perc: ew.data.hh_size.perc["2021"]
										.three_people,
								},
								{
									group: "NI",
									category: "4 people",
									perc: ew.data.hh_size.perc["2021"]
										.four_people,
								},
								{
									group: "NI",
									category: "5 or more people",
									perc: ew.data.hh_size.perc["2021"]
										.five_people,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{/if}
				</div>
 -->			</div>
		{/if}

		{#if cob_nat}
			<div style="grid-column: span {cols};">
				<h2>
					Country of Birth & Nationality <span
						class="title-inset muted"
						>{place.name} - Census 2021</span
					>
				</h2>
			</div>
			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#cob-info"
						aria-expanded="false"
						aria-controls="cob-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Country of birth<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="cob-info">
						<div class="card card-body">
							The country in which a person was born. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["cob", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#passport-info"
						aria-expanded="false"
						aria-controls="passport-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Passport(s) held<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="passport-info">
						<div class="card card-body">
							Passport or passports that an individual holds. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["passport", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#natid-info"
						aria-expanded="false"
						aria-controls="natid-info"
					>
						<div
							class="blocktitle"
							style="font-size: 1.02em; margin: 0; width: 100%"
						>
							National identity (person based)<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="natid-info">
						<div class="card card-body">
							The nationality or nationalities that the person
							identifies with. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["natid", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
			</div>
		{/if}

		{#if language}
			<div style="grid-column: span {cols};">
				<h2>
					Language  <span class="title-inset muted"
						>{place.name} - Census 2021</span
					>
				</h2>
			</div>
			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#mainlang-info"
						aria-expanded="false"
						aria-controls="mainlang-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Main language<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="mainlang-info">
						<div class="card card-body">
							Person's main language as declared in the Census.
							Statistics for all language questions are restricted
							to persons aged 3 and over. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["mainlang", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#irish-info"
						aria-expanded="false"
						aria-controls="irish-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Knowledge of Irish<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="irish-info">
						<div class="card card-body">
							A person has some ability in Irish if they can
							understand, speak, read or write Irish. Statistics
							for all language questions are restricted to persons
							aged 3 and over. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart_nocomparator 
						data={place && makeData(["irish", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
						ovrtm={overtime}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#ulster-info"
						aria-expanded="false"
						aria-controls="ulster-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Knowledge of Ulster-Scots<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="ulster-info">
						<div class="card card-body">
							A person has some ability in Ulster-Scots if they
							can understand, speak, read or write Ulster-Scots.
							Statistics for all language questions are restricted
							to persons aged 3 and over. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart_nocomparator
						data={place && makeData(["ulster", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
						ovrtm={overtime}
					/>
				</div>
			</div>
		{/if}

		{#if religion}
			<div style="grid-column: span {cols};">
				<h2>
					Religion & Ethnicity  <span
						class="title-inset muted"
					>
						{place.name} - Census 2021</span
					>
				</h2>
			</div>
			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#rel-info"
						aria-expanded="false"
						aria-controls="rel-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Religion<span style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="rel-info">
						<div class="card card-body">
							Religion, religious denomination or body the person
							indicated they belong to. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["religion", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
<!-- 				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#relbup-info"
						aria-expanded="false"
						aria-controls="relbup-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Religion, Religion brought up<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="relbup-info">
						<div class="card card-body">
							The religious group the person belongs to or for
							people with no current religion their religious
							group of upbringing. People with no current religion
							and no religion of upbringing are labelled 'None'. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					{#if noCompare}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Catholic",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].catholic,
								},
								{
									group: place.name,
									category:
										"Protestant & other Christian religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"]
										.protestant_and_other_christian_including_christian_related,
								},
								{
									group: place.name,
									category: "Other religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].other_religions,
								},
								{
									group: place.name,
									category: "None",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].none,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if overtime}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Catholic",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].catholic,
								},
								{
									group: place.name,
									category:
										"Protestant & other Christian religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"]
										.protestant_and_other_christian_including_christian_related,
								},
								{
									group: place.name,
									category: "Other religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].other_religions,
								},
								{
									group: place.name,
									category: "None",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].none,
								},
								{
									group: "2011",
									category: "Catholic",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2011"].catholic,
								},
								{
									group: "2011",
									category:
										"Protestant & other Christian religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2011"]
										.protestant_and_other_christian_including_christian_related,
								},
								{
									group: "2011",
									category: "Other religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2011"].other_religions,
								},
								{
									group: "2011",
									category: "None",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2011"].none,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{:else if hasChange}
						<GroupChart
							data={[
								{
									group: place.name,
									category: "Catholic",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].catholic,
								},
								{
									group: place.name,
									category:
										"Protestant & other Christian religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"]
										.protestant_and_other_christian_including_christian_related,
								},
								{
									group: place.name,
									category: "Other religions",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].other_religions,
								},
								{
									group: place.name,
									category: "None",
									perc: place.data
										.religion_or_religion_brought_up_in
										.perc["2021"].none,
								},
								{
									group: "NI",
									category: "Catholic",
									perc: ew.data
										.religion_or_religion_brought_up_in
										.perc["2021"].catholic,
								},
								{
									group: "NI",
									category:
										"Protestant & other Christian religions",
									perc: ew.data
										.religion_or_religion_brought_up_in
										.perc["2021"]
										.protestant_and_other_christian_including_christian_related,
								},
								{
									group: "NI",
									category: "Other religions",
									perc: ew.data
										.religion_or_religion_brought_up_in
										.perc["2021"].other_religions,
								},
								{
									group: "NI",
									category: "None",
									perc: ew.data
										.religion_or_religion_brought_up_in
										.perc["2021"].none,
								},
							]}
							zKey="group"
							label={chartLabel}
						/>
					{/if}
				</div> -->
				 <div class = "div-grey-box">
		<div class="row" style="display: flex; cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#relbup-info" aria-expanded="false" aria-controls="relbup-info">
			<div class="blocktitle" style="margin: 0; width: 100%">Religion, Religion brought up<span style="color: gray; font-size: 14pt;">{@html ' &#x24D8; '}</span></div>
		</div>
		<div class="collapse" id="relbup-info">
			<div class="card card-body">
				The religious group the person belongs to or for people with no current religion their religious group of upbringing. People with no current religion and no religion of upbringing are labelled 'None'.    <a href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"><strong>Statistical bulletins</strong></a>
			</div>
		</div>
		<StackedBarChart data="{place && makeData(['religion_or_religion_brought_up_in', 'perc', '2021'])}" zKey="{noCompare ? null: overtime  ? 'prev' : !overtime && place.type != 'ew' ? 'ew' : null}" label={chartLabel}/>
			</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#ethnic-info"
						aria-expanded="false"
						aria-controls="ethnic-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Ethnic group<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="ethnic-info">
						<div class="card card-body">
							Person’s ethnic group as declared in the Census. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["ethnic", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
			</div>
		{/if}

		{#if health}
		<div style="grid-column: span {cols};">
				<h2>
					Health & Care <span class="title-inset muted"
						>{place.name} - Census 2021</span
					>
				</h2>
		</div>
		<div class="grid mt" bind:clientWidth={w}>
					<div class="div-grey-box">
						<div
							class="row"
							style="display: flex; cursor: pointer;"
							data-bs-toggle="collapse"
							data-bs-target="#gen-health-info"
							aria-expanded="false"
							aria-controls="gen-health"
						>
							<div
								class="blocktitle"
								style="margin: 0; width: 100%"
							>
								General health<span
									style="color: gray; font-size: 14pt;"
									>{@html " &#x24D8; "}</span
								><br>
							</div>
						</div>
						<div class="collapse" id="gen-health-info">
							<div class="card card-body">
								General health is a self-assessment of a
								person’s general state of health. It is not
								based over any specified period of time.
								<a
									href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
									><strong>Statistical bulletins</strong></a
								>
							</div>
						</div>
						<StackedBarChart
							data={place &&
								makeData(["general_health", "perc", "2021"])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
							label={chartLabel}
						/>
					</div>
					<div class="div-grey-box">
						<div
							class="row"
							style="display: flex; cursor: pointer;"
							data-bs-toggle="collapse"
							data-bs-target="#lti-info"
							aria-expanded="false"
							aria-controls="lti-info"
						>
							<div
								class="blocktitle"
								style="font-size: 0.90em; margin: 0; width: 100%"
							>
								Long-term health problem or disability<span
									style="color: gray; font-size: 14pt;"
									>{@html " &#x24D8; "}</span
								>
							</div>
						</div>
						<div class="collapse" id="lti-info">
							<div class="card card-body">
								A self-assessment of whether a person has a long-term health problem or disability that limits daily activities and which has lasted, or is expected to last, at least 12 months. It includes problems that are due to old age. <a
									href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
									><strong>Statistical bulletins</strong></a
								>
							</div>
						</div>
						<StackedBarChart
							data={place &&
								makeData([
									"long_term_disability",
									"perc",
									"2021",
								])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
							label={chartLabel}
						/>
					</div>
					<div class="div-grey-box">
						<div
							class="row"
							style="display: flex; cursor: pointer;"
							data-bs-toggle="collapse"
							data-bs-target="#lt-cond-info"
							aria-expanded="false"
							aria-controls="lt-cond-info"
						>
							<div
								class="blocktitle"
								style="font-size: 1.02em; margin: 0; width: 100%"
							>
								Long-term health conditions<span
									style="color: gray; font-size: 14pt;"
									>{@html " &#x24D8; "}</span
								><br>
							</div>
						</div>
						<div class="collapse" id="lt-cond-info">
							<div class="card card-body">
								A self-assessment of whether a person has a long-term health condition that has lasted, or is expected to last, at least 12 months. Examples include, but are not limited to, deafness or partial hearing loss, mobility or dexterity difficulty that requires the use of a wheelchair, and intellectual or learning disability.
						<a
									href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
									><strong>Statistical bulletins</strong></a
								>
							</div>
						</div>
						<StackedBarChart
							data={place &&
								makeData([
									"number_of_long_term_health",
									"perc",
									"2021",
								])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
							label={chartLabel}
						/>
					</div>
					<div class="div-grey-box">
						<div
							class="row"
							style="display: flex; cursor: pointer;"
							data-bs-toggle="collapse"
							data-bs-target="#unpaid-info"
							aria-expanded="false"
							aria-controls="unpaid-info"
						>
							<div
								class="blocktitle"
								style="font-size: 1.02em; margin: 0; width: 100%"
							>
								Unpaid care<span
									style="color: gray; font-size: 14pt;"
									>{@html " &#x24D8; "}</span
								>
							</div>
						</div>
						<div class="collapse" id="unpaid-info">
							<div class="card card-body">
								'Unpaid care' covers looking after, giving help
								or support to anyone because they have long-term
								physical or mental health conditions or
								illnesses, or problems related to old age. It
								does not include any activities as part of paid
								employment. All unpaid care statistics are restricted to persons aged 5 and over.
								<a
									href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
									><strong>Statistical bulletins</strong></a
								>
							</div>
						</div>
						<StackedBarChart
							data={place &&
								makeData(["provision_care", "perc", "2021"])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
							label={chartLabel}
						/>
					</div>
				</div>
		{/if}

		{#if housing}
			<div style="grid-column: span {cols};">
				<h2>
					Housing & Accommodation <span
						class="title-inset muted"
					>
						{place.name} - Census 2021
					</span>
				</h2>
			</div>

			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#acc-type-info"
						aria-expanded="false"
						aria-controls="acc-type-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Accommodation type<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="acc-type-info">
						<div class="card card-body">
							The type of accommodation occupied by a household. <a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place &&
							makeData(["accommodation_type", "perc", "2021"])}
						zKey={noCompare ? null : 
						overtime ? "prev" : 
						!overtime && place.type != "ew" ? "ew" : 
						null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#adapt-info"
						aria-expanded="false"
						aria-controls="adapt-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Household adaptations<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="adapt-info">
						<div class="card card-body">
							Household accommodation that has been adapted or designed for one or more of the following: internal wheelchair usage; external wheelchair access; other physical or mobility difficulties; visual difficulties; hearing difficulties; or other.
							<a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place &&
							makeData(["number_of_adaptations", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#heat-info"
						aria-expanded="false"
						aria-controls="heat-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Central heating<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="heat-info">
						<div class="card card-body">
							Central heating is a central system that generates heat for multiple rooms. It is classified by fuel type.
							<a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place &&
							makeData(["central_heating", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#renew-info"
						aria-expanded="false"
						aria-controls="renew-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Renewable energy systems<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="renew-info">
						<div class="card card-body">
							Renewable energy systems used to generate heat or energy for a household. Examples include: solar panels for electricity; solar panels for heating water; biomass and wind turbines.
							<a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart_nocomparator
						data={place &&
							makeData(["renewable_energy", "perc", "2021"])}
						zKey={!noCompare && !overtime && place.type != "ew" ? "ew"
							: null}
						label={chartLabel}
						ovrtm={overtime}
					/>
				</div>

				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#tenure-info"
						aria-expanded="false"
						aria-controls="tenure-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Household tenure<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="tenure-info">
						<div class="card card-body">
							Whether a household owns or rents its accommodation and, if rented, who the landlord is. 
							<a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["hh_tenure", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>

				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#car-info"
						aria-expanded="false"
						aria-controls="car-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Car or van availability<span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="car-info">
						<div class="card card-body">
							The number of cars or vans that are owned, or
							available for use, by members of a household. It
							includes company cars and vans that are available
							for private use.
							<a
								href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
								><strong>Statistical bulletins</strong></a
							>
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["car_or_van", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>
			</div>
		{/if}

		
	{/if}
</Section>

<style>
	a {
		color: rgb(0, 60, 87);
	}
	h3 {
		margin-top: 12px;
	}
	h2 {
		margin-top: 20px;
		page-break-before: always;
	}

	.div-grey-box {
		line-height: 1.78;
		overflow: hidden;
		box-shadow: 0 2px #4140424d;
		background-color: #f5f5f6;
		padding: 16px 16px;
	}
	.btn {
		padding: 2px 4px;
		margin: 0.2;
		border: 2px solid #00205b;
		cursor: pointer;
		color: #00205b;
		background-color: lightgrey;
	}
	.btn-active {
		color: white;
		background-color: #00205b;
	}
	.increase {
		color: darkgreen;
	}
	.increase::before {
		content: "▲";
		color: darkgreen;
	}
	.decrease {
		color: darkred;
	}
	.decrease::before {
		content: "▼";
		color: darkred;
	}
	.nochange {
		font-size: 0.85em;
		color: grey;
	}
	.line {
		background-color: #cedc20;
		width: 25px;
		height: 4px;
		display: inline-block;
		margin-bottom: 3px;
	}
	.title {
		display: inline-block;
		margin-top: -3px;
	}
	.text-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
	.inline {
		display: inline-block;
	}
	.condensed {
		line-height: 1.1em;
	}
	.mt {
		margin-top: 20px;
	}
	.mts {
		margin-top: 10px;
	}
	.mtl {
		margin-top: 55px;
	}
	.mbs {
		margin-bottom: 10px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
		page-break-inside: avoid;
	}
	.title-inset {
		font-weight: normal;
		font-size: 13.6px;
	}
	#grid {
		grid-gap: 20px !important;
	}
	.chart {
		position: relative;
		width: 100%;
	}
	#map {
		grid-row: span 2;
		min-height: 400px;
	}

	.tooltip {
		position: relative;
		display: inline-block;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 120px;
		background-color: #666666;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		padding: 5px 0;
		bottom: 100%;
		right: 100%;
		font-size: 12pt;

		/* Position the tooltip */
		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}

	.collapse:not(.show) {
		display: none;
	}
	.collapsing {
		height: 0;
		overflow: hidden;
		transition: height 0.35s ease;
	}

	.show {
		display: block !important;
	}

	.card {
		--bs-card-spacer-y: 0.1rem;
		--bs-card-spacer-x: 0.5rem;
		--bs-card-title-spacer-y: 0.5rem;
		--bs-card-border-width: 1px;
		--bs-card-border-color: var(--bs-border-color-translucent);
		--bs-card-border-radius: 0.375rem;
		--bs-card-box-shadow: ;
		--bs-card-inner-border-radius: calc(0.375rem - 1px);
		--bs-card-cap-padding-y: 0.5rem;
		--bs-card-cap-padding-x: 1rem;
		--bs-card-cap-bg: rgba(0, 0, 0, 0.03);
		--bs-card-cap-color: ;
		--bs-card-height: ;
		--bs-card-color: ;
		--bs-card-bg: #fff;
		--bs-card-img-overlay-padding: 1rem;
		--bs-card-group-margin: 0.75rem;
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: var(--bs-card-height);
		word-wrap: break-word;
		background-color: var(--bs-card-bg);
		background-clip: border-box;
		border: var(--bs-card-border-width) solid var(--bs-card-border-color);
		border-radius: var(--bs-card-border-radius);
	}

	.card-body {
		flex: 1 1 auto;
		padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
		color: var(--bs-card-color);
		font-size: 10pt;
		margin-bottom: 5px;
	}


	.blockinfoicon {
		font-size: 14pt;
	}

	@media print {
		.highlited {
			color: red !important;
			-webkit-print-color-adjust: exact;
		}
	}

	/* manual override for black svg icons that filters them to a specified colour */
	.filter-navy {
		filter: invert(12%) sepia(78%) saturate(1934%) hue-rotate(204deg)
			brightness(91%) contrast(110%);
	}
</style>
