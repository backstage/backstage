import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-BpYUhtQT.js";import{C as V}from"./MenuBook-CKKedEiY.js";import{U as j}from"./Person-BUC95jXN.js";import{S as s}from"./SearchType-BEzzdxKM.js";import{s as g,M as _}from"./api-CGdsmrDM.js";import{S as D}from"./SearchContext-Qa-NpMIX.js";import{S as u}from"./Grid-BSBIJVeD.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-CeSJ010X.js";import"./useAsync-BpYeyvGz.js";import"./useMountedState-DBGgrpWA.js";import"./translation-Bkv_J9ly.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./AccordionDetails-fjjprATf.js";import"./index-DnL3XN75.js";import"./Collapse-CmnpFYn4.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./Divider-C5hfIyuI.js";import"./ListItem-DoWEcNrm.js";import"./ListItemIcon-LOr9dyWJ.js";import"./ListItemText-CJKnCLsZ.js";import"./Tabs-DRKcPHr7.js";import"./KeyboardArrowRight-Cy4ruyXZ.js";import"./FormLabel-CpvPMx-l.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-AOp6HVrP.js";import"./InputLabel-BMr4kJZH.js";import"./Select-Bll_j_Zk.js";import"./Popover-BGVNopjx.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./MenuItem-DGez6lGh.js";import"./Checkbox-DFFHda2d.js";import"./SwitchBase-DHDHzWjp.js";import"./Chip-DmrAEOMg.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-Bh2pk9PK.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
