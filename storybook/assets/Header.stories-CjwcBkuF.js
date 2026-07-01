import{bR as e}from"./iframe-ttKo4f2F.js";import{H as o}from"./Header-q2G0DOYH.js";import{P as p}from"./Page-CXt6R04y.js";import{H as r}from"./HeaderLabel-Dv_iyzFe.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BV0ve7iS.js";import"./Box-BLh1p0gC.js";import"./styled-BRZQaIhs.js";import"./Grid-DLVq2uhF.js";import"./makeStyles-uLqtFRhe.js";import"./Breadcrumbs-CwCYbubI.js";import"./index-B9sM2jn7.js";import"./Popover-BFKdvmuH.js";import"./Modal-BhRYV-wh.js";import"./Portal-CWOA4stm.js";import"./List-DUqrfDnj.js";import"./ListContext-D9QAtrI3.js";import"./ListItem-0Ck4kHM2.js";import"./Link-C16865Y8.js";import"./index-Cl71yVqQ.js";import"./lodash-DfqH5_9w.js";import"./useAnalytics-Chjogz3C.js";import"./useApp-CYMzbzRt.js";import"./Page-fZJJOyu-.js";import"./useMediaQuery-CDj2Ewqs.js";import"./Tooltip-D_OskOTB.js";import"./Popper-D_KTqsst.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
