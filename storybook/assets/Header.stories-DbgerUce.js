import{bR as e}from"./iframe-Bfeun6FV.js";import{H as o}from"./Header-DDsn2UPe.js";import{P as p}from"./Page-DvI-FTIr.js";import{H as r}from"./HeaderLabel-5j2qFWUY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DHFJ6bGn.js";import"./Box-VVBVNoPf.js";import"./styled-tsuVmXB5.js";import"./Grid-DpcxvWnM.js";import"./makeStyles-C7fNhz2-.js";import"./Breadcrumbs-WSCaaP89.js";import"./index-B9sM2jn7.js";import"./Popover-DyUWzX5E.js";import"./Modal-SPXttOH5.js";import"./Portal-CGw0e9kP.js";import"./List-Be5BF-4X.js";import"./ListContext-xaY7-bAc.js";import"./ListItem-CVsqLCjK.js";import"./Link-Ck5B18Ox.js";import"./index-Bj4M52Zv.js";import"./lodash-BgRn0AvU.js";import"./useAnalytics-BM8yTVVe.js";import"./useApp-CxJ04SgY.js";import"./Page-Be0o64TI.js";import"./useMediaQuery-CbdT-CAe.js";import"./Tooltip-RZdKHhW0.js";import"./Popper-4yvY-kKK.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
