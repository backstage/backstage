import{aK as v,aL as f,aM as h,aN as T,Y as y,j as e,Z as V,P as S}from"./iframe-DEPu6gb6.js";import{M as x}from"./MenuBook-DO9XEF-k.js";import{M as g}from"./Person-D4OQdVJr.js";import{S as s}from"./SearchType-CPyzM2cZ.js";import{s as j,M as I}from"./api-B8NpRCgE.js";import{S as D}from"./SearchContext-C_VLWS4z.js";import{S as u}from"./Grid-B4jZTMCZ.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-f018RETT.js";import"./useAsync-CXqm1YlW.js";import"./useMountedState-Bp82S8Hy.js";import"./translation-Dz_SqZI_.js";import"./makeStyles-DmiRwbC-.js";import"./Box-CRmT1Uep.js";import"./styled-C8JkirxD.js";import"./AccordionDetails-nYq3MGOf.js";import"./index-B9sM2jn7.js";import"./Collapse-D43uTXl1.js";import"./List-6W-tA5Er.js";import"./ListContext-YZAoD3r_.js";import"./Divider-Ce0hzK3j.js";import"./ListItem-Bp_YBU-O.js";import"./ListItemIcon-C1zFb_hB.js";import"./ListItemText-3-mp0clE.js";import"./Tabs-Drj02WKW.js";import"./KeyboardArrowRight-DDkx7YvC.js";import"./FormLabel-D6UJOp3T.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DAUaYgN1.js";import"./InputLabel-IUsVuxd9.js";import"./Select-vBtV_Tvu.js";import"./Popover-JW9C08Jz.js";import"./Modal-CgWsFYOX.js";import"./Portal-CQdgPEoH.js";import"./MenuItem-Cr_5oxMb.js";import"./Checkbox-TUTDokqR.js";import"./SwitchBase-pFpJccyV.js";import"./Chip-BrHrYCVI.js";import"./lodash-BpJ5SQhB.js";import"./useAnalytics-tiEgn8GG.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=y(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new I]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
