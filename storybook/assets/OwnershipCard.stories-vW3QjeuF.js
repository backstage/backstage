import{bs as _,cA as Y,bQ as l,a9 as j,cW as H,c8 as L,a5 as X,d as S}from"./iframe-BiC6vzfc.js";import{N as Z,O as N}from"./appWrappers-D9Cr-qww.js";import{u as ee}from"./useAsync-BfvsCM6Z.js";import{q as te}from"./index-CxvBrRzT.js";import{a as U}from"./lodash-CmicG8li.js";import{c as D}from"./api-bhoG1r64.js";import{s as $}from"./ref-C0VTUPuL.js";import{g as J,b as ne,R as ie,u as re,E as ae,o as se,a as B}from"./translation-Be6C0_03.js";import{u as oe}from"./useRouteRef-BkmsmyAx.js";import{S as x}from"./Grid-5kX5iYpE.js";import{B as I}from"./Box-CGVVs5_5.js";import{m as F}from"./makeStyles-BTRKbQbn.js";import{c as W}from"./createStyles-Bp4GwXob.js";import{P as le}from"./Progress-CjijHw8-.js";import{R as ue}from"./ResponseErrorPanel-D1rjR2zb.js";import{O as ce}from"./OverflowTooltip-CrKr8yMD.js";import{L as de}from"./Link-BBWT3DGx.js";import{S as pe}from"./Switch-CETo3-fm.js";import"./preload-helper-PPVm8Dsz.js";import"./WebStorage-Cp2ehJip.js";import"./useAnalytics-CWeTU5_6.js";import"./componentData-BSbf9b0a.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CNB7CHhj.js";import"./useIsomorphicLayoutEffect-VRDt432r.js";import"./useApp-CsAmf1u2.js";import"./BUIProvider-DEMxJ951.js";import"./BUIRoutingProvider-ht1fdH5F.js";import"./openLink-fglnGFM4.js";import"./useResolvedHref-G7FW9UOs.js";import"./useMountedState-rwLvoT14.js";import"./ajv-Bau5ExAk.js";import"./index-HANU7tPZ.js";import"./Card-CAbx-fBl.js";import"./Button-CSCohGDT.js";import"./utils-BQPJ15nW.js";import"./useObjectRef-rJAA83qf.js";import"./Label-Dt81RO29.js";import"./Hidden-DdtniuZ_.js";import"./useFocusRing-CYz7DZLf.js";import"./useLabel-CfyoKpiQ.js";import"./useLabels-Kk8q7j9x.js";import"./number-CQJyNM_c.js";import"./I18nProvider-DJaDCNar.js";import"./useButton-EPm5NcFx.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./useHover-CRtjWjkD.js";import"./Link-00Raw4XY.js";import"./useLink-C_UAK_Mo.js";import"./getNodeText-9xFtoTWr.js";import"./Flex-wFSzcl10.js";import"./Text-DfVerI7c.js";import"./styled-BNPRS9hw.js";import"./createStyles-yD3y8ldD.js";import"./LinearProgress-CwZQGUib.js";import"./ErrorPanel-C1h2VdJ6.js";import"./WarningPanel-eIVpFTHC.js";import"./ExpandMore-Dv72LSow.js";import"./AccordionDetails-CuhjeHp2.js";import"./index-B9sM2jn7.js";import"./Collapse-CdOLWtqx.js";import"./MarkdownContent-f-GJNKWd.js";import"./CodeSnippet-B3kU0HP_.js";import"./List-DJtEB1Fe.js";import"./ListContext-127C_KA8.js";import"./ListItem-Bm0RnmVU.js";import"./ListItemText-DbI1WcNJ.js";import"./CopyTextButton-fAT1swaV.js";import"./useCopyToClipboard-EtHc7wba.js";import"./Tooltip-B5bHPnfj.js";import"./useOverlayTriggerState-CjTLIV8R.js";import"./useControlledState-CjMsoNHV.js";import"./animation-89PtgvT4.js";import"./ButtonIcon-pfvj9qzl.js";import"./index-BGy42kW1.js";import"./Divider-DflaO4gg.js";import"./Tooltip-B2T2MTsb.js";import"./Popper-CRE5HCjP.js";import"./Portal-BeSptJUc.js";import"./useToggle-CrwFiE4m.js";import"./useFormReset-Cq9Z1B3A.js";import"./useToggleState-4l2XaPue.js";import"./VisuallyHidden-DwJsbRnS.js";class me{[Z]="external";id;params;optional;defaultTarget;constructor(i,a,n,r){this.id=i,this.params=a,this.optional=n,this.defaultTarget=r}toString(){return this.#e?`externalRouteRef{id=${this.#e},legacyId=${this.id}}`:`routeRef{type=external,id=${this.id}}`}getDefaultTarget(){return this.defaultTarget}$$type="@backstage/ExternalRouteRef";version="v1";T=void 0;#e=void 0;getParams(){return this.params}getDescription(){return this.#e?this.#e:this.id}setId(i){if(!i)throw new Error("ExternalRouteRef id must be a non-empty string");if(this.#e&&this.#e!==i)throw new Error(`ExternalRouteRef was referenced twice as both '${this.#e}' and '${i}'`);this.#e=i}}function he(e){return new me(e.id,e.params??[],!!e.optional,e?.defaultTarget)}const C=he({id:"catalog-index",optional:!0,defaultTarget:"catalog.catalogIndex"});function fe(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var q={exports:{}},ge=q.exports,O;function ye(){return O||(O=1,(function(e,i){(function(a,n){typeof fe=="function"?e.exports=n():a.pluralize=n()})(ge,function(){var a=[],n=[],r={},o={},u={};function h(t){return typeof t=="string"?new RegExp("^"+t+"$","i"):t}function f(t,s){return t===s?s:t===t.toLowerCase()?s.toLowerCase():t===t.toUpperCase()?s.toUpperCase():t[0]===t[0].toUpperCase()?s.charAt(0).toUpperCase()+s.substr(1).toLowerCase():s.toLowerCase()}function m(t,s){return t.replace(/\$(\d{1,2})/g,function(b,g){return s[g]||""})}function p(t,s){return t.replace(s[0],function(b,g){var v=m(s[1],arguments);return f(b===""?t[g-1]:b,v)})}function d(t,s,b){if(!t.length||r.hasOwnProperty(t))return s;for(var g=b.length;g--;){var v=b[g];if(v[0].test(s))return p(s,v)}return s}function w(t,s,b){return function(g){var v=g.toLowerCase();return s.hasOwnProperty(v)?f(g,v):t.hasOwnProperty(v)?f(g,t[v]):d(v,g,b)}}function y(t,s,b,g){return function(v){var T=v.toLowerCase();return s.hasOwnProperty(T)?!0:t.hasOwnProperty(T)?!1:d(T,T,b)===T}}function c(t,s,b){var g=s===1?c.singular(t):c.plural(t);return(b?s+" ":"")+g}return c.plural=w(u,o,a),c.isPlural=y(u,o,a),c.singular=w(o,u,n),c.isSingular=y(o,u,n),c.addPluralRule=function(t,s){a.push([h(t),s])},c.addSingularRule=function(t,s){n.push([h(t),s])},c.addUncountableRule=function(t){if(typeof t=="string"){r[t.toLowerCase()]=!0;return}c.addPluralRule(t,"$0"),c.addSingularRule(t,"$0")},c.addIrregularRule=function(t,s){s=s.toLowerCase(),t=t.toLowerCase(),u[t]=s,o[s]=t},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["is","are"],["was","were"],["has","have"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["looey","looies"],["thief","thieves"],["groove","grooves"],["pickaxe","pickaxes"],["passerby","passersby"]].forEach(function(t){return c.addIrregularRule(t[0],t[1])}),[[/s?$/i,"s"],[/[^\u0000-\u007F]$/i,"$0"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(t){return c.addPluralRule(t[0],t[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/ies$/i,"y"],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,"$1ie"],[/\b(mon|smil)ies$/i,"$1ey"],[/\b((?:tit)?m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,"$1"],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,"$1sis"],[/(movie|twelve|abuse|e[mn]u)s$/i,"$1"],[/(test)(?:is|es)$/i,"$1is"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(t){return c.addSingularRule(t[0],t[1])}),["adulthood","advice","agenda","aid","aircraft","alcohol","ammo","analytics","anime","athletics","audio","bison","blood","bream","buffalo","butter","carp","cash","chassis","chess","clothing","cod","commerce","cooperation","corps","debris","diabetes","digestion","elk","energy","equipment","excretion","expertise","firmware","flounder","fun","gallows","garbage","graffiti","hardware","headquarters","health","herpes","highjinks","homework","housework","information","jeans","justice","kudos","labour","literature","machinery","mackerel","mail","media","mews","moose","music","mud","manga","news","only","personnel","pike","plankton","pliers","police","pollution","premises","rain","research","rice","salmon","scissors","series","sewage","shambles","shrimp","software","species","staff","swine","tennis","traffic","transportation","trout","tuna","wealth","welfare","whiting","wildebeest","wildlife","you",/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(c.addUncountableRule),c})})(q)),q.exports}var ve=ye();const be=_(ve);var E,z;function we(){if(z)return E;z=1;class e{constructor(n){this.value=n,this.next=void 0}}class i{constructor(){this.clear()}enqueue(n){const r=new e(n);this._head?(this._tail.next=r,this._tail=r):(this._head=r,this._tail=r),this._size++}dequeue(){const n=this._head;if(n)return this._head=this._head.next,this._size--,n.value}clear(){this._head=void 0,this._tail=void 0,this._size=0}get size(){return this._size}*[Symbol.iterator](){let n=this._head;for(;n;)yield n.value,n=n.next}}return E=i,E}var P,G;function $e(){if(G)return P;G=1;const e=we();return P=a=>{if(!((Number.isInteger(a)||a===1/0)&&a>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up");const n=new e;let r=0;const o=()=>{r--,n.size>0&&n.dequeue()()},u=async(m,p,...d)=>{r++;const w=(async()=>m(...d))();p(w);try{await w}catch{}o()},h=(m,p,...d)=>{n.enqueue(u.bind(null,m,p,...d)),(async()=>(await Promise.resolve(),r<a&&n.size>0&&n.dequeue()()))()},f=(m,...p)=>new Promise(d=>{h(m,d,...p)});return Object.defineProperties(f,{activeCount:{get:()=>r},pendingCount:{get:()=>n.size},clearQueue:{value:()=>{n.clear()}}}),f},P}var xe=$e();const Te=_(xe),ke=Te(5),Re=(e,i)=>{const{kind:a,type:n}=i,r={kind:a.toLocaleLowerCase("en-US"),type:n,owners:e,user:"all"};return te.stringify({filters:r},{arrayFormat:"repeat"})},qe=e=>[...J(e,ie,{kind:"Group"}).map(({kind:n,namespace:r,name:o})=>$({kind:n,namespace:r,name:o})),$(e)],Ae=e=>e!==void 0,K=async(e,i,a=[])=>{const n=J(e,ne,{kind:"Group"}),r=n.length>0,o=$(e);if(r){const u=n.map(d=>$(d)),m=(await ke(()=>i.getEntitiesByRefs({fields:["kind","metadata.namespace","metadata.name","relations"],entityRefs:u}))).items.filter(Ae).filter(d=>!a.includes($(d))),p=(await Promise.all(m.map(d=>K(d,i,[...a,o])))).flatMap(d=>d);return U.uniq([...p,o])}return[o]},je=async(e,i,a)=>{const n=e.kind==="Group",r=i==="aggregated",o=e.kind==="User";return r&&n?K(e,a):r&&o?qe(e):[$(e)]},Ee=e=>new Promise(i=>setTimeout(i,e)),Pe=async(e,i,a,n=100,r=100)=>{const o=[];for(let u=0;u<e.length;u+=n){const h=e.slice(u,u+n),f=await a.getEntities({filter:[{kind:i,"relations.ownedBy":h}],fields:["kind","metadata.name","metadata.namespace","spec.type","relations"]});o.push(...f.items),u+n<e.length&&await Ee(r)}return U.uniqBy(o,$)};function Ce(e,i,a,n=6){const r=Y(D),o=a??["Component","API","System","Resource"],{loading:u,error:h,value:f}=ee(async()=>{const m=await je(e,i,r);return(await Pe(m,o,r)).reduce((y,c)=>{const t=y.find(s=>s.kind===c.kind&&s.type===c.spec?.type);return t?t.count+=1:y.push({kind:c.kind,type:c.spec?.type?.toString(),count:1}),y},[]).sort((y,c)=>c.count-y.count).slice(0,n).map(y=>({counter:y.count,type:y.type,kind:y.kind,queryParams:Re(m,y)}))},[r,e,i]);return{componentsWithCounters:f,loading:u,error:h}}const Le=F(e=>W({card:{border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[2],borderRadius:"4px",padding:e.spacing(2),transition:`${e.transitions.duration.standard}ms`,"&:hover":{boxShadow:e.shadows[4]},height:"100%"},bold:{fontWeight:e.typography.fontWeightBold},smallFont:{fontSize:e.typography.body2.fontSize},entityTypeBox:{background:i=>e.getPageTheme({themeId:i.type}).backgroundImage,color:i=>e.getPageTheme({themeId:i.type}).fontColor}}),{name:"PluginOrgComponentsGrid"}),Ie=({counter:e,type:i,kind:a,url:n})=>{const r=Le({type:i??a}),o=i??a,u=o.length>10,h=l.jsxs(I,{className:`${r.card} ${r.entityTypeBox}`,display:"flex",flexDirection:"column",alignItems:"center",children:[l.jsx(j,{className:r.bold,variant:"h6",children:e}),l.jsx(I,{sx:{width:"100%",textAlign:"center"},children:l.jsx(j,{className:`${r.bold} ${u&&r.smallFont}`,variant:"h6",children:l.jsx(ce,{text:be(o.toLocaleUpperCase("en-US"),e)})})}),i&&l.jsx(j,{variant:"subtitle1",children:a})]});return n?l.jsx(de,{to:n,variant:"body2",children:h}):h},M=({className:e,entity:i,relationsType:a,relationAggregation:n,entityFilterKind:r,entityLimit:o=6})=>{const u=oe(C);if(!a&&!n)throw new Error("The relationAggregation property must be set as an EntityRelationAggregation type.");const{componentsWithCounters:h,loading:f,error:m}=Ce(i,n??a,r,o);return f?l.jsx(le,{}):m?l.jsx(ue,{error:m}):l.jsx(x,{container:!0,className:e,children:h?.map(p=>l.jsx(x,{item:!0,xs:6,md:6,lg:4,children:l.jsx(Ie,{counter:p.counter,kind:p.kind,type:p.type,url:u&&`${u()}?${p.queryParams}`})},`${p.kind}:${p.type??""}`))})};M.__docgenInfo={description:"",methods:[],displayName:"ComponentsGrid",props:{className:{required:!1,tsType:{name:"string"},description:""},entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"6",computed:!1}}}};const Oe=F(()=>W({grid:{overflowY:"auto",marginTop:0}}),{name:"PluginOrgOwnershipCard"}),A=e=>{const{entityFilterKind:i,hideRelationsToggle:a,entityLimit:n=6}=e,r=e.relationAggregation??e.relationsType,o=a===void 0?!1:a,u=Oe(),{entity:h}=re(),{t:f}=H(se),m=h.kind==="User"?"aggregated":"direct",[p,d]=L.useState(r??m);return L.useEffect(()=>{r||d(m)},[d,m,r]),l.jsx(ae,{title:f("ownershipCard.title"),headerActions:!o&&l.jsx(pe,{isSelected:p!=="direct",onChange:w=>d(w?"aggregated":"direct"),label:f("ownershipCard.aggregateRelationsToggle.label")}),children:l.jsx(M,{className:u.grid,entity:h,entityLimit:n,relationAggregation:p,entityFilterKind:i})})};A.__docgenInfo={description:"@public",methods:[],displayName:"OwnershipCard",props:{entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},hideRelationsToggle:{required:!1,tsType:{name:"boolean"},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:""}}};const vn={title:"Plugins/Org/Ownership Card",component:A,tags:["!manifest"]},V={apiVersion:"backstage.io/v1alpha1",kind:"Group",metadata:{name:"team-a",description:"Team A"},spec:{profile:{displayName:"Team A",email:"team-a@example.com",picture:"https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4"},type:"group",children:[]}},ze=({type:e,name:i})=>({apiVersion:"backstage.io/v1alpha1",kind:"Component",metadata:{name:i},spec:{type:e},relations:[{type:"ownedBy",targetRef:"group:default/team-a",target:{namespace:"default",kind:"group",name:"team-a"}}]}),Ge=["service","website","api","playlist","grpc","trpc","library"],_e=Ge.map((e,i)=>ze({type:e,name:`${e}-${i}`})),Se={getEntities:()=>Promise.resolve({items:_e})},Q=X.from([D,Se]),k=()=>N(l.jsx(S,{apis:Q,children:l.jsx(B,{entity:V,children:l.jsx(x,{container:!0,spacing:4,children:l.jsx(x,{item:!0,xs:12,md:6,style:{maxHeight:320,overflow:"hidden"},children:l.jsx(A,{})})})})}),{mountedRoutes:{"/catalog":C}}),R={argTypes:{entityLimit:{control:{type:"number"}}},render:({entityLimit:e})=>N(l.jsx(S,{apis:Q,children:l.jsx(B,{entity:V,children:l.jsx(x,{container:!0,spacing:4,children:l.jsx(x,{item:!0,xs:12,md:6,children:l.jsx(A,{entityLimit:e})})})})}),{mountedRoutes:{"/catalog":C}})};k.__docgenInfo={description:"",methods:[],displayName:"Default"};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`() => wrapInTestApp(<ApiProvider apis={apis}>
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
}`,...R.parameters?.docs?.source}}};const bn=["Default","WithVariableEntityList"];export{k as Default,R as WithVariableEntityList,bn as __namedExportsOrder,vn as default};
