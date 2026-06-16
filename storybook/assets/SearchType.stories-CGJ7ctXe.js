import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-A5q7KvPV.js";import{M as j}from"./MenuBook-6TwUHa7_.js";import{S as u}from"./SearchType-DQQbwN3c.js";import{s as g,M as R}from"./api-DY5NJNHK.js";import{S as q}from"./SearchContext-BGFENsFy.js";import{S as m}from"./Grid-B2YGGSgc.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DZiXAgMM.js";import"./useAsync-D9Dadyr-.js";import"./useMountedState-D9Kraart.js";import"./translation-Da90xQy8.js";import"./Box-Do1kLFaD.js";import"./styled-CaiGGCTB.js";import"./AccordionDetails-CJeHfiZr.js";import"./index-B9sM2jn7.js";import"./Collapse-DNyQVL9b.js";import"./List-BHb0DGH0.js";import"./ListContext-BrmWluE9.js";import"./Divider-yQcNjI7O.js";import"./ListItem-CLjawmK4.js";import"./ListItemIcon-CrnEtBQ7.js";import"./ListItemText-BWLQ0n6h.js";import"./makeStyles-BSDvNkE_.js";import"./Tabs-BRRPEtCG.js";import"./KeyboardArrowRight-CjF1Birc.js";import"./FormLabel-D3cTAXYQ.js";import"./formControlState-BpLmWJLS.js";import"./InputLabel-D4puVLld.js";import"./Select-QB9tCMwo.js";import"./Popover-X-ryUqSd.js";import"./Modal-NqX8GTQ0.js";import"./Portal-CYnqZvqi.js";import"./MenuItem-b-m50k9y.js";import"./Checkbox-C6P_SRzV.js";import"./SwitchBase-Bp8yDqBu.js";import"./Chip-BB37PRoF.js";import"./useAnalytics-Ds2gUWuY.js";import"./lodash-9IYu6p8I.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Te as __namedExportsOrder,ye as default};
