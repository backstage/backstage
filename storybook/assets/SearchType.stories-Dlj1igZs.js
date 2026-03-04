import{aF as v,aG as f,aH as h,aI as T,V,j as e,W as y,P as S}from"./iframe-DC0HuKGF.js";import{M as x}from"./MenuBook-MJq8qUfD.js";import{M as I}from"./Person-BUjRFYYz.js";import{S as s}from"./SearchType-VbpdLMDB.js";import{s as g,M as j}from"./api-qFrVV7Y9.js";import{S as D}from"./SearchContext-D_r8S1EG.js";import{S as u}from"./Grid-B4PBabAQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BviA-7xr.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./translation-CGlcTDae.js";import"./makeStyles-CdFTekTr.js";import"./Box-CHRqFhJe.js";import"./styled-B4TWoPqU.js";import"./AccordionDetails-eCguWzjA.js";import"./index-B9sM2jn7.js";import"./Collapse-BID6kfZ_.js";import"./List-CssDjDLP.js";import"./ListContext-P3rTeiNo.js";import"./Divider-DNA6aJNh.js";import"./ListItem-ppf-hIBK.js";import"./ListItemIcon-ClZ6XSB5.js";import"./ListItemText-BEMMREzR.js";import"./Tabs-DrpIxYYh.js";import"./KeyboardArrowRight-B7ArYsQL.js";import"./FormLabel-DDi_9Eij.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C9u7aH6n.js";import"./InputLabel-DNeoskIJ.js";import"./Select-DnZ_kkyZ.js";import"./Popover-DGTyTaBx.js";import"./Modal-BmT395tY.js";import"./Portal-BQrNoYBv.js";import"./MenuItem-g9bjAnHh.js";import"./Checkbox-B6H2vSRp.js";import"./SwitchBase-BTPjMVDw.js";import"./Chip-DcqZf6-M.js";import"./lodash-CrNJApB2.js";import"./useAnalytics-BaWCJwCB.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[g,new j]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
