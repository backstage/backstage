import{j as t}from"./iframe-BBTbmRF3.js";import{H as i}from"./Header-BlGZeYVE.js";import{P as a}from"./Page-tWRO5SEL.js";import{H as r}from"./HeaderLabel-B6fhFRY1.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-z-Em5Dg1.js";import"./makeStyles-BPqnV28r.js";import"./Box-DFn50L67.js";import"./styled-Cxigd6bq.js";import"./Grid-CuXpcFIC.js";import"./Breadcrumbs-DZpemZ25.js";import"./index-B9sM2jn7.js";import"./Popover-Du-NqFAp.js";import"./Modal-CVrOJJ1o.js";import"./Portal-2y-oZ47a.js";import"./List-CUBDdxMb.js";import"./ListContext-B4Kfs7vL.js";import"./ListItem-gGS09kMG.js";import"./Link-C6rUrHHj.js";import"./index-CaZzWUdT.js";import"./lodash-CcPJG2Jc.js";import"./index-BcYwVfc2.js";import"./useAnalytics-Ba0Akb_8.js";import"./useApp-CesNqOwY.js";import"./Page-DiFQ7PXZ.js";import"./useMediaQuery-DT-4_5LT.js";import"./Tooltip-CdzZ4H0f.js";import"./Popper-BgTVAObk.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
