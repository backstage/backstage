import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-SQ-DrL5X.js";import{M as j}from"./MenuBook-B2SEbeXh.js";import{S as u}from"./SearchType-BUWX42Aw.js";import{s as g,M as P}from"./api-BNKCg0aq.js";import{S as R}from"./SearchContext-CM9k6e-l.js";import{S as m}from"./Grid-HVfBHifM.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DJRaFll9.js";import"./useAsync-DQVALOZU.js";import"./useMountedState-DACqQM7r.js";import"./translation-CA8JYBT7.js";import"./Box-jO9atyci.js";import"./styled-1GO4OxeJ.js";import"./AccordionDetails-jaK267eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-jswZGveg.js";import"./List-DB7A22uf.js";import"./ListContext-kEGsA8es.js";import"./Divider-DIkUV8fk.js";import"./ListItem-gDNiL9FP.js";import"./ListItemIcon-D9G4W8uu.js";import"./ListItemText-k6zwYryN.js";import"./makeStyles-CcvGO_cU.js";import"./Tabs-tpLhBi8c.js";import"./KeyboardArrowRight-C-xVj3UG.js";import"./FormLabel-gnVVEzxn.js";import"./formControlState-Dlh0g5nD.js";import"./InputLabel-BmuHpnZG.js";import"./Select-4NnDcq5q.js";import"./Popover-DjclQa21.js";import"./Modal-BO_2eW4j.js";import"./Portal-D10s9_Wu.js";import"./MenuItem-Di6pceV8.js";import"./Checkbox-POh0ommt.js";import"./SwitchBase-tkdF0wPK.js";import"./Chip-CdC_2Kac.js";import"./useAnalytics-CVS451d_.js";import"./lodash-aVxBzF5u.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
