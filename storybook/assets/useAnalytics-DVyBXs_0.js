import{j as p}from"./jsx-runtime-Cw0GR0a5.js";import{r as u}from"./index-CTjT7uj6.js";import{b as m,c as h,g as v,u as g}from"./ApiRef-CqkoWjZn.js";import{a as R}from"./ConfigApi-D1qiBdfc.js";const d=m("analytics-context"),l=()=>{const n=u.useContext(d);if(n===void 0)return{routeRef:"unknown",pluginId:"root",extension:"App"};const e=n.atVersion(1);if(e===void 0)throw new Error("No context found for version 1.");return e},x=n=>{const{attributes:e,children:r}=n,a={...l(),...e},s=R({1:a});return p.jsx(d.Provider,{value:s,children:r})};x.__docgenInfo={description:`Provides components in the child react tree an Analytics Context, ensuring
all analytics events captured within the context have relevant attributes.

@remarks

Analytics contexts are additive, meaning the context ultimately emitted with
an event is the combination of all contexts in the parent tree.

@public`,methods:[],displayName:"AnalyticsContext",props:{attributes:{required:!0,tsType:{name:"Partial",elements:[{name:"intersection",raw:`CommonAnalyticsContext & {
  [param in string]: string | boolean | number | undefined;
}`,elements:[{name:"signature",type:"object",raw:`{
  /**
   * The nearest known parent plugin where the event was captured.
   */
  pluginId: string;

  /**
   * The ID of the routeRef that was active when the event was captured.
   */
  routeRef: string;

  /**
   * The nearest known parent extension where the event was captured.
   */
  extension: string;
}`,signature:{properties:[{key:"pluginId",value:{name:"string",required:!0},description:"The nearest known parent plugin where the event was captured."},{key:"routeRef",value:{name:"string",required:!0},description:"The ID of the routeRef that was active when the event was captured."},{key:"extension",value:{name:"string",required:!0},description:"The nearest known parent extension where the event was captured."}]}},{name:"signature",type:"object",raw:`{
  [param in string]: string | boolean | number | undefined;
}`,signature:{properties:[{key:{name:"string",required:!0},value:{name:"union",raw:"string | boolean | number | undefined",elements:[{name:"string"},{name:"boolean"},{name:"number"},{name:"undefined"}]}}]}}]}],raw:"Partial<AnalyticsContextValue>"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const f=h({id:"core.analytics"}),t=v("core-plugin-api:analytics-tracker-events",()=>({mostRecentGatheredNavigation:void 0,mostRecentRoutableExtensionRender:void 0,beforeUnloadRegistered:!1})),y="_ROUTABLE-EXTENSION-RENDERED";class w{constructor(e,r={routeRef:"unknown",pluginId:"root",extension:"App"}){this.analyticsApi=e,this.context=r,t.beforeUnloadRegistered||(addEventListener("beforeunload",()=>{t.mostRecentGatheredNavigation&&(this.analyticsApi.captureEvent({...t.mostRecentGatheredNavigation,...t.mostRecentRoutableExtensionRender}),t.mostRecentGatheredNavigation=void 0,t.mostRecentRoutableExtensionRender=void 0)},{once:!0,passive:!0}),t.beforeUnloadRegistered=!0)}setContext(e){this.context=e}captureEvent(e,r,{value:o,attributes:a}={}){const{_routeNodeType:s,...i}=this.context;if(e===y){t.mostRecentGatheredNavigation&&(t.mostRecentRoutableExtensionRender={context:{...i,extension:"App"}});return}if(t.mostRecentGatheredNavigation){try{this.analyticsApi.captureEvent({...t.mostRecentGatheredNavigation,...t.mostRecentRoutableExtensionRender})}catch(c){console.warn("Error during analytics event capture. %o",c)}t.mostRecentGatheredNavigation=void 0,t.mostRecentRoutableExtensionRender=void 0}if(e==="navigate"&&s==="gathered"&&i.pluginId==="root"){t.mostRecentGatheredNavigation={action:e,subject:r,value:o,attributes:a,context:i};return}try{this.analyticsApi.captureEvent({action:e,subject:r,value:o,attributes:a,context:i})}catch(c){console.warn("Error during analytics event capture. %o",c)}}}function b(){try{return g(f)}catch{return{captureEvent:()=>{}}}}function C(){const n=u.useRef(null),e=l(),r=b();function o(){return n.current===null&&(n.current=new w(r)),n.current}const a=o();return a.setContext(e),a}export{x as A,f as a,y as r,C as u};
