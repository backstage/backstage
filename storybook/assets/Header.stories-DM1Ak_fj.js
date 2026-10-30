import{j as e}from"./iframe-bgo7e1e-.js";import{H as o}from"./Header-D5b52PGI.js";import{P as p}from"./Page-3oHzoXY5.js";import{H as r}from"./HeaderLabel-CyID8T9b.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BBkx9Jb2.js";import"./Box-DGsFNqvi.js";import"./styled-D89UzqIM.js";import"./Grid-T6mBOXNr.js";import"./makeStyles-DoaRxWiQ.js";import"./Breadcrumbs-CuPY3yZK.js";import"./index-B9sM2jn7.js";import"./Popover-Cyn351Ub.js";import"./Modal-Cql6tkbp.js";import"./Portal-DiZEHrPB.js";import"./List-BMiwvO_T.js";import"./ListContext-C2MdW-s7.js";import"./ListItem-DenzP3x1.js";import"./Link-BuK2DZMN.js";import"./index-D2QNSMaZ.js";import"./lodash-0Uigzlnj.js";import"./useAnalytics-7LMFMwsI.js";import"./useApp-DNALaMPe.js";import"./Page-D2TAbKA7.js";import"./useMediaQuery-86IzbB37.js";import"./Tooltip-B_xXmz-W.js";import"./Popper-BDX9YrO-.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
