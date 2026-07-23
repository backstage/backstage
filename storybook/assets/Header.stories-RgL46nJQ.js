import{bR as e}from"./iframe-DEB_XKCy.js";import{H as o}from"./Header-sqPeQAKI.js";import{P as p}from"./Page-DpH1mnTU.js";import{H as r}from"./HeaderLabel-Cwyh6z3q.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-W2BJ0A0n.js";import"./Box-DFSyaomf.js";import"./styled-EI2gKmN5.js";import"./Grid-CEjxPXH5.js";import"./makeStyles-C8eWtwMZ.js";import"./Breadcrumbs-BIIwoI7G.js";import"./index-B9sM2jn7.js";import"./Popover-DQpBf6ao.js";import"./Modal-PEsHY48S.js";import"./Portal-BIClc4cE.js";import"./List-BRkGi2Sl.js";import"./ListContext-4fnJmzGu.js";import"./ListItem-D1TJUFze.js";import"./Link-BIYNobCf.js";import"./index-D9sSfquE.js";import"./lodash-fMOpK_K8.js";import"./useAnalytics-mLXG6yYh.js";import"./useApp-VyPYetGM.js";import"./Page-DyKC8bzD.js";import"./useMediaQuery-BbdAy-rX.js";import"./Tooltip-DdaDCG3F.js";import"./Popper-DdVrj_XM.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
