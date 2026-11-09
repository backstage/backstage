import{j as e}from"./iframe-VdnJkTLn.js";import{H as o}from"./Header-CK-yVaO1.js";import{P as p}from"./Page-BL3AmEtn.js";import{H as r}from"./HeaderLabel-BI1BA3DT.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D7u5wMRD.js";import"./Box-C8SNIygF.js";import"./styled-BeOa9MJM.js";import"./Grid-DMas_M46.js";import"./makeStyles-Cp7Yf1JD.js";import"./Breadcrumbs-DmOtgWwC.js";import"./index-B9sM2jn7.js";import"./Popover-DUg3-e5a.js";import"./Modal-C6P4vkpv.js";import"./Portal-C9ktRzmA.js";import"./List-CiPqBeP2.js";import"./ListContext-C7-lmNu8.js";import"./ListItem-CB_5m-On.js";import"./Link-MVqLQhLF.js";import"./index-CCaKtv_x.js";import"./lodash-DattC6St.js";import"./useAnalytics-olN0zlPD.js";import"./useApp-C1mvMRCJ.js";import"./Page-D8lYFKJE.js";import"./useMediaQuery-D0PznKlD.js";import"./Tooltip-abvhIPuQ.js";import"./Popper-eZnOey74.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
