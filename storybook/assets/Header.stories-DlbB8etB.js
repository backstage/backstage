import{j as t}from"./iframe-C-coJuUP.js";import{H as i}from"./Header-BWLYNcYT.js";import{P as a}from"./Page-B9uPiXO4.js";import{H as r}from"./HeaderLabel-CRQ_9Bjd.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CaqY-JEr.js";import"./makeStyles-CiHm2TPH.js";import"./Box-DUptaEM1.js";import"./styled-a3UFYgpT.js";import"./Grid-CpuCkwO3.js";import"./Breadcrumbs-CMCwsvKs.js";import"./index-B9sM2jn7.js";import"./Popover-D_ta6ggJ.js";import"./Modal-CU7kgWSP.js";import"./Portal-7MVcqHay.js";import"./List-DmNK4dvp.js";import"./ListContext-DK0SRiIG.js";import"./ListItem-B38saMSF.js";import"./Link-BAqVydJ4.js";import"./index-CBdKPl6K.js";import"./lodash-BMGFMZfQ.js";import"./index-2anb1mQB.js";import"./useAnalytics-Csq2_frD.js";import"./useApp-DwifVUVc.js";import"./Page-CXnO-5zE.js";import"./useMediaQuery-BzWp8RXW.js";import"./Tooltip-DiFwxGBu.js";import"./Popper-dI_EnRqc.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
