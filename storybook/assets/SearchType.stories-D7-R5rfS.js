import{aK as v,aL as f,aM as h,aN as T,Y as y,j as e,Z as V,P as S}from"./iframe-DTfizrde.js";import{M as x}from"./MenuBook-CLr45R5e.js";import{M as g}from"./Person-DPFijFJx.js";import{S as s}from"./SearchType-BdzK4S7X.js";import{s as j,M as I}from"./api-BBX_jdKK.js";import{S as D}from"./SearchContext-Df2xVzSN.js";import{S as u}from"./Grid-CiU0LbEc.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Zq7wFUjN.js";import"./useAsync-B8iDfpP7.js";import"./useMountedState-ucond-iA.js";import"./translation-z6qQKUwe.js";import"./makeStyles-cQYMssxT.js";import"./Box-BJ9QCDuL.js";import"./styled-D7CkLDDF.js";import"./AccordionDetails-TZdQkQtk.js";import"./index-B9sM2jn7.js";import"./Collapse-BjWqbLIw.js";import"./List-D_x_P-c5.js";import"./ListContext-D7hCMl_b.js";import"./Divider-FNJvM-pk.js";import"./ListItem-DW0UN9hL.js";import"./ListItemIcon-BF8hzhOE.js";import"./ListItemText-g7zvfuTx.js";import"./Tabs-CW_2UXlJ.js";import"./KeyboardArrowRight-BdPVyCmJ.js";import"./FormLabel-DBjzk2rj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-fH1OlxqH.js";import"./InputLabel-cJatbOt_.js";import"./Select-CADAs5HX.js";import"./Popover-QLUC5cRE.js";import"./Modal-UP6JYRoo.js";import"./Portal-DWz9hzP1.js";import"./MenuItem-D3_f0sYj.js";import"./Checkbox-KbVSZxWj.js";import"./SwitchBase-BP7-ZAO3.js";import"./Chip-B9ELYAiZ.js";import"./lodash-CVq2iuuf.js";import"./useAnalytics-Dnz6KMIA.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=y(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new I]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
