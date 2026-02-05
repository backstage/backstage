import{a0 as o,j as n}from"./iframe-M9O-K8SB.js";import"./preload-helper-PPVm8Dsz.js";const i={title:"Layout/Content",component:o,tags:["!manifest"]},e=t=>n.jsx(o,{...t,children:n.jsx("div",{children:"This is child of content component"})});e.args={stretch:!1,noPadding:!1};const s=t=>n.jsx(o,{...t,children:n.jsx("div",{children:"This is child of content component"})});s.args={stretch:!0,noPadding:!0};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{stretch:{required:!1,tsType:{name:"boolean"},description:""},noPadding:{required:!1,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};s.__docgenInfo={description:"",methods:[],displayName:"WithNoPadding",props:{stretch:{required:!1,tsType:{name:"boolean"},description:""},noPadding:{required:!1,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <Content stretch={false} noPadding={false}>
    <div>This is child of content component</div>
  </Content>
);
`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const WithNoPadding = () => (
  <Content stretch noPadding>
    <div>This is child of content component</div>
  </Content>
);
`,...s.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: Props) => <Content {...args}>
    <div>This is child of content component</div>
  </Content>`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(args: Props) => <Content {...args}>
    <div>This is child of content component</div>
  </Content>`,...s.parameters?.docs?.source}}};const d=["Default","WithNoPadding"];export{e as Default,s as WithNoPadding,d as __namedExportsOrder,i as default};
