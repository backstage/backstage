import{bR as e}from"./iframe-Dv_LOz74.js";import{H as o}from"./Header-C7kV432k.js";import{P as p}from"./Page-CcTpNmAJ.js";import{H as r}from"./HeaderLabel-BGbbdP5L.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BlIZyaQt.js";import"./Box-CKs0ezee.js";import"./styled-DwgY9p9o.js";import"./Grid-CVdaifsV.js";import"./makeStyles-Balw57Mg.js";import"./Breadcrumbs-EZxWipKM.js";import"./index-B9sM2jn7.js";import"./Popover-CLwhXdRh.js";import"./Modal-DrYXJl1m.js";import"./Portal-BH6-A2cn.js";import"./List-DO7BjG3n.js";import"./ListContext-BQeOYvd4.js";import"./ListItem-CPDhSI3E.js";import"./Link-Dhqn3FRD.js";import"./index-B9AQLwBR.js";import"./lodash-D8r4FPUQ.js";import"./useAnalytics-BQ1Ntni6.js";import"./useApp-Cy2_bCrQ.js";import"./Page-BKycxKFc.js";import"./useMediaQuery-C6UyU63t.js";import"./Tooltip-DaQ1ZG1o.js";import"./Popper-BKKCXmHB.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
