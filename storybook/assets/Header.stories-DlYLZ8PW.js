import{j as t}from"./iframe-Bakz1Oty.js";import{H as i}from"./Header-Do5wm2sM.js";import{P as a}from"./Page-BdGDbwBn.js";import{H as r}from"./HeaderLabel-ClgIiZ0G.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BUXTYh1_.js";import"./makeStyles-3_kuKRiN.js";import"./Box-BnRbKBR1.js";import"./styled-CVPCEBvL.js";import"./Grid-ORZV85AM.js";import"./Breadcrumbs-RvJur5fD.js";import"./index-B9sM2jn7.js";import"./Popover-D1adgFrq.js";import"./Modal-29C48Sgn.js";import"./Portal-CHaHYX6z.js";import"./List-B_gy8x3o.js";import"./ListContext-C1Qr8NkX.js";import"./ListItem-CDsyXI4L.js";import"./Link-CT1F1Kap.js";import"./index-D1b53K_1.js";import"./lodash-DgNMza5D.js";import"./index-DCOINpOM.js";import"./useAnalytics-C-zfrdUt.js";import"./useApp-A6R3_jDs.js";import"./Page-DrZx5lVI.js";import"./useMediaQuery-CuP53YYC.js";import"./Tooltip-G4tQ9l7u.js";import"./Popper-BPZuuPZ9.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
