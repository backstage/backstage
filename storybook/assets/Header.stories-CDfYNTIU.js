import{j as e}from"./iframe-jnmYTFb3.js";import{H as o}from"./Header-Dc-lz7m8.js";import{P as p}from"./Page-19rnMEP8.js";import{H as r}from"./HeaderLabel-C6F6JK0u.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CkNb3aGU.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";import"./Grid-DHhCW-Yl.js";import"./makeStyles-BpJnXHFG.js";import"./Breadcrumbs-CTPbjy-E.js";import"./index-B9sM2jn7.js";import"./Popover-BxTe35X4.js";import"./Modal-BQsPqmbu.js";import"./Portal-KWeLUL2L.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./ListItem-BO9RXUpG.js";import"./Link-DMTmhcL8.js";import"./index-CdOJX-9o.js";import"./lodash-DMwpKwqE.js";import"./useApp-BB1JgkaP.js";import"./index-C7-0R-zP.js";import"./useAnalytics-BuCMBFsG.js";import"./Page-B-KX7SCo.js";import"./useMediaQuery-C8WYIORR.js";import"./Tooltip-SMJoaiqf.js";import"./Popper-DiiDg51H.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
