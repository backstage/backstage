import{j as t}from"./iframe-BNPQer77.js";import{H as i}from"./Header-H7oE_udV.js";import{P as a}from"./Page-AfoAy1O6.js";import{H as r}from"./HeaderLabel-DaxM-C8n.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Bg0OfZ9f.js";import"./Box-C3TqwX1t.js";import"./styled-T_nlQOJW.js";import"./Grid-Yv5UUmOJ.js";import"./Breadcrumbs-DWQg2y0R.js";import"./index-B9sM2jn7.js";import"./Popover-DhB4mRyc.js";import"./Modal-DuAz145P.js";import"./Portal-D6rxE-he.js";import"./List-Bj78s_pe.js";import"./ListContext-BZ4pbeSM.js";import"./ListItem-we3G7HGD.js";import"./Link-B__iWKUx.js";import"./lodash-D6Y5cDVN.js";import"./index-D2A2K7dC.js";import"./useAnalytics-DI9G1xrU.js";import"./useApp-C940MqwE.js";import"./Page-Bmpqs4D6.js";import"./useMediaQuery-B3PljuEy.js";import"./Tooltip-ZVPmh-dx.js";import"./Popper-BItIL40F.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
