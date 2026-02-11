import{aC as v,aD as f,aE as h,aF as T,V,j as e,W as y,P as S}from"./iframe-BJyhMgZx.js";import{M as x}from"./MenuBook-8pGooZDa.js";import{M as g}from"./Person-DBfb5IjU.js";import{S as s}from"./SearchType-C3meS9wk.js";import{s as j,M as D}from"./api-Cdm69iM_.js";import{S as I}from"./SearchContext-C7gGdmvg.js";import{S as u}from"./Grid-Ce4w6y7_.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CZtZ9lCo.js";import"./useAsync-Bw-fkNAq.js";import"./useMountedState-Cu_WIlx5.js";import"./translation-OUfAJ4m-.js";import"./Box-DvCgVOwJ.js";import"./styled-LNNxiV8P.js";import"./AccordionDetails-BPpQ2yq1.js";import"./index-B9sM2jn7.js";import"./Collapse-Dk3gxg1y.js";import"./List-BFZ4Qrp4.js";import"./ListContext-wap519Wf.js";import"./Divider-CW714Rq9.js";import"./ListItem-C9MlxCoa.js";import"./ListItemIcon-CQMXs9iI.js";import"./ListItemText-BGmwo6yn.js";import"./Tabs-oRS404vA.js";import"./KeyboardArrowRight-dg1ZX07j.js";import"./FormLabel-B_ZS34Ie.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dkq16rYo.js";import"./InputLabel-UOElIK4s.js";import"./Select-C14uzBLV.js";import"./Popover-BMSZCUIK.js";import"./Modal-CpRiOHte.js";import"./Portal-Bs15JVl2.js";import"./MenuItem-D3sl4950.js";import"./Checkbox-CECHhbtb.js";import"./SwitchBase-BpEsOeP-.js";import"./Chip-CoinGNY9.js";import"./lodash-Owt1XfFv.js";import"./useAnalytics-D5KbbwDD.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=V(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
