import{aC as v,aD as f,aE as h,aF as T,a1 as y,j as e,U as V,P as S}from"./iframe-DG9KPDCv.js";import{M as x}from"./MenuBook-eJ7NGjBo.js";import{U as g}from"./Person-DQrG9_WC.js";import{S as s}from"./SearchType-HwK17npI.js";import{s as j,M as D}from"./api-CXYhJN8Z.js";import{S as I}from"./SearchContext-BllXntxY.js";import{S as u}from"./Grid-BalTlFvh.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CqQxAXKH.js";import"./useAsync-BV2n2o7b.js";import"./useMountedState-B6hIrLCn.js";import"./translation-NQ035EfW.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./AccordionDetails-BMa1mXpE.js";import"./index-B9sM2jn7.js";import"./Collapse-B-7etz-P.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./Divider-e6kSnJJ8.js";import"./ListItem-CdFlW9lK.js";import"./ListItemIcon-BpSknpTV.js";import"./ListItemText-W0WQZlCP.js";import"./Tabs-DsYo7W32.js";import"./KeyboardArrowRight-D-n6FVla.js";import"./FormLabel-BfvEdZgn.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DPdVetVH.js";import"./InputLabel-BFY5u4Ls.js";import"./Select-145LJqm_.js";import"./Popover-Ce3qAytM.js";import"./Modal-BgaFEzC9.js";import"./Portal-Du_aJAA6.js";import"./MenuItem-CV9ILrOZ.js";import"./Checkbox-DOmgALbM.js";import"./SwitchBase-DLt2di76.js";import"./Chip-BCXeSDIr.js";import"./lodash-Czox7iJy.js";import"./useAnalytics-DskDDOhn.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
