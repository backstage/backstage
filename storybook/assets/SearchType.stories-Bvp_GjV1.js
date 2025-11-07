import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-DqJQ9uPs.js";import{C as V}from"./MenuBook-CdUiLeJZ.js";import{U as j}from"./Person-wVkJeO2c.js";import{S as s}from"./SearchType-C0Qifozz.js";import{s as g,M as _}from"./api-DFeRnRBI.js";import{S as D}from"./SearchContext-CDPFSwZ_.js";import{S as u}from"./Grid-KKLALRV6.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-BotAWQ1n.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./translation-EyQMhH41.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./AccordionDetails-Dyf75Eaf.js";import"./index-DnL3XN75.js";import"./Collapse-BECsH0M_.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./Divider-xOTMBAcj.js";import"./ListItem-DIBtNilh.js";import"./ListItemIcon-DddJgjrL.js";import"./ListItemText-QaJAw11k.js";import"./Tabs-DqZ__Is-.js";import"./KeyboardArrowRight-C1HzRoK8.js";import"./FormLabel-CFDsgmCA.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CUP8RVYe.js";import"./InputLabel-DI2qx3ui.js";import"./Select-BTs0VRvv.js";import"./Popover-O0XQDvdf.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./MenuItem-CVc4UX_G.js";import"./Checkbox-CMX1Hq5y.js";import"./SwitchBase-dvRTwFBi.js";import"./Chip-BMnNLW81.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-CfDtSbQu.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
