import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-B8uJzJnC.js";import{M as j}from"./MenuBook-CEZV-5XJ.js";import{S as u}from"./SearchType-CmsMTJ8Q.js";import{s as g,M as R}from"./api-EJdcO3Kb.js";import{S as q}from"./SearchContext-DAt3uNwn.js";import{S as m}from"./Grid-oRgMNHPR.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-h74Mv7eG.js";import"./useAsync-TaeDQlC6.js";import"./useMountedState-kS2pBaHK.js";import"./translation-DuCcxekG.js";import"./Box-C1vqOm76.js";import"./styled-BF0ejy4K.js";import"./AccordionDetails-LfQ1yJlW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dyw97_4a.js";import"./List-jJMlgd41.js";import"./ListContext-DB1EvxRt.js";import"./Divider-CPt0w2jx.js";import"./ListItem-BUvXVTsE.js";import"./ListItemIcon-Cey2zalD.js";import"./ListItemText-dB0fGlEm.js";import"./makeStyles-CENq9NVb.js";import"./Tabs-BdI9LVLG.js";import"./KeyboardArrowRight-C_py0SHH.js";import"./FormLabel-Cr9DABDU.js";import"./formControlState-C8ySi78y.js";import"./InputLabel-DfNteBO-.js";import"./Select-DzUdKDko.js";import"./Popover-sx9CoWmf.js";import"./Modal-DJmgbmQD.js";import"./Portal-BKHkFN--.js";import"./MenuItem-B2hOITEt.js";import"./Checkbox-DixUsgzX.js";import"./SwitchBase-C0q0akY6.js";import"./Chip-a_og1fon.js";import"./useAnalytics-DmS_ziXv.js";import"./lodash-D9y7SekR.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
