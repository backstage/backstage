import{aC as v,aD as f,aE as h,aF as T,a4 as y,j as e,T as x,Z as S}from"./iframe-BuVoE93N.js";import{C as V}from"./MenuBook-D-dRv4fm.js";import{U as j}from"./Person-DyohIijl.js";import{S as s}from"./SearchType-LjnN6qJT.js";import{s as _,M as g}from"./api-DsOWsteJ.js";import{S as D}from"./SearchContext-BCG5PVtl.js";import{S as u}from"./Grid-BS_RmjCI.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DhETGfMT.js";import"./useAsync-Wgi4dREP.js";import"./useMountedState-CTJrFvSG.js";import"./translation-DnmRTu-l.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./AccordionDetails-hMDXQ06y.js";import"./index-B9sM2jn7.js";import"./Collapse-1RctBr9q.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./Divider-Ccs-DDu6.js";import"./ListItem-DWhn9oWM.js";import"./ListItemIcon-D6OIKSgI.js";import"./ListItemText-BhWjqHFt.js";import"./Tabs-CN1y7-I2.js";import"./KeyboardArrowRight-BF1Wcwli.js";import"./FormLabel-DhWhQW_c.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BJIgSq-Y.js";import"./InputLabel-DaEQzIA4.js";import"./Select-RzLO2HvX.js";import"./Popover-BXpMyGs6.js";import"./Modal-DyZkcIsp.js";import"./Portal-C8Go-sfs.js";import"./MenuItem-BO8r2Ugw.js";import"./Checkbox-Bek1DRBf.js";import"./SwitchBase-CNM0OcZT.js";import"./Chip-B0FXo_z1.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-CGq4Uj37.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const fe=["Default","Accordion","Tabs"];export{o as Accordion,a as Default,t as Tabs,fe as __namedExportsOrder,ve as default};
