import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-Ca7Z-L4G.js";import{C as V}from"./MenuBook-Bt7iuck5.js";import{U as j}from"./Person-D1y9RxFu.js";import{S as s}from"./SearchType-CNsLIE7E.js";import{s as g,M as _}from"./api-DI73kWJB.js";import{S as D}from"./SearchContext-DdegsUV-.js";import{S as u}from"./Grid-auHuq8r2.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-CMMWGbBw.js";import"./useAsync-DSkJAg62.js";import"./useMountedState-CV_rLf93.js";import"./translation-DcAgMdni.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./index-DnL3XN75.js";import"./Collapse-n2Kb8itc.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./Divider-zG-YiM3h.js";import"./ListItem-C9nJC85u.js";import"./ListItemIcon-BNgxXteL.js";import"./ListItemText-DZSn-Gas.js";import"./Tabs-CFozYLzz.js";import"./KeyboardArrowRight-BBrljslD.js";import"./FormLabel-qc-IFA2K.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-Q8lpQF.js";import"./InputLabel-C2usU0pq.js";import"./Select-DxKKxtIl.js";import"./Popover-CcKmVttI.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./MenuItem-DT4YPicg.js";import"./Checkbox-CFOiu_oi.js";import"./SwitchBase-43sqdZDc.js";import"./Chip-Du02hAg4.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-B4tVP_DV.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
