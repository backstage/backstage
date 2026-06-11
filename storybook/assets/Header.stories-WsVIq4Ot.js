import{bR as e}from"./iframe-BNSLO1vV.js";import{H as o}from"./Header-QAfpFBek.js";import{P as p}from"./Page-u4BVB-LK.js";import{H as r}from"./HeaderLabel-Bg72yLXU.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BYLhXq8K.js";import"./Box-CUryh8iW.js";import"./styled-X4ZADqyc.js";import"./Grid-C9Nu3WVI.js";import"./makeStyles-CZnQSWDh.js";import"./Breadcrumbs-BEKTiLjh.js";import"./index-B9sM2jn7.js";import"./Popover-CqmPfk9S.js";import"./Modal-nGlf-rBn.js";import"./Portal-CJWU_qpN.js";import"./List-BFUn9Abz.js";import"./ListContext-gUlqcjcC.js";import"./ListItem-D39zADcQ.js";import"./Link-K3MkQ3D3.js";import"./index-C8wTAkbr.js";import"./lodash-CaDdG74r.js";import"./useAnalytics-CeiKLkx8.js";import"./useApp-CMrJz5U2.js";import"./Page-CCW8LZ61.js";import"./useMediaQuery-DM5QQtjA.js";import"./Tooltip-BJEELWEm.js";import"./Popper-hi3NpXOV.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
