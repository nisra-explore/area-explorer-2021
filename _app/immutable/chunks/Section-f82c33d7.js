import{S as m,i as f,s as g,O as y,l as _,m as u,n as b,h as d,p,q as c,b as v,I,Q as w,R as k,T as S,f as N,t as C,K as O}from"./index-50f9e43e.js";const B={light:{name:"light",text:"#222",muted:"#777",pale:"#f0f0f0",background:"#fff"},dark:{name:"dark",text:"#fff",muted:"#bbb",pale:"#333",background:"#222"}},L={options:"https://datavis.nisra.gov.uk/techlab/drpvze/places_2001.csv",places:"https://datavis.nisra.gov.uk/techlab/drpvze/",base:"https://explore.nisra.gov.uk/area-explorer-2021/"},U={dea:{name:"District Electoral Area",pl:"District Electoral Areas"},town:{name:"settlement",pl:"Settlement"},lgd:{name:"Local Government District",pl:"Districts"},postcode:{name:"postcode",pl:"postcode"},ctry:{name:"Country",pl:"Countries"}},x={age:[{code:"a0to14",label:"0-14"},{code:"a15to39",label:"15-39"},{code:"a40to64",label:"40-64"},{code:"a65plus",label:"65+"}],cob:[{code:"northern_ireland",label:"Northern Ireland"},{code:"england",label:"England"},{code:"scotland",label:"Scotland"},{code:"wales",label:"Wales"},{code:"republic_of_ireland",label:"Republic of Ireland"},{code:"other_cob",label:"Other countries"}],mainlang:[{code:"english",label:"English"},{code:"other_languages",label:"Other languages"}],irish:[{code:"no_ability_in_irish",label:"No ability in Irish"},{code:"some_ability_in_irish",label:"Some ability in Irish"}],ulster:[{code:"no_ability_in_ulsterscots",label:"No ability in Ulster-Scots"},{code:"some_ability_in_ulsterscots",label:"Some ability in Ulster-Scots"}],ethnic:[{code:"white",label:"White"},{code:"other_ethnic",label:"Other ethnic groups"}],natid:[{code:"british_only",label:"British only"},{code:"irish_only",label:"Irish only"},{code:"northern_irish_only",label:"Northern Irish only"},{code:"british_and_irish_only",label:"British & Irish only"},{code:"british_and_northern_irish_only",label:"British & Northern Irish only"},{code:"irish_and_northern_irish_only",label:"Irish & Northern Irish only"},{code:"british_irish_and_northern_irish_only",label:"British, Irish & Northern Irish only"},{code:"other_natid",label:"Other national identities"}],religion:[{code:"catholic",label:"Catholic"},{code:"presbyterian_church_in_ireland",label:"Presbyterian"},{code:"church_of_ireland",label:"Church of Ireland"},{code:"methodist_church_in_ireland",label:"Methodist"},{code:"other_christian_including_christian_related",label:"Other Christian religions"},{code:"other_religions",label:"Other religions"},{code:"no_religion_or_religion_not_stated",label:"No religion/Not stated"}],religion_or_religion_brought_up_in:[{code:"catholic",label:"Catholic"},{code:"protestant_and_other_christian_including_christian_related",label:"Protestant & other Christian religions"},{code:"other_religions",label:"Other religions"},{code:"none",label:"None"}],passport:[{code:"united_kingdom_only",label:"UK only"},{code:"ireland_only",label:"Ireland only"},{code:"united_kingdom_and_ireland_only",label:"UK & Ireland"},{code:"other_passports",label:"Other passport(s)"},{code:"no_passport",label:"No passport"}],hh_size:[{code:"one_person",label:"1 person"},{code:"two_people",label:"2 people"},{code:"three_people",label:"3 people"},{code:"four_people",label:"4 people"},{code:"five_people",label:"5 or more people"}],households:[{code:"all_households"}],population:[{code:"females",label:"Females"},{code:"males",label:"Males"}]},K="https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json",P={crd:{id:"crd",promoteId:"areacd",type:"vector",url:"https://raw.githubusercontent.com/nisra-explore/map_tiles/main/lgd2012/{z}/{x}/{y}.pbf",maxzoom:12},dea:{id:"dea",promoteId:"areacd",type:"vector",url:"https://raw.githubusercontent.com/nisra-explore/map_tiles/main/dea/{z}/{x}/{y}.pbf",minzoom:6,maxzoom:12}},q={lgd:{source:"crd",sourceLayer:"lgd2012",code:"areacd",name:"areanm"},dea:{source:"dea",sourceLayer:"dea",code:"areacd",name:"areanm"}},A={fill:{"fill-color":"rgba(255,255,255,0)","fill-opacity":0},line:{"line-color":"rgba(255,255,255,0)","line-width":1,"line-opacity":0},"fill-active":{"fill-color":["case",["==",["feature-state","selected"],!0],"rgba(255,255,255,0)","grey"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,["!=",["feature-state","selected"],!0],.1,0]},"fill-self":{"fill-color":["case",["==",["feature-state","selected"],!0],"rgb(17,140,123)","grey"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,.1]},"fill-child":{"fill-color":["case",["==",["feature-state","highlighted"],!0],"rgb(17,140,123)","rgba(255,255,255,0)"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,["==",["feature-state","highlighted"],!0],.1,0]},"line-active":{"line-color":["case",["==",["feature-state","selected"],!0],"rgb(17,140,123)","grey"],"line-width":2,"line-opacity":1},"line-self":{"line-color":"rgb(17,140,123)","line-width":2,"line-opacity":["case",["==",["feature-state","selected"],!0],1,0]},"line-child":{"line-color":"rgb(17,140,123)","line-width":1,"line-opacity":["case",["==",["feature-state","highlighted"],!0],1,0]}};function z(i){let l,a,s,o;const n=i[3].default,t=y(n,i,i[2],null);return{c(){l=_("section"),a=_("div"),t&&t.c(),this.h()},l(e){l=u(e,"SECTION",{style:!0});var r=b(l);a=u(r,"DIV",{class:!0});var h=b(a);t&&t.l(h),h.forEach(d),r.forEach(d),this.h()},h(){p(a,"class",s="col-"+(i[1]=="wide"?"wide":i[1]=="narrow"?"narrow":"medium")),c(l,"color",i[0].text),c(l,"background-color",i[0].background)},m(e,r){v(e,l,r),I(l,a),t&&t.m(a,null),o=!0},p(e,[r]){t&&t.p&&(!o||r&4)&&w(t,n,e,e[2],o?S(n,e[2],r,null):k(e[2]),null),(!o||r&2&&s!==(s="col-"+(e[1]=="wide"?"wide":e[1]=="narrow"?"narrow":"medium")))&&p(a,"class",s),(!o||r&1)&&c(l,"color",e[0].text),(!o||r&1)&&c(l,"background-color",e[0].background)},i(e){o||(N(t,e),o=!0)},o(e){C(t,e),o=!1},d(e){e&&d(l),t&&t.d(e)}}}function E(i,l,a){let{$$slots:s={},$$scope:o}=l,{theme:n=O("theme")}=l,{column:t="medium"}=l;return i.$$set=e=>{"theme"in e&&a(0,n=e.theme),"column"in e&&a(1,t=e.column),"$$scope"in e&&a(2,o=e.$$scope)},[n,t,o,s]}class M extends m{constructor(l){super(),f(this,l,E,z,g,{theme:0,column:1})}}export{M as S,U as a,K as b,x as c,A as d,P as e,q as m,B as t,L as u};