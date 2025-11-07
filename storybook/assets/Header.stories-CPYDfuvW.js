import{j as e}from"./iframe-C4yti0TH.js";import{H as o}from"./Header-CM88eBnh.js";import{P as p}from"./Page-BaM5gg76.js";import{H as r}from"./HeaderLabel-BeWTNwkK.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-Cnl8G7sc.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./Grid-v0xxfd_1.js";import"./Breadcrumbs-GwwOyMzz.js";import"./index-DnL3XN75.js";import"./Popover-C0oEerqE.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./ListItem-Cb_9Twd1.js";import"./Link-Cz9gaJJo.js";import"./lodash-CwBbdt2Q.js";import"./index-B-o6asHV.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./Page-BZhe5gWa.js";import"./useMediaQuery-Dwp2kN8M.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
