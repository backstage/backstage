import{ah as v,ai as f,aj as h,ak as T,q as y,j as e,T as x,$ as S}from"./iframe-DVllq_JJ.js";import{C as V}from"./MenuBook-DFGtI48n.js";import{U as j}from"./Person-CpBYAGxx.js";import{S as s}from"./SearchType-Caq4h1ix.js";import{s as _,M as g}from"./api-CuPwg010.js";import{S as D}from"./SearchContext-CaUhcdO1.js";import{S as u}from"./Grid-GLf92srY.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-DeLbxlk1.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./translation-C0yGASJG.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./AccordionDetails-Df6QxQno.js";import"./index-DnL3XN75.js";import"./Collapse-BPkQPj1V.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./Divider-CjoboeOw.js";import"./ListItem-DLfoHZ9h.js";import"./ListItemIcon-YeiYafbr.js";import"./ListItemText-C9klhbSR.js";import"./Tabs-Cg_RZuRg.js";import"./KeyboardArrowRight-Bh86fb4U.js";import"./FormLabel-BUcwKNSV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-FUAgoXnH.js";import"./InputLabel-Bw5HT09J.js";import"./Select-C2FbmBaB.js";import"./Popover-BN4BKHON.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./MenuItem-Dt6qEJa5.js";import"./Checkbox-C4IbqV4-.js";import"./SwitchBase-Ch36SCvN.js";import"./Chip-DYiRYBoC.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-gDAqv4j8.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var q=I();const R=y(q),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(R,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
