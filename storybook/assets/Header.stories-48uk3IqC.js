import{bR as e}from"./iframe-DmKIhSd4.js";import{H as o}from"./Header-DJyZX_Q4.js";import{P as p}from"./Page-B-ZhyY-i.js";import{H as r}from"./HeaderLabel-sRa7aNMr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Bdvwy_3h.js";import"./Box-DUl4t4xa.js";import"./styled-CkYeEFkY.js";import"./Grid-A2BeQhfO.js";import"./makeStyles-BqK0q-gB.js";import"./Breadcrumbs-D42MiT7R.js";import"./index-B9sM2jn7.js";import"./Popover-mgc1nWuf.js";import"./Modal-D74uew-h.js";import"./Portal-BUtfj8Pc.js";import"./List-C3tYQ8nk.js";import"./ListContext-B0FPCnG9.js";import"./ListItem-aei1NC_j.js";import"./Link-Dk9R5rXS.js";import"./index-DJiMl0KJ.js";import"./lodash-TPrC5YUF.js";import"./useAnalytics-BU7cnARE.js";import"./useApp-DzXHRUhp.js";import"./Page-kKDJIpCp.js";import"./useMediaQuery-i0CYU6XK.js";import"./Tooltip-BfaGzWnJ.js";import"./Popper-BK84To72.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
