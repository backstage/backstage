import{j as t}from"./iframe-DHcBEgBH.js";import{H as i}from"./Header-C-Bv6tZ9.js";import{P as a}from"./Page-V54w3GGq.js";import{H as r}from"./HeaderLabel-CCVFAiXe.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CUhPVJ3s.js";import"./makeStyles-pGUaJr24.js";import"./Box-CbZQ1U2e.js";import"./styled-DMPIvYo_.js";import"./Grid-BgyCT4VC.js";import"./Breadcrumbs-DyoqXKTp.js";import"./index-B9sM2jn7.js";import"./Popover-DBNCOFt-.js";import"./Modal-D6JI9uWD.js";import"./Portal-4pR_an9W.js";import"./List-CzJs69wv.js";import"./ListContext-bUUGMd0s.js";import"./ListItem-CTYXOgij.js";import"./Link-Bv9aCS_D.js";import"./index-OQeCNnW5.js";import"./lodash-BO6khM8p.js";import"./index-CAQ8RYn7.js";import"./useAnalytics-DzmCXJiR.js";import"./useApp-DfvXHod2.js";import"./Page-DBFpgcyT.js";import"./useMediaQuery-BoXzlxKk.js";import"./Tooltip-8MUD-NVH.js";import"./Popper-Bsu9O5KR.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
