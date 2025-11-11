import{j as e}from"./iframe-D1GFiJZo.js";import{H as o}from"./Header-BgrdOYXb.js";import{P as p}from"./Page-CN6o8lMX.js";import{H as r}from"./HeaderLabel-CJ2cgHjW.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CJR6Lwpk.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./Grid-C_DJ7CXy.js";import"./Breadcrumbs-B9xAVprg.js";import"./index-DnL3XN75.js";import"./Popover-C7YRUsdO.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./ListItem-DWHRsh5J.js";import"./Link-B1KKwcLj.js";import"./lodash-CwBbdt2Q.js";import"./index-DKQ8ROEi.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./Page-UaY3G67c.js";import"./useMediaQuery-4MbFXRzp.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
