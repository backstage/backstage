import{j as e}from"./iframe-BuVoE93N.js";import{H as o}from"./Header-CJ6G3p2g.js";import{P as p}from"./Page-0GWEewFX.js";import{H as r}from"./HeaderLabel-D1vltM2s.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwcBeG8Q.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./Grid-BS_RmjCI.js";import"./Breadcrumbs-Bc4SDuk8.js";import"./index-B9sM2jn7.js";import"./Popover-BXpMyGs6.js";import"./Modal-DyZkcIsp.js";import"./Portal-C8Go-sfs.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./ListItem-DWhn9oWM.js";import"./Link-2efb-DF8.js";import"./lodash-Y_-RFQgK.js";import"./index-CLOs8FQP.js";import"./useAnalytics-CGq4Uj37.js";import"./useApp-CzP5PYac.js";import"./Page-D-nyfe6o.js";import"./useMediaQuery-_lxiEYiM.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
