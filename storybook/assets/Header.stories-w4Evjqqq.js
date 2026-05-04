import{j as e}from"./iframe-COJz9F1o.js";import{H as o}from"./Header-DvY4VPE7.js";import{P as p}from"./Page-W_pWp_No.js";import{H as r}from"./HeaderLabel-CGIOprbb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B7U_G-BE.js";import"./Box-Dnr7lIgc.js";import"./styled-CHgYw-aN.js";import"./Grid-QH0IRglv.js";import"./makeStyles-DfpJxphG.js";import"./Breadcrumbs-DzLk8mEQ.js";import"./index-B9sM2jn7.js";import"./Popover-C_zNppFz.js";import"./Modal-C4q2dohw.js";import"./Portal-Df_bDRFp.js";import"./List-DxjCJy_8.js";import"./ListContext-D1BzRUpQ.js";import"./ListItem-BeM9N7OL.js";import"./Link-SgQWsjcg.js";import"./index-DiZHcWFF.js";import"./lodash-CDGQ6Log.js";import"./useAnalytics-K4Yw9kGl.js";import"./useApp-BuWghqmQ.js";import"./Page-D7N_dMpO.js";import"./useMediaQuery-O5iFJJSz.js";import"./Tooltip-fO89vQyA.js";import"./Popper-CxR6N-KO.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
