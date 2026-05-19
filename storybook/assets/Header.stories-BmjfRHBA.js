import{j as e}from"./iframe-BCuiGO18.js";import{H as o}from"./Header-CVP8mBCl.js";import{P as p}from"./Page-D6fFrkKd.js";import{H as r}from"./HeaderLabel-D_tceZSY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CAwre02C.js";import"./Box-DF0subjV.js";import"./styled-n3Xk8m2M.js";import"./Grid-ks1F9Ab_.js";import"./makeStyles-BiC0-IRq.js";import"./Breadcrumbs-hkIIhSlI.js";import"./index-B9sM2jn7.js";import"./Popover-CyM8W8X-.js";import"./Modal-BjSLJdmT.js";import"./Portal-Bdh2rISL.js";import"./List-DYKyo639.js";import"./ListContext-DefbUR_f.js";import"./ListItem-D5tv8MX2.js";import"./Link-D8nUG02y.js";import"./index-BOxQOO6X.js";import"./lodash-LxfdXjj1.js";import"./useAnalytics-CLav7vMM.js";import"./useApp-57KoDWVG.js";import"./Page-C6PLD35H.js";import"./useMediaQuery-Bm42w48N.js";import"./Tooltip-C0suzQKt.js";import"./Popper-nJ1Os4sA.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
