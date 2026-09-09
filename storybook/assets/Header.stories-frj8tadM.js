import{bQ as e}from"./iframe-wUGVZK80.js";import{H as o}from"./Header-Maq7RM_s.js";import{P as p}from"./Page-Bf6HmnLT.js";import{H as r}from"./HeaderLabel-DO8wa29G.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Bk_klbN1.js";import"./Box-DE0sHIcK.js";import"./styled-BJSwmENK.js";import"./Grid-B4FlnJ2g.js";import"./makeStyles-Cw8l4FUa.js";import"./Breadcrumbs-DJKOCxzE.js";import"./index-B9sM2jn7.js";import"./Popover-D2tp82qk.js";import"./Modal-JTvV5kGM.js";import"./Portal-CErvu087.js";import"./List-Ci0k_jrS.js";import"./ListContext-50b39xzR.js";import"./ListItem-DDigxjaw.js";import"./Link-Go23hbH8.js";import"./index-CGlIW_he.js";import"./lodash-DyeR7AcE.js";import"./useAnalytics-Cx9_3Zxd.js";import"./useApp-YEoBNPcr.js";import"./Page-BwpPGuMa.js";import"./useMediaQuery-Du3ATRug.js";import"./Tooltip-w2Cdof0A.js";import"./Popper--wSxGKWI.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
