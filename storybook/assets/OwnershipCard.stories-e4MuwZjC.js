import{a3 as _,n as Y,j as l,m as G,d as j,k as X,r as I,aW as U,aX as Z}from"./iframe-CA0Xqitl.js";import{b as ee,w as D}from"./appWrappers-OMKuIXpb.js";import{u as te}from"./useAsync-BGwS6Vz2.js";import{q as ne}from"./index-Cbylfjtp.js";import{l as J}from"./lodash-Y_-RFQgK.js";import{c as F}from"./api-Bsfaf5B0.js";import"./get-X0uARnFC.js";import{D as S,s as x,p as ie}from"./ref-C0VTUPuL.js";import{g as B,a as ae,R as re,u as se,o as oe,E as K}from"./translation-3I9M1iWN.js";import{S as $}from"./Grid-B8o7JoCY.js";import{B as C}from"./Box-Ds7zC8BR.js";import{c as H}from"./createStyles-Bp4GwXob.js";import{u as le}from"./useRouteRef-DoEb129Q.js";import{P as de}from"./Progress-BMXpV-Rn.js";import{R as ue}from"./ResponseErrorPanel-C2DYRHB9.js";import{O as ce}from"./OverflowTooltip-fsRpIzav.js";import{L as pe}from"./Link-D1vtE7Ac.js";import{L as me}from"./List-BnsnRWJY.js";import{L as he}from"./ListItem-BzxviKme.js";import{L as ge}from"./ListItemText-BwZgc58h.js";import{L as fe,S as ye}from"./Switch-7cMWfa7C.js";import{T as ve}from"./Tooltip-CuEp3aUv.js";import{I as be}from"./InfoCard-CWjsgdCI.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DY424ZJv.js";import"./useIsomorphicLayoutEffect-rHGqqG8J.js";import"./useAnalytics-Bs3aHlE6.js";import"./componentData-CdEqgOPk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-ByTVIOef.js";import"./useApp-DFdkDp9A.js";import"./useMountedState-zGQsXHvo.js";import"./styled-BOzNBejn.js";import"./createStyles-yD3y8ldD.js";import"./LinearProgress-Bwo2YJzI.js";import"./ErrorPanel-xkUPraUn.js";import"./WarningPanel-DyFbjHtf.js";import"./ExpandMore-DfKPiaDM.js";import"./AccordionDetails-BewnNYiP.js";import"./index-B9sM2jn7.js";import"./Collapse-BpZh4zHv.js";import"./MarkdownContent-CWjBFtdf.js";import"./CodeSnippet-BbCr73he.js";import"./CopyTextButton-Bm7dvK1x.js";import"./useCopyToClipboard-B8vbXgZE.js";import"./Divider-Dil931lt.js";import"./ListContext-TMUZkd5u.js";import"./SwitchBase-B3jb_k_h.js";import"./useFormControl-BujB911u.js";import"./Popper-yvDUz_ZU.js";import"./Portal-DUJxNLzx.js";import"./CardContent-CLH9eyHI.js";import"./ErrorBoundary-Brzk20pV.js";import"./LinkButton-mfjqNKAK.js";import"./Button-CbaUxuKj.js";import"./CardHeader-CVthFMjM.js";import"./CardActions-Im4oiJ-Q.js";import"./BottomLink-BPv30Qn0.js";import"./ArrowForward-Di5ER0Ic.js";class we{[ee]="external";id;params;optional;defaultTarget;constructor(a,r,t,i){this.id=a,this.params=r,this.optional=t,this.defaultTarget=i}toString(){return this.#e?`externalRouteRef{id=${this.#e},legacyId=${this.id}}`:`routeRef{type=external,id=${this.id}}`}getDefaultTarget(){return this.defaultTarget}$$type="@backstage/ExternalRouteRef";version="v1";T=void 0;#e=void 0;getParams(){return this.params}getDescription(){return this.#e?this.#e:this.id}setId(a){if(!a)throw new Error("ExternalRouteRef id must be a non-empty string");if(this.#e&&this.#e!==a)throw new Error(`ExternalRouteRef was referenced twice as both '${this.#e}' and '${a}'`);this.#e=a}}function xe(e){return new we(e.id,e.params??[],!!e.optional,e?.defaultTarget)}function $e(e,a){const r=a?.defaultKind;let t,i,o;return"metadata"in e?(t=e.kind,i=e.metadata.namespace,o=e.metadata.name):(t=e.kind,i=e.namespace,o=e.name),(i===void 0||i==="")&&(i=S),a?.defaultNamespace!==void 0?a?.defaultNamespace===i&&(i=void 0):i===S&&(i=void 0),t=t.toLocaleLowerCase("en-US"),t=r.toLocaleLowerCase("en-US")===t?void 0:t,`${t?`${t}:`:""}${i?`${i}/`:""}${o}`}const P=xe({id:"catalog-index",optional:!0,defaultTarget:"catalog.catalogIndex"});function Te(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var q={exports:{}},ke=q.exports,O;function Re(){return O||(O=1,function(e,a){(function(r,t){typeof Te=="function"?e.exports=t():r.pluralize=t()})(ke,function(){var r=[],t=[],i={},o={},d={};function g(n){return typeof n=="string"?new RegExp("^"+n+"$","i"):n}function f(n,s){return n===s?s:n===n.toLowerCase()?s.toLowerCase():n===n.toUpperCase()?s.toUpperCase():n[0]===n[0].toUpperCase()?s.charAt(0).toUpperCase()+s.substr(1).toLowerCase():s.toLowerCase()}function p(n,s){return n.replace(/\$(\d{1,2})/g,function(b,y){return s[y]||""})}function m(n,s){return n.replace(s[0],function(b,y){var v=p(s[1],arguments);return f(b===""?n[y-1]:b,v)})}function c(n,s,b){if(!n.length||i.hasOwnProperty(n))return s;for(var y=b.length;y--;){var v=b[y];if(v[0].test(s))return m(s,v)}return s}function w(n,s,b){return function(y){var v=y.toLowerCase();return s.hasOwnProperty(v)?f(y,v):n.hasOwnProperty(v)?f(y,n[v]):c(v,y,b)}}function h(n,s,b,y){return function(v){var T=v.toLowerCase();return s.hasOwnProperty(T)?!0:n.hasOwnProperty(T)?!1:c(T,T,b)===T}}function u(n,s,b){var y=s===1?u.singular(n):u.plural(n);return(b?s+" ":"")+y}return u.plural=w(d,o,r),u.isPlural=h(d,o,r),u.singular=w(o,d,t),u.isSingular=h(o,d,t),u.addPluralRule=function(n,s){r.push([g(n),s])},u.addSingularRule=function(n,s){t.push([g(n),s])},u.addUncountableRule=function(n){if(typeof n=="string"){i[n.toLowerCase()]=!0;return}u.addPluralRule(n,"$0"),u.addSingularRule(n,"$0")},u.addIrregularRule=function(n,s){s=s.toLowerCase(),n=n.toLowerCase(),d[n]=s,o[s]=n},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["is","are"],["was","were"],["has","have"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["looey","looies"],["thief","thieves"],["groove","grooves"],["pickaxe","pickaxes"],["passerby","passersby"]].forEach(function(n){return u.addIrregularRule(n[0],n[1])}),[[/s?$/i,"s"],[/[^\u0000-\u007F]$/i,"$0"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(n){return u.addPluralRule(n[0],n[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/ies$/i,"y"],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,"$1ie"],[/\b(mon|smil)ies$/i,"$1ey"],[/\b((?:tit)?m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,"$1"],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,"$1sis"],[/(movie|twelve|abuse|e[mn]u)s$/i,"$1"],[/(test)(?:is|es)$/i,"$1is"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(n){return u.addSingularRule(n[0],n[1])}),["adulthood","advice","agenda","aid","aircraft","alcohol","ammo","analytics","anime","athletics","audio","bison","blood","bream","buffalo","butter","carp","cash","chassis","chess","clothing","cod","commerce","cooperation","corps","debris","diabetes","digestion","elk","energy","equipment","excretion","expertise","firmware","flounder","fun","gallows","garbage","graffiti","hardware","headquarters","health","herpes","highjinks","homework","housework","information","jeans","justice","kudos","labour","literature","machinery","mackerel","mail","media","mews","moose","music","mud","manga","news","only","personnel","pike","plankton","pliers","police","pollution","premises","rain","research","rice","salmon","scissors","series","sewage","shambles","shrimp","software","species","staff","swine","tennis","traffic","transportation","trout","tuna","wealth","welfare","whiting","wildebeest","wildlife","you",/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(u.addUncountableRule),u})}(q)),q.exports}var qe=Re();const Ae=_(qe);var E,z;function je(){if(z)return E;z=1;class e{constructor(t){this.value=t,this.next=void 0}}class a{constructor(){this.clear()}enqueue(t){const i=new e(t);this._head?(this._tail.next=i,this._tail=i):(this._head=i,this._tail=i),this._size++}dequeue(){const t=this._head;if(t)return this._head=this._head.next,this._size--,t.value}clear(){this._head=void 0,this._tail=void 0,this._size=0}get size(){return this._size}*[Symbol.iterator](){let t=this._head;for(;t;)yield t.value,t=t.next}}return E=a,E}var L,N;function Ee(){if(N)return L;N=1;const e=je();return L=r=>{if(!((Number.isInteger(r)||r===1/0)&&r>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up");const t=new e;let i=0;const o=()=>{i--,t.size>0&&t.dequeue()()},d=async(p,m,...c)=>{i++;const w=(async()=>p(...c))();m(w);try{await w}catch{}o()},g=(p,m,...c)=>{t.enqueue(d.bind(null,p,m,...c)),(async()=>(await Promise.resolve(),i<r&&t.size>0&&t.dequeue()()))()},f=(p,...m)=>new Promise(c=>{g(p,c,...m)});return Object.defineProperties(f,{activeCount:{get:()=>i},pendingCount:{get:()=>t.size},clearQueue:{value:()=>{t.clear()}}}),f},L}var Le=Ee();const Ce=_(Le),Pe=Ce(5),Ie=(e,a)=>{const{kind:r,type:t}=a,i=e.map(d=>$e(ie(d),{defaultKind:"group"})),o={kind:r.toLocaleLowerCase("en-US"),type:t,owners:i,user:"all"};return ne.stringify({filters:o},{arrayFormat:"repeat"})},Se=e=>[...B(e,re,{kind:"Group"}).map(({kind:t,namespace:i,name:o})=>x({kind:t,namespace:i,name:o})),x(e)],Oe=e=>e!==void 0,M=async(e,a,r=[])=>{const t=B(e,ae,{kind:"Group"}),i=t.length>0,o=x(e);if(i){const d=t.map(c=>x(c)),p=(await Pe(()=>a.getEntitiesByRefs({fields:["kind","metadata.namespace","metadata.name","relations"],entityRefs:d}))).items.filter(Oe).filter(c=>!r.includes(x(c))),m=(await Promise.all(p.map(c=>M(c,a,[...r,o])))).flatMap(c=>c);return J.uniq([...m,o])}return[o]},ze=async(e,a,r)=>{const t=e.kind==="Group",i=a==="aggregated",o=e.kind==="User";return i&&t?M(e,r):i&&o?Se(e):[x(e)]},Ne=e=>new Promise(a=>setTimeout(a,e)),_e=async(e,a,r,t=100,i=100)=>{const o=[];for(let d=0;d<e.length;d+=t){const g=e.slice(d,d+t),f=await r.getEntities({filter:[{kind:a,"relations.ownedBy":g}],fields:["kind","metadata.name","metadata.namespace","spec.type","relations"]});o.push(...f.items),d+t<e.length&&await Ne(i)}return J.uniqBy(o,x)};function Ge(e,a,r,t=6){const i=Y(F),o=r??["Component","API","System"],{loading:d,error:g,value:f}=te(async()=>{const p=await ze(e,a,i);return(await _e(p,o,i)).reduce((h,u)=>{const n=h.find(s=>s.kind===u.kind&&s.type===u.spec?.type);return n?n.count+=1:h.push({kind:u.kind,type:u.spec?.type?.toString(),count:1}),h},[]).sort((h,u)=>u.count-h.count).slice(0,t).map(h=>({counter:h.count,type:h.type,kind:h.kind,queryParams:Ie(p,h)}))},[i,e,a]);return{componentsWithCounters:f,loading:d,error:g}}const Ue=G(e=>H({card:{border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[2],borderRadius:"4px",padding:e.spacing(2),transition:`${e.transitions.duration.standard}ms`,"&:hover":{boxShadow:e.shadows[4]},height:"100%"},bold:{fontWeight:e.typography.fontWeightBold},smallFont:{fontSize:e.typography.body2.fontSize},entityTypeBox:{background:a=>e.getPageTheme({themeId:a.type}).backgroundImage,color:a=>e.getPageTheme({themeId:a.type}).fontColor}}),{name:"PluginOrgComponentsGrid"}),De=({counter:e,type:a,kind:r,url:t})=>{const i=Ue({type:a??r}),o=a??r,d=o.length>10,g=l.jsxs(C,{className:`${i.card} ${i.entityTypeBox}`,display:"flex",flexDirection:"column",alignItems:"center",children:[l.jsx(j,{className:i.bold,variant:"h6",children:e}),l.jsx(C,{sx:{width:"100%",textAlign:"center"},children:l.jsx(j,{className:`${i.bold} ${d&&i.smallFont}`,variant:"h6",children:l.jsx(ce,{text:Ae(o.toLocaleUpperCase("en-US"),e)})})}),a&&l.jsx(j,{variant:"subtitle1",children:r})]});return t?l.jsx(pe,{to:t,variant:"body2",children:g}):g},W=({className:e,entity:a,relationsType:r,relationAggregation:t,entityFilterKind:i,entityLimit:o=6})=>{const d=le(P);if(!r&&!t)throw new Error("The relationAggregation property must be set as an EntityRelationAggregation type.");const{componentsWithCounters:g,loading:f,error:p}=Ge(a,t??r,i,o);return f?l.jsx(de,{}):p?l.jsx(ue,{error:p}):l.jsx($,{container:!0,className:e,children:g?.map(m=>l.jsx($,{item:!0,xs:6,md:6,lg:4,children:l.jsx(De,{counter:m.counter,kind:m.kind,type:m.type,url:d&&`${d()}?${m.queryParams}`})},m.type??m.kind))})};W.__docgenInfo={description:"",methods:[],displayName:"ComponentsGrid",props:{className:{required:!1,tsType:{name:"string"},description:""},entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];
}`,signature:{properties:[{key:"apiVersion",value:{name:"string",required:!0},description:`The version of specification format for this particular entity that
this is written against.`},{key:"kind",value:{name:"string",required:!0},description:"The high level entity type being described."},{key:"metadata",value:{name:"intersection",raw:`JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,elements:[{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},{name:"signature",type:"object",raw:`{
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,signature:{properties:[{key:"uid",value:{name:"string",required:!1},description:`A globally unique ID for the entity.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, but the server is free to reject requests
that do so in such a way that it breaks semantics.`},{key:"etag",value:{name:"string",required:!1},description:`An opaque string that changes for each update operation to any part of
the entity, including metadata.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, and the server will then reject the
operation if it does not match the current stored value.`},{key:"name",value:{name:"string",required:!0},description:`The name of the entity.

Must be unique within the catalog at any given point in time, for any
given namespace + kind pair. This value is part of the technical
identifier of the entity, and as such it will appear in URLs, database
tables, entity references, and similar. It is subject to restrictions
regarding what characters are allowed.

If you want to use a different, more human readable string with fewer
restrictions on it in user interfaces, see the \`title\` field below.`},{key:"namespace",value:{name:"string",required:!1},description:"The namespace that the entity belongs to."},{key:"title",value:{name:"string",required:!1},description:`A display name of the entity, to be presented in user interfaces instead
of the \`name\` property above, when available.

This field is sometimes useful when the \`name\` is cumbersome or ends up
being perceived as overly technical. The title generally does not have
as stringent format requirements on it, so it may contain special
characters and be more explanatory. Do keep it very short though, and
avoid situations where a title can be confused with the name of another
entity, or where two entities share a title.

Note that this is only for display purposes, and may be ignored by some
parts of the code. Entity references still always make use of the \`name\`
property, not the title.`},{key:"description",value:{name:"string",required:!1},description:`A short (typically relatively few words, on one line) description of the
entity.`},{key:"labels",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:"Key/value pairs of identifying information attached to the entity."},{key:"annotations",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:`Key/value pairs of non-identifying auxiliary information attached to the
entity.`},{key:"tags",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1},description:`A list of single-valued strings, to for example classify catalog entities in
various ways.`},{key:"links",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;

  /**
   * An optional value to categorize links into specific groups
   */
  type?: string;
}`,signature:{properties:[{key:"url",value:{name:"string",required:!0},description:"The url to the external site, document, etc."},{key:"title",value:{name:"string",required:!1},description:"An optional descriptive title for the link."},{key:"icon",value:{name:"string",required:!1},description:"An optional semantic key that represents a visual icon."},{key:"type",value:{name:"string",required:!1},description:"An optional value to categorize links into specific groups"}]}}],raw:"EntityLink[]",required:!1},description:"A list of external hyperlinks related to the entity."}]}}],required:!0},description:"Metadata related to the entity."},{key:"spec",value:{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},description:"The specification data describing the entity itself."},{key:"relations",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The entity ref of the target of this relation.
   */
  targetRef: string;
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"6",computed:!1}}}};const Je=G(e=>H({card:{maxHeight:"100%"},cardContent:{display:"flex",flexDirection:"column",overflow:"hidden"},list:{[e.breakpoints.down("xs")]:{padding:"0 0 12px"}},listItemText:{[e.breakpoints.down("xs")]:{paddingRight:0,paddingLeft:0}},listItemSecondaryAction:{[e.breakpoints.down("xs")]:{width:"100%",top:"auto",right:"auto",position:"relative",transform:"unset"}},grid:{overflowY:"auto",marginTop:0},box:{overflowY:"auto",padding:e.spacing(0,1,1),margin:e.spacing(0,-1)}}),{name:"PluginOrgOwnershipCard"}),A=e=>{const{variant:a,entityFilterKind:r,hideRelationsToggle:t,entityLimit:i=6,maxScrollHeight:o}=e,d=e.relationAggregation??e.relationsType,g=t===void 0?!1:t,f=a!=="fullHeight"?o:void 0,p=Je(),{entity:m}=se(),{t:c}=X(oe),w=m.kind==="User"?"aggregated":"direct",[h,u]=I.useState(d??w);return I.useEffect(()=>{d||u(w)},[u,w,d]),l.jsxs(be,{title:c("ownershipCard.title"),variant:a,className:p.card,cardClassName:p.cardContent,children:[!g&&l.jsx(me,{dense:!0,children:l.jsxs(he,{className:p.list,children:[l.jsx(ge,{className:p.listItemText}),l.jsxs(fe,{className:p.listItemSecondaryAction,children:[c("ownershipCard.aggregateRelationsToggle.directRelations"),l.jsx(ve,{placement:"top",arrow:!0,title:c(h==="direct"?"ownershipCard.aggregateRelationsToggle.directRelations":"ownershipCard.aggregateRelationsToggle.aggregatedRelations"),children:l.jsx(ye,{color:"primary",checked:h!=="direct",onChange:()=>{u(h==="direct"?"aggregated":"direct")},name:"pin",inputProps:{"aria-label":c("ownershipCard.aggregateRelationsToggle.ariaLabel")}})}),c("ownershipCard.aggregateRelationsToggle.aggregatedRelations")]})]})}),l.jsx(C,{maxHeight:f,className:p.box,children:l.jsx(W,{className:p.grid,entity:m,entityLimit:i,relationAggregation:h,entityFilterKind:r})})]})};A.__docgenInfo={description:"@public",methods:[],displayName:"OwnershipCard",props:{variant:{required:!1,tsType:{name:"union",raw:"'flex' | 'fullHeight' | 'gridItem'",elements:[{name:"literal",value:"'flex'"},{name:"literal",value:"'fullHeight'"},{name:"literal",value:"'gridItem'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},hideRelationsToggle:{required:!1,tsType:{name:"boolean"},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:""},maxScrollHeight:{required:!1,tsType:{name:"string"},description:""}}};const en={title:"Plugins/Org/Ownership Card",component:A},V={apiVersion:"backstage.io/v1alpha1",kind:"Group",metadata:{name:"team-a",description:"Team A"},spec:{profile:{displayName:"Team A",email:"team-a@example.com",picture:"https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4"},type:"group",children:[]}},Fe=({type:e,name:a})=>({apiVersion:"backstage.io/v1alpha1",kind:"Component",metadata:{name:a},spec:{type:e},relations:[{type:"ownedBy",targetRef:"group:default/team-a",target:{namespace:"default",kind:"group",name:"team-a"}}]}),Be=["service","website","api","playlist","grpc","trpc","library"],Ke=Be.map((e,a)=>Fe({type:e,name:`${e}-${a}`})),He={getEntities:()=>Promise.resolve({items:Ke})},Q=Z.from([F,He]),k=()=>D(l.jsx(U,{apis:Q,children:l.jsx(K,{entity:V,children:l.jsx($,{container:!0,spacing:4,children:l.jsx($,{item:!0,xs:12,md:6,style:{maxHeight:320,overflow:"hidden"},children:l.jsx(A,{})})})})}),{mountedRoutes:{"/catalog":P}}),R={argTypes:{entityLimit:{control:{type:"number"}}},render:({entityLimit:e})=>D(l.jsx(U,{apis:Q,children:l.jsx(K,{entity:V,children:l.jsx($,{container:!0,spacing:4,children:l.jsx($,{item:!0,xs:12,md:6,children:l.jsx(A,{entityLimit:e})})})})}),{mountedRoutes:{"/catalog":P}})};k.__docgenInfo={description:"",methods:[],displayName:"Default"};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`() => wrapInTestApp(<ApiProvider apis={apis}>
      <EntityProvider entity={defaultEntity}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} style={{
        maxHeight: 320,
        overflow: 'hidden'
      }}>
            <OwnershipCard />
          </Grid>
        </Grid>
      </EntityProvider>
    </ApiProvider>, {
  mountedRoutes: {
    '/catalog': catalogIndexRouteRef
  }
})`,...k.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  argTypes: {
    entityLimit: {
      control: {
        type: 'number'
      }
    }
  },
  render: ({
    entityLimit
  }: {
    entityLimit: number;
  }) => wrapInTestApp(<ApiProvider apis={apis}>
        <EntityProvider entity={defaultEntity}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <OwnershipCard entityLimit={entityLimit} />
            </Grid>
          </Grid>
        </EntityProvider>
      </ApiProvider>, {
    mountedRoutes: {
      '/catalog': catalogIndexRouteRef
    }
  })
}`,...R.parameters?.docs?.source}}};const tn=["Default","WithVariableEntityList"];export{k as Default,R as WithVariableEntityList,tn as __namedExportsOrder,en as default};
