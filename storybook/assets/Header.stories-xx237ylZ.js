import{j as t}from"./iframe-ByRYLFwj.js";import{H as i}from"./Header-CYKB49q9.js";import{P as a}from"./Page-zCwXhE4R.js";import{H as r}from"./HeaderLabel-DNSvCcP8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CHp6SefC.js";import"./makeStyles-CUs-1deS.js";import"./Box-D8ylNFTF.js";import"./styled-ASiGQwJu.js";import"./Grid-BWBQHPmq.js";import"./Breadcrumbs-C7pWdVPT.js";import"./index-B9sM2jn7.js";import"./Popover-DlGIOhka.js";import"./Modal-CBQ1InMz.js";import"./Portal-BZPqZUv7.js";import"./List-D9mAo6Wj.js";import"./ListContext-Dqofe_r2.js";import"./ListItem-CRQYiEBH.js";import"./Link-Bkh9f3bS.js";import"./index-BgENFDPt.js";import"./lodash-CEZ35LHP.js";import"./index-DsL-N0cf.js";import"./useAnalytics-vZwzvm-y.js";import"./useApp-CVstOjrX.js";import"./Page-DLsZJ1zM.js";import"./useMediaQuery-Balm5x5n.js";import"./Tooltip-DR9Idexm.js";import"./Popper-BHEEGTZh.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
