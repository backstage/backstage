import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-Bm5ba6Eo.js";import{M as j}from"./MenuBook-BBhwBPGe.js";import{S as u}from"./SearchType-DwUN7N__.js";import{s as g,M as R}from"./api-6tYSjb2W.js";import{S as q}from"./SearchContext-hvWarYky.js";import{S as m}from"./Grid-2YxRqddS.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DZhVJ5gx.js";import"./useAsync-BFTdLWGt.js";import"./useMountedState-CX6Pdejq.js";import"./translation-qmYOz1yO.js";import"./Box-NESd7kYt.js";import"./styled-DeEwf9nS.js";import"./AccordionDetails-BH84Cqgt.js";import"./index-B9sM2jn7.js";import"./Collapse-8dQvh7gn.js";import"./List-CJhMPRPP.js";import"./ListContext-CVjS-G2V.js";import"./Divider-DgXuoSNG.js";import"./ListItem-UVpWaDMa.js";import"./ListItemIcon-BIBGeTx2.js";import"./ListItemText-D1JMY5d6.js";import"./makeStyles-BxPw9vCe.js";import"./Tabs-BB4Ir0GU.js";import"./KeyboardArrowRight-DpTPYhfS.js";import"./FormLabel-B8HHe0vy.js";import"./formControlState-BIqw7ICg.js";import"./InputLabel-C2OYVFQH.js";import"./Select-EsGPAfN_.js";import"./Popover-CYDJVvd7.js";import"./Modal-Cx8YqiY2.js";import"./Portal-Cg5Nvqt2.js";import"./MenuItem-D2iqw-vS.js";import"./Checkbox-w9yG33zI.js";import"./SwitchBase-DC-Y3upw.js";import"./Chip-C4iYXxfQ.js";import"./useAnalytics-BQdStjBt.js";import"./lodash-KBhUdAYx.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
