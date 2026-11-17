import{j as e}from"./iframe-BS0xFXlr.js";import{H as o}from"./Header-A_IkNmg8.js";import{P as p}from"./Page-CpdZsDmQ.js";import{H as r}from"./HeaderLabel-f-BWiY-h.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CoPywV8B.js";import"./Box-CLuirzLp.js";import"./styled-DTU31MMc.js";import"./Grid-BC-GErrP.js";import"./makeStyles-BLXzgJv8.js";import"./Breadcrumbs-CZr9LlH_.js";import"./index-B9sM2jn7.js";import"./Popover-CGUN73PQ.js";import"./Modal-CLDgk_N2.js";import"./Portal-pjLYth_7.js";import"./List-3z7MBLVl.js";import"./ListContext-D9vaJRo5.js";import"./ListItem-BV0lDcKg.js";import"./Link-CIfFi95r.js";import"./index-DC7FuYq9.js";import"./lodash-diAnziC6.js";import"./useApp-DZ3AraTi.js";import"./index-BJ65rCJn.js";import"./useAnalytics-BnNCqh3j.js";import"./Page-ByNaAzbm.js";import"./useMediaQuery-Cq_nIR-l.js";import"./Tooltip-lPd64LOZ.js";import"./Popper-IIGU5fGc.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
