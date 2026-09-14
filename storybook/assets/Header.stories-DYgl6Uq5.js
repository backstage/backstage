import{bQ as e}from"./iframe-C1Du46eF.js";import{H as o}from"./Header-BcVL5n1h.js";import{P as p}from"./Page-BAPg-Kpg.js";import{H as r}from"./HeaderLabel-CYKKlDBZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CGsi8WGj.js";import"./Box-ClfRlZ9E.js";import"./styled-CZd-VRab.js";import"./Grid-DNU8Z8x6.js";import"./makeStyles-tNrkWhA3.js";import"./Breadcrumbs-Vp0k2Z98.js";import"./index-B9sM2jn7.js";import"./Popover-C_oowvYM.js";import"./Modal-DtNWqn-Z.js";import"./Portal-Dy_Xqvnq.js";import"./List-BNs0QNsL.js";import"./ListContext-D4W1XVLG.js";import"./ListItem-CdzCtbN9.js";import"./Link-BV4tUmIi.js";import"./index-CMoliSBC.js";import"./lodash-Dvbzgryf.js";import"./useAnalytics-C9i1P1xg.js";import"./useApp-O4d2mQzz.js";import"./Page-Co9ZKUiu.js";import"./useMediaQuery-REVLsW2-.js";import"./Tooltip-1Uzq-6pe.js";import"./Popper-BVU7Dnxb.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
