import{j as e}from"./iframe-cIBAsfTm.js";import{H as o}from"./Header-D9_Oxa-k.js";import{P as p}from"./Page-YZQBtGXj.js";import{H as r}from"./HeaderLabel-Diu3DlG5.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C18ZB1WV.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./Grid-Dgo5ACik.js";import"./Breadcrumbs-JlV-xIKL.js";import"./index-DnL3XN75.js";import"./Popover-BkYTo63x.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./ListItem-DDKzfBu6.js";import"./Link-BTtSeEzC.js";import"./lodash-CwBbdt2Q.js";import"./index-BkxQC8j2.js";import"./useAnalytics-Cn11G-Da.js";import"./useApp-BnMckP-G.js";import"./Page-CBdTr0ab.js";import"./useMediaQuery-D4ZwO_FM.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
