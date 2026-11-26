import{j as e}from"./iframe-bb_jNxxL.js";import{H as o}from"./Header-DDXA9CMb.js";import{P as p}from"./Page-B8GJ_hsm.js";import{H as r}from"./HeaderLabel-1kc310yr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-O8S-2A5y.js";import"./Box-DOhXTkmR.js";import"./styled-Bf8yAc5R.js";import"./Grid-BTQv340N.js";import"./makeStyles-CgTSz4WE.js";import"./Breadcrumbs-qk84f1A9.js";import"./index-B9sM2jn7.js";import"./Popover-Bu0C619z.js";import"./Modal-Bkdw9VoW.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-B4509XJg.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./ListItem-BW0PV3ll.js";import"./Link-BhEUyXEZ.js";import"./index-dQxF3Oj4.js";import"./lodash-CwxrZd2c.js";import"./useApp-BYyXk-4Q.js";import"./index-B6EXqJ8A.js";import"./useAnalytics-BwMaIldS.js";import"./Page-CdqbsWzI.js";import"./useMediaQuery-DcCLGXC3.js";import"./Tooltip-M2TQCRSn.js";import"./Popper-bnoTFWm0.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
