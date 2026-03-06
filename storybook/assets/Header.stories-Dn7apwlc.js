import{j as t}from"./iframe-D9hL09PA.js";import{H as i}from"./Header-DaZnJI61.js";import{P as a}from"./Page-hq7ptK7j.js";import{H as r}from"./HeaderLabel-B8vVD2fj.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CP3y5NPC.js";import"./makeStyles-DTQ8SdVn.js";import"./Box-s6YRe9vN.js";import"./styled-DyvFt11P.js";import"./Grid-D6FWqA9h.js";import"./Breadcrumbs-B4hHA856.js";import"./index-B9sM2jn7.js";import"./Popover-DGQTxlhs.js";import"./Modal-B0gOEwSA.js";import"./Portal-IHwjUdnq.js";import"./List-DjRcYuTE.js";import"./ListContext-Brz2Wbg-.js";import"./ListItem-CnqOAGWo.js";import"./Link-Dki0Wf5B.js";import"./index-CtgFInvS.js";import"./lodash-C27Rn_8V.js";import"./index-DnevwhiT.js";import"./useAnalytics-CRWiGQGU.js";import"./useApp-BN8fcp1J.js";import"./Page-2AY_JTEV.js";import"./useMediaQuery-CZS8tEgE.js";import"./Tooltip-CMB05q-q.js";import"./Popper-DOEiwjSs.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
