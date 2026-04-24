import{j as e}from"./iframe-Co8mkF6n.js";import{H as o}from"./Header-DfuEcswJ.js";import{P as p}from"./Page-BWZYaSmf.js";import{H as r}from"./HeaderLabel-DUPtUd01.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BZhOtDZ_.js";import"./Box-DA6OOHjA.js";import"./styled-JXjQDdCt.js";import"./Grid-Bhd9sgun.js";import"./makeStyles-CFpzSHZa.js";import"./Breadcrumbs-gai20R1_.js";import"./index-B9sM2jn7.js";import"./Popover-D2fhxQeu.js";import"./Modal-dW7pa_0x.js";import"./Portal-Dx4WX7P_.js";import"./List-BISM21Ia.js";import"./ListContext-DLNgH7rU.js";import"./ListItem-Bi_Q5yAP.js";import"./Link-C5p9O8kc.js";import"./index-Cw_DALCy.js";import"./lodash-PVyZah61.js";import"./useAnalytics-BZJh0YtL.js";import"./useApp-DuP2kRR6.js";import"./Page-IEykcW0S.js";import"./useMediaQuery-C5QdXrDi.js";import"./Tooltip-By13aFvS.js";import"./Popper-DLIxumuv.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
