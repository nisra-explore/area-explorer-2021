function T(){}function V(t,e){for(const n in e)t[n]=e[n];return t}function W(t){return t()}function D(){return Object.create(null)}function x(t){t.forEach(W)}function q(t){return typeof t=="function"}function gt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let w;function xt(t,e){return w||(w=document.createElement("a")),w.href=e,t===w.href}function X(t){return Object.keys(t).length===0}function Y(t,...e){if(t==null)return T;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function bt(t,e,n){t.$$.on_destroy.push(Y(e,n))}function $t(t,e,n,i){if(t){const r=G(t,e,n,i);return t[0](r)}}function G(t,e,n,i){return t[1]&&i?V(n.ctx.slice(),t[1](i(e))):n.ctx}function wt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const c=[],s=Math.max(e.dirty.length,r.length);for(let l=0;l<s;l+=1)c[l]=e.dirty[l]|r[l];return c}return e.dirty|r}return e.dirty}function Et(t,e,n,i,r,c){if(r){const s=G(e,n,i,c);t.p(s,r)}}function vt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Tt(t){return t??""}function Nt(t,e,n){return t.set(n),e}let N=!1;function Z(){N=!0}function tt(){N=!1}function et(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function nt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let u=0;u<e.length;u++){const f=e[u];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let o=0;o<e.length;o++){const u=e[o].claim_order,f=(r>0&&e[n[r]].claim_order<=u?r+1:et(1,r,$=>e[n[$]].claim_order,u))-1;i[o]=n[f]+1;const a=f+1;n[a]=o,r=Math.max(a,r)}const c=[],s=[];let l=e.length-1;for(let o=n[r]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)s.push(e[l]);l--}for(;l>=0;l--)s.push(e[l]);c.reverse(),s.sort((o,u)=>o.claim_order-u.claim_order);for(let o=0,u=0;o<s.length;o++){for(;u<c.length&&s[o].claim_order>=c[u].claim_order;)u++;const f=u<c.length?c[u]:null;t.insertBefore(s[o],f)}}function it(t,e){t.appendChild(e)}function rt(t,e){if(N){for(nt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function st(t,e,n){t.insertBefore(e,n||null)}function ot(t,e,n){N&&!n?rt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function y(t){t.parentNode&&t.parentNode.removeChild(t)}function At(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function S(t){return document.createElement(t)}function R(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function L(t){return document.createTextNode(t)}function Ct(){return L(" ")}function kt(){return L("")}function P(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Mt(t){return function(e){return e.preventDefault(),t.call(this,e)}}function St(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function ct(t){return Array.from(t.childNodes)}function F(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function I(t,e,n,i,r=!1){F(t);const c=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r||(t.claim_info.last_index=s),l}}for(let s=t.claim_info.last_index-1;s>=0;s--){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function J(t,e,n,i){return I(t,r=>r.nodeName===e,r=>{const c=[];for(let s=0;s<r.attributes.length;s++){const l=r.attributes[s];n[l.name]||c.push(l.name)}c.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Lt(t,e,n){return J(t,e,n,S)}function jt(t,e,n){return J(t,e,n,R)}function lt(t,e){return I(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>L(e),!0)}function Ht(t){return lt(t," ")}function z(t,e,n){for(let i=n;i<t.length;i+=1){const r=t[i];if(r.nodeType===8&&r.textContent.trim()===e)return i}return t.length}function Dt(t,e){const n=z(t,"HTML_TAG_START",0),i=z(t,"HTML_TAG_END",n);if(n===i)return new B(void 0,e);F(t);const r=t.splice(n,i-n+1);y(r[0]),y(r[r.length-1]);const c=r.slice(1,r.length-1);for(const s of c)s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new B(c,e)}function Pt(t,e){e=""+e,t.data!==e&&(t.data=e)}function zt(t,e){t.value=e??""}function Bt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let E;function ut(){if(E===void 0){E=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{E=!0}}return E}function Ot(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=S("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=ut();let c;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=P(window,"message",s=>{s.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=P(i.contentWindow,"resize",e),e()}),it(t,i),()=>{(r||c&&i.contentWindow)&&c(),y(i)}}function Wt(t,e,n){t.classList[n?"add":"remove"](e)}function at(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function qt(t,e){const n=[];let i=0;for(const r of e.childNodes)if(r.nodeType===8){const c=r.textContent.trim();c===`HEAD_${t}_END`?(i-=1,n.push(r)):c===`HEAD_${t}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}class ft{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=R(n.nodeName):this.e=S(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)st(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(y)}}class B extends ft{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)ot(this.t,this.n[n],e)}}function Gt(t,e){return new t(e)}let g;function p(t){g=t}function b(){if(!g)throw new Error("Function called outside component initialization");return g}function Rt(t){b().$$.on_mount.push(t)}function Ft(t){b().$$.after_update.push(t)}function It(){const t=b();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const c=at(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,c)}),!c.defaultPrevented}return!0}}function Jt(t,e){return b().$$.context.set(t,e),e}function Kt(t){return b().$$.context.get(t)}const h=[],O=[];let m=[];const C=[],K=Promise.resolve();let k=!1;function Q(){k||(k=!0,K.then(U))}function Qt(){return Q(),K}function M(t){m.push(t)}function Ut(t){C.push(t)}const A=new Set;let _=0;function U(){if(_!==0)return;const t=g;do{try{for(;_<h.length;){const e=h[_];_++,p(e),dt(e.$$)}}catch(e){throw h.length=0,_=0,e}for(p(null),h.length=0,_=0;O.length;)O.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];A.has(n)||(A.add(n),n())}m.length=0}while(h.length);for(;C.length;)C.pop()();k=!1,A.clear(),p(t)}function dt(t){if(t.fragment!==null){t.update(),x(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}function _t(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const v=new Set;let d;function Vt(){d={r:0,c:[],p:d}}function Xt(){d.r||x(d.c),d=d.p}function ht(t,e){t&&t.i&&(v.delete(t),t.i(e))}function Yt(t,e,n,i){if(t&&t.o){if(v.has(t))return;v.add(t),d.c.push(()=>{v.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function Zt(t,e){const n={},i={},r={$$scope:1};let c=t.length;for(;c--;){const s=t[c],l=e[c];if(l){for(const o in s)o in l||(i[o]=1);for(const o in l)r[o]||(n[o]=l[o],r[o]=1);t[c]=l}else for(const o in s)r[o]=1}for(const s in i)s in n||(n[s]=void 0);return n}function te(t){return typeof t=="object"&&t!==null?t:{}}function ee(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function ne(t){t&&t.c()}function ie(t,e){t&&t.l(e)}function mt(t,e,n,i){const{fragment:r,after_update:c}=t.$$;r&&r.m(e,n),i||M(()=>{const s=t.$$.on_mount.map(W).filter(q);t.$$.on_destroy?t.$$.on_destroy.push(...s):x(s),t.$$.on_mount=[]}),c.forEach(M)}function pt(t,e){const n=t.$$;n.fragment!==null&&(_t(n.after_update),x(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function yt(t,e){t.$$.dirty[0]===-1&&(h.push(t),Q(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function re(t,e,n,i,r,c,s,l=[-1]){const o=g;p(t);const u=t.$$={fragment:null,ctx:[],props:c,update:T,not_equal:r,bound:D(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:D(),dirty:l,skip_bound:!1,root:e.target||o.$$.root};s&&s(u.root);let f=!1;if(u.ctx=n?n(t,e.props||{},(a,$,...j)=>{const H=j.length?j[0]:$;return u.ctx&&r(u.ctx[a],u.ctx[a]=H)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](H),f&&yt(t,a)),$}):[],u.update(),f=!0,x(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){Z();const a=ct(e.target);u.fragment&&u.fragment.l(a),a.forEach(y)}else u.fragment&&u.fragment.c();e.intro&&ht(t.$$.fragment),mt(t,e.target,e.anchor,e.customElement),tt(),U()}p(o)}class se{$destroy(){pt(this,1),this.$destroy=T}$on(e,n){if(!q(n))return T;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!X(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ee as $,mt as A,pt as B,rt as C,T as D,Wt as E,Kt as F,xt as G,P as H,Mt as I,x as J,Y as K,$t as L,qt as M,Et as N,vt as O,wt as P,Jt as Q,bt as R,se as S,It as T,zt as U,At as V,M as W,Ot as X,Nt as Y,R as Z,jt as _,Ct as a,B as a0,Dt as a1,Ut as a2,Tt as a3,V as a4,Zt as a5,te as a6,q as a7,ot as b,Ht as c,Yt as d,kt as e,Xt as f,ht as g,y as h,re as i,Ft as j,S as k,Lt as l,ct as m,St as n,Rt as o,Bt as p,L as q,lt as r,gt as s,Qt as t,Pt as u,Vt as v,O as w,Gt as x,ne as y,ie as z};