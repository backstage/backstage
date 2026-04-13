import{j as e}from"./iframe-Pg_F-I9L.js";import{H as o}from"./Header-CQbzwTJ7.js";import{P as p}from"./Page-2IllbFbw.js";import{H as r}from"./HeaderLabel-kDVkjw1V.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-53BqrsGd.js";import"./Box-203OJvOv.js";import"./styled-CAdW7jEY.js";import"./Grid-B2ie39ah.js";import"./makeStyles-Cbx_09Po.js";import"./Breadcrumbs-z7XyQjET.js";import"./index-B9sM2jn7.js";import"./Popover-Ct-qR0uU.js";import"./Modal-eVB76OKV.js";import"./Portal-CkW81tAw.js";import"./List-6IhIysu1.js";import"./ListContext-CwmeD3xv.js";import"./ListItem-2g96ETpe.js";import"./Link-CtDLnTRC.js";import"./index-M3sqaKV4.js";import"./lodash-B6WwamON.js";import"./useAnalytics-DLzqrBGl.js";import"./useApp-Dqd5lgHs.js";import"./Page-DlPM3pt3.js";import"./useMediaQuery-COEjkueC.js";import"./Tooltip-CpdE-o-J.js";import"./Popper-CaJ2KdJo.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
