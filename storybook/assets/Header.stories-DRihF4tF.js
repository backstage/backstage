import{j as t}from"./iframe-Ck0aXmTM.js";import{H as i}from"./Header-DKFR5WTa.js";import{P as a}from"./Page-BEEQebAd.js";import{H as r}from"./HeaderLabel-CcAcFaD8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D6_yNg5f.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./Grid-DJzZ2-y-.js";import"./Breadcrumbs-CBxgA-zr.js";import"./index-B9sM2jn7.js";import"./Popover-C9BG-sVO.js";import"./Modal-CynqYC-h.js";import"./Portal-enzQuAv4.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./ListItem-BI_yLDsO.js";import"./Link-8mv2gKfv.js";import"./lodash-DLuUt6m8.js";import"./index-DzaKdVpu.js";import"./useAnalytics-B-_BiaZI.js";import"./useApp-Bsc5dzDy.js";import"./Page-DhJ6ilWB.js";import"./useMediaQuery-D88h0Om1.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
