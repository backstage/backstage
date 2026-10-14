import{j as e}from"./iframe-osqb7I7f.js";import{H as o}from"./Header-CosZydA5.js";import{P as p}from"./Page-C9ZJBjmC.js";import{H as r}from"./HeaderLabel-BoZ5oep1.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CthZc8S1.js";import"./Box-BSaftFXH.js";import"./styled-xLLFXlcD.js";import"./Grid-C2Kxiu2a.js";import"./makeStyles-B-29AVkS.js";import"./Breadcrumbs-ioP_A6zC.js";import"./index-B9sM2jn7.js";import"./Popover-NniJxcDY.js";import"./Modal-BOnvNtnJ.js";import"./Portal-CSADXJeU.js";import"./List-CTyrNFUW.js";import"./ListContext-DC4QtHJ6.js";import"./ListItem-sSMaatws.js";import"./Link-Bmt0jb7o.js";import"./index-EzFaxwLK.js";import"./lodash-CanoRRwR.js";import"./useAnalytics-tPbxjeba.js";import"./useApp-DYfjB2yk.js";import"./Page-C7-4ZYXN.js";import"./useMediaQuery-D9zwp-YX.js";import"./Tooltip-CtcI0b29.js";import"./Popper-Cy7EaPe0.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
