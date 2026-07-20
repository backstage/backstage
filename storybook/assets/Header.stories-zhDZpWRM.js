import{bR as e}from"./iframe-e_Pbc_6f.js";import{H as o}from"./Header-CKlIukIF.js";import{P as p}from"./Page-BveoHN39.js";import{H as r}from"./HeaderLabel-BVfYFsz_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BGPN5r6s.js";import"./Box-DMUgG59T.js";import"./styled-CxHJsi3Q.js";import"./Grid-DKdjmz4g.js";import"./makeStyles-Cp-EYjYJ.js";import"./Breadcrumbs-BcRhD8KE.js";import"./index-B9sM2jn7.js";import"./Popover-JlPHlHS8.js";import"./Modal-G8fvliIR.js";import"./Portal-BSXO7WyO.js";import"./List-BGzrRdQR.js";import"./ListContext-BTgNrjgi.js";import"./ListItem-0H8wmvm_.js";import"./Link-BPZInZpE.js";import"./index-Cz0En5uD.js";import"./lodash-DAwn35z1.js";import"./useAnalytics-ePNxNM33.js";import"./useApp-CjDlo0PH.js";import"./Page-HDAyddxO.js";import"./useMediaQuery-NkuPYSv2.js";import"./Tooltip-Be6_8a7u.js";import"./Popper-CkmPejm7.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
