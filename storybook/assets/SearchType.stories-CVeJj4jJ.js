import{aC as v,aD as f,aE as h,aF as T,a1 as y,j as e,U as V,P as S}from"./iframe-Dc6SVWG5.js";import{M as x}from"./MenuBook-ygyLg3K9.js";import{U as g}from"./Person-DlqWGU_T.js";import{S as s}from"./SearchType-CFp5W8Gs.js";import{s as j,M as D}from"./api-BxqHLxfN.js";import{S as I}from"./SearchContext-DqrUnkbo.js";import{S as u}from"./Grid-BSXyf9SS.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DbnKJ-3Y.js";import"./useAsync-BGeZ5faP.js";import"./useMountedState-1x78q3TT.js";import"./translation-CpVNt5-q.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./Divider-B6Rq6sfT.js";import"./ListItem-BhueXXFi.js";import"./ListItemIcon-DJxySM4s.js";import"./ListItemText-BD21enaM.js";import"./Tabs-BuEBAYpB.js";import"./KeyboardArrowRight-DEl3sBJ0.js";import"./FormLabel-BC623y4W.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C8sguxDP.js";import"./InputLabel-BJhsb98G.js";import"./Select-dHX4Oq4i.js";import"./Popover-iM_ezzPB.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./MenuItem-CSGcDRRh.js";import"./Checkbox-DeCUp3AD.js";import"./SwitchBase-C5-KVES4.js";import"./Chip-JHBJeI6G.js";import"./lodash-Czox7iJy.js";import"./useAnalytics-BxYnHleN.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
