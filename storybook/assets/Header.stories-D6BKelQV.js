import{j as e}from"./iframe-CwGYDpYH.js";import{H as o}from"./Header-Dp-Quudn.js";import{P as p}from"./Page-BcKRnC4a.js";import{H as r}from"./HeaderLabel-CZ_Vob9E.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D0oSv-iF.js";import"./Box-DK8SMPjv.js";import"./styled-Bo4D4TjS.js";import"./Grid-D9pxZO34.js";import"./makeStyles-B-7ejBjc.js";import"./Breadcrumbs-Cmf0MaFD.js";import"./index-B9sM2jn7.js";import"./Popover-BzcVWMMN.js";import"./Modal-CdGZYRSs.js";import"./Portal-ChQ23K-b.js";import"./List-D7ewfho0.js";import"./ListContext-B7RocSCf.js";import"./ListItem-a-yOdytX.js";import"./Link-CswoIIi-.js";import"./index-fEpbvEIU.js";import"./lodash-DVkgycFV.js";import"./useAnalytics-Bir4eJYF.js";import"./useApp-hwqbTLFx.js";import"./Page-DL8DvhDy.js";import"./useMediaQuery-DbCbp13j.js";import"./Tooltip-0URE30Se.js";import"./Popper-B-_f95Yk.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
