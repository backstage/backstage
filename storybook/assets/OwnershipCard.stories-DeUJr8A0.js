import{V as S,J as Y,j as u,c as E,F as X,r as C,bf as N,bg as Z}from"./iframe-C-coJuUP.js";import{b as ee,w as U}from"./appWrappers-CdioH-jm.js";import{u as te}from"./useAsync-DVqxPCgr.js";import{q as ne}from"./index-CK7yCOkR.js";import{l as D}from"./lodash-BMGFMZfQ.js";import{c as J}from"./api-DzR1jwbs.js";import"./get-wqkGlles.js";import{D as G,s as T,p as ie}from"./ref-C0VTUPuL.js";import{g as F,b as re,R as ae,u as se,E as oe,o as le,a as B}from"./translation-Ce3z9GnE.js";import{S as k}from"./Grid-CpuCkwO3.js";import{m as K}from"./makeStyles-CiHm2TPH.js";import{B as I}from"./Box-DUptaEM1.js";import{c as V}from"./createStyles-Bp4GwXob.js";import{u as ue}from"./useRouteRef-CNiCqjpw.js";import{P as de}from"./Progress-Dll2-_A2.js";import{R as ce}from"./ResponseErrorPanel-DZd_3eE8.js";import{O as pe}from"./OverflowTooltip-BcVaKfX-.js";import{L as me}from"./Link-BAqVydJ4.js";import{S as he}from"./Switch-BFEcPwwn.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CtHErxE2.js";import"./useIsomorphicLayoutEffect-BgJo-eyS.js";import"./useAnalytics-Csq2_frD.js";import"./componentData-CAUcuYKY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-2anb1mQB.js";import"./useApp-DwifVUVc.js";import"./useMountedState-BzctEBb5.js";import"./index-CBdKPl6K.js";import"./Card-DTr6f34_.js";import"./Button-HgcBqqAF.js";import"./utils-U8J9_ypZ.js";import"./useObjectRef-DoPsICjD.js";import"./Label-DuiviT5b.js";import"./Hidden-BZos0PUt.js";import"./useFocusable-C8ZXMjCr.js";import"./useLabel-3gXC22RO.js";import"./useLabels-DyUMAXd4.js";import"./context-eVH2RLAG.js";import"./useButton-DbPnANzN.js";import"./usePress-B_AIff1O.js";import"./useFocusRing-DdAH67IB.js";import"./Link-DWPsUUV5.js";import"./getNodeText-CEYPe-ow.js";import"./useLink-DyCDnSyX.js";import"./Flex-DEyiuRhH.js";import"./Text-DZJ2bZ47.js";import"./styled-a3UFYgpT.js";import"./createStyles-yD3y8ldD.js";import"./LinearProgress-gxPwbSNk.js";import"./ErrorPanel-8ak56BOi.js";import"./WarningPanel-kT6KQz6k.js";import"./ExpandMore-ksCX5CD2.js";import"./AccordionDetails-B8tR2uC9.js";import"./index-B9sM2jn7.js";import"./Collapse-fbo-cbCX.js";import"./MarkdownContent-8VuNV2bl.js";import"./CodeSnippet-CQdXrMO3.js";import"./CopyTextButton-BysfE0zg.js";import"./useCopyToClipboard-CtKTY1lC.js";import"./Tooltip-DiFwxGBu.js";import"./Popper-dI_EnRqc.js";import"./Portal-7MVcqHay.js";import"./List-DmNK4dvp.js";import"./ListContext-DK0SRiIG.js";import"./ListItem-B38saMSF.js";import"./ListItemText-C0-H0C9-.js";import"./Divider-DFcxU8OS.js";import"./useToggleState-a61JJ_72.js";import"./useControlledState-D-0r9ToY.js";import"./useToggle-CeeJ0cML.js";import"./useFormReset-CPQnf70E.js";import"./VisuallyHidden-CEXt6C6h.js";class fe{[ee]="external";id;params;optional;defaultTarget;constructor(r,a,t,n){this.id=r,this.params=a,this.optional=t,this.defaultTarget=n}toString(){return this.#e?`externalRouteRef{id=${this.#e},legacyId=${this.id}}`:`routeRef{type=external,id=${this.id}}`}getDefaultTarget(){return this.defaultTarget}$$type="@backstage/ExternalRouteRef";version="v1";T=void 0;#e=void 0;getParams(){return this.params}getDescription(){return this.#e?this.#e:this.id}setId(r){if(!r)throw new Error("ExternalRouteRef id must be a non-empty string");if(this.#e&&this.#e!==r)throw new Error(`ExternalRouteRef was referenced twice as both '${this.#e}' and '${r}'`);this.#e=r}}function ge(e){return new fe(e.id,e.params??[],!!e.optional,e?.defaultTarget)}function ye(e,r){const a=r?.defaultKind;let t,n,o;return"metadata"in e?(t=e.kind,n=e.metadata.namespace,o=e.metadata.name):(t=e.kind,n=e.namespace,o=e.name),(n===void 0||n==="")&&(n=G),r?.defaultNamespace!==void 0?r?.defaultNamespace===n&&(n=void 0):n===G&&(n=void 0),t=t.toLocaleLowerCase("en-US"),t=a.toLocaleLowerCase("en-US")===t?void 0:t,`${t?`${t}:`:""}${n?`${n}/`:""}${o}`}const L=ge({id:"catalog-index",optional:!0,defaultTarget:"catalog.catalogIndex"});function ve(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var q={exports:{}},be=q.exports,O;function we(){return O||(O=1,(function(e,r){(function(a,t){typeof ve=="function"?e.exports=t():a.pluralize=t()})(be,function(){var a=[],t=[],n={},o={},l={};function h(i){return typeof i=="string"?new RegExp("^"+i+"$","i"):i}function f(i,s){return i===s?s:i===i.toLowerCase()?s.toLowerCase():i===i.toUpperCase()?s.toUpperCase():i[0]===i[0].toUpperCase()?s.charAt(0).toUpperCase()+s.substr(1).toLowerCase():s.toLowerCase()}function m(i,s){return i.replace(/\$(\d{1,2})/g,function(b,g){return s[g]||""})}function p(i,s){return i.replace(s[0],function(b,g){var v=m(s[1],arguments);return f(b===""?i[g-1]:b,v)})}function c(i,s,b){if(!i.length||n.hasOwnProperty(i))return s;for(var g=b.length;g--;){var v=b[g];if(v[0].test(s))return p(s,v)}return s}function $(i,s,b){return function(g){var v=g.toLowerCase();return s.hasOwnProperty(v)?f(g,v):i.hasOwnProperty(v)?f(g,i[v]):c(v,g,b)}}function y(i,s,b,g){return function(v){var R=v.toLowerCase();return s.hasOwnProperty(R)?!0:i.hasOwnProperty(R)?!1:c(R,R,b)===R}}function d(i,s,b){var g=s===1?d.singular(i):d.plural(i);return(b?s+" ":"")+g}return d.plural=$(l,o,a),d.isPlural=y(l,o,a),d.singular=$(o,l,t),d.isSingular=y(o,l,t),d.addPluralRule=function(i,s){a.push([h(i),s])},d.addSingularRule=function(i,s){t.push([h(i),s])},d.addUncountableRule=function(i){if(typeof i=="string"){n[i.toLowerCase()]=!0;return}d.addPluralRule(i,"$0"),d.addSingularRule(i,"$0")},d.addIrregularRule=function(i,s){s=s.toLowerCase(),i=i.toLowerCase(),l[i]=s,o[s]=i},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["is","are"],["was","were"],["has","have"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["looey","looies"],["thief","thieves"],["groove","grooves"],["pickaxe","pickaxes"],["passerby","passersby"]].forEach(function(i){return d.addIrregularRule(i[0],i[1])}),[[/s?$/i,"s"],[/[^\u0000-\u007F]$/i,"$0"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(i){return d.addPluralRule(i[0],i[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/ies$/i,"y"],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,"$1ie"],[/\b(mon|smil)ies$/i,"$1ey"],[/\b((?:tit)?m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,"$1"],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,"$1sis"],[/(movie|twelve|abuse|e[mn]u)s$/i,"$1"],[/(test)(?:is|es)$/i,"$1is"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(i){return d.addSingularRule(i[0],i[1])}),["adulthood","advice","agenda","aid","aircraft","alcohol","ammo","analytics","anime","athletics","audio","bison","blood","bream","buffalo","butter","carp","cash","chassis","chess","clothing","cod","commerce","cooperation","corps","debris","diabetes","digestion","elk","energy","equipment","excretion","expertise","firmware","flounder","fun","gallows","garbage","graffiti","hardware","headquarters","health","herpes","highjinks","homework","housework","information","jeans","justice","kudos","labour","literature","machinery","mackerel","mail","media","mews","moose","music","mud","manga","news","only","personnel","pike","plankton","pliers","police","pollution","premises","rain","research","rice","salmon","scissors","series","sewage","shambles","shrimp","software","species","staff","swine","tennis","traffic","transportation","trout","tuna","wealth","welfare","whiting","wildebeest","wildlife","you",/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(d.addUncountableRule),d})})(q)),q.exports}var $e=we();const xe=S($e);var j,z;function Te(){if(z)return j;z=1;class e{constructor(t){this.value=t,this.next=void 0}}class r{constructor(){this.clear()}enqueue(t){const n=new e(t);this._head?(this._tail.next=n,this._tail=n):(this._head=n,this._tail=n),this._size++}dequeue(){const t=this._head;if(t)return this._head=this._head.next,this._size--,t.value}clear(){this._head=void 0,this._tail=void 0,this._size=0}get size(){return this._size}*[Symbol.iterator](){let t=this._head;for(;t;)yield t.value,t=t.next}}return j=r,j}var P,_;function ke(){if(_)return P;_=1;const e=Te();return P=a=>{if(!((Number.isInteger(a)||a===1/0)&&a>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up");const t=new e;let n=0;const o=()=>{n--,t.size>0&&t.dequeue()()},l=async(m,p,...c)=>{n++;const $=(async()=>m(...c))();p($);try{await $}catch{}o()},h=(m,p,...c)=>{t.enqueue(l.bind(null,m,p,...c)),(async()=>(await Promise.resolve(),n<a&&t.size>0&&t.dequeue()()))()},f=(m,...p)=>new Promise(c=>{h(m,c,...p)});return Object.defineProperties(f,{activeCount:{get:()=>n},pendingCount:{get:()=>t.size},clearQueue:{value:()=>{t.clear()}}}),f},P}var Re=ke();const qe=S(Re),Ae=qe(5),Ee=(e,r)=>{const{kind:a,type:t}=r,n=e.map(l=>ye(ie(l),{defaultKind:"group"})),o={kind:a.toLocaleLowerCase("en-US"),type:t,owners:n,user:"all"};return ne.stringify({filters:o},{arrayFormat:"repeat"})},je=e=>[...F(e,ae,{kind:"Group"}).map(({kind:t,namespace:n,name:o})=>T({kind:t,namespace:n,name:o})),T(e)],Pe=e=>e!==void 0,M=async(e,r,a=[])=>{const t=F(e,re,{kind:"Group"}),n=t.length>0,o=T(e);if(n){const l=t.map(c=>T(c)),m=(await Ae(()=>r.getEntitiesByRefs({fields:["kind","metadata.namespace","metadata.name","relations"],entityRefs:l}))).items.filter(Pe).filter(c=>!a.includes(T(c))),p=(await Promise.all(m.map(c=>M(c,r,[...a,o])))).flatMap(c=>c);return D.uniq([...p,o])}return[o]},Le=async(e,r,a)=>{const t=e.kind==="Group",n=r==="aggregated",o=e.kind==="User";return n&&t?M(e,a):n&&o?je(e):[T(e)]},Ce=e=>new Promise(r=>setTimeout(r,e)),Ge=async(e,r,a,t=100,n=100)=>{const o=[];for(let l=0;l<e.length;l+=t){const h=e.slice(l,l+t),f=await a.getEntities({filter:[{kind:r,"relations.ownedBy":h}],fields:["kind","metadata.name","metadata.namespace","spec.type","relations"]});o.push(...f.items),l+t<e.length&&await Ce(n)}return D.uniqBy(o,T)};function Ie(e,r,a,t=6){const n=Y(J),o=a??["Component","API","System","Resource"],{loading:l,error:h,value:f}=te(async()=>{const m=await Le(e,r,n);return(await Ge(m,o,n)).reduce((y,d)=>{const i=y.find(s=>s.kind===d.kind&&s.type===d.spec?.type);return i?i.count+=1:y.push({kind:d.kind,type:d.spec?.type?.toString(),count:1}),y},[]).sort((y,d)=>d.count-y.count).slice(0,t).map(y=>({counter:y.count,type:y.type,kind:y.kind,queryParams:Ee(m,y)}))},[n,e,r]);return{componentsWithCounters:f,loading:l,error:h}}const Oe=K(e=>V({card:{border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[2],borderRadius:"4px",padding:e.spacing(2),transition:`${e.transitions.duration.standard}ms`,"&:hover":{boxShadow:e.shadows[4]},height:"100%"},bold:{fontWeight:e.typography.fontWeightBold},smallFont:{fontSize:e.typography.body2.fontSize},entityTypeBox:{background:r=>e.getPageTheme({themeId:r.type}).backgroundImage,color:r=>e.getPageTheme({themeId:r.type}).fontColor}}),{name:"PluginOrgComponentsGrid"}),ze=({counter:e,type:r,kind:a,url:t})=>{const n=Oe({type:r??a}),o=r??a,l=o.length>10,h=u.jsxs(I,{className:`${n.card} ${n.entityTypeBox}`,display:"flex",flexDirection:"column",alignItems:"center",children:[u.jsx(E,{className:n.bold,variant:"h6",children:e}),u.jsx(I,{sx:{width:"100%",textAlign:"center"},children:u.jsx(E,{className:`${n.bold} ${l&&n.smallFont}`,variant:"h6",children:u.jsx(pe,{text:xe(o.toLocaleUpperCase("en-US"),e)})})}),r&&u.jsx(E,{variant:"subtitle1",children:a})]});return t?u.jsx(me,{to:t,variant:"body2",children:h}):h},W=({className:e,entity:r,relationsType:a,relationAggregation:t,entityFilterKind:n,entityLimit:o=6})=>{const l=ue(L);if(!a&&!t)throw new Error("The relationAggregation property must be set as an EntityRelationAggregation type.");const{componentsWithCounters:h,loading:f,error:m}=Ie(r,t??a,n,o);return f?u.jsx(de,{}):m?u.jsx(ce,{error:m}):u.jsx(k,{container:!0,className:e,children:h?.map(p=>u.jsx(k,{item:!0,xs:6,md:6,lg:4,children:u.jsx(ze,{counter:p.counter,kind:p.kind,type:p.type,url:l&&`${l()}?${p.queryParams}`})},p.type??p.kind))})};W.__docgenInfo={description:"",methods:[],displayName:"ComponentsGrid",props:{className:{required:!1,tsType:{name:"string"},description:""},entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"6",computed:!1}}}};const _e=K(()=>V({grid:{overflowY:"auto",marginTop:0}}),{name:"PluginOrgOwnershipCard"}),A=e=>{const{entityFilterKind:r,hideRelationsToggle:a,entityLimit:t=6}=e,n=e.relationAggregation??e.relationsType,o=a===void 0?!1:a,l=_e(),{entity:h}=se(),{t:f}=X(le),m=h.kind==="User"?"aggregated":"direct",[p,c]=C.useState(n??m);return C.useEffect(()=>{n||c(m)},[c,m,n]),u.jsx(oe,{title:f("ownershipCard.title"),headerActions:!o&&u.jsx(he,{isSelected:p!=="direct",onChange:$=>c($?"aggregated":"direct"),label:f("ownershipCard.aggregateRelationsToggle.label")}),children:u.jsx(W,{className:l.grid,entity:h,entityLimit:t,relationAggregation:p,entityFilterKind:r})})};A.__docgenInfo={description:"@public",methods:[],displayName:"OwnershipCard",props:{entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},hideRelationsToggle:{required:!1,tsType:{name:"boolean"},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:""}}};const dn={title:"Plugins/Org/Ownership Card",component:A,tags:["!manifest"]},Q={apiVersion:"backstage.io/v1alpha1",kind:"Group",metadata:{name:"team-a",description:"Team A"},spec:{profile:{displayName:"Team A",email:"team-a@example.com",picture:"https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4"},type:"group",children:[]}},Se=({type:e,name:r})=>({apiVersion:"backstage.io/v1alpha1",kind:"Component",metadata:{name:r},spec:{type:e},relations:[{type:"ownedBy",targetRef:"group:default/team-a",target:{namespace:"default",kind:"group",name:"team-a"}}]}),Ne=["service","website","api","playlist","grpc","trpc","library"],Ue=Ne.map((e,r)=>Se({type:e,name:`${e}-${r}`})),De={getEntities:()=>Promise.resolve({items:Ue})},H=Z.from([J,De]),w=()=>U(u.jsx(N,{apis:H,children:u.jsx(B,{entity:Q,children:u.jsx(k,{container:!0,spacing:4,children:u.jsx(k,{item:!0,xs:12,md:6,style:{maxHeight:320,overflow:"hidden"},children:u.jsx(A,{})})})})}),{mountedRoutes:{"/catalog":L}}),x={argTypes:{entityLimit:{control:{type:"number"}}},render:({entityLimit:e})=>U(u.jsx(N,{apis:H,children:u.jsx(B,{entity:Q,children:u.jsx(k,{container:!0,spacing:4,children:u.jsx(k,{item:!0,xs:12,md:6,children:u.jsx(A,{entityLimit:e})})})})}),{mountedRoutes:{"/catalog":L}})};w.__docgenInfo={description:"",methods:[],displayName:"Default"};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{code:`const Default = () =>
  wrapInTestApp(
    <ApiProvider apis={apis}>
      <EntityProvider entity={defaultEntity}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={6}
            style={{ maxHeight: 320, overflow: "hidden" }}
          >
            <OwnershipCard />
          </Grid>
        </Grid>
      </EntityProvider>
    </ApiProvider>,
    {
      mountedRoutes: { "/catalog": catalogIndexRouteRef },
    }
  );
`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{code:`const WithVariableEntityList = ({ entityLimit }: { entityLimit: number }) =>
  wrapInTestApp(
    <ApiProvider apis={apis}>
      <EntityProvider entity={defaultEntity}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <OwnershipCard entityLimit={entityLimit} />
          </Grid>
        </Grid>
      </EntityProvider>
    </ApiProvider>,
    {
      mountedRoutes: { "/catalog": catalogIndexRouteRef },
    }
  );
`,...x.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`() => wrapInTestApp(<ApiProvider apis={apis}>
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
})`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};const cn=["Default","WithVariableEntityList"];export{w as Default,x as WithVariableEntityList,cn as __namedExportsOrder,dn as default};
