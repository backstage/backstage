import{bR as e}from"./iframe-BhJ5Dr2k.js";import{H as o}from"./Header-BEaQm0vw.js";import{P as p}from"./Page-vnA2LONp.js";import{H as r}from"./HeaderLabel-DqdVcFWb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-8aFfc93q.js";import"./Box-Y2xnXHg0.js";import"./styled-w-HNwOwS.js";import"./Grid-DDRFl87z.js";import"./makeStyles-DYyKjhyQ.js";import"./Breadcrumbs-1zc8G6iD.js";import"./index-B9sM2jn7.js";import"./Popover-BIoVk5SI.js";import"./Modal-BCl5pik5.js";import"./Portal-wkxcFvaf.js";import"./List-CgBnxwYg.js";import"./ListContext-f6zilHA_.js";import"./ListItem-C_QyLOpG.js";import"./Link-CC_KtSOn.js";import"./index--C479yzh.js";import"./lodash-B1ZVbPgx.js";import"./useAnalytics-DNfXVerI.js";import"./useApp-CYIhR5HZ.js";import"./Page-1gW46dgQ.js";import"./useMediaQuery-DG-bsxsF.js";import"./Tooltip-cVotykzK.js";import"./Popper-FZP7SLCD.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
