import{j as t}from"./iframe-DVtcQ4_z.js";import{H as i}from"./Header-CtnhRf16.js";import{P as a}from"./Page-Bj-_Guvz.js";import{H as r}from"./HeaderLabel-B4_vFPlQ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CPJHOM9k.js";import"./Box-D_1MPpAq.js";import"./styled-2Y3L2rTs.js";import"./Grid-CRH4wMFl.js";import"./Breadcrumbs-BUZA7epL.js";import"./index-B9sM2jn7.js";import"./Popover-BXTxo9bK.js";import"./Modal-C3aeePrL.js";import"./Portal-kTp41skA.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./ListItem-C0fXON46.js";import"./Link-t6CnRMqh.js";import"./lodash-Czox7iJy.js";import"./index-nBdCQRka.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./Page-Cvj4mtCH.js";import"./useMediaQuery-B8Dla2oc.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
