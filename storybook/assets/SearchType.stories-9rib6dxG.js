import{ah as v,ai as f,aj as h,ak as T,a3 as y,j as e,T as x,Z as S}from"./iframe-CA0Xqitl.js";import{C as V}from"./MenuBook-CHOi2VY7.js";import{U as j}from"./Person-BR_06avH.js";import{S as s}from"./SearchType-DPg_roo6.js";import{s as _,M as g}from"./api-Bb3c_gWr.js";import{S as D}from"./SearchContext-Bger8GSm.js";import{S as u}from"./Grid-B8o7JoCY.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DfKPiaDM.js";import"./useAsync-BGwS6Vz2.js";import"./useMountedState-zGQsXHvo.js";import"./translation-DVeYHsEY.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./AccordionDetails-BewnNYiP.js";import"./index-B9sM2jn7.js";import"./Collapse-BpZh4zHv.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./Divider-Dil931lt.js";import"./ListItem-BzxviKme.js";import"./ListItemIcon-Ck7nypoA.js";import"./ListItemText-BwZgc58h.js";import"./Tabs-fmL5FU6v.js";import"./KeyboardArrowRight-CWYtNh_d.js";import"./FormLabel-B3GaXop_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BujB911u.js";import"./InputLabel--gwgFf8r.js";import"./Select-DNkSp5Jx.js";import"./Popover-BmPtjFBs.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./MenuItem--GQa4AVk.js";import"./Checkbox-DCnPGni0.js";import"./SwitchBase-B3jb_k_h.js";import"./Chip-JwuTVm3o.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-Bs3aHlE6.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
