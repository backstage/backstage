import{bR as e}from"./iframe-BoHeIN98.js";import{H as o}from"./Header-CJPniaKt.js";import{P as p}from"./Page-C1jjh58g.js";import{H as r}from"./HeaderLabel-BoHeD8sF.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-dALW91Zr.js";import"./Box-S5ZWPiRH.js";import"./styled-gfsms5P7.js";import"./Grid-Vi-QfLwX.js";import"./makeStyles-ChrV0xkl.js";import"./Breadcrumbs-DmL5Ogeo.js";import"./index-B9sM2jn7.js";import"./Popover-a9xsBlnN.js";import"./Modal-OS18kCc8.js";import"./Portal-HQ-CMin5.js";import"./List-2zDM7bk8.js";import"./ListContext-D1hfzYAi.js";import"./ListItem-j6ZpAh7t.js";import"./Link-1dowOUr1.js";import"./index-DhR05N1l.js";import"./lodash-BtO-qHMp.js";import"./useAnalytics-Dx-eH7bg.js";import"./useApp-CgoYxTWd.js";import"./Page-BEShiqFY.js";import"./useMediaQuery-UrWUoLKJ.js";import"./Tooltip-Bsc8dTPW.js";import"./Popper-F8TWKpZp.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
