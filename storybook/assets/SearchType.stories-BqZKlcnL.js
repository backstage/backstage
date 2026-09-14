import{cd as h,ce as y,ch as T,cc as x,bs as S,bQ as e,P as _,a4 as V}from"./iframe-Bbqeoxyy.js";import{M as j}from"./MenuBook-DJxsg32r.js";import{S as u}from"./SearchType-Bn5U-w6A.js";import{s as g,M as P}from"./api-DB9jU94S.js";import{S as R}from"./SearchContext-XBRuy8rf.js";import{S as m}from"./Grid-DzJPcTRQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DLJ_FpHY.js";import"./useAsync-CpoIPyM5.js";import"./useMountedState-BNNLW-R1.js";import"./translation-C-OuKQhX.js";import"./Box-BxF7iS_5.js";import"./styled-B7YU-aJo.js";import"./AccordionDetails-DDWkg8jt.js";import"./index-B9sM2jn7.js";import"./Collapse-CJjxMxkO.js";import"./List-DxT-GkgB.js";import"./ListContext-Cf3kUXlp.js";import"./Divider-CjIx6zL2.js";import"./ListItem--VGhdB2A.js";import"./ListItemIcon-CLGQMzmW.js";import"./ListItemText-lg2s-VSy.js";import"./makeStyles-DFmhOTr7.js";import"./Tabs-LfiCsC5R.js";import"./KeyboardArrowRight-B6DXv5xG.js";import"./FormLabel-D_h8Xg4D.js";import"./formControlState-DGsCW9Ey.js";import"./InputLabel-CiedZ-T0.js";import"./Select-DqBZcwDS.js";import"./Popover-CabaTkGK.js";import"./Modal-BoYUUdYj.js";import"./Portal-CLynZG8W.js";import"./MenuItem-CNTI1GY3.js";import"./Checkbox-DWxwXKoh.js";import"./SwitchBase-Gaic3Vf-.js";import"./Chip-DUqAacSI.js";import"./useAnalytics-meCmxkTG.js";import"./lodash-Bx6Dz-vC.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),s=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),i=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Accordion"};i.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{s as Accordion,t as Default,i as Tabs,Te as __namedExportsOrder,ye as default};
