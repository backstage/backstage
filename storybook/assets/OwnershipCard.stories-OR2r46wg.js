import{bu as _,cD as Y,bR as u,aa as j,cY as H,ca as L,a6 as X,d as S}from"./iframe-BHoENCVc.js";import{N as Z,O as N}from"./appWrappers-Bfq9ls44.js";import{u as ee}from"./useAsync-DaAAM54v.js";import{q as te}from"./index-C1Mv8UC5.js";import{a as D}from"./lodash-C1BWqHDU.js";import{c as U}from"./api-BXDaiqlg.js";import{s as $}from"./ref-C0VTUPuL.js";import{d as ne}from"./defaultEntityPresentation-Bdhwys0V.js";import{g as J,b as ie,R as re,u as ae,E as se,o as oe,a as B}from"./translation-DyktXYBf.js";import{u as le}from"./useRouteRef-B9PFWjwA.js";import{S as x}from"./Grid-DQ6GJWoC.js";import{B as I}from"./Box-69iekKeq.js";import{m as F}from"./makeStyles-DPkHg9n9.js";import{c as K}from"./createStyles-Bp4GwXob.js";import{P as ue}from"./Progress-BT2fw4PY.js";import{R as ce}from"./ResponseErrorPanel-C3efgrs2.js";import{O as pe}from"./OverflowTooltip-CXO4B3XO.js";import{L as de}from"./Link-DbaMgic8.js";import{S as me}from"./Switch-eAkyAzS3.js";import"./preload-helper-PPVm8Dsz.js";import"./WebStorage-DQiA-S4e.js";import"./useAnalytics-Cx5c0pM3.js";import"./componentData-BFK1FCBi.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CYkRaHNa.js";import"./useIsomorphicLayoutEffect-BQX4Dz1t.js";import"./useApp-D78Q1Dx1.js";import"./BUIProvider-BqojK_vt.js";import"./openLink-DZP0UHC7.js";import"./useResolvedHref-KjDbaJ0G.js";import"./useMountedState-CS6T7kHD.js";import"./ajv-BS3HtyaF.js";import"./index-CwRuBl_7.js";import"./Card-BcE8tLHA.js";import"./Button-BHRDpgL_.js";import"./utils-CL0Z8V1C.js";import"./useObjectRef-uSeYP5xn.js";import"./Label-DlD4XAby.js";import"./Hidden-C6_e4Tzz.js";import"./useFocusRing-MHb5XFUp.js";import"./useLabel-DLz-9M9H.js";import"./useLabels-Dx4Y77vh.js";import"./number-CnfK_WTv.js";import"./I18nProvider-BHwrJH4v.js";import"./useButton-DPa3LWsd.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./useHover-CPCQZiGU.js";import"./Link-nwVQbPsP.js";import"./useLink-DHP2JBzs.js";import"./getNodeText-DSCCppXL.js";import"./Flex-BjDv317b.js";import"./Text-s-AhUfle.js";import"./styled-DRPdZI7s.js";import"./createStyles-yD3y8ldD.js";import"./LinearProgress-C_-kgo4v.js";import"./ErrorPanel-5JzCMKOf.js";import"./WarningPanel-HXs-l0ct.js";import"./ExpandMore-BtXr0D_Z.js";import"./AccordionDetails-CpV5MvGv.js";import"./index-B9sM2jn7.js";import"./Collapse-DdtUoHqJ.js";import"./MarkdownContent-DFt8VKNH.js";import"./CodeSnippet-I1VgKYUJ.js";import"./List-BP5zaq_8.js";import"./ListContext-vBgF8v9C.js";import"./ListItem-CyAObhT7.js";import"./ListItemText-BRYjbmrS.js";import"./CopyTextButton-D1NyuzKS.js";import"./useCopyToClipboard-C1eKfL6f.js";import"./Tooltip-DzM1tQjG.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./useControlledState--Wz_vfvx.js";import"./animation-D48GeWFv.js";import"./ButtonIcon-Dbucn7ko.js";import"./index-CXAyTdUW.js";import"./Divider-Sa-frcMZ.js";import"./Tooltip-C4aWDmy0.js";import"./Popper-BGschj03.js";import"./Portal-BkPCEqjv.js";import"./useToggle-DZhK_z4c.js";import"./useFormReset-lwOM45Sr.js";import"./useToggleState-Bzmf0k1F.js";import"./VisuallyHidden-q8nayOEv.js";class he{[Z]="external";id;params;optional;defaultTarget;constructor(i,a,n,r){this.id=i,this.params=a,this.optional=n,this.defaultTarget=r}toString(){return this.#e?`externalRouteRef{id=${this.#e},legacyId=${this.id}}`:`routeRef{type=external,id=${this.id}}`}getDefaultTarget(){return this.defaultTarget}$$type="@backstage/ExternalRouteRef";version="v1";T=void 0;#e=void 0;getParams(){return this.params}getDescription(){return this.#e?this.#e:this.id}setId(i){if(!i)throw new Error("ExternalRouteRef id must be a non-empty string");if(this.#e&&this.#e!==i)throw new Error(`ExternalRouteRef was referenced twice as both '${this.#e}' and '${i}'`);this.#e=i}}function fe(e){return new he(e.id,e.params??[],!!e.optional,e?.defaultTarget)}function ge(e,i,a){return ne(e,i)}const C=fe({id:"catalog-index",optional:!0,defaultTarget:"catalog.catalogIndex"});function ye(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var q={exports:{}},ve=q.exports,O;function be(){return O||(O=1,(function(e,i){(function(a,n){typeof ye=="function"?e.exports=n():a.pluralize=n()})(ve,function(){var a=[],n=[],r={},o={},l={};function h(t){return typeof t=="string"?new RegExp("^"+t+"$","i"):t}function f(t,s){return t===s?s:t===t.toLowerCase()?s.toLowerCase():t===t.toUpperCase()?s.toUpperCase():t[0]===t[0].toUpperCase()?s.charAt(0).toUpperCase()+s.substr(1).toLowerCase():s.toLowerCase()}function m(t,s){return t.replace(/\$(\d{1,2})/g,function(b,g){return s[g]||""})}function d(t,s){return t.replace(s[0],function(b,g){var v=m(s[1],arguments);return f(b===""?t[g-1]:b,v)})}function p(t,s,b){if(!t.length||r.hasOwnProperty(t))return s;for(var g=b.length;g--;){var v=b[g];if(v[0].test(s))return d(s,v)}return s}function w(t,s,b){return function(g){var v=g.toLowerCase();return s.hasOwnProperty(v)?f(g,v):t.hasOwnProperty(v)?f(g,t[v]):p(v,g,b)}}function y(t,s,b,g){return function(v){var T=v.toLowerCase();return s.hasOwnProperty(T)?!0:t.hasOwnProperty(T)?!1:p(T,T,b)===T}}function c(t,s,b){var g=s===1?c.singular(t):c.plural(t);return(b?s+" ":"")+g}return c.plural=w(l,o,a),c.isPlural=y(l,o,a),c.singular=w(o,l,n),c.isSingular=y(o,l,n),c.addPluralRule=function(t,s){a.push([h(t),s])},c.addSingularRule=function(t,s){n.push([h(t),s])},c.addUncountableRule=function(t){if(typeof t=="string"){r[t.toLowerCase()]=!0;return}c.addPluralRule(t,"$0"),c.addSingularRule(t,"$0")},c.addIrregularRule=function(t,s){s=s.toLowerCase(),t=t.toLowerCase(),l[t]=s,o[s]=t},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["is","are"],["was","were"],["has","have"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["looey","looies"],["thief","thieves"],["groove","grooves"],["pickaxe","pickaxes"],["passerby","passersby"]].forEach(function(t){return c.addIrregularRule(t[0],t[1])}),[[/s?$/i,"s"],[/[^\u0000-\u007F]$/i,"$0"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(t){return c.addPluralRule(t[0],t[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/ies$/i,"y"],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,"$1ie"],[/\b(mon|smil)ies$/i,"$1ey"],[/\b((?:tit)?m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,"$1"],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,"$1sis"],[/(movie|twelve|abuse|e[mn]u)s$/i,"$1"],[/(test)(?:is|es)$/i,"$1is"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(t){return c.addSingularRule(t[0],t[1])}),["adulthood","advice","agenda","aid","aircraft","alcohol","ammo","analytics","anime","athletics","audio","bison","blood","bream","buffalo","butter","carp","cash","chassis","chess","clothing","cod","commerce","cooperation","corps","debris","diabetes","digestion","elk","energy","equipment","excretion","expertise","firmware","flounder","fun","gallows","garbage","graffiti","hardware","headquarters","health","herpes","highjinks","homework","housework","information","jeans","justice","kudos","labour","literature","machinery","mackerel","mail","media","mews","moose","music","mud","manga","news","only","personnel","pike","plankton","pliers","police","pollution","premises","rain","research","rice","salmon","scissors","series","sewage","shambles","shrimp","software","species","staff","swine","tennis","traffic","transportation","trout","tuna","wealth","welfare","whiting","wildebeest","wildlife","you",/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(c.addUncountableRule),c})})(q)),q.exports}var we=be();const $e=_(we);var E,z;function xe(){if(z)return E;z=1;class e{constructor(n){this.value=n,this.next=void 0}}class i{constructor(){this.clear()}enqueue(n){const r=new e(n);this._head?(this._tail.next=r,this._tail=r):(this._head=r,this._tail=r),this._size++}dequeue(){const n=this._head;if(n)return this._head=this._head.next,this._size--,n.value}clear(){this._head=void 0,this._tail=void 0,this._size=0}get size(){return this._size}*[Symbol.iterator](){let n=this._head;for(;n;)yield n.value,n=n.next}}return E=i,E}var P,G;function Te(){if(G)return P;G=1;const e=xe();return P=a=>{if(!((Number.isInteger(a)||a===1/0)&&a>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up");const n=new e;let r=0;const o=()=>{r--,n.size>0&&n.dequeue()()},l=async(m,d,...p)=>{r++;const w=(async()=>m(...p))();d(w);try{await w}catch{}o()},h=(m,d,...p)=>{n.enqueue(l.bind(null,m,d,...p)),(async()=>(await Promise.resolve(),r<a&&n.size>0&&n.dequeue()()))()},f=(m,...d)=>new Promise(p=>{h(m,p,...d)});return Object.defineProperties(f,{activeCount:{get:()=>r},pendingCount:{get:()=>n.size},clearQueue:{value:()=>{n.clear()}}}),f},P}var ke=Te();const Re=_(ke),qe=Re(5),Ae=(e,i)=>{const{kind:a,type:n}=i,r=e.map(l=>ge(l,{defaultKind:"group"}).primaryTitle),o={kind:a.toLocaleLowerCase("en-US"),type:n,owners:r,user:"all"};return te.stringify({filters:o},{arrayFormat:"repeat"})},je=e=>[...J(e,re,{kind:"Group"}).map(({kind:n,namespace:r,name:o})=>$({kind:n,namespace:r,name:o})),$(e)],Ee=e=>e!==void 0,M=async(e,i,a=[])=>{const n=J(e,ie,{kind:"Group"}),r=n.length>0,o=$(e);if(r){const l=n.map(p=>$(p)),m=(await qe(()=>i.getEntitiesByRefs({fields:["kind","metadata.namespace","metadata.name","relations"],entityRefs:l}))).items.filter(Ee).filter(p=>!a.includes($(p))),d=(await Promise.all(m.map(p=>M(p,i,[...a,o])))).flatMap(p=>p);return D.uniq([...d,o])}return[o]},Pe=async(e,i,a)=>{const n=e.kind==="Group",r=i==="aggregated",o=e.kind==="User";return r&&n?M(e,a):r&&o?je(e):[$(e)]},Ce=e=>new Promise(i=>setTimeout(i,e)),Le=async(e,i,a,n=100,r=100)=>{const o=[];for(let l=0;l<e.length;l+=n){const h=e.slice(l,l+n),f=await a.getEntities({filter:[{kind:i,"relations.ownedBy":h}],fields:["kind","metadata.name","metadata.namespace","spec.type","relations"]});o.push(...f.items),l+n<e.length&&await Ce(r)}return D.uniqBy(o,$)};function Ie(e,i,a,n=6){const r=Y(U),o=a??["Component","API","System","Resource"],{loading:l,error:h,value:f}=ee(async()=>{const m=await Pe(e,i,r);return(await Le(m,o,r)).reduce((y,c)=>{const t=y.find(s=>s.kind===c.kind&&s.type===c.spec?.type);return t?t.count+=1:y.push({kind:c.kind,type:c.spec?.type?.toString(),count:1}),y},[]).sort((y,c)=>c.count-y.count).slice(0,n).map(y=>({counter:y.count,type:y.type,kind:y.kind,queryParams:Ae(m,y)}))},[r,e,i]);return{componentsWithCounters:f,loading:l,error:h}}const Oe=F(e=>K({card:{border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[2],borderRadius:"4px",padding:e.spacing(2),transition:`${e.transitions.duration.standard}ms`,"&:hover":{boxShadow:e.shadows[4]},height:"100%"},bold:{fontWeight:e.typography.fontWeightBold},smallFont:{fontSize:e.typography.body2.fontSize},entityTypeBox:{background:i=>e.getPageTheme({themeId:i.type}).backgroundImage,color:i=>e.getPageTheme({themeId:i.type}).fontColor}}),{name:"PluginOrgComponentsGrid"}),ze=({counter:e,type:i,kind:a,url:n})=>{const r=Oe({type:i??a}),o=i??a,l=o.length>10,h=u.jsxs(I,{className:`${r.card} ${r.entityTypeBox}`,display:"flex",flexDirection:"column",alignItems:"center",children:[u.jsx(j,{className:r.bold,variant:"h6",children:e}),u.jsx(I,{sx:{width:"100%",textAlign:"center"},children:u.jsx(j,{className:`${r.bold} ${l&&r.smallFont}`,variant:"h6",children:u.jsx(pe,{text:$e(o.toLocaleUpperCase("en-US"),e)})})}),i&&u.jsx(j,{variant:"subtitle1",children:a})]});return n?u.jsx(de,{to:n,variant:"body2",children:h}):h},V=({className:e,entity:i,relationsType:a,relationAggregation:n,entityFilterKind:r,entityLimit:o=6})=>{const l=le(C);if(!a&&!n)throw new Error("The relationAggregation property must be set as an EntityRelationAggregation type.");const{componentsWithCounters:h,loading:f,error:m}=Ie(i,n??a,r,o);return f?u.jsx(ue,{}):m?u.jsx(ce,{error:m}):u.jsx(x,{container:!0,className:e,children:h?.map(d=>u.jsx(x,{item:!0,xs:6,md:6,lg:4,children:u.jsx(ze,{counter:d.counter,kind:d.kind,type:d.type,url:l&&`${l()}?${d.queryParams}`})},`${d.kind}:${d.type??""}`))})};V.__docgenInfo={description:"",methods:[],displayName:"ComponentsGrid",props:{className:{required:!1,tsType:{name:"string"},description:""},entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"6",computed:!1}}}};const Ge=F(()=>K({grid:{overflowY:"auto",marginTop:0}}),{name:"PluginOrgOwnershipCard"}),A=e=>{const{entityFilterKind:i,hideRelationsToggle:a,entityLimit:n=6}=e,r=e.relationAggregation??e.relationsType,o=a===void 0?!1:a,l=Ge(),{entity:h}=ae(),{t:f}=H(oe),m=h.kind==="User"?"aggregated":"direct",[d,p]=L.useState(r??m);return L.useEffect(()=>{r||p(m)},[p,m,r]),u.jsx(se,{title:f("ownershipCard.title"),headerActions:!o&&u.jsx(me,{isSelected:d!=="direct",onChange:w=>p(w?"aggregated":"direct"),label:f("ownershipCard.aggregateRelationsToggle.label")}),children:u.jsx(V,{className:l.grid,entity:h,entityLimit:n,relationAggregation:d,entityFilterKind:i})})};A.__docgenInfo={description:"@public",methods:[],displayName:"OwnershipCard",props:{entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},hideRelationsToggle:{required:!1,tsType:{name:"boolean"},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:""}}};const wn={title:"Plugins/Org/Ownership Card",component:A,tags:["!manifest"]},W={apiVersion:"backstage.io/v1alpha1",kind:"Group",metadata:{name:"team-a",description:"Team A"},spec:{profile:{displayName:"Team A",email:"team-a@example.com",picture:"https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4"},type:"group",children:[]}},_e=({type:e,name:i})=>({apiVersion:"backstage.io/v1alpha1",kind:"Component",metadata:{name:i},spec:{type:e},relations:[{type:"ownedBy",targetRef:"group:default/team-a",target:{namespace:"default",kind:"group",name:"team-a"}}]}),Se=["service","website","api","playlist","grpc","trpc","library"],Ne=Se.map((e,i)=>_e({type:e,name:`${e}-${i}`})),De={getEntities:()=>Promise.resolve({items:Ne})},Q=X.from([U,De]),k=()=>N(u.jsx(S,{apis:Q,children:u.jsx(B,{entity:W,children:u.jsx(x,{container:!0,spacing:4,children:u.jsx(x,{item:!0,xs:12,md:6,style:{maxHeight:320,overflow:"hidden"},children:u.jsx(A,{})})})})}),{mountedRoutes:{"/catalog":C}}),R={argTypes:{entityLimit:{control:{type:"number"}}},render:({entityLimit:e})=>N(u.jsx(S,{apis:Q,children:u.jsx(B,{entity:W,children:u.jsx(x,{container:!0,spacing:4,children:u.jsx(x,{item:!0,xs:12,md:6,children:u.jsx(A,{entityLimit:e})})})})}),{mountedRoutes:{"/catalog":C}})};k.__docgenInfo={description:"",methods:[],displayName:"Default"};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`() => wrapInTestApp(<ApiProvider apis={apis}>
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
}`,...R.parameters?.docs?.source}}};const $n=["Default","WithVariableEntityList"];export{k as Default,R as WithVariableEntityList,$n as __namedExportsOrder,wn as default};
