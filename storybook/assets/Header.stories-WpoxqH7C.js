import{bQ as e}from"./iframe-B771vieD.js";import{H as o}from"./Header-BcD00Ep1.js";import{P as p}from"./Page-Bh58csrs.js";import{H as r}from"./HeaderLabel-BWOJ-Ptt.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-1vgsBlyy.js";import"./Box-DejrWpfY.js";import"./styled-DTppfcCN.js";import"./Grid-CkxOXqgi.js";import"./makeStyles-C1hpTmTF.js";import"./Breadcrumbs-eYeRvy7s.js";import"./index-B9sM2jn7.js";import"./Popover-DAltsPU_.js";import"./Modal-qDF8Wu8X.js";import"./Portal-WKffzKiX.js";import"./List-BIqut_Cj.js";import"./ListContext-DWmDADWg.js";import"./ListItem-CGxMT5ro.js";import"./Link-Rn7tZilw.js";import"./index-DUu8846e.js";import"./lodash-BCHMAmg_.js";import"./useAnalytics-Di36h0wy.js";import"./useApp-CmxPLI0J.js";import"./Page-D80a6Qca.js";import"./useMediaQuery-D7aY7lVv.js";import"./Tooltip-CcVvcQrP.js";import"./Popper-SeSBrbgv.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
