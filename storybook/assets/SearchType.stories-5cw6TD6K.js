import{aP as h,aQ as y,aR as S,aS as T,aE as x,j as e,P as _,a2 as V}from"./iframe-Dl5_TB80.js";import{M as j}from"./MenuBook-Dch1Ntch.js";import{S as u}from"./SearchType-CBCCbc2p.js";import{s as P,M as R}from"./api-XU0AZr6w.js";import{S as g}from"./SearchContext-Dz9t0Dya.js";import{S as m}from"./Grid-BMYKcvy9.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DIlhH76V.js";import"./useAsync-CXdWiZfr.js";import"./useMountedState-EgIiw3wU.js";import"./translation-Bu03xfn-.js";import"./Box-OWTqpTcU.js";import"./styled-fbCpj-h3.js";import"./AccordionDetails-BiykvKQ8.js";import"./index-B9sM2jn7.js";import"./Collapse-fj436sW1.js";import"./List-C3tE9H9r.js";import"./ListContext-CchtOyLx.js";import"./Divider-BMXypekn.js";import"./ListItem-BeH4jBX0.js";import"./ListItemIcon-jAg8xCQ2.js";import"./ListItemText-DyWL0Vxa.js";import"./makeStyles-DVCr62xB.js";import"./Tabs-DtqJBHXf.js";import"./KeyboardArrowRight-_mm2-1nC.js";import"./FormLabel-BbBiEv5Y.js";import"./formControlState-M_nCniSy.js";import"./InputLabel-B9SfxFG2.js";import"./Select--XjuSv-m.js";import"./Popover-DeCGPguR.js";import"./Modal-B2_6DlPv.js";import"./Portal-BqMy1omF.js";import"./MenuItem-BGDswtmG.js";import"./Checkbox-Cd9JzOte.js";import"./SwitchBase-CbSziPB5.js";import"./Chip-DGp0soLL.js";import"./useAnalytics-Co8FXgmH.js";import"./lodash-CqCFQ6Ro.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new R]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const Se=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Se as __namedExportsOrder,ye as default};
