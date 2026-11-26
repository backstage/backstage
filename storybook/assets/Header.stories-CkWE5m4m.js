import{j as e}from"./iframe-7sCYbwMA.js";import{H as o}from"./Header--rLucUos.js";import{P as p}from"./Page-C31Le1kt.js";import{H as r}from"./HeaderLabel-CZUzSHb4.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DJyX0IIT.js";import"./Box-CDNKgggc.js";import"./styled-aCG7DPFc.js";import"./Grid-gVLrUN9k.js";import"./makeStyles-B-ZbX8FI.js";import"./Breadcrumbs-GadsfnOc.js";import"./index-B9sM2jn7.js";import"./Popover-DZWWbmbv.js";import"./Modal-CSNkAH3G.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-DyovRpNc.js";import"./List-BiIsoLBQ.js";import"./ListContext-CefK0ZUa.js";import"./ListItem-tKAcflkD.js";import"./Link-Bhg-T8Du.js";import"./index-Cwb1jpWy.js";import"./lodash-CF3MOqf-.js";import"./useApp-BrC99Fm0.js";import"./index-CohR7ztA.js";import"./useAnalytics-5oGCkfyb.js";import"./Page-Bv-RApAP.js";import"./useMediaQuery-B548BgJa.js";import"./Tooltip-Z4anb94V.js";import"./Popper-CdSeWJaZ.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};
