import{j as e}from"./iframe-BNTyYmtG.js";import{H as o}from"./Header-jZRKqWJ9.js";import{P as p}from"./Page-B4nrSNyS.js";import{H as r}from"./HeaderLabel-C6BhDNdY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CEDV2Sgx.js";import"./Box-Kfk7RP33.js";import"./styled-D-f3nXPd.js";import"./Grid-SLvQHwt_.js";import"./makeStyles-BagILknn.js";import"./Breadcrumbs-D6RIOevS.js";import"./index-B9sM2jn7.js";import"./Popover-wogxwwQM.js";import"./Modal-D-azSMDI.js";import"./Portal-BBdVG2wg.js";import"./List-DAAs5hS0.js";import"./ListContext-CAawvRLi.js";import"./ListItem-iQvf4R9D.js";import"./Link-DTnbaAdV.js";import"./index-Co_R5sG-.js";import"./lodash-hyEQ1H7W.js";import"./useAnalytics-D95_uiv8.js";import"./useApp-rt0dQGpV.js";import"./Page-CatkVWQC.js";import"./useMediaQuery-B-I8Jn-Y.js";import"./Tooltip-DUwPyMWo.js";import"./Popper-CZkon0U5.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
