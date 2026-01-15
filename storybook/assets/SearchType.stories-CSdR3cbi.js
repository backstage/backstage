import{aD as v,aE as f,aF as h,aG as T,a6 as y,j as e,T as V,Z as S}from"./iframe-CDMGjht1.js";import{C as x}from"./MenuBook-B7rx3oeh.js";import{U as g}from"./Person-DEnUB2pS.js";import{S as s}from"./SearchType-DNianvII.js";import{s as j,M as D}from"./api-CShczd-4.js";import{S as I}from"./SearchContext-CLEKkWjz.js";import{S as u}from"./Grid-BgC6P4wx.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BW8Ytfi4.js";import"./useAsync-F2seOW-M.js";import"./useMountedState-BCg_GyJl.js";import"./translation-CMz6apg6.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./AccordionDetails-xoWWWHy1.js";import"./index-B9sM2jn7.js";import"./Collapse-T-NVxaZE.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./Divider-BQTEKmhn.js";import"./ListItem-CGpakNnt.js";import"./ListItemIcon-DccZo1Co.js";import"./ListItemText-DadlRFVX.js";import"./Tabs-GBem-Rqr.js";import"./KeyboardArrowRight-Bia-86ry.js";import"./FormLabel-BT7ooOKX.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BRa3ION0.js";import"./InputLabel-83Pog1NA.js";import"./Select-BCla9daD.js";import"./Popover-DdPwRKDV.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./MenuItem-Dp_K5hqc.js";import"./Checkbox-B7u2X2cu.js";import"./SwitchBase-DoZWNQU_.js";import"./Chip-BtG5853m.js";import"./lodash-DLuUt6m8.js";import"./useAnalytics-DNi1LI_h.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
