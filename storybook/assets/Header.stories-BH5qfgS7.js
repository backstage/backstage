import{bQ as e}from"./iframe-DwtLqRd0.js";import{H as o}from"./Header-BJP9f6JJ.js";import{P as p}from"./Page-D8PLaW5P.js";import{H as r}from"./HeaderLabel-D8TrpCdK.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Dr3Wy3JY.js";import"./Box-7z3gKpft.js";import"./styled-2OXr0LLp.js";import"./Grid-CYWjZ88i.js";import"./makeStyles-61D4HnMF.js";import"./Breadcrumbs-DDXVjJIv.js";import"./index-B9sM2jn7.js";import"./Popover-CGuqPOl2.js";import"./Modal-BfoOEHXm.js";import"./Portal--PiZVoQ5.js";import"./List-78xudjL7.js";import"./ListContext-DHZNjXO9.js";import"./ListItem-CZsOW-2D.js";import"./Link-DWcyScs4.js";import"./index-5hB1atvh.js";import"./lodash-B5HI3AG3.js";import"./useAnalytics-DP-R2foX.js";import"./useApp-CwD5tnbo.js";import"./Page-DsoKCAhh.js";import"./useMediaQuery-CF2EajeT.js";import"./Tooltip-BHOKEGJE.js";import"./Popper-Tfc40hpS.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
