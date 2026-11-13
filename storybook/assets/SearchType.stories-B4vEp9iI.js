import{aJ as h,aK as y,aL as T,aM as x,aC as S,j as e,P as _,X as V}from"./iframe-jnmYTFb3.js";import{M as j}from"./MenuBook-CB9wpMv_.js";import{S as u}from"./SearchType-D9U2uaOr.js";import{s as g,M as P}from"./api-AQiNGqYN.js";import{S as R}from"./SearchContext-DFK_4Z9x.js";import{S as m}from"./Grid-DHhCW-Yl.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CA8sV17M.js";import"./useAsync-DMLkPo7x.js";import"./useMountedState-zcJIkXnT.js";import"./translation-B5dzd8L3.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";import"./AccordionDetails-Cr-qO6HI.js";import"./index-B9sM2jn7.js";import"./Collapse-DTDzxOj5.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./Divider-Cc2XeNV9.js";import"./ListItem-BO9RXUpG.js";import"./ListItemIcon-D55y0EHk.js";import"./ListItemText-BnRAJA86.js";import"./makeStyles-BpJnXHFG.js";import"./Tabs-CtJ3Lfyb.js";import"./KeyboardArrowRight-DDsdqCIf.js";import"./FormLabel-BPzQfZL7.js";import"./formControlState-CkCodxTV.js";import"./InputLabel-CUCS3i2b.js";import"./Select-BUzMz8Vv.js";import"./Popover-BxTe35X4.js";import"./Modal-BQsPqmbu.js";import"./Portal-KWeLUL2L.js";import"./MenuItem-DXC0S9jt.js";import"./Checkbox-Ia5eJd41.js";import"./SwitchBase-CNGyt7bw.js";import"./Chip-DAcCRpik.js";import"./useAnalytics-BuCMBFsG.js";import"./lodash-DMwpKwqE.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
