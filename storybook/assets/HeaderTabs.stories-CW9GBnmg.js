import{j as t}from"./iframe-M9O-K8SB.js";import{H as n}from"./HeaderTabs-DEKigQC2.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./Tabs-Ckm9dnSY.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-O5ZDR88r.js";const T={title:"Layout/HeaderTabs",component:n,tags:["!manifest"]},a=r=>t.jsx(n,{...r});a.args={tabs:[{id:"tab1",label:"Tab 1"}]};const e=r=>t.jsx(n,{...r});e.args={tabs:[{id:"tab1",label:"Tab 1"},{id:"tab2",label:"Tab 2"},{id:"tab3",label:"Tab 3"},{id:"tab4",label:"Tab 4"},{id:"tab5",label:"Tab 5"}]};const s=r=>t.jsx(n,{...r});s.args={tabs:[{id:"tab1",label:"Tab 1"},{id:"tab2",label:"Tab 2"},{id:"tab3",label:"Tab 3"},{id:"tab4",label:"Tab 4"},{id:"tab5",label:"Tab 5"}],selectedIndex:1};a.__docgenInfo={description:"",methods:[],displayName:"SingleTab"};e.__docgenInfo={description:"",methods:[],displayName:"MultipleTabs"};s.__docgenInfo={description:"",methods:[],displayName:"SelectedTab"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const SingleTab = () => (
  <HeaderTabs
    tabs={[
      {
        id: "tab1",
        label: "Tab 1",
      },
    ]}
  />
);
`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const MultipleTabs = () => (
  <HeaderTabs
    tabs={[
      {
        id: "tab1",
        label: "Tab 1",
      },
      {
        id: "tab2",
        label: "Tab 2",
      },
      {
        id: "tab3",
        label: "Tab 3",
      },
      {
        id: "tab4",
        label: "Tab 4",
      },
      {
        id: "tab5",
        label: "Tab 5",
      },
    ]}
  />
);
`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const SelectedTab = () => (
  <HeaderTabs
    tabs={[
      {
        id: "tab1",
        label: "Tab 1",
      },
      {
        id: "tab2",
        label: "Tab 2",
      },
      {
        id: "tab3",
        label: "Tab 3",
      },
      {
        id: "tab4",
        label: "Tab 4",
      },
      {
        id: "tab5",
        label: "Tab 5",
      },
    ]}
    selectedIndex={1}
  />
);
`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"(args: any) => <HeaderTabs {...args} />",...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: any) => <HeaderTabs {...args} />",...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"(args: any) => <HeaderTabs {...args} />",...s.parameters?.docs?.source}}};const u=["SingleTab","MultipleTabs","SelectedTab"];export{e as MultipleTabs,s as SelectedTab,a as SingleTab,u as __namedExportsOrder,T as default};
