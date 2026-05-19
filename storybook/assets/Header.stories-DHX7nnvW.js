import{j as e}from"./iframe-BbcE2xlx.js";import{H as o}from"./Header-Cr8hqFFN.js";import{P as p}from"./Page-DEbQhief.js";import{H as r}from"./HeaderLabel-CRfgU9yN.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CoOhHLg0.js";import"./Box-DV7TtJ3X.js";import"./styled-CYn__la3.js";import"./Grid-AQTL701u.js";import"./makeStyles-ByEaUd5i.js";import"./Breadcrumbs-CcAx0jo7.js";import"./index-B9sM2jn7.js";import"./Popover-BjhC_IZb.js";import"./Modal-BvizGCw9.js";import"./Portal-Dt7280Bv.js";import"./List-Bm-97Bpf.js";import"./ListContext-D5tjuQRC.js";import"./ListItem-BurMZ2sa.js";import"./Link-IFkxtfSo.js";import"./index-DfiyOdhX.js";import"./lodash--S21zL8B.js";import"./useAnalytics-BQ8kZAPF.js";import"./useApp-lAnrRgXP.js";import"./Page-DSDMmB5w.js";import"./useMediaQuery-CZ9jefxN.js";import"./Tooltip-DGQL3ZPr.js";import"./Popper-BWJvOSAM.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
