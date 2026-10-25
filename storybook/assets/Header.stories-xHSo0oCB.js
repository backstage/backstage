import{j as e}from"./iframe-CMSX-Slv.js";import{H as o}from"./Header-BuD_7whF.js";import{P as p}from"./Page-DplwrjUk.js";import{H as r}from"./HeaderLabel-DjK00gC-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BVGwPRk8.js";import"./Box-DUV89UkZ.js";import"./styled-EAA9K7Rc.js";import"./Grid-CftEnNEm.js";import"./makeStyles-C56sb6JC.js";import"./Breadcrumbs-6A1kdftD.js";import"./index-B9sM2jn7.js";import"./Popover-DvVF0mXU.js";import"./Modal-Bhz3vted.js";import"./Portal-CCx8CP2N.js";import"./List-C_4Wuvt0.js";import"./ListContext-DVytDPzj.js";import"./ListItem-zoeI7a-b.js";import"./Link-CWhz2WXp.js";import"./index-CrZisxgt.js";import"./lodash-CziDWmf6.js";import"./useAnalytics-BQThuKWZ.js";import"./useApp-ghU1X1ft.js";import"./Page-DJfxmLkX.js";import"./useMediaQuery-B9U-T91e.js";import"./Tooltip-xtNm08iK.js";import"./Popper-C50BHvtE.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
