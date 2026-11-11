import{j as e}from"./iframe-C7lYm63e.js";import{H as o}from"./Header-BF1RL9UB.js";import{P as p}from"./Page-gHC_-fjJ.js";import{H as r}from"./HeaderLabel-CnhZll4Z.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BjmOzCXW.js";import"./Box-DVl--OQ4.js";import"./styled-DFprPEWi.js";import"./Grid-Dx4lFWsU.js";import"./makeStyles-CNdVE_9m.js";import"./Breadcrumbs-Cm7lh9Lu.js";import"./index-B9sM2jn7.js";import"./Popover-BOxuNsBc.js";import"./Modal-BYTUuYK6.js";import"./Portal-Bp4EQw9P.js";import"./List--nqukECR.js";import"./ListContext-sxylWf-L.js";import"./ListItem-CPJiRmSN.js";import"./Link-DKhx2tkV.js";import"./index-DRQcGEH_.js";import"./lodash-jlhHekdq.js";import"./useApp-Ds50W7L8.js";import"./index-FJv8Tr6k.js";import"./useAnalytics-QXmmoeIg.js";import"./Page-B89mHoeM.js";import"./useMediaQuery-D1jP-wiB.js";import"./Tooltip-DBi3Muws.js";import"./Popper-BYgKwfDh.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
