import{j as t}from"./iframe-CTfOr1ix.js";import{H as i}from"./Header-BKWNjCs9.js";import{P as a}from"./Page-Dsk31NHb.js";import{H as r}from"./HeaderLabel-DmT7k22m.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwSGwfv_.js";import"./makeStyles-1FwyOuiP.js";import"./Box-CL14vfYs.js";import"./styled-C_6pXOEP.js";import"./Grid-6mM_q0n-.js";import"./Breadcrumbs-BAOw6-96.js";import"./index-B9sM2jn7.js";import"./Popover-DJq5T8vs.js";import"./Modal-BiWFAeZ0.js";import"./Portal-6Q34r_Nq.js";import"./List-Dpi1Ei3o.js";import"./ListContext-BnXKdXJ6.js";import"./ListItem-BHAZbz_b.js";import"./Link-BZTNDDiJ.js";import"./index-P4DR0u2t.js";import"./lodash-n8-yS5G5.js";import"./index-B-ObPmyF.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";import"./Page-DUBnFqdT.js";import"./useMediaQuery-DtTmkb0v.js";import"./Tooltip-bV63MOr0.js";import"./Popper-BxZ3wRuZ.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
