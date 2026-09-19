import{aN as _,W as Y,j as l,Q as A,U as H,r as L,bu as X,bv as S}from"./iframe-CxlUpTpq.js";import{b as Z,w as N}from"./appWrappers-Ca4f0dkS.js";import{u as ee}from"./useAsync-mJPdi9qv.js";import{q as te}from"./index-CnRIWM6Q.js";import{l as D}from"./lodash-7klT_A_g.js";import{c as J}from"./api-By4190bk.js";import{s as $}from"./ref-CtaBDC4y.js";import{g as U,b as ne,R as ie,u as re,E as ae,o as se,a as B}from"./translation-BtMfxUw-.js";import{u as oe}from"./useRouteRef-BmfNWQxi.js";import{S as x}from"./Grid-BLfllSxx.js";import{B as I}from"./Box-BmCEZaGT.js";import{m as F}from"./makeStyles-DbA2ZWGd.js";import{c as W}from"./createStyles-Bp4GwXob.js";import{P as le}from"./Progress-BQTAcVVk.js";import{R as ue}from"./ResponseErrorPanel-DvZCCMjf.js";import{O as ce}from"./OverflowTooltip-D5xm2dG-.js";import{L as pe}from"./Link-bOvDEdKZ.js";import{S as de}from"./Switch-D2NYA5Yl.js";import"./preload-helper-PPVm8Dsz.js";import"./WebStorage-s88Gv2oc.js";import"./useAnalytics-CsE2FyHM.js";import"./componentData-aELes_pk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BPlKEDSy.js";import"./useIsomorphicLayoutEffect-BeMyXhL0.js";import"./useApp-xRl_5Yzb.js";import"./BUIProvider-DWmcpNws.js";import"./BUIRoutingProvider-CBigqi8l.js";import"./openLink-DT4-HiOA.js";import"./useResolvedHref-CfM4jAOQ.js";import"./useMountedState-DkDBMh4e.js";import"./ajv-BwDFFw83.js";import"./index-22DygKJ2.js";import"./Card-CyJyMd0F.js";import"./Button-Dk1TuodQ.js";import"./utils-BiH69BEF.js";import"./useObjectRef-Dh3jViZn.js";import"./Label-Ci2BW9le.js";import"./Hidden-f_G1o6Y7.js";import"./useFocusRing-DKBxNAkp.js";import"./useLabel-DDDO_Y6W.js";import"./useLabels-ZAvHqBgR.js";import"./number-wfr-a2dw.js";import"./I18nProvider-g-YIgX08.js";import"./useButton-DqI1YsZH.js";import"./usePress-BAaUvFTM.js";import"./textSelection-B_r4mkkT.js";import"./useHover-DMFi8o2f.js";import"./Link-xjP27hSY.js";import"./useLink-Bo6f_MnZ.js";import"./getNodeText-Dcnyi_vD.js";import"./Flex-BCU67wwE.js";import"./Text-BnjPxtF1.js";import"./styled-ri-sX4kt.js";import"./createStyles-yD3y8ldD.js";import"./LinearProgress-Cgq6kP0I.js";import"./ErrorPanel-DVQwZFE4.js";import"./WarningPanel-DujtwXI3.js";import"./ExpandMore-JdlG67sm.js";import"./AccordionDetails-DoQbYKV5.js";import"./index-B9sM2jn7.js";import"./Collapse-CV0Gnfx7.js";import"./MarkdownContent-DNdcex5U.js";import"./CodeSnippet-DNItfSxA.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./ListItem-CFzuWqPn.js";import"./ListItemText-DTWT_exv.js";import"./CopyTextButton-BZZjHxUE.js";import"./useCopyToClipboard-QnRjVoLF.js";import"./Tooltip-CHTJ2CJI.js";import"./useOverlayTriggerState-G8ih59XW.js";import"./useControlledState-CxsccuSa.js";import"./animation-D6w75ks6.js";import"./ButtonIcon-BJxB3R9Y.js";import"./index-m_RVXM54.js";import"./Divider-Bkd74j0H.js";import"./Tooltip-Ck3d58SL.js";import"./Popper-BQ9oVfPx.js";import"./Portal-DIfaqq2w.js";import"./useToggle-BfDccAfl.js";import"./useFormReset-BXjwexTG.js";import"./useToggleState-7RpI4NxM.js";import"./VisuallyHidden-CgJk2kmU.js";class me{[Z]="external";id;params;optional;defaultTarget;constructor(i,a,n,r){this.id=i,this.params=a,this.optional=n,this.defaultTarget=r}toString(){return this.#e?`externalRouteRef{id=${this.#e},legacyId=${this.id}}`:`routeRef{type=external,id=${this.id}}`}getDefaultTarget(){return this.defaultTarget}$$type="@backstage/ExternalRouteRef";version="v1";T=void 0;#e=void 0;getParams(){return this.params}getDescription(){return this.#e?this.#e:this.id}setId(i){if(!i)throw new Error("ExternalRouteRef id must be a non-empty string");if(this.#e&&this.#e!==i)throw new Error(`ExternalRouteRef was referenced twice as both '${this.#e}' and '${i}'`);this.#e=i}}function he(e){return new me(e.id,e.params??[],!!e.optional,e?.defaultTarget)}const C=he({id:"catalog-index",optional:!0,defaultTarget:"catalog.catalogIndex"});function fe(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var q={exports:{}},ge=q.exports,O;function ye(){return O||(O=1,(function(e,i){(function(a,n){typeof fe=="function"?e.exports=n():a.pluralize=n()})(ge,function(){var a=[],n=[],r={},o={},u={};function h(t){return typeof t=="string"?new RegExp("^"+t+"$","i"):t}function f(t,s){return t===s?s:t===t.toLowerCase()?s.toLowerCase():t===t.toUpperCase()?s.toUpperCase():t[0]===t[0].toUpperCase()?s.charAt(0).toUpperCase()+s.substr(1).toLowerCase():s.toLowerCase()}function m(t,s){return t.replace(/\$(\d{1,2})/g,function(b,g){return s[g]||""})}function d(t,s){return t.replace(s[0],function(b,g){var v=m(s[1],arguments);return f(b===""?t[g-1]:b,v)})}function p(t,s,b){if(!t.length||r.hasOwnProperty(t))return s;for(var g=b.length;g--;){var v=b[g];if(v[0].test(s))return d(s,v)}return s}function w(t,s,b){return function(g){var v=g.toLowerCase();return s.hasOwnProperty(v)?f(g,v):t.hasOwnProperty(v)?f(g,t[v]):p(v,g,b)}}function y(t,s,b,g){return function(v){var T=v.toLowerCase();return s.hasOwnProperty(T)?!0:t.hasOwnProperty(T)?!1:p(T,T,b)===T}}function c(t,s,b){var g=s===1?c.singular(t):c.plural(t);return(b?s+" ":"")+g}return c.plural=w(u,o,a),c.isPlural=y(u,o,a),c.singular=w(o,u,n),c.isSingular=y(o,u,n),c.addPluralRule=function(t,s){a.push([h(t),s])},c.addSingularRule=function(t,s){n.push([h(t),s])},c.addUncountableRule=function(t){if(typeof t=="string"){r[t.toLowerCase()]=!0;return}c.addPluralRule(t,"$0"),c.addSingularRule(t,"$0")},c.addIrregularRule=function(t,s){s=s.toLowerCase(),t=t.toLowerCase(),u[t]=s,o[s]=t},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["is","are"],["was","were"],["has","have"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["looey","looies"],["thief","thieves"],["groove","grooves"],["pickaxe","pickaxes"],["passerby","passersby"]].forEach(function(t){return c.addIrregularRule(t[0],t[1])}),[[/s?$/i,"s"],[/[^\u0000-\u007F]$/i,"$0"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(t){return c.addPluralRule(t[0],t[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/ies$/i,"y"],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,"$1ie"],[/\b(mon|smil)ies$/i,"$1ey"],[/\b((?:tit)?m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,"$1"],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,"$1sis"],[/(movie|twelve|abuse|e[mn]u)s$/i,"$1"],[/(test)(?:is|es)$/i,"$1is"],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(t){return c.addSingularRule(t[0],t[1])}),["adulthood","advice","agenda","aid","aircraft","alcohol","ammo","analytics","anime","athletics","audio","bison","blood","bream","buffalo","butter","carp","cash","chassis","chess","clothing","cod","commerce","cooperation","corps","debris","diabetes","digestion","elk","energy","equipment","excretion","expertise","firmware","flounder","fun","gallows","garbage","graffiti","hardware","headquarters","health","herpes","highjinks","homework","housework","information","jeans","justice","kudos","labour","literature","machinery","mackerel","mail","media","mews","moose","music","mud","manga","news","only","personnel","pike","plankton","pliers","police","pollution","premises","rain","research","rice","salmon","scissors","series","sewage","shambles","shrimp","software","species","staff","swine","tennis","traffic","transportation","trout","tuna","wealth","welfare","whiting","wildebeest","wildlife","you",/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(c.addUncountableRule),c})})(q)),q.exports}var ve=ye();const be=_(ve);var E,z;function we(){if(z)return E;z=1;class e{constructor(n){this.value=n,this.next=void 0}}class i{constructor(){this.clear()}enqueue(n){const r=new e(n);this._head?(this._tail.next=r,this._tail=r):(this._head=r,this._tail=r),this._size++}dequeue(){const n=this._head;if(n)return this._head=this._head.next,this._size--,n.value}clear(){this._head=void 0,this._tail=void 0,this._size=0}get size(){return this._size}*[Symbol.iterator](){let n=this._head;for(;n;)yield n.value,n=n.next}}return E=i,E}var P,G;function $e(){if(G)return P;G=1;const e=we();return P=a=>{if(!((Number.isInteger(a)||a===1/0)&&a>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up");const n=new e;let r=0;const o=()=>{r--,n.size>0&&n.dequeue()()},u=async(m,d,...p)=>{r++;const w=(async()=>m(...p))();d(w);try{await w}catch{}o()},h=(m,d,...p)=>{n.enqueue(u.bind(null,m,d,...p)),(async()=>(await Promise.resolve(),r<a&&n.size>0&&n.dequeue()()))()},f=(m,...d)=>new Promise(p=>{h(m,p,...d)});return Object.defineProperties(f,{activeCount:{get:()=>r},pendingCount:{get:()=>n.size},clearQueue:{value:()=>{n.clear()}}}),f},P}var xe=$e();const Te=_(xe),ke=Te(5),Re=(e,i)=>{const{kind:a,type:n}=i,r={kind:a.toLowerCase(),type:n,owners:e,user:"all"};return te.stringify({filters:r},{arrayFormat:"repeat"})},qe=e=>[...U(e,ie,{kind:"Group"}).map(({kind:n,namespace:r,name:o})=>$({kind:n,namespace:r,name:o})),$(e)],je=e=>e!==void 0,K=async(e,i,a=[])=>{const n=U(e,ne,{kind:"Group"}),r=n.length>0,o=$(e);if(r){const u=n.map(p=>$(p)),m=(await ke(()=>i.getEntitiesByRefs({fields:["kind","metadata.namespace","metadata.name","relations"],entityRefs:u}))).items.filter(je).filter(p=>!a.includes($(p))),d=(await Promise.all(m.map(p=>K(p,i,[...a,o])))).flatMap(p=>p);return D.uniq([...d,o])}return[o]},Ae=async(e,i,a)=>{const n=e.kind==="Group",r=i==="aggregated",o=e.kind==="User";return r&&n?K(e,a):r&&o?qe(e):[$(e)]},Ee=e=>new Promise(i=>setTimeout(i,e)),Pe=async(e,i,a,n=100,r=100)=>{const o=[];for(let u=0;u<e.length;u+=n){const h=e.slice(u,u+n),f=await a.getEntities({filter:[{kind:i,"relations.ownedBy":h}],fields:["kind","metadata.name","metadata.namespace","spec.type","relations"]});o.push(...f.items),u+n<e.length&&await Ee(r)}return D.uniqBy(o,$)};function Ce(e,i,a,n=6){const r=Y(J),o=a??["Component","API","System","Resource"],{loading:u,error:h,value:f}=ee(async()=>{const m=await Ae(e,i,r);return(await Pe(m,o,r)).reduce((y,c)=>{const t=y.find(s=>s.kind===c.kind&&s.type===c.spec?.type);return t?t.count+=1:y.push({kind:c.kind,type:c.spec?.type?.toString(),count:1}),y},[]).sort((y,c)=>c.count-y.count).slice(0,n).map(y=>({counter:y.count,type:y.type,kind:y.kind,queryParams:Re(m,y)}))},[r,e,i]);return{componentsWithCounters:f,loading:u,error:h}}const Le=F(e=>W({card:{border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[2],borderRadius:"4px",padding:e.spacing(2),transition:`${e.transitions.duration.standard}ms`,"&:hover":{boxShadow:e.shadows[4]},height:"100%"},bold:{fontWeight:e.typography.fontWeightBold},smallFont:{fontSize:e.typography.body2.fontSize},entityTypeBox:{background:i=>e.getPageTheme({themeId:i.type}).backgroundImage,color:i=>e.getPageTheme({themeId:i.type}).fontColor}}),{name:"PluginOrgComponentsGrid"}),Ie=({counter:e,type:i,kind:a,url:n})=>{const r=Le({type:i??a}),o=i??a,u=o.length>10,h=l.jsxs(I,{className:`${r.card} ${r.entityTypeBox}`,display:"flex",flexDirection:"column",alignItems:"center",children:[l.jsx(A,{className:r.bold,variant:"h6",children:e}),l.jsx(I,{sx:{width:"100%",textAlign:"center"},children:l.jsx(A,{className:`${r.bold} ${u&&r.smallFont}`,variant:"h6",children:l.jsx(ce,{text:be(o.toUpperCase(),e)})})}),i&&l.jsx(A,{variant:"subtitle1",children:a})]});return n?l.jsx(pe,{to:n,variant:"body2",children:h}):h},M=({className:e,entity:i,relationsType:a,relationAggregation:n,entityFilterKind:r,entityLimit:o=6})=>{const u=oe(C);if(!a&&!n)throw new Error("The relationAggregation property must be set as an EntityRelationAggregation type.");const{componentsWithCounters:h,loading:f,error:m}=Ce(i,n??a,r,o);return f?l.jsx(le,{}):m?l.jsx(ue,{error:m}):l.jsx(x,{container:!0,className:e,children:h?.map(d=>l.jsx(x,{item:!0,xs:6,md:6,lg:4,children:l.jsx(Ie,{counter:d.counter,kind:d.kind,type:d.type,url:u&&`${u()}?${d.queryParams}`})},`${d.kind}:${d.type??""}`))})};M.__docgenInfo={description:"",methods:[],displayName:"ComponentsGrid",props:{className:{required:!1,tsType:{name:"string"},description:""},entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"6",computed:!1}}}};const Oe=F(()=>W({grid:{overflowY:"auto",marginTop:0}}),{name:"PluginOrgOwnershipCard"}),j=e=>{const{entityFilterKind:i,hideRelationsToggle:a,entityLimit:n=6}=e,r=e.relationAggregation??e.relationsType,o=a===void 0?!1:a,u=Oe(),{entity:h}=re(),{t:f}=H(se),m=h.kind==="User"?"aggregated":"direct",[d,p]=L.useState(r??m);return L.useEffect(()=>{r||p(m)},[p,m,r]),l.jsx(ae,{title:f("ownershipCard.title"),headerActions:!o&&l.jsx(de,{isSelected:d!=="direct",onChange:w=>p(w?"aggregated":"direct"),label:f("ownershipCard.aggregateRelationsToggle.label")}),children:l.jsx(M,{className:u.grid,entity:h,entityLimit:n,relationAggregation:d,entityFilterKind:i})})};j.__docgenInfo={description:"@public",methods:[],displayName:"OwnershipCard",props:{entityFilterKind:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},hideRelationsToggle:{required:!1,tsType:{name:"boolean"},description:""},relationsType:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:"@deprecated Please use relationAggregation instead"},relationAggregation:{required:!1,tsType:{name:"union",raw:"'direct' | 'aggregated'",elements:[{name:"literal",value:"'direct'"},{name:"literal",value:"'aggregated'"}]},description:""},entityLimit:{required:!1,tsType:{name:"number"},description:""}}};const vn={title:"Plugins/Org/Ownership Card",component:j,tags:["!manifest"]},V={apiVersion:"backstage.io/v1alpha1",kind:"Group",metadata:{name:"team-a",description:"Team A"},spec:{profile:{displayName:"Team A",email:"team-a@example.com",picture:"https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4"},type:"group",children:[]}},ze=({type:e,name:i})=>({apiVersion:"backstage.io/v1alpha1",kind:"Component",metadata:{name:i},spec:{type:e},relations:[{type:"ownedBy",targetRef:"group:default/team-a",target:{namespace:"default",kind:"group",name:"team-a"}}]}),Ge=["service","website","api","playlist","grpc","trpc","library"],_e=Ge.map((e,i)=>ze({type:e,name:`${e}-${i}`})),Se={getEntities:()=>Promise.resolve({items:_e})},Q=X.from([J,Se]),k=()=>N(l.jsx(S,{apis:Q,children:l.jsx(B,{entity:V,children:l.jsx(x,{container:!0,spacing:4,children:l.jsx(x,{item:!0,xs:12,md:6,style:{maxHeight:320,overflow:"hidden"},children:l.jsx(j,{})})})})}),{mountedRoutes:{"/catalog":C}}),R={argTypes:{entityLimit:{control:{type:"number"}}},render:({entityLimit:e})=>N(l.jsx(S,{apis:Q,children:l.jsx(B,{entity:V,children:l.jsx(x,{container:!0,spacing:4,children:l.jsx(x,{item:!0,xs:12,md:6,children:l.jsx(j,{entityLimit:e})})})})}),{mountedRoutes:{"/catalog":C}})};k.__docgenInfo={description:"",methods:[],displayName:"Default"};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`() => wrapInTestApp(<ApiProvider apis={apis}>
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
