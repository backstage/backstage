import{j as e}from"./iframe-a5iorYt_.js";import{H as o}from"./Header-pXP_xUO1.js";import{P as p}from"./Page-DlO1U6cD.js";import{H as r}from"./HeaderLabel-D5VwR-_m.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-cOy-l3Ih.js";import"./Box-BeM7E2iG.js";import"./styled-D8mefoHX.js";import"./Grid-GKprjDXV.js";import"./makeStyles-C3e0W14-.js";import"./Breadcrumbs-DR4hTAdR.js";import"./index-B9sM2jn7.js";import"./Popover-B-goAEQ-.js";import"./Modal-CuivDZiA.js";import"./Portal-CHBw253U.js";import"./List-DC5vfnmZ.js";import"./ListContext-Dj5C0Bx_.js";import"./ListItem-C_oFpBsa.js";import"./Link-CkwOc38T.js";import"./index-B19-WIzK.js";import"./lodash-Ba724kq_.js";import"./useApp-Ch2_fjtz.js";import"./index-CIXpXNvI.js";import"./useAnalytics-DCNn34Rq.js";import"./Page-D_zoB-Ai.js";import"./useMediaQuery-D5dVX95O.js";import"./Tooltip-DUAvk5W5.js";import"./Popper-BwKJvqu9.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
