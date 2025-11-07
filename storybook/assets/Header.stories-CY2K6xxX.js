import{j as e}from"./iframe-BpYUhtQT.js";import{H as o}from"./Header-BrhW5OOw.js";import{P as p}from"./Page-BKrpd-OI.js";import{H as r}from"./HeaderLabel-Bh6HQaE9.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-jkWHKPLj.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./Grid-BSBIJVeD.js";import"./Breadcrumbs-B8x43cBZ.js";import"./index-DnL3XN75.js";import"./Popover-BGVNopjx.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./ListItem-DoWEcNrm.js";import"./Link-CMqafiV1.js";import"./lodash-CwBbdt2Q.js";import"./index-Ce36-Nje.js";import"./useAnalytics-Bh2pk9PK.js";import"./useApp-DvIsmpbF.js";import"./Page-CvzAur2d.js";import"./useMediaQuery-uf84O-Sz.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
