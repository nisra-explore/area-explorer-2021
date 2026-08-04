import { getData } from "$lib/utils";
import { app_inputs, geog_types } from "$lib/config";

async function loadArea(code, fetch) {
    const response = await fetch(`${app_inputs.app_json_data}${code}.json`);
    return response.json();
}

export async function load({ params, fetch }) {
    const results = await getData(app_inputs.search_data, fetch);

    const lookup = {};

    results.forEach((item) => {
        lookup[item.code] = item.name;
    });

    results.forEach((item) => {
        item.typepl = geog_types[item.type].pl;
        item.typenm = geog_types[item.type].name;
        item.typestr = lookup[item.parent]
            ? `${geog_types[item.type].name} within ${lookup[item.parent]}`
            : "";
    });

    const search_data = results.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const ni = await loadArea("N92000002", fetch);
    const place = await loadArea(params.code, fetch);

    return {
        search_data,
        place,
        ni
    };
}