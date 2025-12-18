import{am as v,an as f,ao as h,ap as T,a3 as y,j as e,T as x,Z as S}from"./iframe-BNEamOZA.js";import{C as V}from"./MenuBook-BY48xQ8t.js";import{U as j}from"./Person-DaMliNns.js";import{S as s}from"./SearchType-DRXMEOPu.js";import{s as _,M as g}from"./api-C0fRxaNa.js";import{S as D}from"./SearchContext-CkHPevI1.js";import{S as u}from"./Grid-CRwHHoKE.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CsLuOGj_.js";import"./useAsync-DTLzs39j.js";import"./useMountedState-Dry2TiBQ.js";import"./translation-Dz99vQpA.js";import"./Box-3EsxCCm9.js";import"./styled-vJQyp9py.js";import"./AccordionDetails-BJMgrmW8.js";import"./index-B9sM2jn7.js";import"./Collapse-OWL0PMb0.js";import"./List-DzzgZbq5.js";import"./ListContext-XsugHlK5.js";import"./Divider-DHY-OV0t.js";import"./ListItem-ZNxVQ_73.js";import"./ListItemIcon-BMfY9o5p.js";import"./ListItemText-DDE6HSA_.js";import"./Tabs-JOwnbLCk.js";import"./KeyboardArrowRight-VDvlfOP5.js";import"./FormLabel-BRK_LAWk.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-buV-QlLj.js";import"./InputLabel-CH4Nqqve.js";import"./Select-B8_uejOX.js";import"./Popover-8csDASer.js";import"./Modal-DO3msElT.js";import"./Portal-DTr3SEhf.js";import"./MenuItem-N74_guDo.js";import"./Checkbox-CtEhA_Ry.js";import"./SwitchBase-DQXanYJ1.js";import"./Chip-Dxv8dc2v.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-CDZunouu.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
