import{j as t}from"./iframe-CIst4AKw.js";import{H as i}from"./Header-ktQ4afT1.js";import{P as a}from"./Page-DmPkf7C7.js";import{H as r}from"./HeaderLabel-x2PunPjx.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DQ2MWpAk.js";import"./makeStyles-CyiKs3qI.js";import"./Box-bOt6Vm_d.js";import"./styled-BTP3bkaJ.js";import"./Grid-DSn-A5sL.js";import"./Breadcrumbs-KtxdV81S.js";import"./index-B9sM2jn7.js";import"./Popover-CR_JCiVv.js";import"./Modal-CA5IMXbx.js";import"./Portal-CKExw2or.js";import"./List-xkDrwxCe.js";import"./ListContext-CV9XkK9z.js";import"./ListItem-DzW8sEcw.js";import"./Link-Brm3t_Ck.js";import"./index-BKxkX0e4.js";import"./lodash-Bv_R2aXJ.js";import"./index-DTrbkxL5.js";import"./useAnalytics-B1Tkmcph.js";import"./useApp-Bg0Bzijx.js";import"./Page-BEwpqa_h.js";import"./useMediaQuery-BReJxXVj.js";import"./Tooltip-BXoJmvrU.js";import"./Popper-B5gGl_yS.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
