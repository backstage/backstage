import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-hd6BgcQH.js";import{C as V}from"./MenuBook-DLVmvQxU.js";import{U as j}from"./Person-CrGp36m8.js";import{S as s}from"./SearchType-BBQFSZoi.js";import{s as g,M as _}from"./api-Bev5I2Sd.js";import{S as D}from"./SearchContext-BtDsvwkw.js";import{S as u}from"./Grid-C4Dm4yGa.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-C7-67hd9.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./translation-BeOxiZJ4.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./Divider-BsrVsHFl.js";import"./ListItem-BuICECdF.js";import"./ListItemIcon-B1o-6Fru.js";import"./ListItemText-B0MXj_oA.js";import"./Tabs-DWz-YJuh.js";import"./KeyboardArrowRight-C8dCjVF1.js";import"./FormLabel-CeQe378n.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7qHenqP.js";import"./InputLabel-CWkIs-bu.js";import"./Select-FOK1voHD.js";import"./Popover-w_sS1QxY.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./MenuItem-3YpUlPNQ.js";import"./Checkbox-CoxSolwl.js";import"./SwitchBase-BJsD66a1.js";import"./Chip-DaEx1ypY.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-BNw5WHP5.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
