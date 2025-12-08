import{ah as v,ai as f,aj as h,ak as T,q as y,j as e,T as x,$ as S}from"./iframe-omS-VfEE.js";import{C as V}from"./MenuBook-DG5FqHyB.js";import{U as j}from"./Person-bhgLz_mA.js";import{S as s}from"./SearchType-BQpLfQsV.js";import{s as _,M as g}from"./api-BPHn8KSC.js";import{S as D}from"./SearchContext-BqCLLorT.js";import{S as u}from"./Grid-BYUcu-HN.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-B7pPANEl.js";import"./useAsync-XDPyEQBh.js";import"./useMountedState-B72_4ZkH.js";import"./translation-BOFuybj1.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./AccordionDetails-BhNEpOi0.js";import"./index-B9sM2jn7.js";import"./Collapse-BMfiGGQz.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./Divider-B1hRM44o.js";import"./ListItem-CyW2KymL.js";import"./ListItemIcon-uG6Zdidr.js";import"./ListItemText-pfsweG72.js";import"./Tabs-YhsM_1GP.js";import"./KeyboardArrowRight-GaQDrkvc.js";import"./FormLabel-CMRKpa-Z.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CCoK0o0X.js";import"./InputLabel-DTyloQDa.js";import"./Select-cBs4AoEA.js";import"./Popover-CrWWJ3tC.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./MenuItem-B-ZJdPwj.js";import"./Checkbox-B25j5ajB.js";import"./SwitchBase-CHLia2ma.js";import"./Chip-3VxfBCLo.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-DpXUy368.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var q=I();const R=y(q),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(R,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
