import{j as e}from"./iframe-B6vHPHUS.js";import{H as o}from"./Header-DrI2UdOC.js";import{P as p}from"./Page-CW2HGX-y.js";import{H as r}from"./HeaderLabel-DoCZ0HHL.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DZTe_dyH.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./Grid-BHnfM9BN.js";import"./Breadcrumbs-Cy0hjOnc.js";import"./index-DnL3XN75.js";import"./Popover-CBmXs0vj.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./ListItem-BxDrZyrD.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./index-CG8HQpK_.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./Page-BY1gpxFq.js";import"./useMediaQuery-B4U0XxuS.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
