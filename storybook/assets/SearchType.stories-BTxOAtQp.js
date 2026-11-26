import{aJ as h,aK as y,aL as T,aM as x,aC as S,j as e,P as _,X as V}from"./iframe-bb_jNxxL.js";import{M as j}from"./MenuBook-B3Mezmg2.js";import{S as u}from"./SearchType-BQ89VVI5.js";import{s as g,M as P}from"./api-5h9TKDvy.js";import{S as R}from"./SearchContext-bLZShiWZ.js";import{S as m}from"./Grid-BTQv340N.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DJjOoNS8.js";import"./useAsync-TRDsFk28.js";import"./useMountedState-COkifDVC.js";import"./translation-DWuqerUq.js";import"./Box-DOhXTkmR.js";import"./styled-Bf8yAc5R.js";import"./AccordionDetails-DTiGxQIY.js";import"./index-B9sM2jn7.js";import"./Collapse-C1vt9U0h.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./Divider-BI-7TC7K.js";import"./ListItem-BW0PV3ll.js";import"./ListItemIcon-B263LN9-.js";import"./ListItemText-h_XmDgas.js";import"./makeStyles-CgTSz4WE.js";import"./Tabs-BFHn1gJ1.js";import"./KeyboardArrowRight-BfwKbqNZ.js";import"./FormLabel-BIadkXHW.js";import"./formControlState-CEd5QU-R.js";import"./InputLabel-8G5IPCbN.js";import"./Select-DJcOrX1R.js";import"./Popover-Bu0C619z.js";import"./Modal-Bkdw9VoW.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-B4509XJg.js";import"./MenuItem-dsBEQEZm.js";import"./Checkbox-DbOXHg0L.js";import"./SwitchBase-BGblaiXC.js";import"./Chip-CU4mt7ep.js";import"./useAnalytics-BwMaIldS.js";import"./lodash-CwxrZd2c.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),Te={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const xe=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,xe as __namedExportsOrder,Te as default};
