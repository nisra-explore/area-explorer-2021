// getData is a function in utils.js that goes to a url input and looks for a return of csv data
import { getData, adjectify } from "$lib/utils";
// a constant with 3 string app_inputs, search_data - the places.csv, app_json_data - json files for each area code (accessed via app_inputs.app_json_data),
// quantiles - not sure but not used in index currently
import { app_inputs,
         geog_types
} from "$lib/config";

// create a reference to the json for the current area to be loaded - called in the load() func below
async function loadArea(code, fetch) {
    let res = await fetch(app_inputs.app_json_data + code + ".json");
    let json = await res.json();
    
    return json;
}

export async function load({ params, fetch }) {
    let code = params.code;

    let res = await getData(app_inputs.search_data, fetch);

    let lookup = {};
    res.forEach((d) => (lookup[d.code] = d.name));
    res.forEach((d) => {
        d.typepl = geog_types[d.type].pl;
        d.typenm = geog_types[d.type].name;
        //		  
        // d.typestr = lookup[d.parent]
        //          ? `${lookup[d.parent]} includes ${types[d.type].name} within ${lookup[d.parent]}`
        //         : '';
        d.typestr = lookup[d.parent]
            ? `${geog_types[d.type].name} within ${lookup[d.parent]}`
            : "";
    });

    let search_data = res.sort((a, b) => a.name.localeCompare(b.name));
    let ni = await loadArea("N92000002", fetch);
    let place = await loadArea(code, fetch);

    return {
        search_data, place, ni
    };
}