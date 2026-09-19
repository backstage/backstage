import{bQ as e}from"./iframe-CPZQIdXt.js";import{H as o}from"./Header-Cew0KGlf.js";import{P as p}from"./Page-D4ksjtR7.js";import{H as r}from"./HeaderLabel-Uy_4MjAn.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-QtabeBsz.js";import"./Box-BOusxFj4.js";import"./styled-CIRZa-Bo.js";import"./Grid-C3zT8bmo.js";import"./makeStyles-CN7e-MA3.js";import"./Breadcrumbs-Bqx-YhHY.js";import"./index-B9sM2jn7.js";import"./Popover-GH8OnlUj.js";import"./Modal-BDf9xxQS.js";import"./Portal-Ctnt4JlU.js";import"./List-iZvogWce.js";import"./ListContext-DwCGjIB-.js";import"./ListItem-yhm31bzm.js";import"./Link-DMX8IYMY.js";import"./index-BXQvl2XS.js";import"./lodash-KLTtZyUl.js";import"./useAnalytics-C8QM1kJh.js";import"./useApp-CcYHjusD.js";import"./Page-x0F3Wt20.js";import"./useMediaQuery-DzZIuCFb.js";import"./Tooltip-DkBsF8Ex.js";import"./Popper-CuDuPUoH.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
