import{bQ as e}from"./iframe-CdNUyns1.js";import{H as o}from"./Header-C9AxllQB.js";import{P as p}from"./Page-Dg71JDTa.js";import{H as r}from"./HeaderLabel-CRpqeOka.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BKXb672F.js";import"./Box-DFc3IFyj.js";import"./styled-_ZZ8vobE.js";import"./Grid-CuUKwjma.js";import"./makeStyles-CHAgNhAt.js";import"./Breadcrumbs-CJqTCTKk.js";import"./index-B9sM2jn7.js";import"./Popover-AOZv038h.js";import"./Modal-CmDcDVn6.js";import"./Portal-DUmhVnUE.js";import"./List-DcrVr_XM.js";import"./ListContext-BojgFJwk.js";import"./ListItem-DgRPj49U.js";import"./Link-NLVSI6WU.js";import"./index-Cn4V3qtH.js";import"./lodash-LaLztEdN.js";import"./useAnalytics-uPHW0hxD.js";import"./useApp-B1xNj-di.js";import"./Page-ChM37eqg.js";import"./useMediaQuery-CCdr-EMq.js";import"./Tooltip-SNk2LMxl.js";import"./Popper-JpmGsC7A.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
