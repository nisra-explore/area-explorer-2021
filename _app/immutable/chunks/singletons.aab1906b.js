import{u as p,s as I,C as x,B as T,X as O}from"./scheduler.5192e747.js";import{a as U}from"./paths.251b6b96.js";const f=[];function L(e,t){return{subscribe:b(e,t).subscribe}}function b(e,t=p){let n;const r=new Set;function o(s){if(I(e,s)&&(e=s,n)){const l=!f.length;for(const i of r)i[1](),f.push(i,e);if(l){for(let i=0;i<f.length;i+=2)f[i][0](f[i+1]);f.length=0}}}function c(s){o(s(e))}function a(s,l=p){const i=[s,l];return r.add(i),r.size===1&&(n=t(o,c)||p),s(e),()=>{r.delete(i),r.size===0&&n&&(n(),n=null)}}return{set:o,update:c,subscribe:a}}function q(e,t,n){const r=!Array.isArray(e),o=r?[e]:e;if(!o.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const c=t.length<2;return L(n,(a,s)=>{let l=!1;const i=[];let _=0,g=p;const m=()=>{if(_)return;g();const u=t(r?i[0]:i,a,s);c?a(u):g=O(u)?u:p},R=o.map((u,h)=>x(u,S=>{i[h]=S,_&=~(1<<h),l&&m()},()=>{_|=1<<h}));return l=!0,m(),function(){T(R),g(),l=!1}})}const N="1727706390676",B="sveltekit:snapshot",C="sveltekit:scroll",K="sveltekit:index",v={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},k=location.origin;function X(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function $(){return{x:pageXOffset,y:pageYOffset}}function d(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const y={...v,"":v.hover};function A(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function z(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=A(e)}}function D(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,o=!n||!!r||V(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),c=(n==null?void 0:n.origin)===k&&e.hasAttribute("download");return{url:n,external:o,target:r,download:c}}function G(e){let t=null,n=null,r=null,o=null,c=null,a=null,s=e;for(;s&&s!==document.documentElement;)r===null&&(r=d(s,"preload-code")),o===null&&(o=d(s,"preload-data")),t===null&&(t=d(s,"keepfocus")),n===null&&(n=d(s,"noscroll")),c===null&&(c=d(s,"reload")),a===null&&(a=d(s,"replacestate")),s=A(s);function l(i){switch(i){case"":case"true":return!0;case"off":case"false":return!1;default:return null}}return{preload_code:y[r??"off"],preload_data:y[o??"off"],keep_focus:l(t),noscroll:l(n),reload:l(c),replace_state:l(a)}}function w(e){const t=b(e);let n=!0;function r(){n=!0,t.update(a=>a)}function o(a){n=!1,t.set(a)}function c(a){let s;return t.subscribe(l=>{(s===void 0||n&&l!==s)&&a(s=l)})}return{notify:r,set:o,subscribe:c}}function P(){const{set:e,subscribe:t}=b(!1);let n;async function r(){clearTimeout(n);try{const o=await fetch(`${U}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!o.ok)return!1;const a=(await o.json()).version!==N;return a&&(e(!0),clearTimeout(n)),a}catch{return!1}}return{subscribe:t,check:r}}function V(e,t){return e.origin!==k||!e.pathname.startsWith(t)}let E;function H(e){E=e.client}function W(e){return(...t)=>E[e](...t)}const F={url:w({}),page:w({}),navigating:b(null),updated:P()};export{K as I,v as P,C as S,B as a,D as b,G as c,F as d,H as e,z as f,X as g,W as h,V as i,q as j,k as o,$ as s,b as w};
