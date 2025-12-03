import{ah as v,ai as f,aj as h,ak as T,q as y,j as e,T as x,$ as S}from"./iframe-C9zrakkc.js";import{C as V}from"./MenuBook-DsBCe20t.js";import{U as j}from"./Person-D9J2bcew.js";import{S as s}from"./SearchType-BKI5WoD8.js";import{s as _,M as g}from"./api-ADZ3AgWv.js";import{S as D}from"./SearchContext-C0ChnN0X.js";import{S as u}from"./Grid-JwSod7uj.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BmhSC8QK.js";import"./useAsync-ClKr9TyR.js";import"./useMountedState-C5AiKHab.js";import"./translation-U8ZgGJTK.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./AccordionDetails-CO835Xyy.js";import"./index-B9sM2jn7.js";import"./Collapse-BSaPuFEG.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./Divider-BvnOZNSI.js";import"./ListItem-DN7mBFNT.js";import"./ListItemIcon-BN7Nr2w-.js";import"./ListItemText-u9zyj5b2.js";import"./Tabs-Cpd6_eeD.js";import"./KeyboardArrowRight-dhuBQv-6.js";import"./FormLabel-KYyo1YaL.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-RjzHBz.js";import"./InputLabel-BZzk3L7N.js";import"./Select-BbWiZwSi.js";import"./Popover-DNks6xHK.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./MenuItem-gfVzx_r1.js";import"./Checkbox-Dwz9kxDq.js";import"./SwitchBase-B3wrQpA3.js";import"./Chip-Bg6VTpFe.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-DAZilNqi.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var q=I();const R=y(q),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(R,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
