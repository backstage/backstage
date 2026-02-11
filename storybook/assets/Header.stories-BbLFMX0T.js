import{j as t}from"./iframe-BJyhMgZx.js";import{H as i}from"./Header-Dc1WThv2.js";import{P as a}from"./Page-pvrkmvH-.js";import{H as r}from"./HeaderLabel-Df_yDHlZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CxJAIvVE.js";import"./Box-DvCgVOwJ.js";import"./styled-LNNxiV8P.js";import"./Grid-Ce4w6y7_.js";import"./Breadcrumbs-HplI6vTs.js";import"./index-B9sM2jn7.js";import"./Popover-BMSZCUIK.js";import"./Modal-CpRiOHte.js";import"./Portal-Bs15JVl2.js";import"./List-BFZ4Qrp4.js";import"./ListContext-wap519Wf.js";import"./ListItem-C9MlxCoa.js";import"./Link-Bj1eQkNP.js";import"./lodash-Owt1XfFv.js";import"./index-CgpX80zE.js";import"./useAnalytics-D5KbbwDD.js";import"./useApp-7IUhkz1i.js";import"./Page-E7zGOKiR.js";import"./useMediaQuery-8PsIEoQg.js";import"./Tooltip-BYcvPGbC.js";import"./Popper-CFXrn5Hd.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
