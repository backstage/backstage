import{bQ as e}from"./iframe-Zd-YI-2K.js";import{H as o}from"./Header-CPJSiQFm.js";import{P as p}from"./Page-DCDtbrEi.js";import{H as r}from"./HeaderLabel-B_bqnJUa.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D3wsFcHr.js";import"./Box-DGJn4Sz7.js";import"./styled-DxJJRGJP.js";import"./Grid-B5pNkdLG.js";import"./makeStyles-Bs9jLpYU.js";import"./Breadcrumbs-CxIAfh96.js";import"./index-B9sM2jn7.js";import"./Popover-Bbvb4i1E.js";import"./Modal-CrjAUnpO.js";import"./Portal-PVH4BBfN.js";import"./List-DUT6hMb6.js";import"./ListContext-C7VyENNE.js";import"./ListItem-CnCwlIuh.js";import"./Link-B1-7jmla.js";import"./index-3zt1A_J2.js";import"./lodash-qTrB2OqT.js";import"./useAnalytics-Dh88aAVh.js";import"./useApp-DB_FflUZ.js";import"./Page-XyJNnUL3.js";import"./useMediaQuery-CclrOL_c.js";import"./Tooltip-BJjWT8pf.js";import"./Popper-DAIaQuPH.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
