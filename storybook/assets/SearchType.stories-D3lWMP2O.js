import{ah as v,ai as f,aj as h,ak as T,a3 as y,j as e,T as x,Z as S}from"./iframe-C8uhRVJE.js";import{C as V}from"./MenuBook-DZAh29BA.js";import{U as j}from"./Person-_bczjW7i.js";import{S as s}from"./SearchType-CF_xaALK.js";import{s as _,M as g}from"./api-nXSRwllt.js";import{S as D}from"./SearchContext-Cuk_qmRx.js";import{S as u}from"./Grid-C5ZyGaTv.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-hZ2c00bV.js";import"./useAsync-CISCSNua.js";import"./useMountedState-D0BWMouD.js";import"./translation-B3dhk17w.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./AccordionDetails-CeLa6pif.js";import"./index-B9sM2jn7.js";import"./Collapse-DlLfqGWf.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./Divider-BSVlJEqX.js";import"./ListItem-CMqPdlpf.js";import"./ListItemIcon-J7mH5V5X.js";import"./ListItemText-u8pHhn01.js";import"./Tabs-CmylVRRi.js";import"./KeyboardArrowRight-CCOL6nfW.js";import"./FormLabel-DrjYVuAl.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-yOLsMAyU.js";import"./InputLabel-CwFtWVGx.js";import"./Select-DoMjfmP2.js";import"./Popover-BGm3xZF3.js";import"./Modal-BCg34ymo.js";import"./Portal-DGxbDxZD.js";import"./MenuItem-BcfjPQef.js";import"./Checkbox-JCSP6cGB.js";import"./SwitchBase-B7TJrYZZ.js";import"./Chip-BSGzT2Mn.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-CMB7EDSs.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const fe=["Default","Accordion","Tabs"];export{o as Accordion,a as Default,t as Tabs,fe as __namedExportsOrder,ve as default};
