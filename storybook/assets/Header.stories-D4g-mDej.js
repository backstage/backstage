import{j as t}from"./iframe-BooBp-Po.js";import{H as i}from"./Header-C1RSAWMW.js";import{P as a}from"./Page-Dc6p_H7A.js";import{H as r}from"./HeaderLabel-B9U8fepX.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-kFcV6r9V.js";import"./Box-obs2E8MU.js";import"./styled-DJvGKcz3.js";import"./Grid-DyVJyHQ5.js";import"./Breadcrumbs-BRSPhJpf.js";import"./index-B9sM2jn7.js";import"./Popover-CRZn-eII.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./ListItem-CUDBczQT.js";import"./Link-6ZJtYR0w.js";import"./lodash-DLuUt6m8.js";import"./index-uVUaDJuf.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./Page-BzlNlGQo.js";import"./useMediaQuery-DxyVDiKd.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
