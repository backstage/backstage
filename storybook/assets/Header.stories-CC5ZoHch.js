import{j as e}from"./iframe-C23uhf86.js";import{H as o}from"./Header-CIB5j-Rw.js";import{P as p}from"./Page-CfPNIea-.js";import{H as r}from"./HeaderLabel-zoT4wajH.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DyAI1FC3.js";import"./Box-WThUmTfz.js";import"./styled-CWwxa9HM.js";import"./Grid-B2cP74K4.js";import"./makeStyles-CpHXwfxK.js";import"./Breadcrumbs-B-79twic.js";import"./index-B9sM2jn7.js";import"./Popover-TY3wPQ66.js";import"./Modal-Dut4J2Kn.js";import"./Portal-D5gzgC6z.js";import"./List-CxEdUBo1.js";import"./ListContext-Dp4qNsSt.js";import"./ListItem-D9IookCZ.js";import"./Link-BTfSvZWa.js";import"./index-DzKqHxgJ.js";import"./lodash-DUhit4Jc.js";import"./useAnalytics-cDq5hBLc.js";import"./useApp-BqO9fDba.js";import"./Page-UXXJxqks.js";import"./useMediaQuery-CvIShWpx.js";import"./Tooltip-CSFZreiO.js";import"./Popper-ByrnRm1o.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
