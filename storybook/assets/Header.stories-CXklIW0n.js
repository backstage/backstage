import{j as t}from"./iframe-DGowiHGf.js";import{H as i}from"./Header-DR_n9b3P.js";import{P as a}from"./Page-BCPZSzgp.js";import{H as r}from"./HeaderLabel-hQZUhftd.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CTnVh4pd.js";import"./makeStyles-BB1S9Pq6.js";import"./Box-VCK17nNx.js";import"./styled-CW0ZllnF.js";import"./Grid-DloVQjFg.js";import"./Breadcrumbs-BZF2k4qn.js";import"./index-B9sM2jn7.js";import"./Popover-DqpwUeJY.js";import"./Modal-DsQyezOX.js";import"./Portal-SyAq80li.js";import"./List-BJFCJqLc.js";import"./ListContext-C2un48fJ.js";import"./ListItem-tq9DsB-6.js";import"./Link-DvMGce1e.js";import"./index-ClVhZOfu.js";import"./lodash-Bt1FuOXC.js";import"./index-DaxhahHe.js";import"./useAnalytics-DYPlyL1E.js";import"./useApp-D0KGx7Le.js";import"./Page-C3BiKnG7.js";import"./useMediaQuery-CqedWkQu.js";import"./Tooltip-Lr-cB2mL.js";import"./Popper-OdyRH94b.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
