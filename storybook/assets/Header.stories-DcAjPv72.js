import{j as e}from"./iframe-DVllq_JJ.js";import{H as o}from"./Header-D_QRXYnt.js";import{P as p}from"./Page-DhJK8fFk.js";import{H as r}from"./HeaderLabel-CsysjZjt.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CSWI4zkb.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./Grid-GLf92srY.js";import"./Breadcrumbs-BO0GSUGx.js";import"./index-DnL3XN75.js";import"./Popover-BN4BKHON.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./ListItem-DLfoHZ9h.js";import"./Link-Dfj65VZ1.js";import"./lodash-CwBbdt2Q.js";import"./index-CuC9x3hw.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./Page-D3qs3YpX.js";import"./useMediaQuery-Co111MRs.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
