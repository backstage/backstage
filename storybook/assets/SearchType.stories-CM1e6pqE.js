import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-D9zyyCLm.js";import{M as j}from"./MenuBook-Be-qGsjr.js";import{S as u}from"./SearchType-Lp-HHcOD.js";import{s as g,M as P}from"./api-BcooKewd.js";import{S as R}from"./SearchContext-BROEIRe0.js";import{S as m}from"./Grid-BB8AJhQB.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-C2LE1N2L.js";import"./useAsync-DanSD5vu.js";import"./useMountedState-T1Hh3_OE.js";import"./translation-Be4VAO2f.js";import"./Box-Defj12pz.js";import"./styled-D79h_skJ.js";import"./AccordionDetails-CelqUZr6.js";import"./index-B9sM2jn7.js";import"./Collapse-D4zdbtg3.js";import"./List-C4uiJVgu.js";import"./ListContext-BGhsm4dp.js";import"./Divider-BqjqocUC.js";import"./ListItem-O17-VUI5.js";import"./ListItemIcon-guKHv8rX.js";import"./ListItemText-CSafx1d3.js";import"./makeStyles-CWCwef5R.js";import"./Tabs-BWqDRw9L.js";import"./KeyboardArrowRight-DqPQCt-J.js";import"./FormLabel-1MbQhI4G.js";import"./formControlState-DlNxq2V2.js";import"./InputLabel-C-xp13Xr.js";import"./Select-o8JCmaT5.js";import"./Popover-4cdXxDWz.js";import"./Modal-BrBYhxf7.js";import"./Portal-BgM3-FYw.js";import"./MenuItem-D_TJPtDF.js";import"./Checkbox-_k2rjoj9.js";import"./SwitchBase-D3qJB84K.js";import"./Chip-X13cm0wf.js";import"./useAnalytics-b9lD6bMf.js";import"./lodash-c_X8lcuE.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
