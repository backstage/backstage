import{j as e}from"./iframe-V0mCSmm6.js";import{H as o}from"./Header-DzuEP11L.js";import{P as p}from"./Page-D4qh-apx.js";import{H as r}from"./HeaderLabel-Dlp6be6C.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-bhouoVg_.js";import"./Box-BQ6A2zHk.js";import"./styled-jbaTKMHC.js";import"./Grid-B05O9SBT.js";import"./makeStyles-C-ZAQBJP.js";import"./Breadcrumbs-DK85elq1.js";import"./index-B9sM2jn7.js";import"./Popover-D6I6p0LS.js";import"./Modal-BnW_oUOG.js";import"./Portal-CVJVAyEW.js";import"./List-DoUtMqL3.js";import"./ListContext-B-_4E_oo.js";import"./ListItem-UEfIFqBO.js";import"./Link-C8jjCA1D.js";import"./index-BftmwaLS.js";import"./lodash-DiH-Fmp9.js";import"./useAnalytics-DfdyZRyp.js";import"./useApp-BhakDC8j.js";import"./Page-DzJuhmOO.js";import"./useMediaQuery-D33NzmGQ.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
