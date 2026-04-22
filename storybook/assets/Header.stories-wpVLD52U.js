import{j as e}from"./iframe-CC8dZ5v0.js";import{H as o}from"./Header-BbVnmh5V.js";import{P as p}from"./Page-CcZShUlx.js";import{H as r}from"./HeaderLabel-Dq16a4Ln.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Dcs0KudV.js";import"./Box-BhabvipW.js";import"./styled-CM_Xf2DM.js";import"./Grid-CCYqzPMW.js";import"./makeStyles-DTH3glJL.js";import"./Breadcrumbs-Bz_YF8lP.js";import"./index-B9sM2jn7.js";import"./Popover-CphrO87E.js";import"./Modal-Zvs4RyO_.js";import"./Portal-COibyzBH.js";import"./List-D-_F1OrG.js";import"./ListContext-Bfuv36sR.js";import"./ListItem-B4tF2XTx.js";import"./Link-ORDuPGhJ.js";import"./index-twBdpm7Y.js";import"./lodash-BzWoCuL2.js";import"./useAnalytics-4dX8X2S1.js";import"./useApp-DJZpM7fA.js";import"./Page-4-f3NYYa.js";import"./useMediaQuery-CpQLvn__.js";import"./Tooltip-DdmdxGgY.js";import"./Popper-B3_-o048.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
