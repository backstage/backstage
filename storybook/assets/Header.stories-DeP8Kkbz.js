import{j as e}from"./iframe-C8V0qqb2.js";import{H as o}from"./Header-C2Ctdl41.js";import{P as p}from"./Page-BT_K_LrM.js";import{H as r}from"./HeaderLabel-Cg732BoF.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D-q5Cj0N.js";import"./Box-BUiGTdjP.js";import"./styled-CMImJkv9.js";import"./Grid-Bra3ttwr.js";import"./makeStyles-DfmVTKxZ.js";import"./Breadcrumbs-DLLohVNN.js";import"./index-B9sM2jn7.js";import"./Popover-CEYP-KEz.js";import"./Modal-D6j5Xb6Q.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-jhze5AIU.js";import"./List-8dxWFdZv.js";import"./ListContext-B_b5Xi-t.js";import"./ListItem-B4iIr574.js";import"./Link-CFUengML.js";import"./index-FQMFZsiD.js";import"./lodash-Bfj4pupQ.js";import"./useApp-BS939v7w.js";import"./index-CZTs28Z5.js";import"./useAnalytics-BaF9kBhr.js";import"./Page-BTy3y2gE.js";import"./useMediaQuery-C8agpda9.js";import"./Tooltip-BJu7oAD0.js";import"./Popper-Dyi-FZK6.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};
