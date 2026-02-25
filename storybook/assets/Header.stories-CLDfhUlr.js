import{j as t}from"./iframe-DEPu6gb6.js";import{H as i}from"./Header-BRY0VPam.js";import{P as a}from"./Page-ZF2EweM5.js";import{H as r}from"./HeaderLabel-Bmv0uyEV.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-11spcsYM.js";import"./makeStyles-DmiRwbC-.js";import"./Box-CRmT1Uep.js";import"./styled-C8JkirxD.js";import"./Grid-B4jZTMCZ.js";import"./Breadcrumbs-DsqYNbbs.js";import"./index-B9sM2jn7.js";import"./Popover-JW9C08Jz.js";import"./Modal-CgWsFYOX.js";import"./Portal-CQdgPEoH.js";import"./List-6W-tA5Er.js";import"./ListContext-YZAoD3r_.js";import"./ListItem-Bp_YBU-O.js";import"./Link-BdV67OKF.js";import"./index-DYHA3-tG.js";import"./lodash-BpJ5SQhB.js";import"./index-Dne3y8qR.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./Page-PH8oT19_.js";import"./useMediaQuery-C3_nB813.js";import"./Tooltip-Du9bg8BH.js";import"./Popper-V2uzkjHi.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};
