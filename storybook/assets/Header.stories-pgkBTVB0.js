import{j as t}from"./iframe-CIdfBUNc.js";import{H as i}from"./Header-CHzj-oTd.js";import{P as a}from"./Page-BP3Phra1.js";import{H as r}from"./HeaderLabel-CcxC2Pec.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cs0aJT-S.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./Grid-CNMGd53o.js";import"./Breadcrumbs--3TUxkxg.js";import"./index-B9sM2jn7.js";import"./Popover--nM83zpc.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./ListItem-Dfr179My.js";import"./Link-BiOJGlt4.js";import"./lodash-Y_-RFQgK.js";import"./index-6Q4r393t.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./Page-BUoq3H8w.js";import"./useMediaQuery-DrOJ7HGG.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
