import{aA as v,aB as f,aC as h,aD as T,V,j as e,W as y,P as S}from"./iframe-BCnUaApn.js";import{M as x}from"./MenuBook-BKEi-RAl.js";import{M as g}from"./Person-41ifHxQ2.js";import{S as s}from"./SearchType-D9jXTPT6.js";import{s as j,M as D}from"./api-DGJrcS-c.js";import{S as I}from"./SearchContext-ItWN41u7.js";import{S as u}from"./Grid-C3uFc5ER.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BUxi-bqu.js";import"./useAsync-D_PXZuIc.js";import"./useMountedState-vrTKrSWN.js";import"./translation-9GpW2RMw.js";import"./makeStyles-JxVjC-J_.js";import"./Box-Cd17mACv.js";import"./styled-CI-jgXD3.js";import"./AccordionDetails-BN4iSEgA.js";import"./index-B9sM2jn7.js";import"./Collapse-CEOYVyzq.js";import"./List-CQ8sfUf8.js";import"./ListContext-0sSsVP2_.js";import"./Divider-Bh_4Dh-e.js";import"./ListItem-BwmhHob9.js";import"./ListItemIcon-TwsYfTjW.js";import"./ListItemText-DVlnZYcM.js";import"./Tabs-DKssiqmE.js";import"./KeyboardArrowRight-CDV3ebRj.js";import"./FormLabel-CcK6Kum8.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-KKs53F56.js";import"./InputLabel-JuQ62ob_.js";import"./Select-Hy1AZ8c8.js";import"./Popover-Bu1QA2KL.js";import"./Modal-DttNqa2Q.js";import"./Portal-CNnOrQPJ.js";import"./MenuItem-DyjFW4LQ.js";import"./Checkbox-CuWAVtpt.js";import"./SwitchBase-DTUTTZEN.js";import"./Chip-BvmNOzN_.js";import"./lodash-DBetALU0.js";import"./useAnalytics-C8tUzO32.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const A=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
}`,...o.parameters?.docs?.source}}};const he=["Default","Accordion","Tabs"];export{r as Accordion,a as Default,o as Tabs,he as __namedExportsOrder,fe as default};
