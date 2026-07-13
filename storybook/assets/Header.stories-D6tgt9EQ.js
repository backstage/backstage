import{bR as e}from"./iframe-C134ftd_.js";import{H as o}from"./Header-DUJ1cgBt.js";import{P as p}from"./Page-CrERjHOd.js";import{H as r}from"./HeaderLabel-BG5Hj3UO.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DFfPqHE0.js";import"./Box-DOMgNM1H.js";import"./styled-Caou-WSS.js";import"./Grid-CBiX0ZUm.js";import"./makeStyles-lroa90Fn.js";import"./Breadcrumbs-BB4RWWW4.js";import"./index-B9sM2jn7.js";import"./Popover-DW8SJs16.js";import"./Modal-NyAkNxwG.js";import"./Portal-TvgtzxoW.js";import"./List-b2RWxkMS.js";import"./ListContext-XGHpPVu8.js";import"./ListItem-B0l09fOa.js";import"./Link-DnEb87hH.js";import"./index-XQ83uw43.js";import"./lodash-C9xihbHM.js";import"./useAnalytics-DewmQACP.js";import"./useApp-aYIlvwkE.js";import"./Page-CQJcCcQM.js";import"./useMediaQuery-JKiNOa3Q.js";import"./Tooltip-DVQYrY_7.js";import"./Popper-C4NPWeDa.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
