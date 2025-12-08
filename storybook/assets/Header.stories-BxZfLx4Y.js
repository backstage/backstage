import{j as e}from"./iframe-CA0Xqitl.js";import{H as o}from"./Header-DxqtOCI2.js";import{P as p}from"./Page-B6u-QOB_.js";import{H as r}from"./HeaderLabel-LTfxa5HB.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-fH9Yjick.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./Grid-B8o7JoCY.js";import"./Breadcrumbs-LOPymDGd.js";import"./index-B9sM2jn7.js";import"./Popover-BmPtjFBs.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./ListItem-BzxviKme.js";import"./Link-D1vtE7Ac.js";import"./lodash-Y_-RFQgK.js";import"./index-ByTVIOef.js";import"./useAnalytics-Bs3aHlE6.js";import"./useApp-DFdkDp9A.js";import"./Page--fSqIHhR.js";import"./useMediaQuery-BpBnXgQY.js";import"./Tooltip-CuEp3aUv.js";import"./Popper-yvDUz_ZU.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
