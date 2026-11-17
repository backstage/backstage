import{aJ as h,aK as y,aL as T,aM as x,aC as S,j as e,P as _,X as V}from"./iframe-BS0xFXlr.js";import{M as j}from"./MenuBook-CTpHb89n.js";import{S as u}from"./SearchType-qY2AIB8W.js";import{s as g,M as P}from"./api-kGNx5yom.js";import{S as R}from"./SearchContext-B9Loq1p_.js";import{S as m}from"./Grid-BC-GErrP.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BJk8aIJ8.js";import"./useAsync--6P2rWtU.js";import"./useMountedState-7-fWW0Pc.js";import"./translation-oB-xmGTG.js";import"./Box-CLuirzLp.js";import"./styled-DTU31MMc.js";import"./AccordionDetails-38LltlXO.js";import"./index-B9sM2jn7.js";import"./Collapse-BMt5zQG_.js";import"./List-3z7MBLVl.js";import"./ListContext-D9vaJRo5.js";import"./Divider-DPIySf_q.js";import"./ListItem-BV0lDcKg.js";import"./ListItemIcon-BszJDTWm.js";import"./ListItemText-DrTF3v8k.js";import"./makeStyles-BLXzgJv8.js";import"./Tabs-D5e7mxhJ.js";import"./KeyboardArrowRight-BBL05qmG.js";import"./FormLabel-CXbmrRly.js";import"./formControlState-5HZN73ai.js";import"./InputLabel-MFdW6S54.js";import"./Select-DYpmtd41.js";import"./Popover-CGUN73PQ.js";import"./Modal-CLDgk_N2.js";import"./Portal-pjLYth_7.js";import"./MenuItem-XjbhUJKp.js";import"./Checkbox-CYRmsCbt.js";import"./SwitchBase-PLxkeCMh.js";import"./Chip-nuedOYzC.js";import"./useAnalytics-BnNCqh3j.js";import"./lodash-diAnziC6.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
