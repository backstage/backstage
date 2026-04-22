import{aP as h,aQ as y,aR as S,aS as T,aE as x,j as e,P as _,a2 as V}from"./iframe-CC8dZ5v0.js";import{M as j}from"./MenuBook-dAgr3pha.js";import{S as u}from"./SearchType-bK0NIqZW.js";import{s as P,M as R}from"./api-D4r0i8Z2.js";import{S as g}from"./SearchContext-BWF-VLBq.js";import{S as m}from"./Grid-CCYqzPMW.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-RARwx0Xw.js";import"./useAsync-Cubaspqz.js";import"./useMountedState-BiVC6Sna.js";import"./translation-DK1bgbwD.js";import"./Box-BhabvipW.js";import"./styled-CM_Xf2DM.js";import"./AccordionDetails-C7iUogkW.js";import"./index-B9sM2jn7.js";import"./Collapse-0iMZ9ReK.js";import"./List-D-_F1OrG.js";import"./ListContext-Bfuv36sR.js";import"./Divider-BDaqKUXC.js";import"./ListItem-B4tF2XTx.js";import"./ListItemIcon-BI2dA1qJ.js";import"./ListItemText-DP3OOKih.js";import"./makeStyles-DTH3glJL.js";import"./Tabs-CN2KqYXF.js";import"./KeyboardArrowRight-B_npc3qv.js";import"./FormLabel-D7DoMOF4.js";import"./formControlState-CT258kkI.js";import"./InputLabel-BG7iNks-.js";import"./Select-DiStTNdo.js";import"./Popover-CphrO87E.js";import"./Modal-Zvs4RyO_.js";import"./Portal-COibyzBH.js";import"./MenuItem-BNGZSNlf.js";import"./Checkbox-DG0ezfCy.js";import"./SwitchBase-pednpeve.js";import"./Chip-aD7C19lk.js";import"./useAnalytics-4dX8X2S1.js";import"./lodash-BzWoCuL2.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new R]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
