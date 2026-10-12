import{j as e}from"./iframe-GY9q4FO8.js";import{H as o}from"./Header-DmkPe8BA.js";import{P as p}from"./Page-B_Uq7RaL.js";import{H as r}from"./HeaderLabel-C6HDOOcU.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Bh7i9bwK.js";import"./Box-BD1hfHK_.js";import"./styled-gNaRwUS_.js";import"./Grid-B0Qn3Dnm.js";import"./makeStyles-2U49SRly.js";import"./Breadcrumbs-CX90Ibu-.js";import"./index-B9sM2jn7.js";import"./Popover-DnZsmbxs.js";import"./Modal-bfkZlVQi.js";import"./Portal-wY1dwSda.js";import"./List-WDJE0HvX.js";import"./ListContext-Dnh-YOBQ.js";import"./ListItem-ChY-Ftn4.js";import"./Link-C7aPd1jE.js";import"./index-C3IUYLj9.js";import"./lodash-DzeDbzRd.js";import"./useAnalytics-ChuvGTuC.js";import"./useApp-KPq2D3WO.js";import"./Page-DhhZRH4t.js";import"./useMediaQuery-CtphFgLf.js";import"./Tooltip-B4YYyVSr.js";import"./Popper-5I_R4V6q.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
