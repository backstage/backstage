import{j as s}from"./iframe--eVtoH1I.js";import{C as o}from"./Content-CphX2Clj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dqb3Scx7.js";import"./makeStyles-qwoBpcZQ.js";const p={title:"Layout/Content",component:o,tags:["!manifest"]},e=n=>s.jsx(o,{...n,children:s.jsx("div",{children:"This is child of content component"})});e.args={stretch:!1,noPadding:!1};const t=n=>s.jsx(o,{...n,children:s.jsx("div",{children:"This is child of content component"})});t.args={stretch:!0,noPadding:!0};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{stretch:{required:!1,tsType:{name:"boolean"},description:""},noPadding:{required:!1,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};t.__docgenInfo={description:"",methods:[],displayName:"WithNoPadding",props:{stretch:{required:!1,tsType:{name:"boolean"},description:""},noPadding:{required:!1,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <Content stretch={false} noPadding={false}>
    <div>This is child of content component</div>
  </Content>
);
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const WithNoPadding = () => (
  <Content stretch noPadding>
    <div>This is child of content component</div>
  </Content>
);
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: Props) => <Content {...args}>
    <div>This is child of content component</div>
  </Content>`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: Props) => <Content {...args}>
    <div>This is child of content component</div>
  </Content>`,...t.parameters?.docs?.source}}};const m=["Default","WithNoPadding"];export{e as Default,t as WithNoPadding,m as __namedExportsOrder,p as default};
