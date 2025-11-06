import{j as e}from"./iframe-DKl1TaBY.js";import{H as o}from"./Header-Bb5WRIIV.js";import{P as p}from"./Page-CcXpkCNI.js";import{H as r}from"./HeaderLabel-Cg_27dha.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C62OOZn8.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./Grid-DucnE1Qv.js";import"./Breadcrumbs-D3sZEp24.js";import"./index-DnL3XN75.js";import"./Popover-CYX2rhOY.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./ListItem-Cik-ImzB.js";import"./Link-BtYWFjac.js";import"./lodash-CwBbdt2Q.js";import"./index-CAizWZSO.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./Page-B1CZycKH.js";import"./useMediaQuery-D7zlXt0H.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
