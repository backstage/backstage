import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-Dzms4wRw.js";import{M as j}from"./MenuBook-B7K5XEJp.js";import{S as u}from"./SearchType-C8zF4ZZ5.js";import{s as g,M as R}from"./api-COs9-f2c.js";import{S as q}from"./SearchContext-BoDX1sqx.js";import{S as m}from"./Grid-WTfAUw8g.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DFlqtRQ5.js";import"./useAsync-B8rWFzjm.js";import"./useMountedState-DAwMeOiL.js";import"./translation-Fl4REPcY.js";import"./Box-BC3MKl-R.js";import"./styled-D_n4yIWo.js";import"./AccordionDetails-CbTO_NVi.js";import"./index-B9sM2jn7.js";import"./Collapse-BYtfyYGR.js";import"./List-9JTk76WA.js";import"./ListContext-DIjUyL6C.js";import"./Divider-DDXBFSff.js";import"./ListItem-Buq3cft7.js";import"./ListItemIcon-B8gunPsx.js";import"./ListItemText-k3L9Vy_V.js";import"./makeStyles-B1h1_YhU.js";import"./Tabs-BxF_KPF3.js";import"./KeyboardArrowRight-Cd0pVVpW.js";import"./FormLabel-6k732KDb.js";import"./formControlState-CCaepNrO.js";import"./InputLabel-DlVi-E52.js";import"./Select-BwIdArKx.js";import"./Popover-BjHXVuJd.js";import"./Modal-BopK_LfE.js";import"./Portal-BUEMV8dG.js";import"./MenuItem-BPuLAZGY.js";import"./Checkbox-i0X5xeB4.js";import"./SwitchBase-HwkVwbdT.js";import"./Chip-B4g0GW00.js";import"./useAnalytics-BA98r_JB.js";import"./lodash-Cb2Wy_9k.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
