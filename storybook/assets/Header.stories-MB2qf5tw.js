import{bQ as e}from"./iframe-Bkld27Xv.js";import{H as o}from"./Header-pdP8xvX8.js";import{P as p}from"./Page-DzNicZGv.js";import{H as r}from"./HeaderLabel-CASzBaUG.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DQVk-GJs.js";import"./Box-U7ly1rzl.js";import"./styled-Ckr-4rIS.js";import"./Grid-NPf6_mtF.js";import"./makeStyles-c8tM0-Si.js";import"./Breadcrumbs-ilhHnnpn.js";import"./index-B9sM2jn7.js";import"./Popover-CElbwZXs.js";import"./Modal-BaL46tTG.js";import"./Portal-DZkIDTV8.js";import"./List-B2gY9KR3.js";import"./ListContext-whwYHu0a.js";import"./ListItem-Df-rkWNj.js";import"./Link-Gb2zw1eg.js";import"./index-CzJgrKEb.js";import"./lodash-B0aJYi5c.js";import"./useAnalytics-DgzNfNA8.js";import"./useApp-BeXbzCkx.js";import"./Page-D5KKpWbU.js";import"./useMediaQuery-BUoKVWPq.js";import"./Tooltip-DGFz8Kzo.js";import"./Popper-BUT4qtTb.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
