import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-WUTgIN9N.js";import{M as j}from"./MenuBook-DOZAQJgt.js";import{S as u}from"./SearchType-NbzWNSM7.js";import{s as g,M as P}from"./api-BjbWyhwg.js";import{S as R}from"./SearchContext-CLp44Lpp.js";import{S as m}from"./Grid-QAEhh-IU.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DIy80QFO.js";import"./useAsync-KKA-Wjg0.js";import"./useMountedState-hBsZdgf2.js";import"./translation-HJuaYn-T.js";import"./Box-Dz1w66KV.js";import"./styled-DY6u-KGu.js";import"./AccordionDetails-DFhVCqjY.js";import"./index-B9sM2jn7.js";import"./Collapse-CE1N4KeO.js";import"./List-BwP59E3R.js";import"./ListContext-CASXpzwL.js";import"./Divider-LpG7fity.js";import"./ListItem-CuOMG44s.js";import"./ListItemIcon-pntrBOj-.js";import"./ListItemText-zrcvi365.js";import"./makeStyles-D1P9beTg.js";import"./Tabs-BIRphkum.js";import"./KeyboardArrowRight-B5LADtmM.js";import"./FormLabel-KyJ4F4OP.js";import"./formControlState-CEs28luG.js";import"./InputLabel-CQ4Lk4r1.js";import"./Select-Ci91cUK8.js";import"./Popover-DNNqIvBY.js";import"./Modal-ByG9teyx.js";import"./Portal-Btr-b7mG.js";import"./MenuItem-BlljcXAr.js";import"./Checkbox-CQ6zY3Cx.js";import"./SwitchBase-DyCQYipi.js";import"./Chip-B4Vbl1CO.js";import"./useAnalytics-gQW0QBIW.js";import"./lodash-Dgk92AEG.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
