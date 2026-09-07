import{bQ as e}from"./iframe-DFSHFeCl.js";import{H as o}from"./Header-BTAgA4tW.js";import{P as p}from"./Page-DpD8YKmB.js";import{H as r}from"./HeaderLabel-DFKcKxci.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DzOPr6DA.js";import"./Box-DvZz7Df4.js";import"./styled-fSpPvENu.js";import"./Grid-Dmi5E4PF.js";import"./makeStyles--EHfQ_qo.js";import"./Breadcrumbs-Be7IWQuC.js";import"./index-B9sM2jn7.js";import"./Popover-Cr0AMDrB.js";import"./Modal-RmFSFyNG.js";import"./Portal-CSq3t6wO.js";import"./List-DvEl071k.js";import"./ListContext-D7g9KH0X.js";import"./ListItem-C0wLdb_u.js";import"./Link-CSkeAaLf.js";import"./index-CvTLTj8i.js";import"./lodash-DdiVqFUi.js";import"./useAnalytics-CCyVhjtr.js";import"./useApp-DuAavzIK.js";import"./Page-DqSQWn7R.js";import"./useMediaQuery-CE4G4Rnr.js";import"./Tooltip-CnX8MjpL.js";import"./Popper-BJeilRMM.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
