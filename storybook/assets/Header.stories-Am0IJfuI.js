import{bQ as e}from"./iframe-DgMUslzK.js";import{H as o}from"./Header-7w5apddR.js";import{P as p}from"./Page-JwH4DAvU.js";import{H as r}from"./HeaderLabel-ZR2tNcKq.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BVszWply.js";import"./Box-BJxowxBS.js";import"./styled-BfrhGEg9.js";import"./Grid-aIkVCW8j.js";import"./makeStyles-Df7PmhVI.js";import"./Breadcrumbs-zqv1chpt.js";import"./index-B9sM2jn7.js";import"./Popover-Dg6Gi0hw.js";import"./Modal-CdiJGpCp.js";import"./Portal-kyj2r76y.js";import"./List-C-zQfqUQ.js";import"./ListContext-hXedtGND.js";import"./ListItem-Bc79FKQe.js";import"./Link-COy2ek7E.js";import"./index-CvMNCDS_.js";import"./lodash-C5szjeEy.js";import"./useAnalytics-BFdM291c.js";import"./useApp-KaRpWMSR.js";import"./Page-CeaqleN5.js";import"./useMediaQuery-Bnz3o-3u.js";import"./Tooltip-DDkMnUKl.js";import"./Popper-rKO2956j.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
