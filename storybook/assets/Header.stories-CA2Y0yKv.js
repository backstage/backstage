import{bR as e}from"./iframe-Dzms4wRw.js";import{H as o}from"./Header-nv5eLGd4.js";import{P as p}from"./Page-CwT_Gg1L.js";import{H as r}from"./HeaderLabel-BoAlXz0u.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CAPa7yty.js";import"./Box-BC3MKl-R.js";import"./styled-D_n4yIWo.js";import"./Grid-WTfAUw8g.js";import"./makeStyles-B1h1_YhU.js";import"./Breadcrumbs-ocFJAfzL.js";import"./index-B9sM2jn7.js";import"./Popover-BjHXVuJd.js";import"./Modal-BopK_LfE.js";import"./Portal-BUEMV8dG.js";import"./List-9JTk76WA.js";import"./ListContext-DIjUyL6C.js";import"./ListItem-Buq3cft7.js";import"./Link-cW_x_JDF.js";import"./index-DBBakqER.js";import"./lodash-Cb2Wy_9k.js";import"./useAnalytics-BA98r_JB.js";import"./useApp-BWXSTOil.js";import"./Page-CSJIc3kU.js";import"./useMediaQuery-DlBFzv3k.js";import"./Tooltip-BJx6pd22.js";import"./Popper-Bgm_8I3t.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
