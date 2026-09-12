import{bQ as e}from"./iframe-CLUDVQ5J.js";import{H as o}from"./Header-BTuPJSk2.js";import{P as p}from"./Page-DP813PXp.js";import{H as r}from"./HeaderLabel-dlx9hO9f.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-2KTSFHkW.js";import"./Box-DcD5c5-B.js";import"./styled-hgTb5-qM.js";import"./Grid-D50qQlpO.js";import"./makeStyles-C-SzIQdx.js";import"./Breadcrumbs-C7JsOMDl.js";import"./index-B9sM2jn7.js";import"./Popover-DiU_e52W.js";import"./Modal-B-mLzVps.js";import"./Portal-C-GjSY02.js";import"./List-iHDmihoL.js";import"./ListContext-NBUZM1XF.js";import"./ListItem-Dh8Rtio2.js";import"./Link-BhsWtFDr.js";import"./index-ceSBD9fz.js";import"./lodash-CdFrZFKb.js";import"./useAnalytics-CzwPeQ36.js";import"./useApp-DKdDpZNp.js";import"./Page-BLgL-uLI.js";import"./useMediaQuery-CLG0LmEo.js";import"./Tooltip-B3JyVTPU.js";import"./Popper-DY7AQOWT.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
