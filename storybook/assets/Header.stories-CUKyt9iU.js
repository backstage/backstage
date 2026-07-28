import{bR as e}from"./iframe-DQtIir6_.js";import{H as o}from"./Header-maRGXrqg.js";import{P as p}from"./Page-Q0yVYI-h.js";import{H as r}from"./HeaderLabel-Bsa0PFXU.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CLHCqG5r.js";import"./Box-O4mveAiq.js";import"./styled-BhIgo9Dl.js";import"./Grid-DtwO6FOq.js";import"./makeStyles-BGUJ1R1k.js";import"./Breadcrumbs-D9UbBsbJ.js";import"./index-B9sM2jn7.js";import"./Popover-BRg3kGS4.js";import"./Modal-DHjFoe6o.js";import"./Portal-D45Xwtom.js";import"./List-C72_ZxQh.js";import"./ListContext-f0KYlYlh.js";import"./ListItem-D7j56-L5.js";import"./Link-WvvQIOcL.js";import"./index-CEfocwCu.js";import"./lodash-BeLSVBlD.js";import"./useAnalytics-Nt1lbfmh.js";import"./useApp-D0OeqPVb.js";import"./Page-BfMpfo_E.js";import"./useMediaQuery-BKK48Wrk.js";import"./Tooltip-B6MvjNSF.js";import"./Popper-BNrLVCtN.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
