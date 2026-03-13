import{j as t}from"./iframe-DvAQ9TL9.js";import{H as i}from"./Header-BFN_Tn5U.js";import{P as a}from"./Page-CS42Mzdv.js";import{H as r}from"./HeaderLabel-Db4l73A9.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C6t8Ewwk.js";import"./makeStyles-DIoIr_Gz.js";import"./Box-DF8-c6JA.js";import"./styled-CoguSFmS.js";import"./Grid-R-6Q3RAr.js";import"./Breadcrumbs-C9GSLEp7.js";import"./index-B9sM2jn7.js";import"./Popover-CxJE2Piw.js";import"./Modal-DIdrUuV4.js";import"./Portal-CZWMCv81.js";import"./List-JM-19v_p.js";import"./ListContext-C55nEgJD.js";import"./ListItem-C50yNROG.js";import"./Link-Dtd7Q6IF.js";import"./index-D2kk_IGh.js";import"./lodash-BuTd1Mhz.js";import"./index-Bpd4QHCD.js";import"./useAnalytics-Dn-hivLl.js";import"./useApp-Ce7sGxgT.js";import"./Page-9jFNZKvk.js";import"./useMediaQuery-IguDvrLo.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
