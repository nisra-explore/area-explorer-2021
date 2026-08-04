<script>
  import { onMount } from 'svelte';
	import { setContext } from "svelte";
  import "../app.css";
	import { themes } from "$lib/config";
	import Warning from "$lib/ui/Warning.svelte";
	import NISRAHeader from "$lib/layout/NISRAHeader.svelte";
	import NISRAFooter from "$lib/layout/NISRAFooter.svelte";
  import AnalyticsBanner from "$lib/layout/AnalyticsBanner.svelte"
  import { initCookieConsent } from "$lib/cookies";
  
  // STYLE CONFIG
  // Set theme globally (options are 'light' or 'dark')
  let theme = "light";
  setContext("theme", themes[theme]);

  // GOOGLE ANALYTICS
  // Settings for page analytics. Values must be shared with <AnalyticsBanner> component
  const analyticsId = "GTM-WKK8ZWP";
  const analyticsProps = {
    "contentTitle": "Northern Ireland Census Area Explorer",
    "releaseDate": "20220823",
    "contentType": "exploratory"
  };

  onMount(() => {
    initCookieConsent({
      bannerId: 'cookie-banner',
      gtmId: 'GTM-WKK8ZWP',
      cookieDomain: window.location.hostname
    });
  });

</script>

<svelte:head>
<link rel="icon" href="https://www.nisra.gov.uk/sites/nisra.gov.uk/themes/nisra_theme/favicon.ico" /> 

</svelte:head>

 <div id="cookie-banner"></div>

<AnalyticsBanner {analyticsId} {analyticsProps}/>

<Warning/>
<NISRAHeader/>

<slot/>

<NISRAFooter/>