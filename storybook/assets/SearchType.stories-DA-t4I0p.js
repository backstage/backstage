import{aD as v,aE as f,aF as h,aG as T,a6 as y,j as e,T as V,Z as S}from"./iframe-BUNFJ-LL.js";import{C as x}from"./MenuBook-CPpag1bE.js";import{U as g}from"./Person-BVjau2cu.js";import{S as s}from"./SearchType-B99ENhkY.js";import{s as j,M as D}from"./api-BMyYV67s.js";import{S as I}from"./SearchContext-0ogBco_9.js";import{S as u}from"./Grid-DBxLs0pG.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BvmDc48x.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./translation-VahZo0BD.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./AccordionDetails-NEVFuKGX.js";import"./index-B9sM2jn7.js";import"./Collapse-oWd9G09k.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./Divider-CRo1EOKz.js";import"./ListItem-DqtCuPtR.js";import"./ListItemIcon-BaVzYsIK.js";import"./ListItemText-Csz7vtMz.js";import"./Tabs-BpDARNWL.js";import"./KeyboardArrowRight-BY-m1j12.js";import"./FormLabel-C_IRPNph.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DqfIa0Dm.js";import"./InputLabel-CiiZN-sU.js";import"./Select-BkWY0oDV.js";import"./Popover-Dheh4pDu.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./MenuItem-D5tZwe5H.js";import"./Checkbox-C0shAQFP.js";import"./SwitchBase-DfQIqOIj.js";import"./Chip-xFVbq4gh.js";import"./lodash-Czox7iJy.js";import"./useAnalytics-BrGJTKfU.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>
  );
};
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Accordion = () => {
  return (
    <SearchType.Accordion
      name="Result Types"
      defaultValue="value-1"
      types={[
        { value: "value-1", name: "Value One", icon: <CatalogIcon /> },
        { value: "value-2", name: "Value Two", icon: <DocsIcon /> },
        { value: "value-3", name: "Value Three", icon: <UsersGroupsIcon /> },
      ]}
    />
  );
};
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const Tabs = () => {
  return (
    <SearchType.Tabs
      defaultValue="value-1"
      types={[
        { value: "value-1", name: "Value One" },
        { value: "value-2", name: "Value Two" },
        { value: "value-3", name: "Value Three" },
      ]}
    />
  );
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...o.parameters?.docs?.source}}};const fe=["Default","Accordion","Tabs"];export{r as Accordion,a as Default,o as Tabs,fe as __namedExportsOrder,ve as default};
