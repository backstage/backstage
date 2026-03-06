import{j as t}from"./iframe-y42y8Oej.js";import{H as i}from"./Header-DPbcvrB_.js";import{P as a}from"./Page-CkfWOsto.js";import{H as r}from"./HeaderLabel-Clu871Rw.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-IGNAN2pv.js";import"./makeStyles-DJdTRUmQ.js";import"./Box-C7hZLEtJ.js";import"./styled-CM7DeKVT.js";import"./Grid-CqRlAN7B.js";import"./Breadcrumbs-BzO_ao58.js";import"./index-B9sM2jn7.js";import"./Popover-DFNyBgpP.js";import"./Modal-CUqNDlSg.js";import"./Portal-mSXpCt2p.js";import"./List-DO_c5BbT.js";import"./ListContext-Cbd93-g4.js";import"./ListItem-C9CmSeWD.js";import"./Link-Cx85Eufs.js";import"./index-YOnDx3vl.js";import"./lodash-D9X_jrAn.js";import"./index-CKnVRbVy.js";import"./useAnalytics-DWWuFwoK.js";import"./useApp-jjPu4N5T.js";import"./Page-Be0SepV6.js";import"./useMediaQuery-C9osTrLA.js";import"./Tooltip-BNLu37bx.js";import"./Popper-BWCVR11Y.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
