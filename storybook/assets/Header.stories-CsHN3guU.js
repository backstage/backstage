import{j as e}from"./iframe-psIK5yLO.js";import{H as o}from"./Header-CNtoL6BA.js";import{P as p}from"./Page-BGePuGA8.js";import{H as r}from"./HeaderLabel-DCtjKNQ7.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D55cu3FD.js";import"./Box-R-XiqEG_.js";import"./styled-Bxm6pxZC.js";import"./Grid-CMGT3-M2.js";import"./makeStyles-BO5raylp.js";import"./Breadcrumbs-BGY3rsZH.js";import"./index-B9sM2jn7.js";import"./Popover-n6BkYlst.js";import"./Modal-Cb0YJWzm.js";import"./Portal-DepeXD6C.js";import"./List-CsoDoiW7.js";import"./ListContext-CW1RYZn6.js";import"./ListItem-CUlz7EaG.js";import"./Link-CoeLOjL5.js";import"./index-DmDFDvYh.js";import"./lodash-DavWhvf8.js";import"./useAnalytics-DunOMgS-.js";import"./useApp-Dtg5HRbD.js";import"./Page-46CCk2sH.js";import"./useMediaQuery-DkA2H7Ey.js";import"./Tooltip-CjDxezEl.js";import"./Popper-BLVqlGQl.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
