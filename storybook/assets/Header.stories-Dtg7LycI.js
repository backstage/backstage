import{bR as e}from"./iframe-Bfn8Z101.js";import{H as o}from"./Header-fdeygkeg.js";import{P as p}from"./Page-B-Eu5FeU.js";import{H as r}from"./HeaderLabel-Cm4OWffC.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BbWMZBXV.js";import"./Box-DyfwZbNL.js";import"./styled-DuMxEeiS.js";import"./Grid-DmJYnAGe.js";import"./makeStyles-CYTyANLm.js";import"./Breadcrumbs-uyZQsuCr.js";import"./index-B9sM2jn7.js";import"./Popover-DqZKjMJv.js";import"./Modal-Q6OKoPg0.js";import"./Portal-D_3zuTLc.js";import"./List-D_LcnGoX.js";import"./ListContext-CfWmSMOg.js";import"./ListItem-DWsGqw5Q.js";import"./Link-DTk0cCR5.js";import"./index-B5yD2poE.js";import"./lodash-UuYECw1e.js";import"./useAnalytics-DIVjLHv8.js";import"./useApp-CcgvpO7S.js";import"./Page-BB6RlXTV.js";import"./useMediaQuery-DxAoH8qr.js";import"./Tooltip-rbGTp7Gl.js";import"./Popper-CojVdIgS.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
