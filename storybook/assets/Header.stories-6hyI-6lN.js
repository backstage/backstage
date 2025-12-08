import{j as e}from"./iframe-omS-VfEE.js";import{H as o}from"./Header-Dc3hHuIy.js";import{P as p}from"./Page-D1RZz1Lw.js";import{H as r}from"./HeaderLabel-g2WHY7_P.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwJLIj-9.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./Grid-BYUcu-HN.js";import"./Breadcrumbs-DUOrWrHl.js";import"./index-B9sM2jn7.js";import"./Popover-CrWWJ3tC.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./ListItem-CyW2KymL.js";import"./Link-BWOCx2Nz.js";import"./lodash-Y_-RFQgK.js";import"./index-BJYML3pb.js";import"./useAnalytics-DpXUy368.js";import"./useApp-DFGFX2A_.js";import"./Page-D6VOo8ns.js";import"./useMediaQuery-CmLzCGth.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
